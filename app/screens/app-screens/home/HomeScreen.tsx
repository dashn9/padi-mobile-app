import React from 'react';
import {View, ScrollView, StyleSheet, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import Screen from '../../../components/screen';
import {Header3, HomeHeader} from '../../../components/headers';
import {CompleteYourProfileCard, HorizontalSnappingCards, ServiceCard} from '../../../components/cards';
import type {HomeScreenStackNavigator} from '../../../navigations/AppNavigator';
import {UserImage} from '../../../components/images';
import icons from '../../../config/icons';
import {useAuthContext} from '../../../hooks/contexts/AuthContext';

function HomeScreen() {
    const {user} = useAuthContext();
    const navigator = useNavigation<StackNavigationProp<HomeScreenStackNavigator>>();
    return (
        <Screen>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} alwaysBounceVertical={false} bounces={false}>
                <View style={styles.homeScreenMainContainer}>
                    <View style={styles.homeScreenHeaderContainer}>
                        <View style={styles.userGreetingContainer}>
                            <UserImage size={icons.xl16} />
                            {/** Fetch profile information on login, also make use of profile image instead if exists, modify the download image to allow for it  */}
                            <HomeHeader> Hi, {user?.firstName ?? 'User'}</HomeHeader>
                        </View>

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
    },
    homeScreenHeaderContainer: {
        width: '100%',
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
        width: '100%',
    },
    specialOffersContainer: {
        width: '100%',
    },

    // User Greeting
    userGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HomeScreen;
