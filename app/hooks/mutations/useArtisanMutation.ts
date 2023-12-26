import {useMutation} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';
import {type MutationProps} from '../constants';

interface ArtisanProfileDetails {
    bio: string;
    services: string[];
}
type PartialArtisanProfile = Partial<ArtisanProfileDetails>;
export const useComposeArtisanMutation = ({mutationLoadingCallbackFn = (loadingState: boolean) => {
    void (0);
}, mutationSuccessCallbackFn = (data: PartialArtisanProfile | undefined) => {
    void (0);
}, mutationErrorCallbackFn = (error: Error) => {
    void (0);
}}: MutationProps<PartialArtisanProfile>) => {
    const {sendRequest} = useNetwork();
    const composeUserProperty = async (artisanDetails: PartialArtisanProfile) => {
        mutationLoadingCallbackFn(true);
        const artisanProfile = await sendRequest<PartialArtisanProfile, ArtisanProfileDetails>({urlId: 'compose-my-artisan-profile', data: artisanDetails});
        return artisanProfile;
    };

    return useMutation({mutationFn: composeUserProperty, onSuccess(data) {
        mutationSuccessCallbackFn(data);
    },
    onSettled() {
        mutationLoadingCallbackFn(false);
    },
    onError(error) {
        mutationErrorCallbackFn(error);
    }});
};
