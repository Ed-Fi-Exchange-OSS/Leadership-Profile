import { useState, useEffect } from 'react';
import Axios from 'axios';

function UseRegistration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [staffUniqueId, setStaffUniqueId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registrationInfo, setRegistrationInfo] = useState({
        username: email,
        password: password,
        email: email,
        staffUniqueId: staffUniqueId,
        firstName: firstName,
        lastName: lastName,
    });
    const [error, setError] = useState({
        hasError: false,
        message: ''
    });

    useEffect(() => {
        if (password === confirmPassword) {
            setRegistrationInfo({
                username: email,
                password: password,
                email: email,
                staffUniqueId: staffUniqueId,
                firstName: firstName,
                lastName: lastName,
            });
        } else {
            setError({
                hasError: true,
                message: 'Passwords must match.'
            });
        }
    }, [email, password, staffUniqueId, firstName, lastName]);

    async function setRegistration() {
        let unmounted = false;
        const apiUrl = new URL(`https://localhost:44383/account/register`);
        Axios.post(apiUrl, registrationInfo).then((response) => {
            if (!unmounted && response.data !== null) {
                setError(false);
                console.log(response.data)
            }
        }).catch((error) => {
            const errorResponse = error.response.data
            console.log(Object.values(errorResponse.errors.join()));
            setError({
                hasError: errorResponse.isError,
                message: Object.values(errorResponse.errors)
                    .join(' ')
            });
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
                    case 'firstName':
                        setFirstName(event.target.value);
                        break;
                    case 'lastName':
                        setLastName(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        },
    }
}

export default UseRegistration