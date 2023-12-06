import useAuth from './useAuth';
import {WEBSOCKET_BASE_URL} from '../apis/constants';
import {type ChatMessage, useChatMessagesDataContext, useCreateChatMessagingObject, type ChatContext, isChatMessage} from './contexts/ChatMessagesDataContext';
import {primaryChatKey} from '../config/env';
import camelize from 'camelize-ts';

export function useMessaging(messagesKey: undefined | string | number = undefined) {
    const {fetchAccessToken} = useAuth();
    let chatMessages = useChatMessagesDataContext()[messagesKey ?? primaryChatKey];
    if (!chatMessages) {
        chatMessages = useCreateChatMessagingObject();
        useChatMessagesDataContext()[messagesKey ?? primaryChatKey] = chatMessages;
    }

    const connect = (baseUrl = WEBSOCKET_BASE_URL + '?token=' + fetchAccessToken(), forceCreate = true) => {
        if (forceCreate) {
            chatMessages.websocketConnection = new WebSocket(baseUrl);
        } else if (!chatMessages.websocketConnection) {
            chatMessages.websocketConnection = new WebSocket(baseUrl);
        }

        if (chatMessages.websocketConnection) {
            chatMessages.websocketConnection.onopen = (ev: Event) => {
                console.log(ev);
            };

            chatMessages.websocketConnection.onmessage = (ev: MessageEvent<string>) => {
                const message = camelize(JSON.parse(ev.data));
                if (isChatMessage(message)) {
                    Object.values(chatMessages.websocketConnectionReceiveEventCallbacks).forEach(callback => {
                        callback(chatMessages, ev, message);
                    });
                }
            };

            chatMessages.websocketConnection.onclose = (ev: CloseEvent) => {
                Object.values(chatMessages.websocketConnectionCloseEventCallbacks).forEach(callback => {
                    callback(chatMessages, ev);
                });
                chatMessages.websocketConnection = undefined;
            };
        }
    };

    const attachListenerToWebsocketReceiveEvent = (callback: (chatObject: ChatContext, ev: MessageEvent, message: ChatMessage) => void, key = 0) => {
        chatMessages.websocketConnectionReceiveEventCallbacks[key] = callback;
    };

    const attachListenerToWebsocketCloseEvent = (callback: (chatObject: ChatContext, ev: CloseEvent) => void, key = 0) => {
        chatMessages.websocketConnectionCloseEventCallbacks[key] = callback;
    };

    return {connect, attachListenerToWebsocketReceiveEvent, attachListenerToWebsocketCloseEvent};
}
