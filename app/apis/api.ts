import axios, {isAxiosError, type AxiosError, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import apis from '.';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const API_BASE_URL = 'http://127.0.0.1:8000';

type TrequestMethodTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export interface IapiEndpoint {
    url: string;
    name: string;
    method: TrequestMethodTypes;
    requireAuthToken: boolean;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    description?: string;
}

interface RequestOptions<T, K> {
    urlId: string;
    method: TrequestMethodTypes;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    data?: T;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'; // Add more as needed
    timeout?: number; // Request timeout in milliseconds
    transformResponse?: (response: AxiosResponse) => K;
}

export async function sendRequest<T, K extends Record<string, any>>({
    urlId,
    headers = {},
    params = {},
    data,
    responseType = 'json',
    timeout = 5000, // Default timeout of 5 seconds
    transformResponse,
}: RequestOptions<T, K>): Promise<K> {
    const api = apis[urlId];
    const config: AxiosRequestConfig = {
        method: api.method,
        url: API_BASE_URL + api.url,
        headers: {...api.headers, ...headers},
        params: {...api.params, params},
        data,
        responseType,
        timeout,
    };
    try {
        const response = await axios(config);
        if (transformResponse) {
            return transformResponse(response);
        }

        return response.data as K;
    } catch (error) {
    // Handle AxiosError to provide more meaningful error messages
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw axiosError;
        } else if (axiosError.request) {
            throw new Error('Request was made, but no response received');
        } else {
            throw new Error('Request could not be made');
        }
    }
}
