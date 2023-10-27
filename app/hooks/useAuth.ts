import {isAxiosError} from 'axios';
import {sendRequest} from '../apis/api';
export interface IregistrationAuth {
    full_name: string;
    email: string;
    phonenumber?: string;
    password: string;
}
export interface ItokenResponse {
    refreshToken: string;
    accessToken: string;
}

function useAuth() {
    const nativeRegister = async (registrationData: IregistrationAuth): Promise<['error' | 'success', any] | false> => {
        try {
            const regData = await sendRequest<IregistrationAuth, Record<string, any>>({urlId: 'register', method: 'POST', data: registrationData});
            return ['success', regData];
        } catch (error) {
            if (isAxiosError(error)) {
                return ['error', error.response?.data];
            }

            return false;
        }
    };

    return {nativeRegister};
}

export default useAuth;
