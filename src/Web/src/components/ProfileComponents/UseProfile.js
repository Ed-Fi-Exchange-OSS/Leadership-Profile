import { useState, useEffect } from 'react';


function UseProfile(id) {
    const [data, setData] = useState({});
    let unmounted = false;

    useEffect(() => {
        let unmounted = false;
        const apiUrl = new URL(`/profile/${id}`, new URL(process.env.REACT_APP_API_URL));
        fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            referrerPolicy: 'origin-when-cross-origin',
            // }).then(response => response.json()
        }).then((response) => {
                if (!unmounted && response.data !== null) {
                    setData(response.data);
                    console.log(response.data)
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