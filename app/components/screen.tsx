import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

type ScreenProps = {
    children: React.ReactNode;
};
function Screen({children}: ScreenProps) {
    return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Screen;
