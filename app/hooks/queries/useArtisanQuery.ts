import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';
import {type Paginated} from '../usePagination';

export interface ServiceLight {
    serviceCode: string;
    serviceName: string;
    serviceIndividualName: string;
    serviceGroupName: string;
}
export interface Service extends ServiceLight {
    iconName?: string;
    iconColor?: string;
    iconBackDropColor?: string;
}

export interface ArtisanLight {
    id: number;
    profilePictureUrl?: string;
    firstName: string;
    lastName: string;
    stateFull: string;
}

export interface ArtisanProfile extends ArtisanLight {
    userId: number;
    firstName: string;
    lastName: string;
    bio: string;
    birthDate: string;
    services: ServiceLight[];
    joined: string;
}
export type ArtisanListPaginated = Paginated<ArtisanLight>;

interface ArtisansListPaginatedAdditionalParams {
    services__service_code__in: string;
    user__state: string;
}

const queryKeys = {
    fetchServicesKey: ['services'],
    fetchArtisansKey: ['artisans'],
    fetchArtisanProfileKey: ['artisan'],
    checkIfIsArtisanKey: ['is_artisan'],
};

export const useCheckIfIsArtisanQuery = () => {
    const {sendRequest} = useNetwork();
    const checkIfArtisan = async () => {
        const data = await sendRequest<undefined, boolean>({urlId: 'check-if-artisan'});
        return data;
    };

    return useQuery({queryKey: queryKeys.checkIfIsArtisanKey, queryFn: checkIfArtisan});
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

    return useQuery({queryKey: [...queryKeys.fetchArtisansKey, pageNumber, filters?.filters.services__service_code__in, filters?.filters?.user__state, filters?.search], queryFn: fetchArtisansPaginated, placeholderData: keepPreviousData});
};

export const useFetchArtisanProfileQuery = (artisanId: number) => {
    const {sendRequest} = useNetwork();

    const fetchArtisanProfile = async () => {
        const data = await sendRequest<undefined, ArtisanProfile>({urlId: 'fetch-artisan-profile', urlAffix: artisanId.toString() + '/'});
        console.log(data);
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchArtisanProfileKey, artisanId], queryFn: fetchArtisanProfile});
};
