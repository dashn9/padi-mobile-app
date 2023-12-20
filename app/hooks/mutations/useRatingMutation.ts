import {useMutation} from '@tanstack/react-query';
import {useNetwork} from '../../apis/api';

export interface RatingCreate {
    ratingTargetId: number;
    ratingTargetType: 'artisan';
    ratingComment: string;
    ratingStarsPoint: number;
}

interface RatingCreateResponse extends RatingCreate {
    // The id of the rating giver;
    ratingGiver: number;
}
export const useRatingMutation = (mutationLoadingCallbackFn = (loadingState: boolean) => {
    void (0);
}, mutationSuccessCallbackFn = (data: RatingCreateResponse | undefined) => {
    void (0);
}, mutationErrorCallbackFn = (error: Error) => {
    void (0);
}) => {
    const {sendRequest} = useNetwork();
    const modifyUserProperty = async (rating: RatingCreate) => {
        mutationLoadingCallbackFn(true);
        const profileDetails = await sendRequest<RatingCreate, RatingCreateResponse>({urlId: 'update-rating', data: rating});
        return profileDetails;
    };

    return useMutation({mutationFn: modifyUserProperty, onSuccess(data) {
        mutationSuccessCallbackFn(data);
    },
    onSettled() {
        mutationLoadingCallbackFn(false);
    },
    onError(error) {
        mutationErrorCallbackFn(error);
    }});
};
