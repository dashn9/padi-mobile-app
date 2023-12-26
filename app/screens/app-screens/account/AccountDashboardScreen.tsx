import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Screen from '../../../components/screen';
import * as metrics from '../../../utils/metrics';
import {UserImage} from '../../../components/images';
import {type AccountDashboardScreenProps} from '../../../navigations/AccountNavigator';
import icons from '../../../config/icons';
import AppText from '../../../components/text';
import {useAuthContext} from '../../../hooks/contexts/AuthContext';
import {Header3, Header4} from '../../../components/headers';
import {capitalizeFirstLetter} from '../../../utils/string';
import {AntDesign, Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import colors from '../../../config/colors';
import {useCheckIfIsArtisanQuery} from '../../../hooks/queries/useArtisanQuery';
import {Button} from '../../../components/buttons';

interface AccountDetailItemProps {
    label: string | number;
    value: string | number | undefined;
    icon?: React.ReactElement;
    onClick?: () => void;
}
function AccountDetailItem({label, value, icon, onClick}: AccountDetailItemProps) {
    if (!value) {
        value = undefined;
    }

    return (
        <Pressable onPress={onClick} style={styles.accountDetailItemContainer}>
            <View style={styles.accountDetailItemLabelContainer}>
                {icon}
                <Header4 style={{marginTop: 0, marginLeft: metrics.horizontalScale(8)}}>{label}</Header4>
            </View>
            <View style={styles.accountDetailItemValueContainer}>
                <AppText style={styles.accountDetailItemValue}>{value ?? 'None'}</AppText>
                <AntDesign name='right' size={icons.m} />
            </View>
        </Pressable>
    );
}

export function AccountDashboardScreen({route, navigation}: AccountDashboardScreenProps) {
    const {user} = useAuthContext();
    const isArtisan = useCheckIfIsArtisanQuery();
    return (
        <Screen>
            <View style={styles.accountDashboardContainer}>
                <ScrollView>
                    <View style={styles.accountMainDetails}>
                        <View>
                            <UserImage size={icons.xl100} containerStyle={{borderWidth: 2, borderColor: colors.primaryColor800B}} />
                        </View>
                        <View>
                            <Header3>
                                {capitalizeFirstLetter(user?.firstName)} {capitalizeFirstLetter(user?.lastName)}
                            </Header3>
                        </View>
                    </View>
                    <View style={styles.accountDetailItemsParent}>
                        <Header3 style={{marginBottom: metrics.verticalScale(42), textAlign: 'center'}}>Account</Header3>
                        <AccountDetailItem label='Email' value={user?.email} icon={<Entypo name='email' size={icons.m} />} />
                        <AccountDetailItem label='Phone Number' value={user?.phoneNumber} icon={<Entypo name='phone' size={icons.m} />} />
                        <AccountDetailItem
                            onClick={() => {
                                navigation.navigate('ChangeAccountState', {id: user?.id ?? -1});
                            }}
                            label='State'
                            value={user?.state}
                            icon={<FontAwesome5 name='city' size={icons.m} />}
                        />
                        <AccountDetailItem
                            onClick={() => {
                                navigation.navigate('ChangeAccountBirthDate', {id: user?.id ?? -1});
                            }}
                            label='Birth Date'
                            value={user?.birthDate}
                            icon={<FontAwesome5 name='birthday-cake' size={icons.m} />}
                        />
                    </View>
                    <View>
                        <Header3 style={{marginBottom: metrics.verticalScale(42), textAlign: 'center'}}>Profiles</Header3>
                        {isArtisan.data ? (
                            <View>
                                <AccountDetailItem
                                    onClick={() => {
                                        console.log('hittin');
                                        navigation.navigate('ArtisanProfileDashboard');
                                    }}
                                    label='View your Artisan Profile'
                                    value=' '
                                    icon={<Ionicons name='construct' size={icons.m} />}
                                />
                            </View>
                        ) : (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Header4 style={{flexDirection: 'row', marginTop: 0, color: colors.successGreenBold}}>Get paid for your skills!</Header4>
                                <Button
                                    text='Become an Artisan'
                                    onPress={() => {
                                        navigation.navigate('CreateArtisanProfile');
                                    }}
                                />
                            </View>
                        )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: metrics.verticalScale(42),
        flex: 1,
    },
    accountDetailItemsParent: {
        marginTop: '8%',
    },
    accountDetailItemLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountDetailItemValueContainer: {
        flexDirection: 'row',
    },
    accountDetailItemValue: {
        color: colors.primaryColor800B,
        fontWeight: 'bold',
        marginRight: metrics.horizontalScale(16),
    },
});

export default AccountDashboardScreen;
