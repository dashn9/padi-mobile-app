import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Screen from '../../../../components/screen';
import {AppHeader} from '../../../../components/headers';
import type {ArtisansViewScreenProps} from '../../../../navigations/ArtisansNavigator';
import {SearchBox, SearchableDropDown} from '../../../../components/inputs';
import {states} from '../../../../config/lists';
import {ArtisanProfileListCard} from '../../../../components/cards';
import {ScrollView} from 'react-native-gesture-handler';

import * as metrics from '../../../../utils/metrics';

function ArtisansViewScreen({route, navigation}: ArtisansViewScreenProps) {
    const [searchValue, setSearchValue] = useState('');
    const [stateValue, setStateValue] = useState('');

    useEffect(() => {
        console.log(stateValue);
    }, [stateValue]);

    const updateSearchValue = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const fetchArtisansByName = (artisanName: string) => {
        console.log('');
    };

    return (
        <Screen>
            <View style={styles.artisansViewScreenContainer}>
                <View>
                    <AppHeader>{route.params.artisansGroupName}</AppHeader>
                    <SearchBox onSearchSubmit={updateSearchValue} />
                    <SearchableDropDown items={states} value={stateValue} setValue={setStateValue} placeholder='State' searchPlaceholder='Search States' />
                </View>
                {/* Definitely Make use of a FlatList here intead (Very Importaint) */}
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={{paddingBottom: metrics.verticalScale(16)}}>
                        <Pressable
                            onPress={() => {
                                navigation.navigate('ArtisanViewScreen', {artisanId: 0});
                            }}
                        >
                            <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        </Pressable>
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                        <ArtisanProfileListCard name='Charles Emmanuel' state='Lagos' rating={4.5} reviewsCount={20} />
                    </View>
                </ScrollView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    artisansViewScreenContainer: {
        flex: 1,
        width: '90%',
    },
});
export default ArtisansViewScreen;
