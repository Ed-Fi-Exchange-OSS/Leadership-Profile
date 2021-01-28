import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';
import { NavItem } from 'reactstrap';

function AuthService() {
    const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET_KEY;
    var secureStorage = new SecureStorage(sessionStorage, {
        hash: function hash(key) {
            return key;
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    
            data = data.toString();
    
            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    
            data = data.toString(CryptoJS.enc.Utf8);
    
            return data;
        }
    });
    
    function loginAuth(username) {
        secureStorage.setItem('authInfo', {
            'isAuthenticated': true,
            'id': username
        });
        return secureStorage.getItem('authInfo');
    }

    function logoutAuth() {
        secureStorage.removeItem('authInfo');
    }

    function isAuthenticated() {
        const authInfo = secureStorage.getItem('authInfo');
        const isAuthenticated = authInfo === null || authInfo['isAuthenticated'] === null ? false : authInfo['isAuthenticated'];
        return isAuthenticated;
    }

    function getAuthInfo() {
        const authInfo = secureStorage.getItem('authInfo');
        const authId = authInfo === null ? null : authInfo['id']
        return authId;
    }

    return { loginAuth, logoutAuth, isAuthenticated, getAuthInfo}
}

export default AuthService;