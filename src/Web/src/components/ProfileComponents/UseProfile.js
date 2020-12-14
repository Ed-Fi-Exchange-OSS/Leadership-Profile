import { useState, useEffect } from 'react';
import Axios from 'axios';

function UseProfile() {
    const [data, setData] = useState({});

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`https://localhost:44383/Profile/1ec702ca-3d47-4c75-9f4e-70cae8510bb2`);
        Axios.get(apiUrl)
            .then((response) => {
                if (!unmounted && response.data !== null) {
                    setData(response.data);
                }
            })
            .catch(error => {
                // setError(true);
                console.error(error.message);
            });
        return () => {
            unmounted = true;
        };
    }, []);

    return { data };
}

export default UseProfile;