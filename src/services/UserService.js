export class UserService {

    static getCurrentUser() {
        let token = window.localStorage['jwtToken'];
        if (!token) return {};
        //some parsing to extract the relevant info from the token
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return {
            userId: JSON.parse(window.atob(base64)).userId,
            email: JSON.parse(window.atob(base64)).email,
            expiration: JSON.parse(window.atob(base64)).exp
        };
    }

    static isAuthenticated() {
        if (this.getCurrentUser().expiration >= new Date().getTime() / 1000 && !!localStorage.getItem('jwtToken')) {
            return true;
        } return false;
    }

    static logout() {
        window.localStorage.removeItem('jwtToken');
    }
}

export default UserService
