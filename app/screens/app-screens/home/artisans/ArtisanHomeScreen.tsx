import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AppHeader} from '../../../../components/headers';
import Screen from '../../../../components/screen';
import * as metrics from '../../../../utils/metrics';
import AppText from '../../../../components/text';
import type {ArtisanHomeNavigationProp, ArtisanHomeScreenProps} from '../../../../navigations/ArtisansNavigator';

const services = [
    {
        iconName: 'air-conditioner',
        iconColor: '#DDA503',
        iconBackDropColor: '#FFF9E8',
        serviceCode: 'ac_repair',
        serviceName: 'AC Repair',
        artisansGroupName: 'AC Repairers',
    },
    {
        iconName: 'lightning-bolt',
        iconColor: '#4A7AFF',
        iconBackDropColor: '#F6F9FF',
        serviceCode: 'electricity',
        serviceName: 'Electricity',
        artisansGroupName: 'Electericians',
    },
    {
        iconName: 'pipe-leak',
        iconColor: '#5EBE30',
        iconBackDropColor: '#F5FFE9',
        serviceCode: 'plumbing',
        serviceName: 'Plumbing',
        artisansGroupName: 'Plumbers',
    },
    {
        iconName: 'hair-dryer',
        iconColor: '#CA84FF',
        iconBackDropColor: '#FBF6FF',
        serviceCode: 'beauty',
        serviceName: 'Beauty',
        artisansGroupName: 'Beauticians',
    },
];
function artisanServices<Services extends Array<{iconName?: string; iconColor?: string; iconBackDropColor?: string; serviceCode: string; serviceName: string; artisansGroupName: string}>>(services: Services, navigation: ArtisanHomeNavigationProp) {
    return services.map((value, index) => (
        <View key={index} style={styles.serviceContainer}>
            <Pressable
                onPress={() => {
                    navigation.navigate('ArtisansViewScreen', {serviceName: value.serviceName, artisansGroupName: value.artisansGroupName, filters: {}});
                }}
            >
                <View style={styles.serviceIconBackDrop}>
                    {value.iconName ? (
                        <View style={[{backgroundColor: value.iconBackDropColor}, styles.serviceIconBackDrop]}>
                            {/* @ts-expect-error The MaterialCommunityIcons Types does not have a standard type for all the possible type of icons(string represented), and there are a lot of them, so I rather specified IconName as a string since I can't control all the possible types(of string) that can be used in this scenario */}
                            <MaterialCommunityIcons name={value.iconName} size={metrics.moderateScale(30)} color={value.iconColor} />
                        </View>
                    ) : null}
                    <AppText style={styles.serviceNameStyle}>{value.serviceName}</AppText>
                </View>
            </Pressable>
        </View>
    ));
}

export default function ArtisansHomeScreen({navigation, route}: ArtisanHomeScreenProps) {
    return (
        <Screen>
            <View style={styles.artisanHomeScreenContainer}>
                <AppHeader>All Services</AppHeader>
                <View style={styles.servicesContainer}>{artisanServices(services, navigation)}</View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    artisanHomeScreenContainer: {
        flex: 1,
        width: '90%',
    },
    servicesContainer: {
        marginTop: metrics.verticalScale(60),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceContainer: {
        alignSelf: 'flex-start',
    },
    serviceIconBackDrop: {
        padding: metrics.moderateScale(14),
        borderRadius: 50,
        alignSelf: 'center',
    },
    serviceNameStyle: {
        marginTop: metrics.verticalScale(8),
        fontSize: metrics.moderateScale(14),
        fontFamily: 'karlaSemiBold',
        fontWeight: '200',
        color: '#41405D',
    },
});
