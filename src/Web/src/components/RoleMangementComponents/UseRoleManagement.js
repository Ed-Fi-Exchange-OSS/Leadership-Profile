import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import config from '../../config';

function UseRoleManagement() {
    const { API_URL, API_CONFIG } = config();
    const history = useHistory();
    const location = useLocation();

    const [url, setUrl] = useState(window.location.href);
    const [data, setData] = useState({});
    const [addRoleList, setAddRoleList] = useState([]);
    const [removeRoleList, setRemoveRoleList] = useState([]);
    const [error, setError] = useState(false);
    const [paging, setPaging] = useState({
        page: 1,
        totalSize: 0,
        maxPages: 1,
    });

    const searchableUrl = useRef(new URL(url));

    useEffect(() => {
        if (history.action === 'POP' && searchableUrl.current.search !== location.search) {
            const searchParams = new URLSearchParams(history.location.search);
            setPaging({ ...paging, page: searchParams.get('page') });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.action, history.location]);

    useEffect(() => {
        searchableUrl.current.textContent = new URL(url);
        searchableUrl.current.searchParams.delete('page');
        searchableUrl.current.searchParams.set('page', paging.page);
        setUrl(searchableUrl.current.href);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paging.page]);

    useEffect(() => {
        searchableUrl.current.textContent = new URL(url);
        if (searchableUrl.current.search === location.search || !searchableUrl.current.search) return;
        history.push(`manage${searchableUrl.current.search}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`/RoleManagement/list?page=${paging.page}`, API_URL);
        fetch(apiUrl, API_CONFIG('GET'))
            .then(response => response.json())
            .then((response) => {
                if (!unmounted && response !== null) {
                    setData(response);
                    setPaging({
                        ...paging,
                        totalSize: response.totalCount,
                        maxPages: Math.ceil(response.totalCount / 2),
                    });
                }       
            }).catch((error) => {
                setError(true);
                console.error(error);
            });
        return () => {
            unmounted = true;
        };
    }, [url]);

    //
    function OnAddClick(event) {
        const staffUniqueId = event.target.value;
        let stored = JSON.parse(localStorage.getItem('AddAdmin')) ?? [];
        stored.push(staffUniqueId);
        localStorage.setItem("AddAdmin", JSON.stringify(stored));
    }

    function OnRemoveClick(event) {
        const staffUniqueId = event.target.value;
        let stored = JSON.parse(localStorage.getItem('RemoveAdmin')) ?? [];
        stored.push(staffUniqueId);
        localStorage.setItem("RemoveAdmin", JSON.stringify(stored));
    }

    async function OnSubmit(event) {
        event.preventDefault();

        setRemoveRoleList(localStorage.getItem('AddAdmin'));
        setAddRoleList(localStorage.getItem('RemoveAdmin'));
        localStorage.clear();

        const addPromise = await AddAdminRoles();
        const removePromise = await RemoveAdminRoles();
        Promise.all([addPromise, removePromise])
            .then(() => {
                history.push('/queue?count=10&page=1&sortBy=desc&sortField=id');
                history.go(0);
            });
    }
     
    function AddAdminRoles() {
        let unmounted = false;
        const apiUrl = new URL('/RoleManagement/add-admin', API_URL);
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify({staffUniqueIds: addRoleList})))
            .then(() => Promise.resolve())
            .catch((error) => {
                setError(true);
                console.error(error);
            });
        return () => {
            unmounted = true;
        };
    }

    function RemoveAdminRoles() {
        let unmounted = false;
        const apiUrl = new URL('/RoleManagement/remove-admin', API_URL);
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify({staffUniqueIds: removeRoleList})))
            .then(() => Promise.resolve())
            .catch((error) => {
                setError(true);
                console.error(error);
            });
        return () => {
            unmounted = true;
        };
    }

    function SetPage(newPage) {
        setPaging({
            ...paging,
            page: newPage,
        });
    }

    return {
        data,
        paging,
        SetPage,
        OnSubmit,
        error,
        bind: {
            addRoleList,
            onClick: event => {
                switch (event.target.checked) {
                    case true:
                        OnAddClick(event);
                        break;
                    case false:
                        OnRemoveClick(event);
                        break;
                    default:
                        console.error('Not a boolean value.');
                }
            }
        }
    };
};

export default UseRoleManagement;