import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import config from '../../config';

function UseDirectory() {
    const history = useHistory();
    const location = useLocation();
    const { API_URL, API_CONFIG } = config();

    const [data, setData] = useState([]);
    const [error, setError] = useState(false);

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
        history.push(`directory${searchableUrl.current.search}`);
    }, [url]);

    useEffect(() => {
        if (!searchableUrl.current.search) return;
        let unmounted = false;
        const apiUrl = new URL(API_URL.href + `/profile${history.location.search}`);
        fetch(apiUrl, API_CONFIG('GET')).then(response => response.json()
        ).then((response) => {
            if (response.isError) {
                setError(true);
            }
            if (!unmounted && response !== null) {
                if (response.profiles !== undefined) {
                    setData(response.profiles);
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
    }, [url]);

    function setPage(newPage) {
        setPaging({
            ...paging,
            page: newPage,
        });
    }

    function setColumnSort(category, value) {
        setSort({ category, value });
    }

    function goToAdvancedSearch(){
        let path = '/advanced/search?page=1&sortBy=asc&sortField=id';
        history.push(path);
        history.go(0);
    }

    return { setColumnSort, setSort, sort, data, paging, setPage, error,goToAdvancedSearch }
}

export default UseDirectory;
