import {useState, useEffect} from 'react';
import {type UseQueryResult} from '@tanstack/react-query';
import {simpleHash} from '../utils/math';

export interface Paginated<T> {
    count: number;
    next: string | undefined;
    previous: string | undefined;
    results: T[];
}
// I came to the damning realization Tanstack has a useInfinite query which is equivalent to this functionality below.
// In the future, find a way to use and replace this
// Best used when dealing with a paginated endpoint
export function usePageNumberPagination<T>(
    query: (page: number, filters?: any, urlAffixes?: any) => UseQueryResult<Paginated<T>>,
    appendResults = false,
    filters?: Record<string, any>,
    urlAffixes?: Record<string, any>,
) {
    const [results, setResults] = useState<Set<T>>(new Set());
    const [resultsCount, setResultsCount] = useState(0);
    const [page, setPage] = useState(1);

    const paginated = query(page, filters, urlAffixes);
    let pageSize = 10;

    let prevPage = 0;

    // There is a slight issue of filter change causing useQuery to hit first with last page before updating with the now setPage(1).
    // e.g on page 3, then this useEffect changes to 1, but useQuery would have ran with 3 first, before fetching with 1 again. This behaviour is sporadic
    useEffect(() => {
        if (typeof filters !== 'undefined') {
            setPage(1);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        let newResults = [...results];

        if (page > prevPage && !paginated?.isError && paginated?.data) {
            if (page === 1) {
                pageSize = paginated?.data?.results?.length;
            }

            newResults = appendResults && page !== 1 ? newResults.concat(paginated?.data?.results) : paginated?.data?.results;
        } else if (page < prevPage && !paginated?.isError && paginated?.data) {
            // This code below is not fully tested
            newResults = appendResults && page !== 1 ? newResults.splice(newResults.length, -pageSize) : paginated?.data?.results;
        }

        prevPage = page;

        setResults(new Set(newResults));
        setResultsCount(paginated?.data?.count ?? 0);
    }, [paginated?.data?.results]);

    const goForward = () => {
        if (paginated.data?.next) {
            setPage(page => page + 1);
        }
    };

    const goBack = () => {
        if (paginated.data?.previous) {
            setPage(page => page - 1);
        }
    };

    return {results, resultsCount, isPaginationLoading: paginated?.isFetching, goBack, goForward};
}
