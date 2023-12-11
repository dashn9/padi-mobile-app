import React from 'react';
import {SafeAreaView, View, StyleSheet, type ViewStyle} from 'react-native';
import Constants from 'expo-constants';

type ScreenProps = {
    children: React.ReactNode;
    innerContainerStyle?: ViewStyle;
};
function Screen({children, innerContainerStyle}: ScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.innerContainer, innerContainerStyle]}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: '90%',
        flex: 1,
        overflow: 'hidden',
    },
});

export default Screen;
