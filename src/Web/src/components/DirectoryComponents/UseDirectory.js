import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';

function UseDirectory() {
    const history = useHistory();
    const location = useLocation();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, paging.page]);

    useEffect(() => {
        searchableUrl.current.textContent = new URL(url);
        if (searchableUrl.current.search === location.search || !searchableUrl.current.search) return;
        history.push(`directory${searchableUrl.current.search}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    useEffect(() => {
        if (!searchableUrl.current.search) return;
        let unmounted = false;
        const apiUrl = new URL(`https://localhost:5001/Profile${history.location.search}`);
        fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            // cache: 'cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'text/plain',
                'Accept': 'text/plain',
                'Cache': 'no-cache',
            },
            referrerPolicy: 'origin-when-cross-origin',
            }).then((response) => {
                if (response.isError) {
                    setError(true);
                }
                if (!unmounted && response.data !== null) {
                    if (response.data.profiles !== undefined) {
                        setData(response.data.profiles);
                    }
                    setPaging({
                        ...paging,
                        totalSize: response.data.totalCount,
                        maxPages: Math.ceil(response.data.totalCount / 10),
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // function setSearchValue(value) {
    //     setSearch(value);
    // }

    return { setColumnSort, setSort, sort, data, paging, setPage, error }
}

export default UseDirectory;
