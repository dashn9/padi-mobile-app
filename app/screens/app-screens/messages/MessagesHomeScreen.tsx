import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import type {MessagesHomeNavigationProp, MessagesHomeScreenProps} from '../../../navigations/MessagesNavigator';
import Screen from '../../../components/screen';
import AppText from '../../../components/text';
import {SearchBox, useSearch} from '../../../components/inputs';
import {AppHeader, Header4} from '../../../components/headers';
import {formatAmPm} from '../../../utils/datetime';
import {NewMessagesCountBadge, TagBadge} from '../../../components/badges';
import colors from '../../../config/colors';
import * as metrics from '../../../utils/metrics';
import {useMessaging} from '../../../hooks/useChatMessaging';
import {useChatMessagesDataContext, type ChatContext, type IncomingChatMessage, type OutgoingChatMessage} from '../../../hooks/contexts/ChatMessagesDataContext';
import {useMessage, Message2} from '../../../components/messages';
import {primaryChatKey} from '../../../config/env';
import {useFetchUserDetailsQuery} from '../../../hooks/queries/useUserQuery';

// This is a custom hook, seperate all hooks into their own folder
// This is obviously not the full coontents of the message
// Don't know why I made use of type here rather than an interface, felt there is no need of extension
type TchatBarMessage = {
    messageBody: string;
    dateSent: Date;
};
// 0 - Offline, 1 - Online, 2 - Away (Not used for now)
type TuserOnlineStates = 0 | 1 | 2;

function useChatBar() {
    const [isTyping, setIsTyping] = useState(false);
    // 0 - Offline, 1 - Online, 2 - Away (Not used for now)
    const [userOnlineState, setUserOnlineState] = useState<0 | 1 | 2>(0);
    const [recentMessage, setRecentMessage] = useState<TchatBarMessage>({messageBody: 'Hello', dateSent: new Date()});
    const [newMessagesCount, setNewMessagesCount] = useState(100);

    const updateIsTyping = (isTyping: boolean) => {
        setIsTyping(isTyping);
    };

    /**
     * @param userOnlineState - 0 - Offline, 1 - Online, 2 - Away (Not used for now)
     */
    const updateUserOnlineState = (userOnlineState: TuserOnlineStates) => {
        setUserOnlineState(userOnlineState);
    };

    const updateRecentMessage = (recentMessage: TchatBarMessage) => {
        setRecentMessage(recentMessage);
    };

    const updateNewMessagesCount = (newMessagesCount: number) => {
        setNewMessagesCount(newMessagesCount);
    };

    return {
        isTyping,
        userOnlineState,
        recentMessage,
        newMessagesCount,
        updateIsTyping,
        updateUserOnlineState,
        updateRecentMessage,
        updateNewMessagesCount,
    };
}

interface IchatBarStatesControl {
    updateIsTyping: (arg: boolean) => void;
    updateUserOnlineState: (arg: TuserOnlineStates) => void;
    updateRecentMessage: (arg: TchatBarMessage) => void;
    updateNewMessagesCount: (arg: number) => void;
}
interface IchatBarProps {
    userId: number;
    navigation: MessagesHomeNavigationProp;
}

function ChatBar({userId, navigation}: IchatBarProps) {
    const {chatsMeta, chats} = useChatMessagesDataContext()[primaryChatKey];
    const userInfo = useFetchUserDetailsQuery(userId).data;
    const chatMeta = chatsMeta[userId];
    const lastChatMessage = chats[userId][chats[userId].length - 1];
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('DirectMessageChatScreen', {recipientId: userId});
            }}
        >
            <View style={styles.chatBarContainer}>
                <View>{/** User image goes into this View */}</View>
                <View style={styles.chatBarUserMessageInformation}>
                    <View style={styles.chatBarTitle}>
                        <View>
                            <Header4 style={{marginTop: 0}}>
                                {userInfo?.firstName} {userInfo?.lastName}
                            </Header4>
                        </View>
                        <View>
                            <TagBadge>Plumber</TagBadge>
                        </View>
                    </View>
                    <AppText style={[styles.chatBarRecentMessageText, {color: false ? colors.primaryColor600B : colors.subtitleColor}]}>{false ? 'Typing..........' : lastChatMessage.messageBody}</AppText>
                </View>
                <View style={styles.chatBarMessageInformation}>
                    {chatMeta?.unreadMessagesCount > 0 ? <NewMessagesCountBadge count={chatMeta.unreadMessagesCount} /> : null}
                    {/** TODO: Still have to update the time so it shows the date instead if the t */}
                    <AppText style={{color: chatMeta?.unreadMessagesCount > 0 ? colors.primaryColor600B : 'black'}}>{formatAmPm(new Date(lastChatMessage.senderTimestamp), 'senderId' in lastChatMessage)}</AppText>
                </View>
            </View>
        </Pressable>
    );
}

function MessagesHomeScreen({navigation, route}: MessagesHomeScreenProps) {
    const {chats} = useChatMessagesDataContext()[primaryChatKey];
    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();
    const chatMessaging = useMessaging();
    const searchSubmit = (searchValue: string) => searchValue;

    const {searchValue, updateSearchValue, performSearch} = useSearch(searchSubmit);

    // Storage for all Chat Bars states controllers
    const chatsControl: Record<number | string, IchatBarStatesControl> = {};

    const renderError = (chatObject: ChatContext, message: IncomingChatMessage | OutgoingChatMessage, event: MessageEvent) => {
        if ((message as IncomingChatMessage).senderId === 'server') {
            if (message.status === 401) {
                showMessage('Unauthorized: Try signing in again', 'caution');
            }
        }
    };

    useEffect(() => {
        chatMessaging.attachListenerToWebsocketOpenEvent(chatMessaging.sendRequestToRetrieveAllSavedIncomingMessagesFromTimestamp);
        chatMessaging.attachListenerToWebsocketReceiveEvent(renderError, 1);
        chatMessaging.attachListenerToWebsocketReceiveEvent(chatMessaging.padiPrimaryChatAppPlugin);
        chatMessaging.connect();
    }, []);

    const activeChatsElements = [];
    for (const recipientId in chats) {
        if (chats.hasOwnProperty(recipientId)) {
            activeChatsElements.push(<ChatBar key={recipientId} userId={parseInt(recipientId, 10)} navigation={navigation} />);
        }
    }

    return (
        <Screen>
            <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
            <View style={styles.messagesHomeScreenContainer}>
                <View>
                    <AppHeader backable={false}>Inbox</AppHeader>
                    <SearchBox onSearchSubmit={performSearch} />
                </View>
                <ScrollView>
                    <View>{activeChatsElements}</View>
                </ScrollView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    messagesHomeScreenContainer: {
        flex: 1,
    },

    // Chat Bar
    chatBarContainer: {
        flexDirection: 'row',
        paddingVertical: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#CECFCF80',
    },
    chatBarUserMessageInformation: {
        flex: 1,
    },
    chatBarTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatBarMessageInformation: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    chatBarRecentMessageText: {
        color: colors.subtitleColor,
        marginTop: metrics.verticalScale(4),
    },
});

export default MessagesHomeScreen;
