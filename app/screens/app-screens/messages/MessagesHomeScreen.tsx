import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import type {MessagesHomeScreenProps} from '../../../navigations/MessagesNavigator';
import Screen from '../../../components/screen';
import AppText from '../../../components/text';
import {SearchBox, useSearch} from '../../../components/inputs';
import {AppHeader, Header4} from '../../../components/headers';
import {formatAmPm} from '../../../utils/datetime';
import {NewMessagesCountBadge, TagBadge} from '../../../components/badges';
import colors from '../../../config/colors';
import * as metrics from '../../../utils/metrics';

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
    // States
    userTypingState: boolean;
    userOnlineState: TuserOnlineStates;
    recentChatMessage: TchatBarMessage;
    newMessagesCount: number;
}

function ChatBar({userId, userTypingState, userOnlineState, recentChatMessage, newMessagesCount}: IchatBarProps) {
    return (
        <View style={styles.chatBarContainer}>
            <View>{/** User image goes into this View */}</View>
            <View style={styles.chatBarUserMessageInformation}>
                <View style={styles.chatBarTitle}>
                    <View>
                        <Header4 style={{marginTop: 0}}>John Doe</Header4>
                    </View>
                    <View>
                        <TagBadge>Plumber</TagBadge>
                    </View>
                </View>
                <AppText style={[styles.chatBarRecentMessageText, {color: userTypingState ? colors.primaryColor600B : colors.subtitleColor}]}>{userTypingState ? 'Typing..........' : recentChatMessage.messageBody}</AppText>
            </View>
            <View style={styles.chatBarMessageInformation}>
                {newMessagesCount > 0 ? <NewMessagesCountBadge count={newMessagesCount} /> : null}
                {/** TODO: Still have to update the time so it shows the date instead if the t */}
                <AppText style={{color: newMessagesCount > 0 ? colors.primaryColor600B : 'black'}}>{formatAmPm(recentChatMessage.dateSent)}</AppText>
            </View>
        </View>
    );
}

function MessagesHomeScreen({navigation, route}: MessagesHomeScreenProps) {
    const searchSubmit = (searchValue: string) => searchValue;

    const {searchValue, updateSearchValue, performSearch} = useSearch(searchSubmit);

    // Storage for all Chat Bars states controllers
    const chatsControl: Record<number | string, IchatBarStatesControl> = {};

    const activeChatsElements = [];
    for (let i = 0; i < 6; i++) {
        const {isTyping, userOnlineState, recentMessage, newMessagesCount, updateIsTyping, updateUserOnlineState, updateRecentMessage, updateNewMessagesCount} = useChatBar();
        chatsControl[i] = {
            updateIsTyping,
            updateUserOnlineState,
            updateRecentMessage,
            updateNewMessagesCount,
        };

        activeChatsElements.push(<ChatBar key={i} userId={i} userTypingState={i === 3 ? true : isTyping} userOnlineState={userOnlineState} recentChatMessage={recentMessage} newMessagesCount={newMessagesCount} />);
    }

    return (
        <Screen>
            <View style={styles.messagesHomeScreenContainer}>
                <View>
                    <AppHeader>Inbox</AppHeader>
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
