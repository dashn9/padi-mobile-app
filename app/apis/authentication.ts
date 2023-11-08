import {type IapiEndpoint, API_BASE_URL} from './constants';

// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
const users: Record<string, IapiEndpoint> = {
    register: {
        url: API_BASE_URL + '/auth/users/',
        name: 'User registration endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    login: {
        url: API_BASE_URL + '/auth/jwt/create',
        name: 'User Authentication endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    'refresh-token': {
        url: API_BASE_URL + '/auth/jwt/refresh',
        name: 'Token Refresh endpoint',
        requireAuthToken: false,
        method: 'POST',
    },

    // OTP
    'generate-otp': {
        url: API_BASE_URL + '/auth/otp/generate/user-activation',
        name: 'User OTP Generation for Email verfication',
        requireAuthToken: false,
        method: 'PUT',
    },
    'verify-otp': {
        url: API_BASE_URL + '/auth/otp/verify/user-activation',
        name: 'User OTP Verification for Email',
        requireAuthToken: false,
        method: 'POST',
    },
};

export default users;
