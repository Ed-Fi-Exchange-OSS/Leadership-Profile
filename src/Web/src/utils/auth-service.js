import Cookies from 'js-cookie'

function AuthService() {
    function loginAuth(username) {
        sessionStorage.setItem('isAuthenticated', true);
        sessionStorage.setItem('id', username);
        return sessionStorage.getItem('isAuthenticated');
    }

    function logoutAuth() {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('id');
    }

    function isAuthenticated() {
        let authInfo = sessionStorage.getItem('isAuthenticated');
        authInfo = authInfo === null ? false : authInfo;
        return authInfo;
    }

    function getAuthInfo() {
        const authInfo = sessionStorage.getItem('id');
        return authInfo;
    }

    return { loginAuth, logoutAuth, isAuthenticated, getAuthInfo}
}

export default AuthService;