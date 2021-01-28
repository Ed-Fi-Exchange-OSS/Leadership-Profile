import { useState, useEffect } from 'react';
import config from '../../config';

function UseProfile(id) {
    const { API_URL, API_CONFIG } = config();
    const [data, setData] = useState({});

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`/profile/${id}`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then((response) => {
            if (!unmounted && response.data !== null) {
                setData(response.data);
            }
        }).catch(error => {
            // setError(true);
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }, [id]);

    return { data };
}

export default UseProfile;