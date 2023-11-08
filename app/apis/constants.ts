/* eslint-disable @typescript-eslint/naming-convention */

export type TrequestMethodTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export interface IapiEndpoint {
    url: string;
    name: string;
    method: TrequestMethodTypes;
    requireAuthToken: boolean;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    description?: string;
}

export const API_BASE_URL = 'http://127.0.0.1:8000';

// This host api is used for generating avatars
export const API_DICEBAR_BASE_URL = 'https://api.dicebear.com';
