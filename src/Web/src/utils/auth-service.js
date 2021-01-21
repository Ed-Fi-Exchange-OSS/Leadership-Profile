import Cookies from 'js-cookie'

function AuthService() {
    function login(username) {
        sessionStorage.setItem('isAuthenticated', true);
        sessionStorage.setItem('id', username);
        return sessionStorage.getItem('isAuthenticated');
    }

    function logout(username) {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('id');
    }

    function isAuthenticated() {
        const authInfo = sessionStorage.getItem('isAuthenticated');
        return authInfo;
    }

    return { login, logout, isAuthenticated }
}

export default AuthService;