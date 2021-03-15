import { useState, useEffect } from 'react';
import config from '../../config';

function UseDataCorrectionModal() {
    const { API_URL, API_CONFIG } = config();

    const [staffUniqueId, setStaffUniqueId] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Data Correction Request');
    const [messageContent, setMessageContent] = useState('');

    const [feedbackInfo, setFeedbackInfo] = useState({
        staffUniqueId : staffUniqueId,
        UserFullName : fullName,
        StaffEmail : email,
        MessageSubject : subject,
        MessageDescription : messageContent
    });

    useEffect(() => {
        setFeedbackInfo({
            staffUniqueId : staffUniqueId,
            UserFullName : fullName,
            StaffEmail : email,
            MessageSubject : subject,
            MessageDescription : messageContent
        });
    }, [staffUniqueId, fullName, email, subject, messageContent]);

    async function sendFeedback(data){
        let unmounted = false;

        feedbackInfo["staffUniqueId"] = data.sui;
        feedbackInfo["UserFullName"] = data.fullname;
        feedbackInfo["StaffEmail"] = data.email;

        const apiUrl = new URL('/profile/datacorrection', API_URL);
        fetch(apiUrl, API_CONFIG('POST', JSON.stringify(feedbackInfo)))
        .then((response) => {
            unmounted = true;
            return true;
        })
        .catch(error => {
            console.error(error);
            return false;
        });
    }

    return{
        sendFeedback,
        bind:{
            feedbackInfo,
            onChange: event => {
                switch (event.target.name) {
                    case 'staffUniqueId':
                        setStaffUniqueId(event.target.value);
                        break;
                    case 'fullName':
                        setFullName(event.target.value);
                        break;
                    case 'email':
                        setEmail(event.target.value);
                        break;
                    case 'subject':
                        setSubject(event.target.value);
                        break;
                    case 'messagescontent':
                        setMessageContent(event.target.value);
                        break;
                    default:
                        console.error('No matching elements');
                }
            }
        }
    }
}

export default UseDataCorrectionModal;