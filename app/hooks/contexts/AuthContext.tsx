import React from 'react';

export interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    state?: string;
    birthDate?: string;
    pushToken?: string;
    sessionID?: string;

    // Tokens
    access: string;
    refresh: string;

    isAuthenticated: boolean;
}

export const checkIfIsUser = (obj: any): obj is User => typeof obj === 'object' && typeof obj?.id === 'number' && typeof obj?.access === 'string' && typeof obj?.refresh === 'string' && typeof obj?.isAuthenticated === 'boolean';

export interface AuthContextProviderProps {
    children: React.ReactNode;
}
// It wasn't really necessary to specify the context type has an optional undefined, but createContext requires an initial value
export const authContext = React.createContext<{user: User | undefined; setUser: React.Dispatch<React.SetStateAction<User | undefined>>} | undefined>(undefined);

export const useAuthContext = () => {
    const context = React.useContext(authContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be inside a useAuthContextProvider');
    }

    return context;
};

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [user, setUser] = React.useState<User>();
    return <authContext.Provider value={{user, setUser}}>{children}</authContext.Provider>;
};
