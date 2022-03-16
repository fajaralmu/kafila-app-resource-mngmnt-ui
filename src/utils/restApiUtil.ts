
import { getCookie, setCookie, removeCookie } from './cookieUtil';
const LOGIN_KEY_NAME = "kado-in-login-token"

export const commonAuthorizedHeader = (contentType:string = 'application/json') => {
    return {
        'Content-Type': contentType,
        'requestId': "ABCD",// getRequestId(),//'localStorage.getItem("requestId")',
        'Authorization': 'Bearer '+getCookie(LOGIN_KEY_NAME)
    }
};
export const commonHeader = (contentType:string = 'application/json') => {
    return {
        'Content-Type': contentType,
        // 'requestId': getRequestId(), 
    }
};
export const removeLoginKeyCookie = () => {
    removeCookie(LOGIN_KEY_NAME);
}
export const setLoginKeyCookie =  (token:string) => {
    setCookie(LOGIN_KEY_NAME, token);
}
export const loginKeyCookieExist = () => {
    const val:string = getLoginKeyCookie();
    return val !== undefined && val !== null && val.trim() !== "";
}
export const getLoginKeyCookie = () => {
    return getCookie(LOGIN_KEY_NAME);
}
