import Cookies from 'js-cookie'

function AuthService() {
    function getAuthInfo() {
        // eslint-disable-next-line no-undef
        const authInfo = Cookies.get();
        return authInfo;
    }

    function isAuthenticated() {
        const authInfo = getAuthInfo();
    
        if (Object.keys(authInfo).length === 0) {
          return false;
        }
    
        // const token = jwt.decode(authInfo.accessToken);
    
        return(true);
        // return (token && this.isAuthValid(token));
    }

    return { getAuthInfo, isAuthenticated }
}

// class AuthService {
//     constructor() {
//         this.authInfoKey = 'AUTH_KEY';
//     }

//     // saveAuthInfo(authInfo) {
//     //     Cookies.get(this.authInfoKey, JSON.stringify(authInfo));
//     // }

//     getAuthInfo() {
//         // eslint-disable-next-line no-undef
//         const authInfo = Cookies.get(this.authInfoKey);
//         return JSON.parse(authInfo);
//     }


//     isAuthenticated() {
//         console.log('here')
//         const authInfo = this.getAuthInfo();
    
//         if (!authInfo) {
//           return false;
//         }
    
//         // const token = jwt.decode(authInfo.accessToken);
    
//         return(true);
//         // return (token && this.isAuthValid(token));
//     }
// }

export default AuthService;