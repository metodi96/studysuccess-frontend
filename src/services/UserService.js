export class UserService {

    static getCurrentUser() {
        let token = window.localStorage['jwtToken'];
        console.log(token);
        if (!token) return {};
        //some parsing to extract the relevant info from the token
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return {
            userId: JSON.parse(window.atob(base64)).userId,
            email: JSON.parse(window.atob(base64)).email
        };
    }

    static isAuthenticated() {
        return !!window.localStorage['jwtToken'];
    }

    static logout(){
        window.localStorage.removeItem('jwtToken');
    }
}

export default UserService
