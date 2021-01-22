import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';

function AuthService() {
    const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET_KEY;
    console.log(process.env);
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
        secureStorage.setItem('isAuthenticated', true);
        secureStorage.setItem('id', username);
        console.log(process.env)
        return sessionStorage.getItem('isAuthenticated');
    }

    function logoutAuth() {
        secureStorage.removeItem('isAuthenticated');
        secureStorage.removeItem('id');
    }

    function isAuthenticated() {
        let authInfo = secureStorage.getItem('isAuthenticated');
        authInfo = authInfo === null ? false : authInfo;
        return authInfo;
    }

    function getAuthInfo() {
        const authInfo = secureStorage.getItem('id');
        return authInfo;
    }

    return { loginAuth, logoutAuth, isAuthenticated, getAuthInfo}
}

export default AuthService;