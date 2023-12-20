import {type IapiEndpoint, API_BASE_HOST} from './constants';
import {reformDataKeys} from './constants';
// Django is pretty ruthless when it comes to the last stroke(/) after the URL, make sure you add it.

export const ratings: Record<string, IapiEndpoint> = {
    'fetch-ratings': {
        url: API_BASE_HOST + '/ratings/',
        name: 'Fetch Ratings',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
    'fetch-my-rating': {
        url: API_BASE_HOST + '/ratings/me/',
        name: 'Fetch Ratings',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
    'update-rating': {
        url: API_BASE_HOST + '/ratings/',
        name: 'Create new or overwrite existing rating',
        requireAuthToken: true,
        method: 'PUT',
        ...reformDataKeys,
    },
    'fetch-aggregates-ratings': {
        url: API_BASE_HOST + '/ratings/aggregates/',
        name: 'Fetch Aggregates Rating',
        requireAuthToken: true,
        method: 'GET',
        ...reformDataKeys,
    },
};
