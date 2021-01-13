import { useState, useEffect } from 'react';
import Axios from 'axios';

function UseLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInfo, setLoginInfo] = useState({
        email: email,
        password: password
    });
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoginInfo({
            email: email,
            password: password
        })
    }, [email, password]);

    useEffect(() => {

    }, [loginInfo]);

    async function setLogin(e) {
        console.log('logging in');
        if (password !== '' && email !== '') {
            let unmounted = false;
            const apiUrl = new URL(`https://localhost:44383/account/login`);
            Axios.post(apiUrl, {
                'username': email,
                'password': password,
                "rememberLogin": true,
                "returnUrl": "http://localhost:3000/directory?page=1&sortBy=desc&sortField=id"
            }).then((response) => {
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
            loginInfo,
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