import {useEffect} from 'react';
import camelize from 'camelize-ts';
import snakify from 'snakify-ts';

import useAuth from './useAuth';
import {WEBSOCKET_BASE_URL} from '../apis/constants';
import {type IncomingChatMessage, useChatMessagesDataContext, useCreateChatMessagingObject, type ChatContext, isChatMessage, type OutgoingChatMessage, chatsMetaReducer} from './contexts/ChatMessagesDataContext';
import {primaryChatKey} from '../config/env';
import {useAuthContext} from './contexts/AuthContext';
import {formatDateTimeStringWithTimezone} from '../utils/datetime';
import {WebSocketNotExistOrOpenError} from '../errors/websocketErrors';

type Message = OutgoingChatMessage | IncomingChatMessage;

export function useMessaging(connectOnCall = true, messagesKey: undefined | string | number = undefined) {
    const {fetchAccessToken} = useAuth();
    const {user} = useAuthContext();

    const chatMessages = useChatMessagesDataContext()[messagesKey ?? primaryChatKey];
    // UseEffect(() => () => {
    //     const {websocketConnection} = chatMessages;
    //     console.log(websocketConnection);
    //     // Clean up WebSocket on component unmount
    //     if (websocketConnection) {
    //         websocketConnection.close();
    //         chatMessages.setWebsocketConnection(undefined);
    //     }
    // }, []);
    // You may want to move this commented block of code to an on app-exit callback function
    useEffect(() => {
        resolveSocketListeners();
    }, [chatMessages.websocketConnection]);
    // I commented this code because I'm trying to avoid making this hook async.
    // if (!chatMessages) {
    //     chatMessages = useCreateChatMessagingObject();
    //     useChatMessagesDataContext()[messagesKey ?? primaryChatKey] = chatMessages;
    // }

    const resolveSocketListeners = () => {
        const {websocketConnection} = chatMessages;
        if (websocketConnection) {
            websocketConnection.onopen = (ev: Event) => {
                console.log('websocket opened', ev);
                Object.values(chatMessages.websocketConnectionOpenEventCallbacks).forEach(callback => {
                    callback(chatMessages, ev);
                });
            };

            websocketConnection.onmessage = (ev: MessageEvent<string>) => {
                let message = JSON.parse(ev.data).data as IncomingChatMessage | Message[];
                if (Array.isArray(message)) {
                    message = message.map(message => camelize(message));
                } else {
                    message = camelize(message);
                }

                Object.values(chatMessages.websocketConnectionReceiveEventCallbacks).forEach(callback => {
                    callback(chatMessages, message, ev);
                });
            };

            websocketConnection.onclose = (ev: CloseEvent) => {
                Object.values(chatMessages.websocketConnectionCloseEventCallbacks).forEach(callback => {
                    callback(chatMessages, ev);
                });
                chatMessages.setWebsocketConnection(undefined);
            };
        }

        chatMessages.setWebsocketConnection(websocketConnection);
    };

    const connect = (baseUrl = WEBSOCKET_BASE_URL + '?token=' + fetchAccessToken(), forceCreate = false) => {
        try {
            if (forceCreate || !chatMessages.websocketConnection) {
                if (chatMessages.websocketConnection) {
                    chatMessages.websocketConnection.close();
                }

                chatMessages.setWebsocketConnection(new WebSocket(baseUrl));
            }
        } catch (error) {
            console.error('WebSocket connection error:', error);
            // Handle the error appropriately, e.g., inform the user, retry, etc.
        }
    };

    const sendMessageToRecipient = (recipientId: number, message: string, callback: (chatMessages: ChatContext, message: OutgoingChatMessage) => any) => {
        try {
            if (chatMessages.websocketConnection) {
                const messagePayload: OutgoingChatMessage = {
                    recipientId,
                    status: 200,
                    messageBody: message,
                    messageType: 'DM',
                    senderTimestamp: formatDateTimeStringWithTimezone(),
                };
                chatMessages.websocketConnection.send(JSON.stringify(snakify(messagePayload)));
                callback(chatMessages, messagePayload);
            }
        } catch (error) {
            console.log(error);
            throw new WebSocketNotExistOrOpenError();
        }
    };

    const sendRequestToRetrieveAllSavedIncomingMessagesFromTimestamp = (chatMessages: ChatContext) => {
        try {
            if (chatMessages.websocketConnection) {
                const lastSenderDtime = chatMessages.chatsMeta[primaryChatKey]?.lastIncomingMessageDtime;

                const fetchMessagesFromTimestampRequestPayload = {
                    recipientId: 'server',
                    intent: 'fetch-all-my-incoming-messages-from-dtime',
                    intentMessage: lastSenderDtime,
                    senderTimestamp: formatDateTimeStringWithTimezone(),
                };

                const fetchAllMessagesRequestPayload = {
                    recipientId: 'server',
                    intent: 'fetch-all-my-messages',
                    senderTimestamp: formatDateTimeStringWithTimezone(),
                };

                if (!lastSenderDtime) {
                    chatMessages.chatsDispatcher({
                        actionType: 'overwrite-chats',
                        chatPayload: {},
                        payload: undefined,
                    });
                }

                chatMessages.websocketConnection.send(JSON.stringify(snakify(lastSenderDtime ? fetchMessagesFromTimestampRequestPayload : fetchAllMessagesRequestPayload)));
            }
        } catch (error) {
            console.log(error);
            throw new WebSocketNotExistOrOpenError();
        }
    };

    const attachListenerToWebsocketOpenEvent = (callback: (chatObject: ChatContext, ev: Event) => void, key = 0) => {
        chatMessages.setWebsocketConnectionOpenEventCallbacks({...chatMessages.websocketConnectionOpenEventCallbacks, [key]: callback});
    };

    const attachListenerToWebsocketReceiveEvent = (callback: (chatObject: ChatContext, message: IncomingChatMessage, ev: MessageEvent) => void, key = 0) => {
        chatMessages.setWebsocketConnectionReceiveEventCallbacks({...chatMessages.websocketConnectionReceiveEventCallbacks, [key]: callback});
    };

    const attachListenerToWebsocketCloseEvent = (callback: (chatObject: ChatContext, ev: CloseEvent) => void, key = 0) => {
        chatMessages.setWebsocketConnectionCloseEventCallbacks({...chatMessages.websocketConnectionCloseEventCallbacks, [key]: callback});
    };

    const padiPrimaryChatAppPlugin = (chatObject: ChatContext, message: Message | Message[], ev?: MessageEvent) => {
        function processMessage(message: Message) {
            if (message.status === 200 && message.messageType === 'DM') {
                if ((message as OutgoingChatMessage)?.recipientId !== 'server' && (message as IncomingChatMessage)?.senderId !== 'server') {
                    chatObject.chatsDispatcher({actionType: 'add-chat', payload: message});
                    if ('senderId' in message) {
                        chatObject.chatsMetaDispatcher({actionType: 'increment-unread-messages-count', roomId: message.senderId});
                        chatObject.chatsMetaDispatcher({actionType: 'update-last-incoming-message-dtime', dTimeString: message.senderTimestamp});
                    }
                }
            }
        }

        if (Array.isArray(message)) {
            // I'm to lazy to do it right now, but in the future, find a way to process all messages in one dispatch call
            message.forEach(message => {
                processMessage(message);
            });
        } else if (message) {
            processMessage(message);
        }
    };

    return {connect, sendRequestToRetrieveAllSavedIncomingMessagesFromTimestamp, sendMessageToRecipient, attachListenerToWebsocketOpenEvent, attachListenerToWebsocketReceiveEvent, attachListenerToWebsocketCloseEvent, padiPrimaryChatAppPlugin};
}
