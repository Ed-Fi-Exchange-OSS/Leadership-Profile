import AuthService from '../utils/auth-service';
import { useHistory } from 'react-router-dom';
import config from '../config';

function LogoutService() {
    const history = useHistory();
    const { logoutAuth, getAuthInfo } = AuthService();
    const authInfo = getAuthInfo();
    const { API_URL } = config();

    function logout() {
        const apiUrl = new URL(API_URL + 'account/logout');
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
            'logoutId': authInfo,
        })}).then(() => {
          logoutAuth();
          history.push('/account/login');
          history.go(0);
        }).catch(error => console.error(error)); 
      }

      return { logout }
}

export default LogoutService;