import {type JwtPayload, jwtDecode} from 'jwt-decode';
import {UserIdNotPresentInToken} from '../errors/authErrors';

interface AccessTokenPayload extends JwtPayload {
    token_type: 'access';
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}
export const isTokenValid = (token: string) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

export const fetchIdFromToken = (token: string) => {
    const decodedToken = jwtDecode<AccessTokenPayload>(token);

    if ('user_id' in decodedToken) {
        return decodedToken.user_id;
    }

    throw new UserIdNotPresentInToken();
};
