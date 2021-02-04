import { useState } from 'react';
import { useHistory } from "react-router-dom";

import config from '../../config';

function UseForgotPassword() {
    const history = useHistory();
    const [staffuniqueid, setstaffuniqueid] = useState('');
    const [username, setUsername] = useState('');
    const { API_URL, API_CONFIG } = config();
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
			const apiUrl = new URL('/account/forgotPassword', API_URL);
			
            fetch(apiUrl, API_CONFIG(
                'POST', JSON.stringify({
                        'username': username,
                        'staffUniqueId': staffuniqueid
                    })
                )
            ).then(response => response.json())
            .then((response) => {
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
					setTimeout(() => {
                        history.push('/account/Login'); 
                        history.go(0);
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