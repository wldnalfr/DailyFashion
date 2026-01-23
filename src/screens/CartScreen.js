import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
} from 'react-native';
import realm from '../store/realm';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen-hooks";
import LinearGradient from 'react-native-linear-gradient';

const GradientBorderItem = ({ children }) => {
    return (
        <View style={styles.gradientBoxShadow}>
            <LinearGradient
                colors={['#0061ff', '#01f4c3']}
                start={{x: 0.35, y: 0.98}}
                end={{x: 0.65, y: 0.02}}
                style={styles.gradientItemBorder}
            >
                <View style={styles.itemInner}>
                    {children}
                </View>
            </LinearGradient>
        </View>
    );
};
const GradientButton = ({ 
    children, 
    onPress, 
    style,
    colors = ['#01f4c3', '#60efff'],
    borderRadius = 10, 
    start = {x: 0.35, y: 0.98},
    end = {x: 0.65, y: 0.02}
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <LinearGradient
                colors={colors}
                start={start}
                end={end}
                style={[
                    styles.gradientButton,
                    { borderRadius }
                ]}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCartItems();
        const cartData = realm.objects('Cart');
        const subscription = cartData.addListener((collection, changes) => {
            loadCartItems();
        });
        return () => {
            subscription.remove();  
    };
}, []);

    const loadCartItems = () => {
        const cartData = realm.objects('Cart');
        setCartItems(Array.from(cartData));
    };

    const removeFromCart = (itemId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: () => {
                        realm.write(() => {
                            const itemToDelete = realm.objects('Cart').filtered(`id = ${itemId}`)[0];
                            if (itemToDelete) {
                                realm.delete(itemToDelete);
                            }
                        });
                    }
                }
            ]
        );
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }

        realm.write(() => {
            const item = realm.objects('Cart').filtered(`id = ${itemId}`)[0];
            if (item) {
                item.quantity = newQuantity;
            }
        });
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const clearCart = () => {
        if (cartItems.length === 0) return;
        
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear all items from cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear All', 
                    style: 'destructive',
                    onPress: () => {
                        realm.write(() => {
                            const allCartItems = realm.objects('Cart');
                            realm.delete(allCartItems);
                        });
                    }
                }
            ]
        );
    };

    const checkout = () => {
        if (cartItems.length === 0) {
            Alert.alert('Cart Empty', 'Please add items to cart before checkout');
            return;
        }

        Alert.alert(
            'Checkout',
            `Total: Rp ${getTotalPrice()}\n\nProceed with checkout?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Checkout', 
                    onPress: () => {
                        Alert.alert(
                            'Success', 
                            'Thank you for your purchase! Our seller will contact you soon.',
                            [
                                { 
                                    text: 'OK', 
                                    onPress: () => {
                                        // Clear cart after successful checkout
                                        realm.write(() => {
                                            const allCartItems = realm.objects('Cart');
                                            realm.delete(allCartItems);
                                        });
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const renderCartItem = ({ item }) => (
        <GradientBorderItem>
            <View style={styles.cartItem}>
                <Image 
                    source={{ uri: item.imagePath }} 
                    style={styles.productImage} 
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.productName}
                    </Text>
                    <Text style={styles.productPrice}>Rp {item.price.toLocaleString()}</Text>
                    
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            <Icon name="remove" size={20} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Icon name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.itemTotalContainer}>
                    <Text style={styles.itemTotalPrice}>
                        Rp {(item.price * item.quantity).toLocaleString()}
                    </Text>
                    <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.id)}
                    >
                        <Icon name="trash-can-outline" type="material-community" color="#ff3b30" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBorderItem>
    );

    return (
        <View style={styles.container}>
            {cartItems.length > 0 ? (
                <>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>
                            Total Items: {getTotalItems()}
                        </Text>
                        <Text style={styles.totalPrice}>
                            Total: Rp {getTotalPrice().toLocaleString()}
                        </Text>
                    </View>

                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={[styles.footerButton, styles.clearButton]}
                            onPress={clearCart}
                        >
                            <Text style={styles.clearButtonText}>Clear Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.footerButton, styles.checkoutButton]}
                            onPress={checkout}
                        >
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyCart}>
                    <Icon 
                        name="cart-outline" 
                        type="material-community" 
                        size={80} 
                        color="#ccc" 
                    />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Text style={styles.emptyCartSubText}>
                        Add some products to get started!
                    </Text>
                    <GradientButton
                        onPress={() => navigation.navigate('Home')}
                        style={{ marginVertical: 10 }}
                    >
                        <Text style={styles.shopButtonText}>Continue Shopping</Text>
                    </GradientButton>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    gradientButton: {
        width: 160,
        height: 55,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    summaryText: {
        fontSize: hp('1.8%'),
        color: '#666',
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: hp('2.4%'),
        fontFamily: 'AlanSans-Bold',
        color: '#666'
    },
    flatListContent: {
        padding: 8,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    productImage: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        fontSize: hp('2%'),
        fontFamily: 'AlanSans-Medium',
        color: 'black',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: hp('1.8%'),
        fontFamily: 'AlanSans-Medium',
        marginBottom: 8,
        color: 'black'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#0061ff',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: hp('2%'),
        fontFamily: 'AlanSans-Medium',
        minWidth: 20,
        textAlign: 'center',
        color: 'black'
    },
    itemTotalContainer: {
        alignItems: 'flex-end',
    },
    itemTotalPrice: {
        fontSize: hp('1.8%'),
        fontFamily: 'AlanSans-Bold',
        color: 'black',
        marginBottom: 8,
    },
    removeButton: {
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        backgroundColor: 'white',
    },
    footerButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    clearButton: {
        backgroundColor: '#6c757d',
    },
    checkoutButton: {
        backgroundColor: '#0061ff',
    },
    clearButtonText: {
        color: 'white',
        fontFamily: 'AlanSans-Medium',
        fontSize: hp('1.8%'),
    },
    checkoutButtonText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('1.8%'),
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyCartText: {
        fontSize: hp('2.4%'),
        fontFamily: 'AlanSans-Medium',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyCartSubText: {
        fontSize: hp('1.8%'),
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#0061ff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('2%'),
    },
    gradientBoxShadow: {
        flex: 1,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    gradientItemBorder: {
        padding: 2,
        borderRadius: 12,
    },
    itemInner: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
    },
});

export default CartScreen;