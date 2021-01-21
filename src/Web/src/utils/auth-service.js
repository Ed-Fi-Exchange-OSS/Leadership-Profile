import Cookies from 'js-cookie'

function AuthService() {
    function login(username) {
        sessionStorage.setItem('isAuthenticated', true);
        sessionStorage.setItem('id', username);
        return sessionStorage.getItem('isAuthenticated');
    }

    function logout() {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('id');
    }

    function isAuthenticated() {
        const authInfo = sessionStorage.getItem('isAuthenticated');
        return authInfo;
    }

    function getAuthInfo() {
        const authInfo = sessionStorage.getItem('id');
        return authInfo;
    }

    return { login, logout, isAuthenticated, getAuthInfo}
}

export default AuthService;