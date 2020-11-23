import { useState, useEffect } from 'react';

function UseTableList() {
    const [data, setData] = useState([]);

    const [url, setUrl] = useState(window.location.href);
    let searchableUrl = new URL(url);

    const [sort, setSort] = useState({
        category: searchableUrl.searchParams.get('sortField') !== null && searchableUrl.searchParams.get('sortField') !== 'null' ? searchableUrl.searchParams.get('sortField') : 'Id',
        value: searchableUrl.searchParams.get('sortBy') !== null && searchableUrl.searchParams.get('sortBy') !== 'null' ? searchableUrl.searchParams.get('sortBy') : 'desc',
    });

    const [paging, setPaging] = useState({
        page: searchableUrl.searchParams.get('page') !== null && searchableUrl.searchParams.get('page') !== 'null' ? searchableUrl.searchParams.get('page') : 1,
        totalSize: 0,
        maxPages: 1,
    });

    useEffect(() => {
        searchableUrl = new URL(url);
        const params = Array.from(searchableUrl.searchParams);
        params.forEach(param => searchableUrl.searchParams.delete(param[0]));
        searchableUrl.searchParams.set('page', paging.page);
        searchableUrl.searchParams.set('sortField', sort.category);
        searchableUrl.searchParams.set('sortBy', sort.value);
        Object.keys(filters)
            .forEach((key) => {
                if (filters[key] !== null) {
                    searchableUrl.searchParams.set(key, filters[key]);
                }
            });
        searchableUrl.searchParams.sort();
        setUrl(searchableUrl.href);
    }, [sort, paging.page]);

    useEffect(() => {
        searchableUrl = new URL(url);
        if (searchableUrl.search === location.search || !searchableUrl.search) return;
        history.push(`queue${searchableUrl.search}`);
    }, [url]);

    useEffect(() => {
        if (!searchableUrl.search) return;
        const getDirectoryData = `api/pulsechecks/queue${history.location.search}`;
        const apiUrl = new URL(pulseCheckQueueUrl, config.API_URL);
        Axios.get(apiUrl, { headers: { Authorization: `Bearer  ${loginData.accessToken}` } })
            .then((response) => {
                if (response.data.pulseCheckList !== null) {
                    setData(response.data.staff);
                    setPaging({
                        ...paging,
                        totalSize: response.data.totalPulseChecks,
                        maxPages: Math.ceil(response.data.totalPulseChecks / response.data.count),
                    });
                }
            })
            .catch(error => error);
    }, [url]);

    export default UseTableList;
}