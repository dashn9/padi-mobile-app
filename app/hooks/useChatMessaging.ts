import useAuth from './useAuth';
import {WEBSOCKET_BASE_URL} from '../apis/constants';
import {type ChatMessage, useChatMessagesDataContext, useCreateChatMessagingObject, type ChatContext} from './contexts/ChatMessagesDataContext';
import {primaryChatKey} from '../config/env';

export function useMessaging(messagesKey: undefined | string | number = undefined) {
    let chatMessages = useChatMessagesDataContext()[messagesKey ?? primaryChatKey];
    if (!chatMessages) {
        chatMessages = useCreateChatMessagingObject();
        useChatMessagesDataContext()[messagesKey ?? primaryChatKey] = chatMessages;
    }

    const connect = (baseUrl = WEBSOCKET_BASE_URL, forceCreate = true) => {
        if (forceCreate) {
            chatMessages.websocketConnection = new WebSocket(baseUrl);
        } else if (!chatMessages.websocketConnection) {
            chatMessages.websocketConnection = new WebSocket(baseUrl);
        }

        if (chatMessages.websocketConnection) {
            chatMessages.websocketConnection.onmessage = (ev: MessageEvent<ChatMessage>) => {
                chatMessages.websocketConnectionReceiveEventCallbacks.forEach(callback => {
                    callback(chatMessages, ev);
                });
            };
        }
    };

    const attachListenerToWebsocketReceiveEvent = (callback: (chatObject: ChatContext, message: MessageEvent<ChatMessage>) => void) => {
        chatMessages.websocketConnectionReceiveEventCallbacks.push(callback);
    };

    return {connect, attachListenerToWebsocketReceiveEvent};
}
