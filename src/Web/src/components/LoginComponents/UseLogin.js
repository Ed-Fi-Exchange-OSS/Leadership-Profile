import { useState, useEffect } from 'react';
import Axios from 'axios';

function UseLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logininfo, setLogininfo] = useState({
        email: email,
        password: password
    });
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLogininfo({
            email: email,
            password: password
        })
    }, [email, password]);

    function setLogin(e) {
        if (password !== '' && email !== '') {
            let unmounted = false;
            const apiUrl = new URL(`https://tpdm.web.internal:5001/account/login`);
            fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Accept': 'application/json',
                    // 'Cache': 'no-cache',
                },
                // referrerPolicy: 'origin-when-cross-origin',
                body: JSON.stringify({
                'username': email,
                'password': password,
            })}).then((response) => {
                if (!unmounted && response.data !== null) {
                    setError(false);
                    setData(response.data);
                }
            }).catch(error => {
                setError(true);
                console.error(error.message);
            });
            return () => {
                unmounted = true;
            };
        }
    }

    return {
        setLogin,
        bind: {
            logininfo,
            onChange: event => {
                switch (event.target.name) {
                    case 'email':
                        setEmail(event.target.value);
                        break;
                    case 'password':
                        setPassword(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        },
        error
    };
}

export default UseLogin;