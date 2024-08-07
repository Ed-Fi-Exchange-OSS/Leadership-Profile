// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import AuthService from '../../utils/auth-service';
import config from '../../config';
import { convertCompilerOptionsFromJson } from 'typescript';

function UseLogin() {
    const navigate = useNavigate();
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
        navigate(path);
        // history.go(0);
    }

    function setLogin(e) {
        if (password !== '' && username !== '') {

            let unmounted = false;
            // const apiUrl = new URL(API_URL + '/Identity/Account/Login?ReturnUrl=/Directory');
            //var uri = "http://localhost";
            //var uri = "https://victorialeadership.developers.net";
            // alert(uri);
            var uri = API_URL.toString().replace('/api', '');
            const apiUrl = new URL(uri + 'login?useCookies=true');

            fetch(apiUrl, API_CONFIG(
                'POST',
                JSON.stringify(
                    {
                    'email': username,
                    'password': password,
                    }
                )
            ))
            // .then(response => response.json())
            .then(
                (result) => {
                    // console(result);
                    if (!unmounted && result?.status == 200)
                    {
                        setError(false);
                        loginAuth(username);
                        
                        // history.push('/queue?count=10&page=1&sortBy=asc&sortField=id');
                        navigate('/landing');
                        // history.go(0);
                    }
                    else
                    {
                        setError(true);
                    }
                }
            )
            .catch((error) => {
                console.error(error.message);
                setError(true);
            });

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
