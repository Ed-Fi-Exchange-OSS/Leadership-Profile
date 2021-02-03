import { useState, useEffect } from 'react';
import config from '../../config';

function UseProfile(id) {
    const { API_URL, API_CONFIG } = config();
    const [data, setData] = useState({});

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`/profile/${id}`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                setData(response);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }, [id]);

    return { data };
}

export default UseProfile;