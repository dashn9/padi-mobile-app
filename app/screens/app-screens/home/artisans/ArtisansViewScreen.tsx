import React, {useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, ActivityIndicator} from 'react-native';

import Screen from '../../../../components/screen';
import {AppHeader} from '../../../../components/headers';
import {type ArtisansViewNavigationProp, type ArtisansViewScreenProps} from '../../../../navigations/ArtisansNavigator';
import {SearchBox, SearchableDropDown} from '../../../../components/inputs';
import {states} from '../../../../config/lists';
import {ArtisanProfileListCard} from '../../../../components/cards';
import {usePageNumberPagination} from '../../../../hooks/usePagination';

import * as metrics from '../../../../utils/metrics';
import {useFetchArtisansPaginatedQuery, type ArtisanLight} from '../../../../hooks/queries/useArtisanQuery';
import colors from '../../../../config/colors';
import {useFetchAvgRatingQuery as useFetchAggRatingQuery} from '../../../../hooks/queries/useRatingQuery';

interface RenderArtisanProps {
    item: ArtisanLight;
    navigation: ArtisansViewNavigationProp;
}

function ArtisansViewScreen({route, navigation}: ArtisansViewScreenProps) {
    const [searchValue, setSearchValue] = useState('');
    const [stateValue, setStateValue] = useState('');
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {results, isPaginationLoading, goForward} = usePageNumberPagination(useFetchArtisansPaginatedQuery, true, {search: searchValue, filters: {services__service_code__in: route.params.serviceCode, user__state: stateValue}});

    const updateSearchValue = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const updateStateValue = (stateValue: React.SetStateAction<string>) => {
        setSearchValue('');
        setStateValue(stateValue);
    };

    const updateArtisansList = () => {
        if (!isPaginationLoading) {
            goForward();
        }
    };

    const ArtisanLight = ({item, navigation}: RenderArtisanProps) => {
        const artisanRatingAggregates = useFetchAggRatingQuery('artisan', item.id).data;
        return (
            <Pressable
                onPress={() => {
                    navigation.navigate('ArtisanViewScreen', {artisanId: item.id});
                }}
            >
                <ArtisanProfileListCard firstName={item.firstName} lastName={item.lastName} state={item.stateFull} rating={artisanRatingAggregates?.ratingStarsAverage ?? 0} reviewsCount={artisanRatingAggregates?.ratingsCount ?? 0} />
            </Pressable>
        );
    };

    const renderArtisanFooter = () => <View style={styles.artisansFlatListFooter}>{isPaginationLoading ? <ActivityIndicator color={colors.primaryColor800B} /> : null}</View>;

    return (
        <Screen>
            <View style={styles.artisansViewScreenContainer}>
                <View style={styles.artisansViewHeaderContainer}>
                    <AppHeader>{route.params.serviceGroupName}</AppHeader>
                    <SearchBox onSearchSubmit={updateSearchValue} />
                    <SearchableDropDown items={states} value={stateValue} setValue={updateStateValue} placeholder='State' searchPlaceholder='Search States' />
                </View>
                <FlatList data={Array.from(results)} renderItem={object => <ArtisanLight item={object.item} navigation={navigation} />} onEndReached={updateArtisansList} onEndReachedThreshold={0.1} showsVerticalScrollIndicator={false} ListFooterComponent={renderArtisanFooter} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    artisansViewScreenContainer: {
        flex: 1,
    },
    artisansViewHeaderContainer: {
        zIndex: 2,
    },
    artisansFlatListFooter: {
        alignItems: 'center',
        marginTop: metrics.verticalScale(8),
    },
});
export default ArtisansViewScreen;
