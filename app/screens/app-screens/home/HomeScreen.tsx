import React from 'react';
import {View, ScrollView, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import Screen from '../../../components/screen';
import {Header3, HomeHeader} from '../../../components/headers';
import {CompleteYourProfileCard, HorizontalSnappingCards, ServiceCard} from '../../../components/cards';
import type {HomeScreenStackNavigator} from '../../../navigations/AppNavigator';

function HomeScreen() {
    const navigator = useNavigation<StackNavigationProp<HomeScreenStackNavigator>>();
    return (
        <Screen>
            <ScrollView style={{width: '100%'}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} alwaysBounceVertical={false} bounces={false}>
                <View style={styles.homeScreenMainContainer}>
                    <View style={styles.homeScreenHeaderContainer}>
                        <HomeHeader>Hi, Charles</HomeHeader>
                        <CompleteYourProfileCard />
                    </View>
                    <View style={styles.specialOffersContainer}>
                        <Header3>Special Offers</Header3>
                        <HorizontalSnappingCards />
                    </View>
                    <View style={styles.serviceCardsContainer}>
                        <Pressable style={styles.serviceCardPressableContainer}>
                            <ServiceCard cardTitle='Shortlet Apartments' cardDescription='Discover Your Short-Term Oasis!' cardColor='#F5FFE9' iconName='home' iconColor='#5EBE30' iconDropColor='#E3FDC3' />
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                navigator.navigate('ArtisansHomeScreen');
                            }}
                            style={styles.serviceCardPressableContainer}
                        >
                            <ServiceCard cardTitle='Artisans' cardDescription='Discover Skilled, Credible Artisans near you' cardColor='#FBF6FF' iconName='linechart' iconColor='#CA84FF' iconDropColor='#F7ECFF' />
                        </Pressable>
                        <Pressable style={styles.serviceCardPressableContainer}>
                            <ServiceCard cardTitle='Crypto' cardDescription='Trade smart, convert your crypto to naira with us' cardColor='#F6F9FF' iconName='tool' iconColor='#4A7AFF' iconDropColor='#E4EDFF' />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    homeScreenMainContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    homeScreenHeaderContainer: {
        width: '90%',
        marginTop: '5%',
    },
    serviceCardPressableContainer: {
        width: '48%',
    },
    serviceCardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '90%',
    },
    specialOffersContainer: {
        width: '90%',
    },
});

export default HomeScreen;
