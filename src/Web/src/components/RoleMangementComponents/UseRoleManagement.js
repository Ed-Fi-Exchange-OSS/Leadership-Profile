import { useState, useEffect } from 'react';
import config from '../../config';

function UseRoleManagement() {
    const { API_URL, API_CONFIG } = config();

    const [data, setData] = useState({});
    const [addRoleList, setAddRoleList] = useState([]);
    const [removeRoleList, setRemoveRoleList] = useState([]);
    const [error, setError] = useState(false);

    const [paging, setPaging] = useState({
        page: 1,
        totalSize: 0,
        maxPages: 1,
    });

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`/RoleManagement/list?page=${paging.page}`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                setData(response);
            }       
        }).catch((error) => {
            setError(true);
            console.error(error);
        });
        return () => {
            unmounted = true;
        };
    }, [paging]);

    //
    function OnAddClick(event) {
        const staffUniqueId = event.target.value;
        const indexOnRemoveList = removeRoleList.indexOf(staffUniqueId);
        // if (removeRoleList.length > 0 && indexOnRemoveList > -1) {
        //     console.log(removeRoleList.splice(indexOnRemoveList, 1))
        //     setRemoveRoleList(removeRoleList.splice(indexOnRemoveList, 1));
        // } else {
            setAddRoleList([...addRoleList, staffUniqueId]);
        // }
    }

    function OnRemoveClick(event) {
        const staffUniqueId = event.target.value;
        const indexOnAddList = addRoleList.indexOf(staffUniqueId);
        // if (addRoleList.length > 0 && indexOnAddList > -1) {
        //     console.log(addRoleList.splice(indexOnAddList, 1))
        //     setAddRoleList(addRoleList.splice(indexOnAddList, 1));
        // } else {
            setRemoveRoleList([...removeRoleList, staffUniqueId]);
        // }
    }

    async function OnSubmit(event) {
        event.preventDefault();
        const addPromise = await AddAdminRoles();
        const removePromise = await RemoveAdminRoles();
        Promise.all([addPromise, removePromise])
        .then(results => console.log(results));
    }
     
    function AddAdminRoles() {
        let unmounted = false;
        const apiUrl = new URL('/RoleManagement/add-admin', API_URL);
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify({staffUniqueIds: addRoleList}))
        ).then(response => response.json())
        .then((response) => {
            console.log(response);   
        }).catch((error) => {
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
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify({staffUniqueIds: removeRoleList}))
        ).then(response => response.json())
        .then((response) => {
            console.log(response);   
        }).catch((error) => {
            setError(true);
            console.error(error);
        });
        return () => {
            unmounted = true;
        };
    }

    return {
        data,
        paging,
        setPaging,
        OnSubmit,
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