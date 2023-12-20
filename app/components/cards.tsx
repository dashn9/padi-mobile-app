import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, ScrollView, Pressable, Modal, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {AntDesign, Entypo, EvilIcons, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';

import colors from '../config/colors';
import * as metrics from '../utils/metrics';
import icons from '../config/icons';
import {Header3, Header4, Subtitle2} from './headers';
import AppText from './text';
import fonts from '../config/fonts';
import {UserImage} from './images';
import {type DirectMessageChatNavigationProp} from '../navigations/MessagesNavigator';
import {FormTextArea} from './inputs';
import {Button} from './buttons';
import {type RatingCreate} from '../hooks/mutations/useRatingMutation';
import {useFetchMyRatingQuery} from '../hooks/queries/useRatingQuery';

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
    firstName: string;
    lastName: string;
    state: string;
    rating: number;
    reviewsCount: number;
}
export function ArtisanProfileListCard({firstName, lastName, state, rating, reviewsCount}: ArtisanProfileListCardProps) {
    return (
        <View style={[styles.profileListCardContainer, styles.artisanProfileListCardContainer]}>
            <View style={{flex: 0.2}}>
                <UserImage initials={firstName[0] + lastName[0]} size={metrics.moderateScale(50)} containerStyle={{borderWidth: 0.5}} />
            </View>
            <View style={{flex: 0.8}}>
                <View style={styles.artisanProfilListCardInnerContainer}>
                    <AppText style={styles.artisansProfileListCardNameTextStyle}>{firstName + ' ' + lastName}</AppText>
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
    firstName: string;
    lastName: string;
    comment: string;
    starRating: number;
}
export function RatingCard({firstName, lastName, comment, starRating}: IratingCardProps) {
    return (
        <View style={styles.profileListCardContainer}>
            <View>
                <View style={styles.artisanProfilListCardInnerContainer}>
                    <AppText style={styles.artisansProfileListCardNameTextStyle}>
                        {firstName} {lastName}
                    </AppText>
                    <View style={styles.artisanProfileListCardRatingContainer}>
                        <AntDesign name='star' color={colors.ratingColor} size={metrics.moderateScale(icons.xs)} />
                        <AppText> {starRating}</AppText>
                    </View>
                </View>
                <View style={[styles.artisanProfilListCardInnerContainer, {marginTop: metrics.verticalScale(12)}]}>
                    <View style={styles.artisanProfileListCardLocationContainer}>
                        <AppText style={{color: '#848484', fontSize: metrics.moderateScale(15)}}>{comment}</AppText>
                    </View>
                </View>
            </View>
        </View>
    );
}

interface ImessageUserCardProps {
    userId: number;
}
export function MessageUserCardProps<NavigationProp extends DirectMessageChatNavigationProp>({userId}: ImessageUserCardProps) {
    const chatNavigation = useNavigation<NavigationProp>();
    return (
        <View style={styles.messageUserCardContainer}>
            <Pressable
                style={styles.sendToMessageContainer}
                onPress={() => {
                    chatNavigation.navigate('DirectMessageChatScreen', {recipientId: userId});
                }}
            >
                <AppText style={{fontSize: fonts.medium}}>Message</AppText>
            </Pressable>
            <Pressable style={styles.callButton}>
                <Feather name='phone' size={icons.xl6} color={colors.white} />
            </Pressable>
        </View>
    );
}

export interface SendChatMessageControlProps {
    messageSend: (message: string) => void;
}
export function SendChatMessageControl({messageSend}: SendChatMessageControlProps) {
    const [message, setMessage] = useState('');

    const handleTextChange = (text: string) => {
        setMessage(text);
    };

    return (
        <View style={styles.sendChatMessageControlContainer}>
            <View style={styles.sendChatMessageControlInputContainer}>
                <TextInput multiline numberOfLines={5} style={styles.sendChatMessageControlInput} placeholder='Message' onChangeText={handleTextChange} />
            </View>
            <View style={{marginLeft: metrics.horizontalScale(8)}}>
                <Pressable
                    onPress={() => {
                        messageSend(message);
                    }}
                    style={styles.sendChatMessageControlSendMessageButton}
                >
                    <Entypo style={{marginRight: 2}} name='paper-plane' color={colors.white} size={icons.xl} />
                </Pressable>
            </View>
        </View>
    );
}

export type Rate = Pick<RatingCreate, 'ratingComment' | 'ratingStarsPoint'>;
interface PostReviewProps {
    targetName?: string;
    targetType: string;
    targetId: number;
    isPosting?: boolean;
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    onRatingPost?: (rating: Rate) => void;
}

export function PostReview({targetName = 'this person', visible, setVisibility, onRatingPost, isPosting, targetType, targetId}: PostReviewProps) {
    const [starRating, setStarRating] = useState(1);
    const [comment, setComment] = useState('');

    const myRating = useFetchMyRatingQuery(targetType, targetId);

    useEffect(() => {
        setStarRating(myRating.data?.ratingStarsPoint ?? 1);
        setComment(myRating.data?.ratingComment ?? '');
    }, [myRating.data]);

    const updateStarRating = (rating: number) => {
        if (rating >= 1) {
            setStarRating(rating);
        }
    };

    const uploadRating = () => {
        if (onRatingPost) {
            onRatingPost({ratingComment: comment, ratingStarsPoint: starRating});
        }
    };

    return (
        <Modal animationType='fade' transparent={true} visible={visible}>
            <View style={styles.centeredView}>
                <View style={styles.postReviewContainer}>
                    <MaterialCommunityIcons
                        name='cancel'
                        size={icons.l}
                        style={{marginLeft: 'auto'}}
                        onPress={() => {
                            setVisibility(false);
                        }}
                    />
                    <Header3 style={{marginTop: 0}}>Post Review</Header3>
                    <FormTextArea
                        outText={comment}
                        placeholder={'Review ' + targetName}
                        maxLength={300}
                        onChangeText={text => {
                            if (typeof text === 'string') {
                                setComment(text);
                            }
                        }}
                    />
                    <StarRating style={{alignSelf: 'center'}} starSize={40} rating={starRating} onChange={updateStarRating} />
                    {isPosting ? <ActivityIndicator style={{marginLeft: 'auto', marginTop: metrics.verticalScale(16)}} color={colors.primaryCOlor900B} /> : ''}
                    <Button disabled={isPosting} buttonStyle={{marginLeft: 'auto', marginTop: metrics.verticalScale(16)}} text='Post Review' onPress={uploadRating} />
                </View>
            </View>
        </Modal>
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

    profileListCardContainer: {
        width: '100%',
        backgroundColor: colors.formInputBgColor2,
        marginTop: metrics.verticalScale(16),
        padding: metrics.moderateScale(16),
        borderRadius: 8,
    },

    // Artisan Profile List Card
    artisanProfileListCardContainer: {
        flexDirection: 'row',
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

    // Chat messages control
    sendChatMessageControlContainer: {
        flexDirection: 'row',
        paddingVertical: metrics.verticalScale(16),
        paddingHorizontal: metrics.horizontalScale(16),
        borderTopColor: '#F5F5F5',
        borderTopWidth: 2,
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    sendChatMessageControlInputContainer: {
        flex: 0.9,
        borderWidth: 0.5,
        borderColor: '#CECFCF',
        padding: metrics.moderateScale(12),
        borderRadius: 6,
    },
    sendChatMessageControlInput: {
        fontSize: fonts.normal,
        maxHeight: metrics.horizontalScale(100),
    },
    sendChatMessageControlSendMessageButton: {
        backgroundColor: colors.primaryColor800B,
        padding: metrics.moderateScale(8),
        borderRadius: 50,
    },

    // Post review
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postReviewContainer: {
        margin: metrics.moderateScale(20),
        backgroundColor: 'white',
        borderRadius: 8,
        padding: metrics.moderateScale(24),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
