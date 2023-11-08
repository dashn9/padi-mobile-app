export class UserIdNotPresentInToken extends Error {
    constructor(message = 'The Identification Number of this user is not present in this token') {
        super(message);
        this.name = 'UserIdNotPresentInToken';
        Error.captureStackTrace(this, UserIdNotPresentInToken);
    }
}

export class UserNotAuthenticated extends Error {
    constructor(message = 'The User is not authenticated') {
        super(message);
        this.name = 'UserNotAuthenticated';
        Error.captureStackTrace(this, UserNotAuthenticated);
    }
}
