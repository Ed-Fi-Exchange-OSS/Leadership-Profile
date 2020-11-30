import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';

function UseDirectory() {
    const history = useHistory();
    const location = useLocation();
    const [data, setData] = useState([]);

    const [url, setUrl] = useState(window.location.href);
    let searchableUrl = new URL(url);

    const [sort, setSort] = useState({
        category: searchableUrl.searchParams.get('sortField') !== null && searchableUrl.searchParams.get('sortField') !== 'null' ? searchableUrl.searchParams.get('sortField') : 'Id',
        value: searchableUrl.searchParams.get('sortBy') !== null && searchableUrl.searchParams.get('sortBy') !== 'null' ? searchableUrl.searchParams.get('sortBy') : 'desc',
    });

    const [search, setSearch] = useState(
        searchableUrl.searchParams.get('search') !== null && searchableUrl.searchParams.get('search') !== 'null' ? searchableUrl.searchParams.get('search') : null
    );

    const [paging, setPaging] = useState({
        page: searchableUrl.searchParams.get('page') !== null && searchableUrl.searchParams.get('page') !== 'null' ? searchableUrl.searchParams.get('page') : 1,
        totalSize: 0,
        maxPages: 1,
    });

    useEffect(() => {
        if (history.action === 'POP' && searchableUrl.search !== location.search) {
            const searchParams = new URLSearchParams(history.location.search);
            setPaging({ ...paging, page: searchParams.get('page') });
            setSort({ category: searchParams.get('sortField'), value: searchParams.get('sortBy') });
            setSearch(searchParams.get('search'));
        }
    }, [history.action, history.location]);

    useEffect(() => {
        searchableUrl = new URL(url);
        const params = Array.from(searchableUrl.searchParams);
        params.forEach(param => searchableUrl.searchParams.delete(param[0]));
        searchableUrl.searchParams.set('page', paging.page);
        searchableUrl.searchParams.set('sortField', sort.category);
        searchableUrl.searchParams.set('sortBy', sort.value);
        if (search !== null)
            searchableUrl.searchParams.set('search', search);
        searchableUrl.searchParams.sort();
        setUrl(searchableUrl.href);
    }, [sort, paging.page, search]);

    useEffect(() => {
        searchableUrl = new URL(url);
        if (searchableUrl.search === location.search || !searchableUrl.search) return;
        history.push(`queue${searchableUrl.search}`);
    }, [url]);

    useEffect(() => {
        if (!searchableUrl.search) return;
        let unmounted = false;
        const apiUrl = new URL(`https://localhost:44383/Profile${history.location.search}`);
        Axios.get(apiUrl)
            .then((response) => {
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
            .catch(error => console.error(error.message));
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

    function setSearchValue(value) {
        setSearch(value);
    }

    return { setColumnSort, setSort, sort, data, paging, search, setPage, setSearchValue }
}

export default UseDirectory;
