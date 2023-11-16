import {isAxiosError, isCancel} from 'axios';
import {useNetwork} from '../apis/api';
import * as SecureStore from 'expo-secure-store';

import {isTokenValid, fetchIdFromToken} from '../utils/auth';
import {checkIfIsUser, useAuthContext} from './contexts/AuthContext';
import {UserNotAuthenticated} from '../errors/authErrors';
import {useEffect} from 'react';
export interface RegistrationAuthData {
    full_name: string;
    email: string;
    phonenumber?: string;
    password: string;
}

export interface LoginAuthRequestData {
    email: string;
    password: string;
}

export interface RefreshTokenData {
    refresh: string;
}
export interface TokenData extends RefreshTokenData {
    access: string;
}

export interface OtpGenerationRequestData {
    email: string;
}

export interface OtpVerificationRequestData {
    email: string;
    otp: number;
}

type ObjResponseData = ['error' | 'success', Record<string, any>, number | undefined] | false;

export interface OtpStatusResponseData {
    detail: string;
}

function parseAxiosErrorForObjResp(error: any): ObjResponseData {
    if (isAxiosError(error)) {
        return ['error', error.response?.data as Record<string, any>, error?.response?.status];
    }

    return false;
}

// Recheck this code in the future, there are areas of optimizations;
// TO DO: Make inactive accounts via login to also be able to generate OTP if email and password is valid
const useAuth = () => {
    const {user, setUser} = useAuthContext();
    const {sendRequest} = useNetwork();
    useEffect(() => {
        if (checkIfIsUser(user)) {
            // Console.log(user);
            void saveUser();
            // Careful here, if you set refreshAccessToken to always update user tokens whenever called rather than to check if token expired before refresh
            // You will have a case of an infinite useEffect call because refreshAccessToken() updates the user tokens which causes a side effect for user
            void refreshAccessToken();
        }
    }, [user]);
    const saveUser = async () => {
        // Prevents the useEffect hook from overwriting store data when called
        await SecureStore.setItemAsync('userAuthDetails', JSON.stringify({...user}));
    };

    const retrieveAndSetUser = async () => {
        try {
            const user: unknown = JSON.parse((await SecureStore.getItemAsync('userAuthDetails'))!);
            // Console.log(await SecureStore.getItemAsync('userAuthDetails'));
            if (checkIfIsUser(user)) {
                setUser(user);
            }
        } catch (e) {
            console.log(e);
            void (0);
        }
    };

    const nativeRegister = async (registrationData: RegistrationAuthData): Promise<ObjResponseData> => {
        try {
            const regData = await sendRequest<RegistrationAuthData, Record<string, any>>({urlId: 'register', method: 'POST', data: registrationData});
            return ['success', regData, 201];
        } catch (error) {
            return parseAxiosErrorForObjResp(error);
        }
    };

    // Will be used alongside logout.
    const resetAuthentication = async () => {
        setUser(undefined);
        await SecureStore.deleteItemAsync('userAuthDetails');
    };

    const nativeLogin = async (loginData: LoginAuthRequestData): Promise<ObjResponseData> => {
        try {
            const tokenData = await sendRequest<LoginAuthRequestData, TokenData>({urlId: 'login', method: 'POST', data: loginData});
            // Just updating the token
            const newUserDetails = {...user, ...tokenData, isAuthenticated: true, id: fetchIdFromToken(tokenData.access)};
            // Console.log(newUserDetails);

            // Gives time for the pages to react before everything is set, because App.tsx instantly reacts and renders the App.
            // This code below might be source for future problems, especially if the function in the setTimeout fails, find a fix.
            setTimeout(
                async () => {
                    setUser(newUserDetails);
                }, 2000);

            // It returns an object because it doesn't need to share the Tokens with you
            return ['success', {}, 200];
        } catch (error) {
            console.log(error);
            return parseAxiosErrorForObjResp(error);
        }
    };

    const checkIfUserAuthenticated = () => {
        if (user === undefined) {
            throw new UserNotAuthenticated();
        }
    };

    // This piece of code is very sensitive as it controls the user side effect. if you did not get any valid response or you got 401, log out and delete the user immediately: TODO
    const refreshAccessToken = async (onlyIfExpired = true) => {
        checkIfUserAuthenticated();

        try {
            const refreshToken = async () => {
                if (user) {
                    sendRequest<RefreshTokenData, TokenData>({urlId: 'refresh-token', method: 'POST', data: {refresh: user.refresh}}).then(tokenData => {
                        setUser({...user, ...tokenData, isAuthenticated: true});
                        // Console.log('token', tokenData);
                    }).catch(error => {
                        const objError = error as Record<string, unknown>;

                        if (typeof objError?.response === 'undefined') {
                            // Render a page that shows the user needs to be connected to internet
                            // Or set isOnline to false on the user making App.tsx render a connect to the internet page
                            console.log('canceled');
                        }
                    });
                }
            };

            if (onlyIfExpired) {
                if (user && !isTokenValid(user.access)) {
                    await refreshToken();
                }
            } else {
                await refreshToken();
            }
        } catch (error) {
            console.log('resetting auth');
            await resetAuthentication();
        }
    };

    const fetchAccessToken = () => {
        checkIfUserAuthenticated();

        return user?.access;
    };

    const generateOtp = async (otpGenerationData: OtpGenerationRequestData) => {
        try {
            const otpGenerationStatus = await sendRequest<OtpGenerationRequestData, OtpStatusResponseData>({urlId: 'generate-otp', method: 'PUT', data: otpGenerationData});
            return ['success', otpGenerationStatus];
        } catch (error) {
            return parseAxiosErrorForObjResp(error);
        }
    };

    const verifyOtp = async (otpVerificationData: OtpVerificationRequestData) => {
        try {
            const otpVerificationStatus = await sendRequest<OtpVerificationRequestData, OtpStatusResponseData>({urlId: 'verify-otp', method: 'PUT', data: otpVerificationData});
            return ['success', otpVerificationStatus];
        } catch (error) {
            return parseAxiosErrorForObjResp(error);
        }
    };

    return {nativeRegister, nativeLogin, retrieveAndSetUser, generateOtp, verifyOtp, refreshAccessToken, fetchAccessToken, resetAuthentication};
};

export default useAuth;
