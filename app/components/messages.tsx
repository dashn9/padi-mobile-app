import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Animated, Easing} from 'react-native';

import * as metrics from '../metrics/metrics';

interface MessageProps {
    message: string;
    status: 'success' | 'failure';
    isVisible: boolean;
    onHide: () => void;
}

const Message: React.FC<MessageProps> = ({message, status, isVisible, onHide}) => {
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (isVisible) {
            // Enlarge animation when the message is visible
            Animated.timing(animation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
                easing: Easing.inOut(Easing.ease),
            }).start();

            // Automatically hide the message after 5 seconds
            const timeout = setTimeout(() => {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.ease),
                }).start(() => {
                    // Call onHide callback when the message is hidden
                    onHide();
                });
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isVisible]);

    const containerStyle = {
        opacity: animation,
        width: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '50%'],
        }),
    };

    return (
        <Animated.View style={[styles.container, status === 'success' ? {backgroundColor: '#F5FFF3'} : null, containerStyle]}>
            <Text style={[styles.text, status === 'success' ? {color: '#157507'} : null]} numberOfLines={1}>
                {message}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF7F6',
        padding: metrics.verticalScale(10),
        borderRadius: 25,
        alignSelf: 'center',
        zIndex: 99,
        position: 'absolute',
        top: 0,
        overflow: 'hidden',
    },
    text: {
        color: '#D43126',
        textAlign: 'center',
        fontSize: metrics.moderateScale(16),
    },
});

export function useMessage() {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [messageStatus, setMessageStatus] = useState<'success' | 'failure'>('success');

    const showMessage = (newMessage: string, newMessageStatus: 'success' | 'failure') => {
        setMessage(newMessage);
        setMessageStatus(newMessageStatus);
        setIsVisible(true);
    };

    const hideMessage = () => {
        setIsVisible(false);
    };

    return {
        isVisible,
        message,
        messageStatus,
        showMessage,
        hideMessage,
    };
}

export default Message;
