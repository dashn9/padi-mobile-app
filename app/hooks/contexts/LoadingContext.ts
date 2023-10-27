import {useState, createContext} from 'react';

const [loading, setLoading] = useState<boolean>(false);

const loadingContext = createContext({
    loading,
    setLoading(loading: boolean) {
        setLoading(loading);
    },
});

export default loadingContext;
