import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import AuthService from '../../utils/auth-service';

function UseLogin() {
    const history = useHistory();
    const { login } = AuthService()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logininfo, setLogininfo] = useState({
        username: username,
        password: password
    });
    const [error, setError] = useState(false);

    useEffect(() => {
        setLogininfo({
            username: username,
            password: password
        })
    }, [username, password]);

    function setLogin(e) {
        if (password !== '' && username !== '') {
            let unmounted = false;
            const apiUrl = new URL(`https://localhost:5001/account/login`);
            fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                referrerPolicy: 'origin-when-cross-origin',
                body: JSON.stringify({
                'username': username,
                'password': password,
            })}).then((response) => {
                if (!unmounted && response.data !== null) {
                    setError(false);
                    login(username);
                    history.push('/queue?count=10&page=1&sortBy=desc&sortField=id');
                    history.go(0);
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
                    case 'username':
                        setUsername(event.target.value);
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