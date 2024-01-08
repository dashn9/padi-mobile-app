import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Back} from '../../../navigations/controls';
import Screen from '../../../components/screen';
import {type DirectMessageChatScreenProps} from '../../../navigations/MessagesNavigator';
import {useFetchUserDetailsQuery} from '../../../hooks/queries/useUserQuery';
import {UserImage} from '../../../components/images';
import icons from '../../../config/icons';
import {capitalizeFirstLetter} from '../../../utils/string';
import AppText from '../../../components/text';

import * as metrics from '../../../utils/metrics';
import {Header4} from '../../../components/headers';
import {SendChatMessageControl} from '../../../components/cards';
import {useMessaging} from '../../../hooks/useChatMessaging';
import {formatAmPm} from '../../../utils/datetime';
import {type IncomingChatMessage, type OutgoingChatMessage, useChatMessagesDataContext} from '../../../hooks/contexts/ChatMessagesDataContext';
import {primaryChatKey} from '../../../config/env';
import {Feather} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import fonts from '../../../config/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../../config/colors';

const ChatHeader = ({userId}: {userId: number}) => {
    const userBasicDetails = useFetchUserDetailsQuery(userId).data;
    return (
        <View style={styles.chatHeader}>
            <Back style={{position: 'relative', top: 0, left: 0}} design='back-icon-only-2' color='#555' />
            <UserImage containerStyle={{marginLeft: metrics.horizontalScale(16)}} initials={capitalizeFirstLetter(userBasicDetails?.firstName[0]) + capitalizeFirstLetter(userBasicDetails?.lastName[0])} size={icons.xl20} />
            <Header4 style={{marginTop: 0, marginLeft: metrics.horizontalScale(16)}}>
                {userBasicDetails?.firstName} {userBasicDetails?.lastName}
            </Header4>
        </View>
    );
};

const ChatFooter = ({userId}: {userId: number}) => {
    const messenger = useMessaging();

    useEffect(() => {
        messenger.connect();
        messenger.attachListenerToWebsocketReceiveEvent(messenger.padiPrimaryChatAppPlugin);
    }, []);

    const sendMessage = (message: string) => {
        if (message.length > 0) {
            messenger.sendMessageToRecipient(userId, message, messenger.padiPrimaryChatAppPlugin);
        }
    };

    return (
        <View style={styles.chatFooter}>
            <SendChatMessageControl messageSend={sendMessage} />
        </View>
    );
};

const RecipientMessage = ({message}: {message: IncomingChatMessage}) => {
    // It's a serious issue, please fix, multiple endpoints request
    // Please don't crucify me for the request repition, it was based of an assumption
    const userBasicDetails = useFetchUserDetailsQuery(message.senderId as number).data;
    return (
        <View style={{alignSelf: 'flex-start'}}>
            <View style={styles.MessageChatBoxInnerContainer}>
                <UserImage size={icons.xl2} initials={capitalizeFirstLetter(userBasicDetails?.firstName[0]) + capitalizeFirstLetter(userBasicDetails?.lastName[0])} />
                <Feather name='chevrons-right' size={icons.m} color='#0B1721' style={{marginBottom: metrics.verticalScale(6)}} />
                <View style={[styles.MessageChatBoxInnerInnerContainer, {backgroundColor: '#F3F7FF'}]}>
                    <AppText style={{color: '#0B1721', width: '100%'}}>{message.messageBody}</AppText>
                </View>
            </View>
            <View style={{marginTop: metrics.verticalScale(4)}}>
                <AppText style={{fontSize: fonts.small, textAlign: 'right'}}>{formatAmPm(new Date(message.senderTimestamp), true)}</AppText>
            </View>
        </View>
    );
};

const SenderMessage = ({message}: {message: OutgoingChatMessage}) => {
    void 0;
    return (
        <View style={{alignSelf: 'flex-end'}}>
            <View style={styles.MessageChatBoxInnerContainer}>
                <View style={[styles.MessageChatBoxInnerInnerContainer, {backgroundColor: '#1D2C56'}]}>
                    <AppText style={{color: colors.white, width: '100%'}}>{message.messageBody}</AppText>
                </View>
                <Feather name='chevrons-left' size={icons.m} color='#0B1721' style={{marginBottom: metrics.verticalScale(6)}} />
            </View>
            <View style={{marginTop: metrics.verticalScale(4)}}>
                <AppText style={{fontSize: fonts.small, textAlign: 'left'}}>{formatAmPm(new Date(message.senderTimestamp), true)}</AppText>
            </View>
        </View>
    );
};

const DirectMessageChatScreen = ({route, navigation}: DirectMessageChatScreenProps) => {
    const {chats, chatsMeta, chatsMetaDispatcher} = useChatMessagesDataContext()[primaryChatKey];
    const {recipientId} = route.params;

    useFocusEffect(() => {
        if (chatsMeta[recipientId]?.unreadMessagesCount) {
            chatsMetaDispatcher({actionType: 'reset-unread-messages-count', roomId: recipientId});
        }
    });

    const chatMessagesElements = [];
    for (const [index, chatMessage] of chats[recipientId]?.entries() ?? []) {
        if ((chatMessage as IncomingChatMessage).senderId) {
            chatMessagesElements.push(<RecipientMessage key={index} message={chatMessage as IncomingChatMessage} />);
        } else if ((chatMessage as OutgoingChatMessage).recipientId) {
            chatMessagesElements.push(<SenderMessage key={index} message={chatMessage as OutgoingChatMessage} />);
        }
    }

    return (
        <Screen innerContainerStyle={{width: '100%'}}>
            <ChatHeader userId={recipientId} />
            <ScrollView>{chatMessagesElements}</ScrollView>
            <ChatFooter userId={recipientId} />
        </Screen>
    );
};

const styles = StyleSheet.create({
    chatHeader: {
        borderBottomWidth: 0.5,
        borderColor: '#A5A5A5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: metrics.verticalScale(24),
        paddingHorizontal: metrics.horizontalScale(8),
    },
    chatFooter: {
        marginTop: 'auto',
    },
    MessageChatBoxInnerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: metrics.verticalScale(16),
        marginLeft: metrics.horizontalScale(8),
    },
    MessageChatBoxInnerInnerContainer: {
        minWidth: '40%',
        maxWidth: '90%',
        padding: metrics.moderateScale(10),
        borderRadius: 16,
    },
});

export default DirectMessageChatScreen;
