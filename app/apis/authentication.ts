import {type IapiEndpoint} from './api';

// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
const users: Record<string, IapiEndpoint> = {
    register: {
        url: '/auth/users/',
        name: 'User registration endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
    login: {
        url: '/login',
        name: 'User Authentication endpoint',
        requireAuthToken: false,
        method: 'POST',
    },
};

export default users;
