import React from 'react';
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
    const sendMessage = (message: string) => {
        console.log(message);
    };

    return (
        <View style={styles.chatFooter}>
            <SendChatMessageControl messageSend={sendMessage} />
        </View>
    );
};

const DirectMessageChatScreen = ({route, navigation}: DirectMessageChatScreenProps) => {
    const {recipientId} = route.params;
    return (
        <Screen innerContainerStyle={{width: '100%'}}>
            <ChatHeader userId={recipientId} />
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
});

export default DirectMessageChatScreen;
