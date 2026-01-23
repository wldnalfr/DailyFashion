export const CartSchema = {
    name: 'Cart',
    properties: {
        id: 'int',
        productId: 'int',
        productName: 'string',
        imagePath: 'string',
        price: 'int',
        quantity: 'int',
        addedAt: 'date'
    },
    primaryKey: 'id'
}