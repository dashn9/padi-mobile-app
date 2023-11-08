import React from 'react';
import * as FileSystem from 'expo-file-system';
import {View, ScrollView, StyleSheet, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import Screen from '../../../components/screen';
import {Header3, HomeHeader} from '../../../components/headers';
import {CompleteYourProfileCard, HorizontalSnappingCards, ServiceCard} from '../../../components/cards';
import type {HomeScreenStackNavigator} from '../../../navigations/AppNavigator';
import {default as imagesURL, setAvatarSeed} from '../../../apis/images';
import icons from '../../../config/icons';
import {Fontisto} from '@expo/vector-icons';
import colors from '../../../config/colors';
import {useAuthContext} from '../../../hooks/contexts/AuthContext';

function HomeScreen() {
    const {user} = useAuthContext();
    const [localImageUri, setLocalImageUri] = React.useState<string | undefined>(undefined);
    React.useEffect(() => {
        const localAvatarsDirectory = `${FileSystem.documentDirectory}user/images/avatars/`;
        const mainUserAvatar = 'user_avatar.jpg';

        const downloadImage = async () => {
            await FileSystem.makeDirectoryAsync(localAvatarsDirectory, {intermediates: true});
            FileSystem.getInfoAsync(localAvatarsDirectory + mainUserAvatar)
                .then(fileInfo => {
                    if (fileInfo.exists) {
                        setLocalImageUri(localAvatarsDirectory + mainUserAvatar);
                    } else {
                        throw new Error('Image doesn&39;t exist.');
                    }
                })
                .catch(() => {
                    setAvatarSeed(user?.id);
                    // Image file doesn't exist, download it from the internet
                    FileSystem.downloadAsync(imagesURL.generateAvatar.url, localAvatarsDirectory + mainUserAvatar)
                        .then(async imageDownloadResult => {
                            setLocalImageUri(imageDownloadResult.uri);
                        })
                        .catch(error => {
                            console.log(error);
                            void 0;
                        });
                });

            // Send an event if the user is not online to attempt a delete on the avatar so whoever is logging in don't use the previous avatar
        };

        void downloadImage();
    }, []);

    const navigator = useNavigation<StackNavigationProp<HomeScreenStackNavigator>>();
    return (
        <Screen>
            <ScrollView style={{width: '100%'}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} alwaysBounceVertical={false} bounces={false}>
                <View style={styles.homeScreenMainContainer}>
                    <View style={styles.homeScreenHeaderContainer}>
                        <View style={styles.userGreetingContainer}>
                            <View style={styles.profileIconBackDrop}>{localImageUri ? <Image source={{uri: localImageUri}} style={{width: icons.xl18, height: icons.xl18}} /> : <Fontisto name='user-secret' size={icons.xl14 + 1} color={colors.primaryColor800B} />}</View>
                            {/** Fetch profile information on login, also make use of profile image instead if exists, modify the download image to allow for it  */}
                            <HomeHeader> Hi, Charles</HomeHeader>
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

    // User Greeting
    userGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIconBackDrop: {
        backgroundColor: '#b6e3f4',
        borderRadius: 25,
        width: icons.xl16,
        height: icons.xl16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default HomeScreen;
