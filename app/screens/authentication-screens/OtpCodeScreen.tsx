import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {type NativeStackScreenProps} from '@react-navigation/native-stack';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

import type {AuthStackList} from '../../navigations/AuthNavigator';

import Screen from '../../components/screen';
import * as metrics from '../../utils/metrics';
import {FormButton} from '../../components/buttons';
import {Header1, Subtitle2} from '../../components/headers';
import {Back} from '../../navigations/controls';
import Message from '../../components/messages';
import {useMessage} from '../../components/messages';
import AppText from '../../components/text';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import useAuth from '../../hooks/useAuth';

interface OtpResendOptionProps {
    email: string;
    showMessage?: (a: string, b: 'success' | 'failure') => void;
}

const OtpResendOption: React.FC<OtpResendOptionProps> = ({email, showMessage}) => {
    const [countdownRemTime, setCountdownRemTime] = useState(60);
    const [restartKey, setRestartKey] = useState(0);
    const {generateOtp} = useAuth();
    const resendOtpCode = () => {
        generateOtp({email})
            .then(data => {
                console.log(data);
                if (data && data[0] === 'success') {
                    if (showMessage) {
                        showMessage('Code Re-Sent!', 'success');
                    }

                    setRestartKey(prevRestartKey => prevRestartKey + 1);
                } else {
                    throw new Error('OTP Generation failed');
                }
            })
            .catch(() => {
                if (showMessage) {
                    showMessage('Unable to generate new OTP', 'failure');
                }
            });
    };

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 12}}>
            <CountdownCircleTimer key={restartKey} strokeWidth={5} strokeLinecap='square' size={34} isPlaying duration={60} colors={['#628BFF', '#EFF6FF']} trailColor='#EFF6FF' colorsTime={[60, 0]}>
                {({remainingTime}) => {
                    setTimeout(() => {
                        setCountdownRemTime(remainingTime);
                    }, 500);
                    return <AppText style={{color: colors.primaryColor}}>{remainingTime}</AppText>;
                }}
            </CountdownCircleTimer>
            <AppText style={styles.otpResendText}>&nbsp;&nbsp;Can&apos;t find the code?&nbsp;</AppText>
            <Pressable onPress={countdownRemTime <= 0 ? resendOtpCode : null}>
                <AppText style={{color: countdownRemTime <= 0 ? colors.primaryColor : colors.subtitleColor, fontFamily: fonts.primaryFontFamilySemiBold, fontSize: fonts.formInputFontSize}}>Resend Code</AppText>
            </Pressable>
        </View>
    );
};

type OtpCodeScreenProps = NativeStackScreenProps<AuthStackList, 'OtpCodeScreen'>;
const OtpCodeScreen: React.FC<OtpCodeScreenProps> = ({navigation, route}: OtpCodeScreenProps) => {
    const {context, email, password} = route.params;
    const [otpCode, setOtpCode] = useState<string>('');
    const {nativeLogin} = useAuth();
    const [isOtpVerificationApiLoading, setOtpVerificationLoading] = useState(false);
    const maxDigits = 6;

    const handleDigitPress = (digit: string) => {
        if (otpCode.length < maxDigits) {
            setOtpCode(otpCode + digit);
        }
    };

    const handleBackspace = () => {
        if (otpCode.length > 0) {
            setOtpCode(otpCode.slice(0, -1));
        }
    };

    const onCodeSubmit = () => {
        // The otp code by default is in string format
        const numOtpCode = parseInt(otpCode, 10);
        if (numOtpCode && otpCode.length === 6) {
            if (context === 'password-reset') {
                navigation.pop();
                navigation.navigate('ResetPasswordScreen');
            } else {
                setOtpVerificationLoading(true);
                verifyOtp({email, otp: numOtpCode})
                    .then(data => {
                        if (data && data[0] === 'success') {
                            if (showMessage) {
                                showMessage('Email Verified!', 'success');
                            }

                            if (route.params.context === 'email-verification') {
                                nativeLogin({email, password})
                                    .then()
                                    .catch(() => {
                                        navigation.navigate('SignIn');
                                    });
                            }
                        } else {
                            throw new Error('Invalid OTP');
                        }

                        setOtpVerificationLoading(false);
                    })
                    .catch(() => {
                        showMessage('Invalid OTP', 'failure');

                        setOtpVerificationLoading(false);
                    });
            }
        } else {
            showMessage('OTP requires 6 digits', 'failure');
        }
    };

    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();

    const {verifyOtp} = useAuth();

    // Mimic component onmount lifecycle hook.
    return (
        <Screen>
            <View style={styles.container}>
                <Message message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <Back style={{top: metrics.verticalScale(32)}} />
                {context === 'email-verification' ? (
                    <>
                        <Header1>Confirm Your E-mail</Header1>
                        <Subtitle2>A code has been sent to &quot;{email}&quot; Input the code to complete account creation!</Subtitle2>
                    </>
                ) : context === 'password-reset' ? (
                    <>
                        <Header1>Check Your Inbox</Header1>
                        <Subtitle2>A code has been sent to &quot;{email}&quot; Input the code to change password!</Subtitle2>
                    </>
                ) : context === 'two-factor-authentication' ? (
                    <>
                        <Header1>Check Your Inbox</Header1>
                        <Subtitle2>A code has been sent to &quot;{email}&quot; Input the code to log in!</Subtitle2>
                    </>
                ) : context === 'session-authenticate' ? (
                    <>
                        <Header1>Enter Your Pin</Header1>
                        <Subtitle2>A code has been sent to &quot;{email}&quot; Input the code to change password</Subtitle2>
                    </>
                ) : (
                    <></>
                )}
                <View style={styles.otpCodeContainer}>
                    {Array.from({length: maxDigits}, (_, index) => (
                        <View key={index} style={styles.otpCodeDigit}>
                            <Text style={styles.otpCodeDigitText}>{otpCode[index] || ''}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.keyboard}>
                    {Array.from({length: 9}, (_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.digitButton}
                            onPress={() => {
                                handleDigitPress(String(index + 1));
                            }}
                        >
                            <Text style={styles.digitButtonText}>{index + 1}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.digitButton}
                        onPress={() => {
                            handleDigitPress('0');
                        }}
                    >
                        <Text style={styles.digitButtonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backspaceButton} onPress={handleBackspace}>
                        <Text style={styles.backspaceButtonText}>←</Text>
                    </TouchableOpacity>
                </View>
                <FormButton onPress={onCodeSubmit} text='Proceed' isApiLoading={isOtpVerificationApiLoading} />
                {email && <OtpResendOption email={email} showMessage={showMessage} />}
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        width: '85%',
    },
    otpCodeContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginTop: metrics.verticalScale(40),
        marginBottom: metrics.verticalScale(20),
    },
    otpCodeDigit: {
        borderWidth: 1,
        borderColor: '#CECFCF',
        width: metrics.horizontalScale(50),
        height: metrics.verticalScale(50),
        borderRadius: 5,
        marginHorizontal: metrics.verticalScale(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpCodeDigitText: {
        fontSize: metrics.moderateScale(20),
        fontFamily: 'karlaSemiBold',
    },
    keyboard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignSelf: 'center',
    },
    digitButton: {
        width: metrics.horizontalScale(100),
        height: metrics.verticalScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        margin: metrics.verticalScale(5),
    },
    digitButtonText: {
        fontSize: metrics.moderateScale(24),
    },
    backspaceButton: {
        width: metrics.horizontalScale(100),
        height: metrics.verticalScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        position: 'absolute',
        right: 10,
        bottom: 0,
    },
    backspaceButtonText: {
        fontSize: 24,
    },
    otpResendText: {
        fontSize: fonts.formInputFontSize,
        color: colors.subtitleColor,
    },
});

export default OtpCodeScreen;
