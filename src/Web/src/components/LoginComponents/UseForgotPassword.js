import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

function UseForgotPassword() {
    const history = useHistory();
    const [staffuniqueid, setstaffuniqueid] = useState('');
	const [username, setUsername] = useState('');
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
		history.push(path);
		history.go(0);
	}
	
	function setForgotPassword(e){
		if (staffuniqueid !== '' && username !== '') {
			const apiUrl = new URL(`https://localhost:5001/account/forgotPassword`);
			
			fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                async: 'true',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                referrerPolicy: 'origin-when-cross-origin',
                body: JSON.stringify({
                'username': username,
                'staffUniqueId': staffuniqueid,
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
                        message: "An email will be sent to the email address on file in the system."
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
                console.error(error.message);
            });
		}
	}
	
	return {
        setForgotPassword,
		goToLogIn,
        bind: {
            onChange: event => {
                switch (event.target.name) {
                    case 'username':
                        setUsername(event.target.value);
                        break;
                    case 'staffuniqueid':
                        setstaffuniqueid(event.target.value);
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