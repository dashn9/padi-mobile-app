import axios, {type AxiosError, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import apis from '.';
import {type TrequestMethodTypes} from './constants';

interface RequestOptions<T, K> {
    urlId: string;
    method: TrequestMethodTypes;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    data?: T;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'; // Add more as needed
    timeout?: number; // Request timeout in milliseconds
    transformResponse?: (responseData: K) => unknown;
}

export async function sendRequest<T, K extends Record<string, any> | ArrayBuffer | string | void>({
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
        url: api.url,
        headers: {...api.headers, ...headers},
        params: {...api.params, params},
        data,
        responseType,
        transformResponse,
        timeout,
    };
    try {
        const response = await axios(config);

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
