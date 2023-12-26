import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Screen from '../../../../components/screen';
import * as metrics from '../../../../utils/metrics';
import {type ArtisanProfileDashboardScreenProps} from '../../../../navigations/AccountNavigator';
import icons from '../../../../config/icons';
import AppText from '../../../../components/text';
import {AppHeader, Header3, Header4} from '../../../../components/headers';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';
import colors from '../../../../config/colors';
import {Back} from '../../../../navigations/controls';
import {useFetchMyArtisanProfileQuery} from '../../../../hooks/queries/useArtisanQuery';

interface AccountDetailItemProps {
    label: string | number;
    value: string | number | undefined;
    onEditClick?: () => void;
}
function AccountDetailItem({label, value, icon, onEditClick}: AccountDetailItemProps) {
    if (!value) {
        value = undefined;
    }

    return (
        <View style={styles.accountDetailItemContainer}>
            <View style={styles.accountDetailItemLabelContainer}>
                <Header4 style={{marginTop: 0}}>{label}</Header4>
            </View>
            <View style={styles.accountDetailItemValueContainer}>
                <AppText style={styles.accountDetailItemValue}>{value ?? 'None'}</AppText>
            </View>
            <Pressable onPress={onEditClick} style={{marginLeft: 'auto'}}>
                <AppText style={{color: colors.primaryColor800B}}>Edit {label}</AppText>
            </Pressable>
        </View>
    );
}

export function ArtisanProfileDashboardScreen({route, navigation}: ArtisanProfileDashboardScreenProps) {
    const myArtisanProfile = useFetchMyArtisanProfileQuery().data;
    console.log(myArtisanProfile);

    return (
        <Screen>
            <View style={styles.accountDashboardContainer}>
                <AppHeader>Artisan Profile</AppHeader>
                <ScrollView alwaysBounceVertical={false}>
                    <View style={styles.accountDetailItemsParent}>
                        <AccountDetailItem
                            onEditClick={() => {
                                navigation.navigate('ChangeArtisanBio', {currentBio: myArtisanProfile?.bio ?? ''});
                            }}
                            label='Bio'
                            value={myArtisanProfile?.bio}
                        />
                        <AccountDetailItem
                            onEditClick={() => {
                                navigation.navigate('ChangeArtisanServices', {currentServices: myArtisanProfile?.services ?? []});
                            }}
                            label='Service'
                            value={myArtisanProfile?.services?.[0].serviceName}
                        />
                    </View>
                </ScrollView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    accountMainDetails: {
        alignItems: 'center',
    },
    accountDashboardContainer: {
        flex: 1,
    },
    accountDetailItemContainer: {
        marginBottom: metrics.verticalScale(42),
    },
    accountDetailItemsParent: {
        marginTop: '12%',
    },
    accountDetailItemLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountDetailItemValueContainer: {
        marginTop: metrics.verticalScale(6),
    },
    accountDetailItemValue: {
        fontWeight: 'bold',
        marginRight: metrics.horizontalScale(16),
    },
});

export default ArtisanProfileDashboardScreen;
