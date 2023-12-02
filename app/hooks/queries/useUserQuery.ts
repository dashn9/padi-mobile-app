import {useQuery} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';

import {type UserDetails} from '../constants';

const queryKeys = {
    fetchUserDetails: ['userDetails'],
};

export const useFetchUserDetailsQuery = () => {
    const {sendRequest} = useNetwork();
    const fetchUserDetails = async () => {
        const data = await sendRequest<undefined, UserDetails>({urlId: 'fetch-user-details'});
        return data;
    };

    return useQuery({queryKey: queryKeys.fetchUserDetails, queryFn: fetchUserDetails, enabled: false});
};
