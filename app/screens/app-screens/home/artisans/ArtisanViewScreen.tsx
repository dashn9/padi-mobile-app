import React, {useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, ActivityIndicator} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import {useNavigation} from '@react-navigation/native';

import Screen from '../../../../components/screen';
import AppText from '../../../../components/text';
import {Header3, Subtitle2} from '../../../../components/headers';
import type {ArtisanViewScreenProps} from '../../../../navigations/ArtisansNavigator';
import {Back} from '../../../../navigations/controls';
import icons from '../../../../config/icons';
import * as metrics from '../../../../utils/metrics';
import fonts from '../../../../config/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import {MessageUserCardProps, PostReview, type Rate, RatingCard} from '../../../../components/cards';
import {useFetchArtisanProfileQuery} from '../../../../hooks/queries/useArtisanQuery';
import {fetchNoOfMonths} from '../../../../utils/datetime';
import {UserImage} from '../../../../components/images';
import colors from '../../../../config/colors';
import {type RatingDisplay, useFetchRatingsPaginatedQuery, useFetchAvgRatingQuery, useFetchMyRatingQuery} from '../../../../hooks/queries/useRatingQuery';
import {usePageNumberPagination} from '../../../../hooks/usePagination';
import {useRatingMutation} from '../../../../hooks/mutations/useRatingMutation';
import {useMessage, Message2} from '../../../../components/messages';

interface ArtisanProfileStatProps {
    iconBackDropColor: string;
    iconColor: string;
    iconName: 'calendar-clock' | 'account-group' | 'star-circle' | 'thumb-up';
    statName: string;
    statValue: string | number;
}

interface RenderRatingProps {
    item: RatingDisplay;
}

function ArtisanProfileStat({iconBackDropColor, iconColor, iconName, statName, statValue}: ArtisanProfileStatProps) {
    return (
        <View style={styles.artisanProfileStat}>
            <View style={[styles.artisanProfileInfoIconBackdrop, {backgroundColor: iconBackDropColor}]}>
                <MaterialCommunityIcons name={iconName} size={icons.xl2} color={iconColor} />
            </View>
            <AppText style={{textAlign: 'center', top: 12, fontSize: fonts.medium}}>{statValue}</AppText>
            <AppText style={{textAlign: 'center', top: 12, fontSize: fonts.normal}}>{statName}</AppText>
        </View>
    );
}

function ArtisanViewScreen({route}: ArtisanViewScreenProps) {
    const artisanProfile = useFetchArtisanProfileQuery(route.params.artisanId).data;
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [reviewFullscreen, setReviewFullscreen] = useState(false);
    const [isReviewPosting, setIsReviewPosting] = useState(false);

    const myRating = useFetchMyRatingQuery('artisan', artisanProfile?.id ?? -1);

    const {isVisible, message, messageStatus, showMessage, hideMessage} = useMessage();

    const rateMutator = useRatingMutation(
        (loadingState: boolean) => {
            setIsReviewPosting(loadingState);
        },
        () => {
            showMessage('Review posted successfully!', 'success');
        },
        () => {
            showMessage('An error occurred while posting your review', 'failure');
        }
    );

    const {results, resultsCount, isPaginationLoading, goForward} = usePageNumberPagination(useFetchRatingsPaginatedQuery, true, undefined, {targetType: 'artisan', targetId: artisanProfile?.id});

    const artisanRatingAggregates = useFetchAvgRatingQuery('artisan', artisanProfile?.id ?? -1).data;
    const updateReviewModalVisibile = (modalVisible: boolean) => {
        setReviewModalVisible(modalVisible);
    };

    const updateRatingList = () => {
        if (!isPaginationLoading) {
            goForward();
        }
    };

    const renderRating = ({item}: RenderRatingProps) => <RatingCard firstName={item.ratingGiverFirstName} lastName={item.ratingGiverLastName} comment={item.ratingComment} starRating={item.ratingStarsPoint} />;

    const renderArtisanFooter = () => <View style={styles.ratingsFlatListFooter}>{isPaginationLoading ? <ActivityIndicator color={colors.primaryColor800B} /> : null}</View>;

    const postRating = ({ratingComment, ratingStarsPoint}: Rate) => {
        if (artisanProfile?.id) {
            if (!ratingComment) {
                showMessage('You need to have a review for ' + (artisanProfile?.firstName ?? ''), 'caution');
                return;
            }

            rateMutator.mutate({ratingTargetId: artisanProfile.id, ratingTargetType: 'artisan', ratingComment, ratingStarsPoint});
        }
    };

    return (
        <>
            <Screen>
                <Message2 message={message} status={messageStatus} isVisible={isVisible} onHide={hideMessage} />
                <View style={styles.artisanProfileContainer}>
                    <View style={styles.artisanViewContainer}>
                        <View style={styles.artisanViewScreenHeadContainer}>
                            <Back style={{position: 'relative', top: 0}} />
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.artisanViewScreenMainContainer}>
                                <View style={styles.artisanProfilePrimaryInfoBar}>
                                    {artisanProfile?.firstName && artisanProfile.lastName ? <UserImage initials={artisanProfile.firstName[0] + artisanProfile.lastName[0]} size={metrics.moderateScale(120)} /> : undefined}
                                    <Header3>
                                        {artisanProfile?.firstName} {artisanProfile?.lastName}
                                    </Header3>
                                    <Subtitle2>{artisanProfile?.services.map(service => service.serviceIndividualName).join(',')}</Subtitle2>
                                </View>
                                <View style={styles.artisanProfileStatsContainer}>
                                    <ArtisanProfileStat iconBackDropColor='#F8F9FF' iconColor='#4A7AFF' iconName='calendar-clock' statName='Months' statValue={artisanProfile?.joined ? fetchNoOfMonths(artisanProfile.joined) : 0} />
                                    <ArtisanProfileStat iconBackDropColor='#FBF6FF' iconColor='#CA84FF' iconName='account-group' statName='Clients' statValue={80} />
                                    <ArtisanProfileStat iconBackDropColor='#FFF9E8' iconColor='#FFBF1C' iconName='star-circle' statName='Rating' statValue={artisanRatingAggregates?.ratingStarsAverage ?? 'N/A'} />
                                    <ArtisanProfileStat iconBackDropColor='#F5FFE9' iconColor='#5EBE30' iconName='thumb-up' statName='Reviews' statValue={resultsCount} />
                                </View>

                                <View style={styles.artisanProfileDescriptionContainer}>
                                    <Header3>About</Header3>
                                    {/** I had the Idea of lumping description with the ratings in the same scrollable */}
                                    <AppText style={{marginTop: '4%', lineHeight: metrics.moderateScale(28), color: '#626262', fontSize: fonts.normalMedium}}>{artisanProfile?.bio}</AppText>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={[styles.artisanReviewContainer, reviewFullscreen ? {flex: 10} : null]}>
                        <View style={{marginTop: metrics.verticalScale(26), flexDirection: 'row', alignItems: 'center'}}>
                            <Pressable
                                style={{flexDirection: 'row'}}
                                onPress={() => {
                                    setReviewFullscreen(!reviewFullscreen);
                                }}
                            >
                                <Header3 style={{marginTop: 0}}>Reviews</Header3>
                                <MaterialCommunityIcons name={reviewFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={icons.xl} />
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    updateReviewModalVisibile(true);
                                }}
                                style={{marginLeft: 'auto'}}
                            >
                                <AppText style={{color: colors.primaryColor900B}}>{myRating?.data ? '* Edit Review' : '+ Create Review'}</AppText>
                            </Pressable>
                        </View>
                        <FlatList data={Array.from(results)} renderItem={renderRating} onEndReached={updateRatingList} onEndReachedThreshold={0.1} showsVerticalScrollIndicator={false} ListFooterComponent={renderArtisanFooter} />
                    </View>
                    <View style={styles.bottomView}>
                        <MessageUserCardProps userId={artisanProfile?.userId ?? -1} />
                    </View>
                </View>
            </Screen>
            <PostReview targetType='artisan' targetId={artisanProfile?.id ?? -1} isPosting={isReviewPosting} visible={reviewModalVisible} setVisibility={updateReviewModalVisibile} targetName={artisanProfile?.firstName} onRatingPost={postRating} />
        </>
    );
}

const styles = StyleSheet.create({
    artisanProfileContainer: {
        flex: 1,
    },
    artisanViewContainer: {
        flex: 0.8,
    },
    artisanReviewContainer: {
        flex: 0.2,
    },
    artisanViewScreenMainContainer: {
        marginTop: '5%',
    },
    artisanViewScreenHeadContainer: {
        flexDirection: 'row',
        marginTop: '5%',
    },
    artisanProfilePrimaryInfoBar: {
        alignItems: 'center',
    },
    artisanProfileStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '5%',
    },
    artisanProfileStat: {},
    artisanProfileInfoIconBackdrop: {
        alignSelf: 'center',
        padding: metrics.moderateScale(12),
        borderRadius: 50,
    },
    artisanProfileDescriptionContainer: {
        marginTop: '10%',
    },

    // Layout Style
    bottomView: {
        justifyContent: 'flex-end',
        backgroundColor: colors.white,
    },

    ratingsFlatListFooter: {
        alignItems: 'center',
        marginTop: metrics.verticalScale(8),
    },
});

export default ArtisanViewScreen;
