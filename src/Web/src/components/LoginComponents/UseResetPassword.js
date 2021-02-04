import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import config from '../../config';

function UseResetPassword() {
	const history = useHistory();
	
    const [newpassword, setnewpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const { API_URL, API_CONFIG } = config();
    const [resetpasswowrdInfo, setresetpasswowrdInfo] = useState({
        newpassword: newpassword,
        confirmpassword: setconfirmpassword
    });
    const [error, setError] = useState({
        hasError: false,
        message: ''
    });
    const [success, setSuccess] = useState({
        isSuccess: false,
        message: ""
    });
	
    const [url, setUrl] = useState(window.location.href);
    const searchableUrl = useRef(new URL(url));
	
    useEffect(() => {
        if (newpassword === confirmpassword) {
            setError({
                hasError: false,
                message: ''
            });
            setSuccess
            ({
                isSuccess: false,
                message: ""
            });
            setresetpasswowrdInfo({
                newpassword: newpassword,
                confirmpassword: confirmpassword,
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
    }, [newpassword, confirmpassword]);

	function setResetPassword(e){
		if (newpassword !== '' && confirmpassword !== '') {
			const apiUrl = new URL('/account/resetPassword', API_URL);
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
                'username': searchableUrl.current.searchParams.get('username'),
                'newpassword': newpassword,
                'token': searchableUrl.current.searchParams.get('token'),
            })}).then(response => response.json()
            ).then((response) => {
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
					setTimeout( () => {history.push('/account/Login'); history.go(0);}, 3000);
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
            return () => {
                
            };
		}
	}
	
	return {
		setResetPassword,
		bind: {
            resetpasswowrdInfo,
            onChange: event => {
                switch (event.target.name) {
                    case 'newpassword':
                        setnewpassword(event.target.value);
                        break;
                    case 'confirmpassword':
                        setconfirmpassword(event.target.value);
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