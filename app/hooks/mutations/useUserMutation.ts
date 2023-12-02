import {useMutation} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';
import {type UserDetails} from '../constants';
import {useAuthContext} from '../contexts/AuthContext';
import {UserNotAuthenticated} from '../../errors/authErrors';

type PartialUserDetails = Partial<UserDetails>;
export const useChangeUserPropertyMutation = (mutationLoadingCallbackFn = (loadingState: boolean) => {
    void (0);
}, mutationSuccessCallbackFn = (data: PartialUserDetails | undefined) => {
    void (0);
}, mutationErrorCallbackFn = (error: Error) => {
    void (0);
}) => {
    const {sendRequest} = useNetwork();
    const {user, setUser} = useAuthContext();
    const modifyUserProperty = async (newUserProperties: PartialUserDetails) => {
        mutationLoadingCallbackFn(true);
        const profileDetails = await sendRequest<PartialUserDetails, UserDetails>({urlId: 'modify-user-details', data: newUserProperties});
        return profileDetails;
    };

    return useMutation({mutationFn: modifyUserProperty, onSuccess(data) {
        if (user && data) {
            setUser({...user, ...data});
            mutationSuccessCallbackFn(data);
        } else {
            throw new UserNotAuthenticated();
        }
    },
    onSettled() {
        mutationLoadingCallbackFn(false);
    },
    onError(error) {
        mutationErrorCallbackFn(error);
    }});
};
