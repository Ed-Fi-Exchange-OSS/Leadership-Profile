import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import config from '../../config';

function UseRoleManagement() {

    const { API_URL, API_CONFIG } = config();
    const history = useHistory();
    const location = useLocation();

    const [url, setUrl] = useState(window.location.href);
    const [data, setData] = useState([]);
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
        const apiUrl = new URL(API_URL + 'userclaims?page=' + paging.page);
        fetch(apiUrl, API_CONFIG('GET'))
            .then(response => response.json())
            .then((response) => {
                if (!unmounted && response !== null) {

                    const profiles = {};
                    var store = localStorage.getItem("userRoleList") === null ? {} : JSON.parse(localStorage.getItem("userRoleList"));
                    response.profiles.map((e,i)=>{
                        if(store[e.staffUniqueId] === undefined){
                            store[e.staffUniqueId] = {
                                isAdmin: e.isAdmin,
                                isOriginal: true,
                                originState: e.isAdmin
                            }
                        }    
                        else{
                            response.profiles[i].isAdmin = store[e.staffUniqueId].isAdmin
                        }
                    });

                    localStorage.setItem("userRoleList", JSON.stringify(store));
                    
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
        var store = JSON.parse(localStorage.getItem("userRoleList"));
        const staffUniqueId = event.target.value;
        store[staffUniqueId].isAdmin = true;
        localStorage.setItem("userRoleList", JSON.stringify(store));
    }

    function OnRemoveClick(event) {
        var store = JSON.parse(localStorage.getItem("userRoleList"));
        const staffUniqueId = event.target.value;
        store[staffUniqueId].isAdmin = false;
        localStorage.setItem("userRoleList", JSON.stringify(store));
    }

    async function OnSubmit(event) {
        event.preventDefault();

        const addList = [];
        const removeList = [];

        var store = JSON.parse(localStorage.getItem("userRoleList"));

        Object.keys(store).map((e,i)=>{
            if(store[e].isAdmin == true && 
                store[e].isAdmin != store[e].originState)
            {
                addList.push(e);
            }            
            
            if(store[e].isAdmin == false && 
                store[e].isAdmin != store[e].originState)
            {
                removeList.push(e);
            }
        });

        localStorage.removeItem("userRoleList");
        localStorage.clear();

        const addPromise = await AddAdminRoles(addList);
        const removePromise = await RemoveAdminRoles(removeList);
        Promise.all([addPromise, removePromise])
            .then(() => {
                history.push('/queue?count=10&page=1&sortBy=asc&sortField=id');
                history.go(0);
            });
    }
     
    function AddAdminRoles(addList) {
        let unmounted = false;
        const apiUrl = new URL(API_URL + 'userclaims');
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify({staffUniqueIds: addList, claimType: "role", claimValue: "Admin"})))
            .then(() => Promise.resolve())
            .catch((error) => {
                setError(true);
                console.error(error);
            });
        return () => {
            unmounted = true;
        };
    }

    function RemoveAdminRoles(removeList) {
        let unmounted = false;
        const apiUrl = new URL(API_URL + 'userclaims');
        fetch(apiUrl, API_CONFIG('DELETE', JSON.stringify({staffUniqueIds: removeList, claimType: "role", claimValue: "Admin"})))
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