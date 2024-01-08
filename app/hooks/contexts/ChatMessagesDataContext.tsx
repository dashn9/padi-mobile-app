import React, {useEffect, useReducer, useState} from 'react';
import {primaryChatKey} from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isObjectEmpty} from '../../utils/object';

// SM Self Message
// DM Direct Message
// GM Group Message
// AM  # Application Message: Message sent by the server
export type MessageTypes = 'SM' | 'DM' | 'GM' | 'AM';

// Equivalent to traditional HTTP Codes
export type MessageStatusTypes = 401 | 200;

interface ChatMessage {
    status: MessageStatusTypes;
    messageType: MessageTypes;
    messageBody: string;
    senderTimestamp: string;
}
export interface IncomingChatMessage extends ChatMessage {
    senderId: number | 'server';
}

export interface OutgoingChatMessage extends ChatMessage {
    recipientId: number | 'server';
}

interface ChatMeta {
    unreadMessagesCount: number;
    lastIncomingMessageDtime: string;
}

type ChatsMeta = Record<string, ChatMeta>;

interface ChatActions {
    actionType: 'add-chat' | 'overwrite-chats';
    payload?: IncomingChatMessage | OutgoingChatMessage;
    chatPayload?: Chats;
}

interface ChatMetaActions {
    actionType: 'increment-unread-messages-count' | 'reset-unread-messages-count' | 'overwrite-chats-meta' | 'update-last-incoming-message-dtime';
    chatMetaPayload?: ChatsMeta;
    // Technically recipient id'
    roomId?: number | string;
    dTimeString?: string;
}

export function isChatMessage(obj: any): obj is IncomingChatMessage {
    return typeof obj === 'object' && (obj.senderId === 'server' || typeof obj.senderId === 'number') && (obj.status === 401 || obj.status === 200) && typeof obj.messageType === 'string' && typeof obj.messageBody === 'string' && typeof obj.senderTimestamp === 'string';
}

// The key is the roomId, purposely named it roomId, because there is a possibility of it extending beyond other users and into groups
// Technically, because only one-on-one messaging is used, the roomId which is technically the user id of the recipient, it will always be a number.
// If in the future Group Messages was decided to be added, it most likely would be a string with the 'group-' preifx.
export type Chats = Record<number | string, Array<IncomingChatMessage | OutgoingChatMessage>>;

export interface ChatContext {
    websocketConnection: WebSocket | undefined;
    setWebsocketConnection: React.Dispatch<React.SetStateAction<WebSocket | undefined>>;
    websocketConnectionOpenEventCallbacks: Record<string, (chatObject: ChatContext, messageEv: Event) => void>;
    setWebsocketConnectionOpenEventCallbacks: React.Dispatch<React.SetStateAction<Record<string, (chatObject: ChatContext, messageEv: Event) => void>>>;
    websocketConnectionReceiveEventCallbacks: Record<string, (chatObject: ChatContext, message: IncomingChatMessage | Array<IncomingChatMessage | OutgoingChatMessage>, messageEv: MessageEvent) => void>;
    setWebsocketConnectionReceiveEventCallbacks: React.Dispatch<React.SetStateAction<Record<string, (chatObject: ChatContext, message: IncomingChatMessage | Array<IncomingChatMessage | OutgoingChatMessage>, messageEv: MessageEvent) => void>>>;
    websocketConnectionCloseEventCallbacks: Record<string, (chatObject: ChatContext, closeEv: CloseEvent) => void>;
    setWebsocketConnectionCloseEventCallbacks: React.Dispatch<React.SetStateAction<Record<string, (chatObject: ChatContext, closeEv: CloseEvent) => void>>>;
    chats: Chats;
    chatsDispatcher: React.Dispatch<ChatActions>;
    chatsMeta: ChatsMeta;
    chatsMetaDispatcher: React.Dispatch<ChatMetaActions>;
    chatsPersistentSaver: () => boolean;
    chatsPersistentFetcher: () => Chats;
    chatsMetaPersistentSaver: () => boolean;
    chatsMetaPersistentFetcher: () => ChatsMeta;
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

export const loadChatsFromStorage = (key: string | number, setChats: (chats: Chats) => void) => {
    AsyncStorage.getItem('websocket-messaging-chats' + key)
        .then(stringifiedChats => {
            const chats = JSON.parse(stringifiedChats ?? '{}') as Chats;
            setChats(chats);
        })
        .catch(error => {
            console.log('Unable to fetch chats', error);
            setChats({});
        });
};

export const saveChatsToStorage = (chats: Chats, key: string | number) => {
    // I don't really care about the response for now, so i'm setting void;
    void AsyncStorage.setItem('websocket-messaging-chats' + key, JSON.stringify(chats));
    return true;
};

export const loadChatsMetaFromStorage = (key: string | number, setChatsMeta: (chats: ChatsMeta) => void) => {
    AsyncStorage.getItem('websocket-messaging-chats-meta' + key)
        .then(stringifiedChats => {
            const chats = JSON.parse(stringifiedChats ?? '{}') as ChatsMeta;
            setChatsMeta(chats);
        })
        .catch(error => {
            console.log('Unable to fetch chats', error);
            setChatsMeta({});
        });
};

export const saveChatsMetaToStorage = (chats: ChatsMeta, key: string | number) => {
    // I don't really care about the response for now, so i'm setting void;
    void AsyncStorage.setItem('websocket-messaging-chats-meta' + key, JSON.stringify(chats));
    return true;
};

export const chatsReducer = (state: Chats, action: ChatActions) => {
    switch (action.actionType) {
        case 'add-chat':
            return handleAddChat(state, action);

        case 'overwrite-chats':
            if (action.chatPayload) {
                return action.chatPayload;
            }

            return state;

        default:
            return state;
    }
};

export const chatsMetaReducer = (state: ChatsMeta, action: ChatMetaActions) => {
    let chatMeta;
    switch (action.actionType) {
        case 'increment-unread-messages-count':
            if (!action.roomId) {
                return state;
            }

            chatMeta = {...state[action.roomId]};
            chatMeta.unreadMessagesCount ??= 0;
            chatMeta.unreadMessagesCount += 1;
            return {...state, [action.roomId]: chatMeta};
        case 'reset-unread-messages-count':
            if (!action.roomId || !state?.[action.roomId]) {
                return state;
            }

            chatMeta = {...state[action.roomId]};
            chatMeta.unreadMessagesCount = 0;
            return {...state, [action.roomId]: chatMeta};
        case 'overwrite-chats-meta':
            if (action.chatMetaPayload) {
                return action.chatMetaPayload;
            }

            return state;
        case 'update-last-incoming-message-dtime':
            if (action.dTimeString) {
                chatMeta = {...state[primaryChatKey]};
                chatMeta.lastIncomingMessageDtime = action.dTimeString;
                return {...state, [primaryChatKey]: chatMeta};
            }

            return state;
        default:
            return state;
    }
};

const handleAddChat = (state: Chats, action: ChatActions) => {
    const {payload} = action;
    if (payload) {
        // Create a copy of the state to ensure immutability
        const newState = {...state};

        // Extract roomId and chat message
        const roomId = 'recipientId' in payload ? payload.recipientId : payload.senderId; // Assuming recipientId is used as roomId
        const chatMessage = payload;

        // Update the chats for the specified roomId
        newState[roomId] = insertChatMessage(newState[roomId] || [], chatMessage);

        return newState;
    }

    return state;
};

// Function to insert chat message in the array based on senderTimestamp
const insertChatMessage = (messages: Array<IncomingChatMessage | OutgoingChatMessage>, newMessage: IncomingChatMessage | OutgoingChatMessage) => {
    const index = messages.findIndex(message => new Date(message.senderTimestamp).getTime() > new Date(newMessage.senderTimestamp).getTime());

    if (index === -1) {
        // If no message with a later timestamp is found, append the new message to the end
        return [...messages, newMessage];
    }

    // Insert the new message at the correct position in the array
    return [...messages.slice(0, index), newMessage, ...messages.slice(index)];
};

export const useCreateChatMessagingObject = (key = primaryChatKey): ChatContext => {
    const [chats, chatsDispatcher] = useReducer(chatsReducer, {});
    const [chatsMeta, chatsMetaDispatcher] = useReducer(chatsMetaReducer, {});

    const updateLoadedChats = (loadedChats: Chats) => {
        chatsDispatcher({
            actionType: 'overwrite-chats',
            chatPayload: loadedChats,
            payload: undefined,
        });
    };

    const updateLoadedChatsMeta = (loadedChatsMeta: ChatsMeta) => {
        chatsMetaDispatcher({
            actionType: 'overwrite-chats-meta',
            chatMetaPayload: loadedChatsMeta,
        });
    };

    useEffect(() => {
        loadChatsFromStorage(key, updateLoadedChats);
        loadChatsMetaFromStorage(key, updateLoadedChatsMeta);
    }, []);

    useEffect(() => {
        if (!isObjectEmpty(chats)) {
            saveChatsToStorage(chats, key);
        }
    }, [chats]);

    useEffect(() => {
        if (!isObjectEmpty(chatsMeta)) {
            saveChatsMetaToStorage(chatsMeta, key);
        }
    }, [chatsMeta]);

    const [websocketConnection, setWebsocketConnection] = useState<WebSocket>();
    const [websocketConnectionOpenEventCallbacks, setWebsocketConnectionOpenEventCallbacks] = useState<Record<string, (chatObject: ChatContext, messageEv: Event) => void>>({});
    const [websocketConnectionReceiveEventCallbacks, setWebsocketConnectionReceiveEventCallbacks] = useState<Record<string, (chatObject: ChatContext, message: IncomingChatMessage | Array<IncomingChatMessage | OutgoingChatMessage>, messageEv: MessageEvent) => void>>({});
    const [websocketConnectionCloseEventCallbacks, setWebsocketConnectionCloseEventCallbacks] = useState<Record<string, (chatObject: ChatContext, closeEv: CloseEvent) => void>>({});
    return {
        websocketConnection,
        setWebsocketConnection,
        websocketConnectionOpenEventCallbacks,
        setWebsocketConnectionOpenEventCallbacks,
        websocketConnectionReceiveEventCallbacks,
        setWebsocketConnectionReceiveEventCallbacks,
        websocketConnectionCloseEventCallbacks,
        setWebsocketConnectionCloseEventCallbacks,
        chatsDispatcher,
        chats,
        chatsMeta,
        chatsMetaDispatcher,
        chatsPersistentFetcher() {
            loadChatsFromStorage(key, updateLoadedChats);
            return chats;
        },
        chatsPersistentSaver() {
            return saveChatsToStorage(chats, key);
        },
        chatsMetaPersistentFetcher() {
            loadChatsMetaFromStorage(key, updateLoadedChatsMeta);
            return chatsMeta;
        },
        chatsMetaPersistentSaver() {
            return saveChatsMetaToStorage(chatsMeta, key);
        },
    };
};

export const ChatMessagesDataContextProvider = ({children}: AuthContextProviderProps) => {
    const primaryChatMessaging = useCreateChatMessagingObject();
    return (
        <chatMessagesDataContext.Provider
            value={{
                [primaryChatKey]: primaryChatMessaging,
            }}
        >
            {children}
        </chatMessagesDataContext.Provider>
    );
};
