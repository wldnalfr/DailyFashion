import Realm from 'realm'
import { ProductSchema } from './ProductSchema'
import { UserSchema } from './UserSchema'
import { CartSchema } from './CartSchema'
import { SessionSchema } from './SessionSchema'

const realm = new Realm({
    schema: [ProductSchema, UserSchema, CartSchema, SessionSchema],
    schemaVersion: 7
})

export default realm