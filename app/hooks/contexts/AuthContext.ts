import {createContext, useState} from 'react';

export interface User {
    ID: number;
    firstName?: string;
    lastName?: string;
    email: string;
    pushToken?: string;
    sessionID?: string;
    accessToken: string;
    refreshToken: string;
}

const [user, setUser] = useState<User>();

export const authContext = createContext({
    user,
    setUser(user: User | undefined) {
        setUser(user);
    },
});

