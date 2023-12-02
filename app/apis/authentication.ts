import {type IapiEndpoint, API_BASE_HOST} from './constants';
import {reformDataKeys} from './constants';

// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
const users: Record<string, IapiEndpoint> = {
    register: {
        url: API_BASE_HOST + '/auth/users/',
        name: 'User registration endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    login: {
        url: API_BASE_HOST + '/auth/jwt/create/',
        name: 'User Authentication endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    'refresh-token': {
        url: API_BASE_HOST + '/auth/jwt/refresh/',
        name: 'Token Refresh endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    'fetch-user-details': {
        url: API_BASE_HOST + '/auth/users/me/',
        name: 'Fetch User Account Details',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
    'modify-user-details': {
        url: API_BASE_HOST + '/auth/users/me/',
        name: 'Fetch User Account Details',
        requireAuthToken: true,
        method: 'PATCH',
        ...reformDataKeys,
    },

    // OTP
    'generate-otp': {
        url: API_BASE_HOST + '/auth/otp/generate/user-activation',
        name: 'User OTP Generation for Email verfication',
        requireAuthToken: false,
        method: 'PUT',
    },
    'verify-otp': {
        url: API_BASE_HOST + '/auth/otp/verify/user-activation',
        name: 'User OTP Verification for Email',
        requireAuthToken: false,
        method: 'POST',
    },
};

export default users;
