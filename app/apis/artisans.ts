import {type IapiEndpoint, API_BASE_URL} from './constants';
import {reformDataKeys} from './constants';
// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.
export const services: Record<string, IapiEndpoint> = {
    'fetch-artisan-services': {
        url: API_BASE_URL + '/artisans/services/',
        name: 'Fetch Artisan Services',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
};

export const artisans: Record<string, IapiEndpoint> = {
    'fetch-artisans': {
        url: API_BASE_URL + '/artisans/',
        name: 'Fetch Artisans',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
};
