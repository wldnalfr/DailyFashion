export const SessionSchema = {
    name: 'Session',
    primaryKey: 'id',
    properties: {
        id: 'string',
        userId: 'string',
        username: 'string',
        fullname: 'string',
        email: 'string',
        isLoggedIn: 'bool',
        loginTime: 'date',
        rememberMe: 'bool',
        role: 'string'
    }
};