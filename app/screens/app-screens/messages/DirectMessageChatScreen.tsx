import React from 'react';
import {View} from 'react-native';
import {Back} from '../../../navigations/controls';

const ChatHeader = () => (
    <View>
        <Back design='back-icon-only-2' />
    </View>
);

const DirectMessageChatScreen = () => {
    void 0;
    return <ChatHeader />;
};

export default DirectMessageChatScreen;
