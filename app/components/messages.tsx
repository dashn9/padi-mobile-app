import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Animated, Easing} from 'react-native';

import * as metrics from '../utils/metrics';
import colors from '../config/colors';
import {Feather, FontAwesome} from '@expo/vector-icons';
import icons from '../config/icons';

interface MessageProps {
    message: string;
    status: 'success' | 'failure' | 'caution';
    isVisible: boolean;
    onHide: () => void;
}

const messagesColorBold = {
    success: colors.successGreenBold,
    failure: colors.failureRedBold,
    caution: colors.cautionBrownBold,
};

const messagesColor = {
    success: colors.successGreen,
    failure: colors.failureRed,
    caution: colors.cautionBrown,
};

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
        <Animated.View style={[styles.container, {backgroundColor: status === 'success' ? messagesColor.success : status === 'failure' ? messagesColor.failure : messagesColor.caution}, containerStyle]}>
            <Text style={[styles.text, {color: status === 'success' ? messagesColorBold.success : status === 'failure' ? messagesColorBold.failure : messagesColorBold.caution}]} numberOfLines={1}>
                {message}
            </Text>
        </Animated.View>
    );
};

export const Message2: React.FC<MessageProps> = ({message, status, isVisible, onHide}) => {
    interface MainComponentProps {
        color: string;
        boldColor: string;
        status?: 'success' | 'failure' | 'caution';
    }
    const MainComponent = ({color, boldColor, status}: MainComponentProps) => {
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
                        duration: 500,
                        useNativeDriver: false,
                        easing: Easing.inOut(Easing.ease),
                    }).start(() => {
                        // Call onHide callback when the message is hidden
                        onHide();
                    });
                }, 10000);

                return () => {
                    clearTimeout(timeout);
                };
            }
        }, [isVisible]);

        const containerStyle = {
            opacity: animation,
            marginTop: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-42, 0],
            }),
        };
        const newStatus = status ?? 'success';
        return (
            <Animated.View style={[styles.message2Container, {backgroundColor: color, borderColor: boldColor}, containerStyle]}>
                <FontAwesome style={{marginLeft: metrics.horizontalScale(8)}} name={newStatus === 'success' ? 'check-circle' : newStatus === 'failure' ? 'times-circle' : 'exclamation-circle'} color={boldColor} size={icons.m + 2} />
                <Text style={[styles.text, {color: boldColor}]} numberOfLines={1}>
                    {message}
                </Text>
                <Feather name='x' size={icons.s} color={boldColor} style={{marginLeft: 'auto', marginRight: metrics.horizontalScale(6)}} onPress={onHide} />
            </Animated.View>
        );
    };

    return status === 'success' ? <MainComponent color={messagesColor.success} boldColor={messagesColorBold.success} /> : status === 'failure' ? <MainComponent color={messagesColor.failure} boldColor={messagesColorBold.failure} status='failure' /> : <MainComponent color={messagesColor.caution} boldColor={messagesColorBold.caution} status='caution' />;
};

// To Do: Implement color and icon change for caution and warning

const styles = StyleSheet.create({
    container: {
        backgroundColor: messagesColor.success,
        padding: metrics.verticalScale(16),
        borderRadius: 25,
        alignSelf: 'center',
        zIndex: 99,
        position: 'absolute',
        top: 0,
        overflow: 'hidden',
    },
    message2Container: {
        flexDirection: 'row',
        width: '85%',
        height: metrics.verticalScale(40),
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: messagesColorBold.success,
        zIndex: -1,
    },
    text: {
        color: messagesColorBold.success,
        fontSize: metrics.moderateScale(14),
        marginLeft: metrics.horizontalScale(6),
        maxWidth: '85%',
    },
});

export function useMessage() {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [messageStatus, setMessageStatus] = useState<'success' | 'failure' | 'caution'>('success');

    const showMessage = (newMessage: string, newMessageStatus: 'success' | 'failure' | 'caution') => {
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
