import {useQuery, keepPreviousData} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';
import {type Paginated} from '../usePagination';

export interface RatingDisplay {
    ratingGiverFirstName: string;
    ratingGiverLastName: string;
    ratingGiverId: number;
    ratingTargetId: number;
    ratingTargetType: number;
    ratingComment: string;
    ratingStarsPoint: number;
}

export interface RatingAggregates {
    ratingStarsAverage: number;
    ratingsCount: number;
}

type RatingPaginated = Paginated<RatingDisplay>;

const queryKeys = {
    fetchRatingsKey: ['ratings'],
    fetchAggregatesRatingKey: ['aggregates-rating'],
    fetchMyRatingKey: ['my-rating'],
};

export const useFetchRatingsPaginatedQuery = (pageNumber: number, filters: undefined, urlAffixes: {targetType: string; targetId: number}) => {
    const {sendRequest} = useNetwork();
    const ratingsPaginationQuery: Record<string, any> = {page: pageNumber};

    const fetchRatingsPaginated = async () => {
        const data = await sendRequest<undefined, RatingPaginated>({urlId: 'fetch-ratings', urlAffix: `${urlAffixes.targetType}/${urlAffixes.targetId}/`, params: ratingsPaginationQuery});
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchRatingsKey, pageNumber, urlAffixes.targetType, urlAffixes.targetId], queryFn: fetchRatingsPaginated, placeholderData: keepPreviousData});
};

export const useFetchAvgRatingQuery = (targetType: string, targetId: number) => {
    const {sendRequest} = useNetwork();
    const fetchAggregatesRatings = async () => {
        const data = await sendRequest<undefined, RatingAggregates>({urlId: 'fetch-aggregates-ratings', urlAffix: `${targetType}/${targetId}/`});
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchAggregatesRatingKey, targetType, targetId], queryFn: fetchAggregatesRatings});
};

export const useFetchMyRatingQuery = (targetType: string, targetId: number) => {
    const {sendRequest} = useNetwork();
    const fetchMyRating = async () => {
        const data = await sendRequest<undefined, RatingDisplay | void>({urlId: 'fetch-my-rating', urlAffix: `${targetType}/${targetId}/`});
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchMyRatingKey, targetType, targetId], queryFn: fetchMyRating});
};
