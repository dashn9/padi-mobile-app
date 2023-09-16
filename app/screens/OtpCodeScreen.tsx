import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import Screen from '../components/screen';
import colors from '../config/colors';
import * as metrics from '../metrics/metrics';
import {FormButton} from '../components/buttons';
import {Header1, Subtitle2} from '../components/headers';
import {Back} from '../navigations/controls';

const OtpCodeScreen: React.FC = () => {
    const [otpCode, setOtpCode] = useState<string>('');
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

    return (
        <Screen>
            <View style={styles.container}>
                <Back style={{top: metrics.verticalScale(32)}} />
                <Header1>Confirm Your E-mail</Header1>
                <Subtitle2>
                    A code has been sent to &quot;&quot; Input the code to
                    complete account creation
                </Subtitle2>
                <View style={styles.otpCodeContainer}>
                    {Array.from({length: maxDigits}, (_, index) => (
                        <View key={index} style={styles.otpCodeDigit}>
                            <Text style={styles.otpCodeDigitText}>
                                {otpCode[index] || ''}
                            </Text>
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
                            <Text style={styles.digitButtonText}>
                                {index + 1}
                            </Text>
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
                    <TouchableOpacity
                        style={styles.backspaceButton}
                        onPress={handleBackspace}
                    >
                        <Text style={styles.backspaceButtonText}>←</Text>
                    </TouchableOpacity>
                </View>
                <FormButton text='Proceed' />
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
});

export default OtpCodeScreen;
