import {type IapiEndpoint, API_BASE_HOST} from './constants';
import {reformDataKeys} from './constants';
// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
export const services: Record<string, IapiEndpoint> = {
    'fetch-artisan-services': {
        url: API_BASE_HOST + '/artisans/services/',
        name: 'Fetch Artisan Services',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
};

export const artisans: Record<string, IapiEndpoint> = {
    'fetch-artisans': {
        url: API_BASE_HOST + '/artisans/',
        name: 'Fetch Artisans',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },

    'fetch-artisan-profile': {
        url: API_BASE_HOST + '/artisans/',
        name: 'Fetch Artisan Profile',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },

    'check-if-artisan': {
        url: API_BASE_HOST + '/artisans/is_artisan/',
        name: 'Fetch Artisan Profile',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
};
