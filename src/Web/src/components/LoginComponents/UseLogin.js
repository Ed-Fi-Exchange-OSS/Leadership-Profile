import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import AuthService from '../../utils/auth-service';
import config from '../../config';
import { convertCompilerOptionsFromJson } from 'typescript';

function UseLogin() {
    const history = useHistory();
    const { loginAuth } = AuthService();
    const { API_URL, API_CONFIG } = config();

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

    function goToForgotPassword() {
        let path = '/account/ForgotPassword';
        history.push(path);
        history.go(0);
    }

    function setLogin(e) {
        if (password !== '' && username !== '') {

            let unmounted = false;
            const apiUrl = new URL(API_URL.href + '/account/login');

            fetch(apiUrl, API_CONFIG(
                'POST', 
                JSON.stringify(
                    {
                    'username': username,
                    'password': password,
                    }
                )
            ))
            .then(response => response.json())
            .then(
                (result) => {
                    if (!unmounted && result.result) 
                    {
                        setError(false);
                        loginAuth(username); 
                        history.push('/queue?count=10&page=1&sortBy=asc&sortField=id');
                        history.go(0);
                    }
                    else 
                    {
                        setError(true);
                    }
                },
                (error) => {
                    console.error(error.message);
                    setError(true);
                }
            );

            return () => {
                unmounted = true;
            };
        }
    }

    return {
        setLogin,
        goToForgotPassword,
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