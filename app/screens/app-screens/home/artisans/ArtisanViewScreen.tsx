import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import Screen from '../../../../components/screen';
import AppText from '../../../../components/text';
import {Header2, Header3, Subtitle2} from '../../../../components/headers';
import type {ArtisanViewScreenProps} from '../../../../navigations/ArtisansNavigator';
import {Back} from '../../../../navigations/controls';
import icons from '../../../../config/icons';
import * as metrics from '../../../../utils/metrics';
import fonts from '../../../../config/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import {MessageUserCardProps, RatingCard} from '../../../../components/cards';

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
                <MaterialCommunityIcons name={iconName} size={icons.artisanProfileIconSize} color={iconColor} />
            </View>
            <AppText style={{textAlign: 'center', top: 12, fontSize: fonts.medium}}>{statValue}</AppText>
            <AppText style={{textAlign: 'center', top: 12, fontSize: fonts.normal}}>{statName}</AppText>
        </View>
    );
}

function ArtisanViewScreen({route}: ArtisanViewScreenProps) {
    return (
        <Screen>
            <View style={styles.artisanViewContainer}>
                <View style={styles.artisanViewScreenHeadContainer}>
                    <Back style={{position: 'relative', top: 0}} />
                </View>
                <View style={styles.artisanViewScreenMainContainer}>
                    <View style={styles.artisanProfilePrimaryInfoBar}>
                        <Header3>Charles Emmanuel</Header3>
                        <Subtitle2>Plumber</Subtitle2>
                    </View>
                    <View style={styles.artisanProfileStatsContainer}>
                        <ArtisanProfileStat iconBackDropColor='#F8F9FF' iconColor='#4A7AFF' iconName='calendar-clock' statName='Years' statValue={2} />
                        <ArtisanProfileStat iconBackDropColor='#FBF6FF' iconColor='#CA84FF' iconName='account-group' statName='Clients' statValue={80} />
                        <ArtisanProfileStat iconBackDropColor='#FFF9E8' iconColor='#FFBF1C' iconName='star-circle' statName='Rating' statValue={4.5} />
                        <ArtisanProfileStat iconBackDropColor='#F5FFE9' iconColor='#5EBE30' iconName='thumb-up' statName='Review' statValue={60} />
                    </View>

                    <View style={styles.artisanProfileDescriptionContainer}>
                        <Header3>About</Header3>
                        <AppText style={{marginTop: '4%', lineHeight: metrics.moderateScale(28), color: '#626262', fontSize: fonts.normalMedium}}>{'\t'}Your Trusted Plumbing Professional 🔧 With years of experience in keeping homes and businesses flowing smoothly, I&apos;m here to tackle all your plumbing needs. I&apos;m dedicated to providing top-notch service and ensuring your peace of mind.</AppText>
                    </View>
                    <ScrollView>
                        <RatingCard userId={2} />
                    </ScrollView>
                </View>
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
        width: '90%',
    },
    artisanViewScreenMainContainer: {
        marginTop: '15%',
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
        marginTop: '10%',
    },
    artisanProfileStat: {},
    artisanProfileInfoIconBackdrop: {
        alignSelf: 'center',
        padding: metrics.moderateScale(12),
        borderRadius: 50,
    },
    artisanProfileDescriptionContainer: {
        marginTop: '15%',
    },

    // Layout Style
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default ArtisanViewScreen;
