/* eslint-disable @typescript-eslint/naming-convention */

export type TrequestMethodTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export interface reformDataKeysI {
    // Camelize JSON Data Keys
    reformResponseDataKeys?: 'camelize';
    // Snakeize JSON Data Keys
    reformRequestDataKeys?: 'snakify';
}

export const reformDataKeys: reformDataKeysI = {
    reformResponseDataKeys: 'camelize',
    reformRequestDataKeys: 'snakify',
};

export interface IapiEndpoint extends reformDataKeysI {
    url: string;
    name: string;
    method: TrequestMethodTypes;
    requireAuthToken: boolean;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    description?: string;
}

export const API_BASE_HOST = 'http://10.0.2.2:8000';
export const WEBSOCKET_BASE_HOST = 'ws://10.0.2.2:8000';
export const WEBSOCKET_BASE_URL = WEBSOCKET_BASE_HOST + '/ws/chat';

// This host api is used for generating avatars
export const API_DICEBEAR_BASE_HOST = 'https://api.dicebear.com';
