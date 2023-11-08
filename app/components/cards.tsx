import React, {useLayoutEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, ScrollView, Pressable} from 'react-native';

import colors from '../config/colors';
import * as metrics from '../utils/metrics';
import {AntDesign, EvilIcons, Feather} from '@expo/vector-icons';
import icons from '../config/icons';
import {Header3, Header4, Subtitle2} from './headers';
import AppText from './text';
import fonts from '../config/fonts';

interface ServiceCardProps {
    iconName: 'linechart' | 'home' | 'tool';
    iconColor: string;
    iconDropColor: string;
    cardTitle: string;
    cardDescription: string;
    cardColor: string;
}

export function CompleteYourProfileCard() {
    return (
        <View style={styles.completeYourProfileBarContainer}>
            <View style={styles.completeYourProfileIconBackDrop}>
                <AntDesign name='user' size={icons.l} color={colors.primaryColor} />
            </View>
            <View style={styles.completeYourProfileTextContainer}>
                <Header4 style={{marginTop: 0}}>Complete your profile</Header4>
                <Subtitle2 style={styles.completeYourProfileSubtitle}>Set up your profile to enable us serve you better</Subtitle2>
            </View>
            <AntDesign name='right' size={12} color={colors.primaryColor} />
        </View>
    );
}

export function ServiceCard({iconName, iconColor, iconDropColor, cardTitle, cardDescription, cardColor}: ServiceCardProps) {
    return (
        <View style={[styles.serviceCardContainer, {backgroundColor: cardColor}]}>
            <View style={[styles.serviceCardIconContainer, {backgroundColor: iconDropColor}]}>
                <AntDesign name={iconName} size={metrics.moderateScale(22)} color={iconColor} />
            </View>
            <Header3 style={{marginTop: metrics.verticalScale(16)}}>{cardTitle}</Header3>
            <Subtitle2 style={{marginTop: metrics.verticalScale(28)}}>{cardDescription}</Subtitle2>
        </View>
    );
}

const {width} = Dimensions.get('window');

export function HorizontalSnappingCards() {
    const scrollViewRef = useRef<ScrollView>(null);

    useLayoutEffect(() => {
        setTimeout(() => {
            if (scrollViewRef.current !== null) {
                scrollViewRef.current.scrollTo({x: -30});
            }
        }, 1);
    }, []);

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.snappingCardsContainer}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width - 80}
            snapToAlignment={'center'}
            contentInset={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            }}
        >
            <View style={styles.snappingCard} />
            <View style={styles.snappingCard} />
            <View style={styles.snappingCard} />
            <View style={styles.snappingCard} />
            <View style={styles.snappingCard} />
        </ScrollView>
    );
}

interface ArtisanProfileListCardProps {
    name: string;
    state: string;
    rating: number;
    reviewsCount: number;
}
export function ArtisanProfileListCard({name, state, rating, reviewsCount}: ArtisanProfileListCardProps) {
    return (
        <View style={styles.artisanProfileListCardContainer}>
            <View>
                <View style={styles.artisanProfilListCardInnerContainer}>
                    <AppText style={styles.artisansProfileListCardNameTextStyle}>{name}</AppText>
                    <View style={styles.artisanProfileListCardRatingContainer}>
                        <AntDesign name='star' color={colors.ratingColor} size={metrics.moderateScale(icons.xs)} />
                        <AppText> {rating}</AppText>
                    </View>
                </View>
                <View style={[styles.artisanProfilListCardInnerContainer, {marginTop: metrics.verticalScale(12)}]}>
                    <View style={styles.artisanProfileListCardLocationContainer}>
                        <EvilIcons name='location' size={metrics.moderateScale(icons.xs + 2)} />
                        <AppText style={{color: '#848484', fontSize: metrics.moderateScale(15)}}>{state}</AppText>
                    </View>
                    {reviewsCount ? <AppText style={{marginLeft: 'auto', color: '#848484', fontSize: metrics.moderateScale(15)}}>{reviewsCount} reviews</AppText> : null}
                </View>
            </View>
        </View>
    );
}

interface IratingCardProps {
    userId: number;
}
export function RatingCard({userId}: IratingCardProps) {
    return (
        <View style={styles.artisanProfileListCardContainer}>
            <View>
                <View style={styles.artisanProfilListCardInnerContainer}>
                    <AppText style={styles.artisansProfileListCardNameTextStyle}>James Guidetti</AppText>
                    <View style={styles.artisanProfileListCardRatingContainer}>
                        <AntDesign name='star' color={colors.ratingColor} size={metrics.moderateScale(icons.xs)} />
                        <AppText> {4.5}</AppText>
                    </View>
                </View>
                <View style={[styles.artisanProfilListCardInnerContainer, {marginTop: metrics.verticalScale(12)}]}>
                    <View style={styles.artisanProfileListCardLocationContainer}>
                        <AppText style={{color: '#848484', fontSize: metrics.moderateScale(15)}}>This is my description</AppText>
                    </View>
                </View>
            </View>
        </View>
    );
}

interface ImessageUserCardProps {
    userId: number;
}
export function MessageUserCardProps({userId}: ImessageUserCardProps) {
    return (
        <View style={styles.messageUserCardContainer}>
            <View style={styles.sendToMessageContainer}>
                <AppText style={{fontSize: fonts.medium}}>Message</AppText>
            </View>
            <Pressable style={styles.callButton}>
                <Feather name='phone' size={icons.xl6} color={colors.white} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    completeYourProfileBarContainer: {
        backgroundColor: '#F6F9FF',
        paddingVertical: metrics.verticalScale(16),
        marginTop: '4%',
        borderWidth: 1,
        borderColor: colors.primaryColor,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    completeYourProfileIconBackDrop: {
        backgroundColor: '#E4EDFF',
        borderRadius: 50,
        padding: metrics.verticalScale(8),
        alignSelf: 'center',
    },
    completeYourProfileTextContainer: {
        width: '70%',
    },
    completeYourProfileSubtitle: {
        marginTop: metrics.verticalScale(4),
        lineHeight: metrics.verticalScale(20),
    },
    serviceCardContainer: {
        padding: metrics.moderateScale(18),
        borderRadius: 8,
        marginTop: metrics.verticalScale(16),
    },
    serviceCardIconContainer: {
        backgroundColor: '#E4EDFF',
        borderRadius: 50,
        padding: metrics.verticalScale(8),
        alignSelf: 'flex-start',
    },
    snappingCardsContainer: {
        borderColor: 'green',
    },
    snappingCard: {
        backgroundColor: 'blue',
        width: width - 100,
        margin: 10,
        height: 200,
        borderRadius: 10,
    },

    // Artisan Profile List Card
    artisanProfileListCardContainer: {
        width: '100%',
        backgroundColor: colors.formInputBgColor2,
        marginTop: metrics.verticalScale(16),
        padding: metrics.moderateScale(16),
        borderRadius: 8,
    },
    artisanProfilListCardInnerContainer: {
        flexDirection: 'row',
    },
    artisanProfileListCardRatingContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'center',
    },
    artisanProfileListCardLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    artisansProfileListCardNameTextStyle: {
        fontSize: metrics.moderateScale(17),
        fontFamily: 'karlaSemiBold',
    },

    // Message User
    messageUserCardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: metrics.verticalScale(60),
    },
    sendToMessageContainer: {
        backgroundColor: '#F8F9FF',
        borderWidth: 2,
        borderColor: colors.primaryColor,
        borderRadius: 6,
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    callButton: {
        backgroundColor: colors.primaryColor,
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        borderRadius: 10,
    },
});
