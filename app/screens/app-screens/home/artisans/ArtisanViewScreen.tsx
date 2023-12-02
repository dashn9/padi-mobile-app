import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import Screen from '../../../../components/screen';
import AppText from '../../../../components/text';
import {Header3, Subtitle2} from '../../../../components/headers';
import type {ArtisanViewScreenProps} from '../../../../navigations/ArtisansNavigator';
import {Back} from '../../../../navigations/controls';
import icons from '../../../../config/icons';
import * as metrics from '../../../../utils/metrics';
import fonts from '../../../../config/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import {MessageUserCardProps, RatingCard} from '../../../../components/cards';
import {useFetchArtisanProfileQuery} from '../../../../hooks/queries/useArtisanQuery';
import {fetchNoOfMonths} from '../../../../utils/datetime';
import {UserImage} from '../../../../components/images';

interface ArtisanProfileStatProps {
    iconBackDropColor: string;
    iconColor: string;
    iconName: 'calendar-clock' | 'account-group' | 'star-circle' | 'thumb-up';
    statName: string;
    statValue: string | number;
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
    console.log(artisanProfile);
    return (
        <Screen>
            <View style={styles.artisanViewContainer}>
                <View style={styles.artisanViewScreenHeadContainer}>
                    <Back style={{position: 'relative', top: 0}} />
                </View>
                <ScrollView>
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
                            <ArtisanProfileStat iconBackDropColor='#FFF9E8' iconColor='#FFBF1C' iconName='star-circle' statName='Rating' statValue={4.5} />
                            <ArtisanProfileStat iconBackDropColor='#F5FFE9' iconColor='#5EBE30' iconName='thumb-up' statName='Review' statValue={60} />
                        </View>

                        <View style={styles.artisanProfileDescriptionContainer}>
                            <Header3>About</Header3>
                            {/** I had the Idea of lumping description with the ratings in the same scrollable */}
                            <AppText style={{marginTop: '4%', lineHeight: metrics.moderateScale(28), color: '#626262', fontSize: fonts.normalMedium}}>{artisanProfile?.bio}</AppText>
                            <RatingCard userId={2} />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomView}>
                    <MessageUserCardProps userId={0} />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    artisanViewContainer: {
        flex: 1,
    },
    artisanViewScreenMainContainer: {
        marginTop: '5%',
    },
    artisanViewScreenHeadContainer: {
        flexDirection: 'row',
        marginTop: '10%',
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
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default ArtisanViewScreen;
