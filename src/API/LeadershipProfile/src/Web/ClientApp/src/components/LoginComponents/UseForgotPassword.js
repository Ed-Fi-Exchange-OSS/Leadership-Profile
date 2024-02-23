// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import config from '../../config';

function UseForgotPassword() {
    const navigate = useNavigate();
    const [staffUniqueId, setStaffUniqueId] = useState('');
    const [userName, setUserName] = useState('');
    const {
        API_URL,
        API_CONFIG
    } = config();
    const [error, setError] = useState({
        hasError: false,
        message: ''
    });
    const [success, setSuccess] = useState({
        isSuccess: false,
        message: ""
    });

    function goToLogIn() {
        let path = '/account/Login';
        navigate(path);
        // history.go(0);
    }

    function setForgotPassword(e) {
        if (staffUniqueId !== '' && userName !== '') {
            const apiUrl = new URL(API_URL + 'user/forgotPassword');

            fetch(apiUrl, API_CONFIG(
                    'POST', JSON.stringify({
                        'userName': userName,
                        'staffUniqueId': staffUniqueId
                    })
                )).then(response => response.json())
                .then((response) => {
                    if(response.isError == true){
                        setError({
                            hasError: true,
                            message: response.message
                        });
                        setSuccess({
                            isSuccess: false,
                            message: ""
                        });
                    }
                    else{
                        if (response.result) {
                            setError({
                                hasError: false,
                                message: ""
                            });
                            setSuccess({
                                isSuccess: true,
                                message: "An email will be sent to the email address on file in the system."
                            });
                            setTimeout(() => {
                                navigate('/account/Login');
                                // history.go(0);
                            }, 3000);
                        } else {
                            setError({
                                hasError: true,
                                message: response.resultMessage
                            });
                            setSuccess({
                                isSuccess: false,
                                message: ""
                            });
                        }
                    }

                }).catch(error => {
                    console.error(error.message);
                });
        } else {
            setError({
                hasError: true,
                message: "Both Staff Unique ID and Username are required."
            });
            setSuccess({
                isSuccess: false,
                message: ""
            });
            setTimeout(() => {
                setError({
                    hasError: false,
                    message: ""
                });
            }, 3000);
        }
    }

    return {
        setForgotPassword,
        goToLogIn,
        bind: {
            onChange: event => {
                switch (event.target.name) {
                    case 'userName':
                        setUserName(event.target.value);
                        break;
                    case 'staffUniqueId':
                        setStaffUniqueId(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        },
        error,
        success
    };
}

export default UseForgotPassword;
