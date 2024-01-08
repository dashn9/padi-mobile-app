import {useQuery} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';

import {type UserDetailsLight, type UserDetails} from '../constants';

const queryKeys = {
    fetchMyUserDetails: ['userDetails'],
    fetchUserDetails: ['userDetails'],
};

export const useFetchMyUserDetailsQuery = () => {
    const {sendRequest} = useNetwork();
    const fetchMyUserDetails = async () => {
        const data = await sendRequest<undefined, UserDetails>({urlId: 'fetch-my-user-details'});
        return data;
    };

    return useQuery({queryKey: queryKeys.fetchMyUserDetails, queryFn: fetchMyUserDetails, enabled: true});
};

export const useFetchUserDetailsQuery = (userId: number) => {
    const {sendRequest} = useNetwork();
    const fetchUserDetails = async () => {
        const data = await sendRequest<undefined, UserDetailsLight>({urlId: 'fetch-user-details', urlAffix: userId.toString() + '/'});
        return data;
    };

    return useQuery({queryKey: [...queryKeys.fetchUserDetails, userId], queryFn: fetchUserDetails});
};
