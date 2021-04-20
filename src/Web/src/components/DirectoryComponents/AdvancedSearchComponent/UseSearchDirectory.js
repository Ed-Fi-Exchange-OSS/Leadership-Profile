import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import config from '../../../config';

function UseSearchDirectory() {
    const history = useHistory();
    const location = useLocation();
    const { API_URL, API_CONFIG } = config();

    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [filters, setFilters] = useState();

    const [url, setUrl] = useState(window.location.href);
    const searchableUrl = useRef(new URL(url));

    const [sort, setSort] = useState({
        category: searchableUrl.current.searchParams.get('sortField') !== null && searchableUrl.current.searchParams.get('sortField') !== 'null' ? searchableUrl.current.searchParams.get('sortField') : 'Id',
        value: searchableUrl.current.searchParams.get('sortBy') !== null && searchableUrl.current.searchParams.get('sortBy') !== 'null' ? searchableUrl.current.searchParams.get('sortBy') : 'desc',
    });

    const [paging, setPaging] = useState({
        page: searchableUrl.current.searchParams.get('page') !== null && searchableUrl.current.searchParams.get('page') !== 'null' ? searchableUrl.current.searchParams.get('page') : 1,
        totalSize: 0,
        maxPages: 1,
    });

    useEffect(() => {
        if (history.action === 'POP' && searchableUrl.current.search !== location.search) {
            const searchParams = new URLSearchParams(history.location.search);
            setPaging({ ...paging, page: searchParams.get('page') });
            setSort({ category: searchParams.get('sortField'), value: searchParams.get('sortBy') });
        }
    }, [history.action, history.location]);

    useEffect(() => {
        searchableUrl.current.textContent = new URL(url);
        const params = Array.from(searchableUrl.current.searchParams);
        params.forEach(param => searchableUrl.current.searchParams.delete(param[0]));
        searchableUrl.current.searchParams.set('page', paging.page);
        searchableUrl.current.searchParams.set('sortField', sort.category);
        searchableUrl.current.searchParams.set('sortBy', sort.value);
        searchableUrl.current.searchParams.sort();
        setUrl(searchableUrl.current.href);
    }, [sort, paging.page]);

    useEffect(() => {
        searchableUrl.current.textContent = new URL(url);
        if (searchableUrl.current.search === location.search || !searchableUrl.current.search) return;
        history.push(`search${searchableUrl.current.search}`);
    }, [url]);
    
    useEffect(() => {
        if(filters !== undefined){
            if (!searchableUrl.current.search) return;
            let unmounted = false;
            const apiUrl = new URL(API_URL.href + `/search${history.location.search}`);
            fetch(apiUrl, API_CONFIG('POST', JSON.stringify(filters)))
                .then(response => response.json())
                .then((response) => {
                setError(response.isError);
                if (!unmounted && response !== null) {
                    if (response.results !== undefined) {
                        setData(response.results);
                    }
                    setPaging({
                        ...paging,
                        totalSize: response.totalCount,
                        maxPages: Math.ceil(response.totalCount / 10),
                    });
                }
            })
            .catch(error => {
                setError(true);
                console.error(error.message);
            });
            return () => {
                unmounted = true;
            };
        }
    }, [filters]);

    function setPage(newPage) {
        setPaging({
            ...paging,
            page: newPage,
        });
    }

    function setColumnSort(category, value) {
        setSort({ category, value });
    }
    
    return { setColumnSort, setSort, sort, data, paging, setPage, error, setFilters }
}

export default UseSearchDirectory;
