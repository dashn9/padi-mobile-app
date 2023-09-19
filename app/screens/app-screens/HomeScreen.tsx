import React from 'react';
import {View, StyleSheet} from 'react-native';

import Screen from '../../components/screen';
import AppText from '../../components/text';

function HomeScreen() {
    return (
        <Screen>
            <View style={styles.homeScreenMainContainer}>
                <AppText>Welcome to Padi!</AppText>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    homeScreenMainContainer: {},
});

export default HomeScreen;
