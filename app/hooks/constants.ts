export interface UserDetailsLight {
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
}

export interface UserDetails extends UserDetailsLight {
    email: string;
    phoneNumber: string;
    state: string;
    birthDate: string;
}

export interface MutationProps<T> {
    mutationLoadingCallbackFn: (loadingState: boolean) => void;
    mutationSuccessCallbackFn: (data: T | undefined) => void;
    mutationErrorCallbackFn: (error: Error) => void;
}
