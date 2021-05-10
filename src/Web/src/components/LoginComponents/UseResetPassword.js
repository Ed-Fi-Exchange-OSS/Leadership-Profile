import { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import config from '../../config';

function UseResetPassword() {
    const history = useHistory();
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { API_URL, API_CONFIG } = config();
    const [resetPasswordInfo, setResetPasswordInfo] = useState({
        newPassword: newPassword,
        confirmPassword: setConfirmPassword
    });
    const [error, setError] = useState({
        hasError: false,
        message: ''
    });
    const [success, setSuccess] = useState({
        isSuccess: false,
        message: ""
    });
    const [url] = useState(window.location.href);
    const searchableUrl = useRef(new URL(url));

    useEffect(() => {
        if (newPassword === confirmPassword) {
            setError({
                hasError: false,
                message: ''
            });
            setSuccess
                ({
                    isSuccess: false,
                    message: ""
                });
            setResetPasswordInfo({
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });
        } else {
            setError({
                hasError: true,
                message: 'Passwords must match.'
            });
            setSuccess
                ({
                    isSuccess: false,
                    message: ""
                });
        }
    }, [newPassword, confirmPassword]);

    function setResetPassword(e) {
        if (newPassword !== '' && confirmPassword !== '') {
            const apiUrl = new URL(API_URL + 'account/resetPassword');

            fetch(apiUrl, API_CONFIG(
                    'POST', JSON.stringify({
                        'username': searchableUrl.current.searchParams.get('username'),
                        'newPassword': newPassword,
                        'token': searchableUrl.current.searchParams.get('token')
                    })
                )).then(response => response.json())
                .then((response) => {
                    if (response.result) {
                        setError({
                            hasError: false,
                            message: ""
                        });
                        setSuccess
                            ({
                                isSuccess: true,
                                message: "New password accepted."
                            });
                        setTimeout(() => {
                            history.push('/account/Login');
                            history.go(0);
                        }, 3000);
                    } else {
                        setError({
                            hasError: true,
                            message: response.resultMessage
                        });
                        setSuccess
                            ({
                                isSuccess: false,
                                message: ""
                            });
                    }
                }).catch(error => {
                    setError({
                        hasError: true,
                        message: error.message
                    });
                    console.error(error.message);
                });
            return () => {};
        }
    }

    return {
        setResetPassword,
        bind: {
            resetPasswordInfo,
            onChange: event => {
                switch (event.target.name) {
                    case 'newPassword':
                        setnewPassword(event.target.value);
                        break;
                    case 'confirmPassword':
                        setConfirmPassword(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        },
        error,
        success
    }
}

export default UseResetPassword;