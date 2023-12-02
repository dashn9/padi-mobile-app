import axios, {type AxiosResponseHeaders, type AxiosError, type AxiosRequestConfig} from 'axios';
import apis from '.';
import {type IapiEndpoint, type TrequestMethodTypes} from './constants';
import snakify from 'snakify-ts';
import camelize from 'camelize-ts';
import {useAuthContext} from '../hooks/contexts/AuthContext';

interface RequestOptions<T, K> {
    urlId: string;
    method?: TrequestMethodTypes;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    data?: T;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'; // Add more as needed
    timeout?: number; // Request timeout in milliseconds
    transformResponse?: (responseData: K) => unknown;
    urlAffix?: string;
}

const transformRequestData = <T>(requestData: T, {reformRequestDataKeys}: IapiEndpoint) => {
    if (reformRequestDataKeys === 'snakify') {
        // TO DO: read this snakify code below to better understand generics
        return snakify(requestData);
    }

    return requestData;
};

const mainRespTransformer = <K>(responseData: string, headers: AxiosResponseHeaders, {reformResponseDataKeys}: IapiEndpoint) => {
    let newResponseData: string | K = responseData;
    if (headers.getContentType()?.includes('application/json')) {
        newResponseData = JSON.parse(responseData) as K;
    }

    if (reformResponseDataKeys === 'camelize') {
        return camelize(newResponseData) as K;
    }

    return newResponseData as K;
};

export const useNetwork = () => {
    const {user} = useAuthContext();
    const sendRequest = async <T, K extends Record<string, any> | ArrayBuffer | string | boolean | void>({
        urlId,
        method,
        headers = {},
        params = {},
        data,
        responseType = 'json',
        timeout = 5000, // Default timeout of 5 seconds
        transformResponse,
        urlAffix = '',
    }: RequestOptions<T, K>): Promise<K> => {
        const api = apis[urlId];
        const config: AxiosRequestConfig = {
            method: method ?? api.method,
            url: api.url + urlAffix,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: {...api.headers, ...headers, Authorization: api.requireAuthToken ? 'Bearer ' + String(user?.access) : undefined},
            params: {...api.params, ...params},
            data: transformRequestData(data, api),
            responseType,
            transformResponse: [(responseData: string, headers: AxiosResponseHeaders) => mainRespTransformer<K>(responseData, headers, api), (responseData: K) => transformResponse ? transformResponse(responseData) : responseData],
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
    };

    return {sendRequest};
};
