import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';
import {type Paginated} from '../usePagination';

export interface Service {
    iconName?: string;
    iconColor?: string;
    iconBackDropColor?: string;
    serviceCode: string;
    serviceName: string;
    serviceGroupName: string;
}

export interface ArtisanLight {
    id: number;
    firstName: string;
    lastName: string;
    stateFull: string;
}

export type ArtisanListPaginated = Paginated<ArtisanLight>;

interface ArtisansListPaginatedAdditionalParams {
    services__service_code__in: string;
    state: string;
}

const queryKeys = {
    fetchServicesKey: ['services'],
    fetchArtisansKey: ['artisans'],
};

export const useFetchServicesQuery = () => {
    const {sendRequest} = useNetwork();
    const fetchServices = async () => {
        const data = await sendRequest<undefined, Service[]>({urlId: 'fetch-artisan-services'});
        return data;
    };

    return useQuery({queryKey: queryKeys.fetchServicesKey, queryFn: fetchServices});
};

export const useFetchArtisansPaginatedQuery = (pageNumber: number, filters: {search: string; filters: ArtisansListPaginatedAdditionalParams}) => {
    const {sendRequest} = useNetwork();
    // So one thing about Django is if the search is present, you can't use search and filters at the same time
    const artisansPaginationQuery: Record<string, any> = {page: pageNumber};
    if (filters.search) {
        artisansPaginationQuery.search = filters.search;
    } else {
        Object.assign(artisansPaginationQuery, filters.filters);
    }

    const fetchArtisansPaginated = async () => {
        const data = await sendRequest<undefined, ArtisanListPaginated>({urlId: 'fetch-artisans', params: artisansPaginationQuery});
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchArtisansKey, pageNumber, filters?.filters.services__service_code__in, filters?.filters?.state, filters?.search], queryFn: fetchArtisansPaginated, placeholderData: keepPreviousData});
};
