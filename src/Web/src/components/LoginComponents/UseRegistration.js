import { useState, useEffect } from 'react';
import Axios from 'axios';

function UseRegistration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [staffUniqueId, setStaffUniqueId] = useState('');
    const [registrationInfo, setRegistrationInfo] = useState({
        username: username,
        password: password,
        email: email,
        staffUniqueId: staffUniqueId,
    });
    const [error, setError] = useState({
        hasError: false,
        message: ''
    });

    useEffect(() => {
        if (password === confirmPassword) {
            setError({
                hasError: false,
                message: ''
            });
            setRegistrationInfo({
                username: username,
                password: password,
                email: email,
                staffUniqueId: staffUniqueId,
            });
        } else {
            setError({
                hasError: true,
                message: 'Passwords must match.'
            });
        }
    }, [username, email, password, confirmPassword, staffUniqueId]);

    async function setRegistration() {
        let unmounted = false;
        const apiUrl = new URL(`https://localhost:5001/account/register`);
        Axios.post(apiUrl, registrationInfo).then((response) => {
            if (!unmounted && response.data !== null) {
                setError(false);
            }
        }).catch((error) => {
            const errorInfo = error.response.data;
            if (errorInfo.message === undefined) {
                const errors = Object.values(errorInfo.errors).map(error => error.join(" ")).join(" ")
                setError({
                    hasError: true,
                    message: errors
                });
            } else {
                setError({
                    hasError: true,
                    message: errorInfo.message
                });
            }
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    return {
        setRegistration,
        error,
        bind: {
            registrationInfo,
            onChange: event => {
                switch (event.target.name) {
                    case 'username':
                        setUsername(event.target.value);
                        break;
                    case 'email':
                        setEmail(event.target.value);
                        break;
                    case 'password':
                        setPassword(event.target.value);
                        break;
                    case 'confirmPassword':
                        setConfirmPassword(event.target.value);
                        break;
                    case 'staffUniqueId':
                        setStaffUniqueId(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        },
    }
}

export default UseRegistration