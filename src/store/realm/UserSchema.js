export const UserSchema = {
    name: 'User',
    properties: {
        id: 'int',
        username: 'string',
        fullname: 'string',
        password: 'string',
        createdAt: 'date',
        role: 'string'
    },
    primaryKey: 'id'
}