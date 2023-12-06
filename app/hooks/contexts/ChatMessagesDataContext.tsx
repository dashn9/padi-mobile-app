import React, {useReducer} from 'react';
import {primaryChatKey} from '../../config/env';

export interface ChatMessage {
    // This senderId would be useful, especially in groups
    senderId: number | 'server';
    status: 401 | 200;
    messageType: string;
    messageBody: string;
    senderTimestamp: string;
}

interface ChatActions {
    action: 'add-chat';
    payload: unknown;
}

export function isChatMessage(obj: any): obj is ChatMessage {
    return typeof obj === 'object' && (obj.senderId === 'server' || typeof obj.senderId === 'number') && (obj.status === 401 || obj.status === 200) && typeof obj.messageType === 'string' && typeof obj.messageBody === 'string' && typeof obj.senderTimestamp === 'string';
}

// The key is the roomId, purposely named it roomId, because there is a possibility of it extending beyond other users and into groups
// Technically, because only one-on-one messaging is used, the roomId which is technically the user id of the recipient, it will always be a number.
// If in the future Group Messages was decided to be added, it most likely would be a string with the 'group-' preifx.
export type Chats = Record<number | string, ChatMessage[]>;

export interface ChatContext {
    websocketConnection: WebSocket | undefined;
    websocketConnectionReceiveEventCallbacks: Record<string, (chatObject: ChatContext, messageEv: MessageEvent, message: ChatMessage) => void>;
    websocketConnectionCloseEventCallbacks: Record<string, (chatObject: ChatContext, closeEv: CloseEvent) => void>;
    chats: Chats;
    chatsDispatcher: React.Dispatch<ChatActions>;
    chatPersistentSaver: () => boolean;
    chatPersistentFetcher: () => Chats;
}

export interface AuthContextProviderProps {
    children: React.ReactNode;
}

// It wasn't really necessary to specify the context type has an optional undefined, but createContext requires an initial value
export const chatMessagesDataContext = React.createContext<Record<string, ChatContext> | undefined>(undefined);

export const useChatMessagesDataContext = () => {
    const context = React.useContext(chatMessagesDataContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be inside a useAuthContextProvider');
    }

    return context;
};

export const loadChatsFromStorage = (key: string | number): Chats => {
    const chats: Chats = {};
    return chats;
};

export const saveChatsToStorage = (chats: Chats, key: string | number) => true;

export const chatsReducer = (state: Chats, action: ChatActions) => ({});

export const useCreateChatMessagingObject = (key = primaryChatKey): ChatContext => {
    const [chats, chatsDispatcher] = useReducer(chatsReducer, loadChatsFromStorage(key));

    return {
        websocketConnection: undefined,
        websocketConnectionReceiveEventCallbacks: {},
        websocketConnectionCloseEventCallbacks: {},
        chatsDispatcher,
        chats,
        chatPersistentFetcher() {
            return loadChatsFromStorage(key);
        },
        chatPersistentSaver() {
            return saveChatsToStorage(chats, key);
        },
    };
};

export const ChatMessagesDataContextProvider = ({children}: AuthContextProviderProps) => (
    <chatMessagesDataContext.Provider
        value={{
            [primaryChatKey]: useCreateChatMessagingObject(),
        }}
    >
        {children}
    </chatMessagesDataContext.Provider>
);
