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
    const [formComplete, setFormComplete] = useState({
        valid: false,
        message: ''
    });

    useEffect(() => {
        setRegistrationInfo({
            username: email,
            password: password,
            email: email, 
            staffUniqueId: staffUniqueId,
            firstName: firstName,
            lastName: lastName,
        });
        setFormComplete(validateForm());
    }, [email, password, staffUniqueId, firstName, lastName]);

    async function setRegistration() {
        if (formComplete) {
            let unmounted = false;
            const apiUrl = new URL(`https://localhost:44383/account/register`);
            Axios.post(apiUrl, registrationInfo).then((response) => {
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

    function validateForm() {
        let allFieldsComplete = registrationInfo.filter(field => field !== '');
        if (allFieldsComplete.includes(false)) {
            return {
                valid: false,
                message: 'All fields are required.'
            }
        }

        let passwordsMatch = password === confirmPassword;
        if (!passwordsMatch) {
            return {
                valid: false,
                message: 'Password required with matching confirmation.'
            }
        }

        return allFieldsComplete && passwordsMatch;
    }

    return {setRegistration, formComplete}
}

UseRegistration