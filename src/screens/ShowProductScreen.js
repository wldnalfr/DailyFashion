import React, { useState, useEffect} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Linking, Alert } from "react-native"; 
import realm from "../store/realm";
import { Icon, CheckBox } from "react-native-elements";
import { MediaComponent } from "../component/MediaComponent";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen-hooks"
import LinearGradient from 'react-native-linear-gradient';

const GradientBorderBox = ({ children, onClose }) => {
    return (
        <LinearGradient
            colors={['#0061ff', '#01f4c3']}
            start={{x: 0.35, y: 0.98}}
            end={{x: 0.65, y: 0.02}}
            style={styles.gradientBorder}
        >
            <View style={styles.boxInner}>
                <GradientBorderButton onPress={onClose} style={styles.closeButton}>
                    <Icon
                        name="close"
                        type="antdesign"
                        size={18}
                        color="#333"
                    />
                </GradientBorderButton>
                {children}
            </View>
        </LinearGradient>
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
const GradientButton2 = ({ 
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
                    styles.gradientButton2,
                    { borderRadius } 
                ]}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const GradientBorderButton = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.gradientButtonContainer, style]}>
            <LinearGradient
                colors={['#0061ff', '#01f4c3']}
                start={{x: 0.35, y: 0.98}}
                end={{x: 0.65, y: 0.02}}
                style={styles.gradientButtonBorder}
            >
                <View style={styles.buttonInner}>
                    {children}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const GradientBorderItem = ({ children, onPress, onLongPress }) => {
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.gradientBoxShadow}>
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
        </TouchableOpacity>
    );
};

export default ShowProductScreen = (props) => {
    const { navigation, route } = props
    const category = route.params.categoryid

    const [Data, setData] = useState([])
    const [isCart, setIsCart] = useState(false) 
    const [isBuy, setIsBuy] = useState(false)
    const [isDesc, setIsDesc] = useState(false)
    const [isRemove, setIsRemove] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null) 
    const [contact, setContact] = useState({
        phoneNumber: '',
        instagram: '',
        facebook: ''
    })
    const [isDetail, setIsDetail] = useState({
        description: '',
        productName: '',
        price: '',
        imagePath: ''
    })
    const [userData, setUserData] = useState({
        username: '',
        fullname: '',
        userId: ''
    })

    const loadUserData = () => {
        const activeSession = realm.objects('Session').filtered('isLoggedIn == true')[0];
        
        if (activeSession) {
            setUserData({
                username: activeSession.username,
                fullname: activeSession.fullname,
                userId: activeSession.userId,
                role: activeSession.role
            });
        } else {
            setUserData(null);
        }
    };

    const CollectData = () => {
        const allData = realm.objects('Product').filtered(`category = ${category}`)
        const newData = allData.map((item) => {
            item.checkedStatus = false;
            return item;
        })
        setData(newData)
        console.log(newData)
    } 

    const setCheckbox = (id, status) => {
        const newData = Data.map((item) => {
            if (item.id == id) {
                item.checkedStatus = !status;
            }
            return item;
        })
        setData(newData)
        console.log(newData)
    }

    const onCancel = () => {
        const newData = Data.map((item) => {
            item.checkedStatus = false;
            return item;
        })
        setData(newData)
        console.log(newData)
        setIsRemove(false)
    }

    const onDelete = () => {
        const checkedTrue = Data.filter(item => item.checkedStatus).map(item => item.id)
        if (checkedTrue.length > 0) {
            realm.write(() => {
                checkedTrue.forEach(id => {
                const deleteData = realm.objects('Product').filtered(`id = ${id}`)
                const cartItemsToDelete = realm.objects('Cart').filtered(`productId = ${id}`)
                realm.delete(deleteData);
                realm.delete(cartItemsToDelete);
                })
            })
            alert('Successfully remove the product!')
            setIsRemove(false)
            const newData = realm.objects('Product').filtered(`category = ${category}`)
            setData(newData)
            console.log(newData)    
        } else {
            alert('Nothing to remove!')
        }
    }

    const DetailInfo = (desc, prodname, price, prodimg) => {
        setIsDetail({
            description: desc,
            productName: prodname,
            price: price,
            imagePath: prodimg,
        })
        setIsDesc(true)
    }

    const AddToCart = (product) => {
        setSelectedProduct(product);
        setContact({
            phoneNumber: product.phoneNumber,
            instagram: product.instagram,
            facebook: product.facebook
        })
        setIsCart(true);
    }

    const confirmAddToCart = () => {
        if (!selectedProduct) return;

        try {
            realm.write(() => {
                const existingCartItem = realm.objects('Cart').filtered(`productId = ${selectedProduct.id}`)[0];
                
                if (existingCartItem) {
                    existingCartItem.quantity += 1;
                    Alert.alert('Success', `Updated quantity for ${selectedProduct.productName} in cart!`);
                } else {
                    const maxId = realm.objects('Cart').max('id') || 0;
                    realm.create('Cart', {
                        id: maxId + 1,
                        productId: selectedProduct.id,
                        productName: selectedProduct.productName,
                        imagePath: selectedProduct.imagePath,
                        price: selectedProduct.price,
                        quantity: 1,
                        addedAt: new Date()
                    });
                    Alert.alert('Success', `${selectedProduct.productName} added to cart!`);
                }
            });
            setIsCart(false);
            setSelectedProduct(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to add product to cart');
        }
    }

    const buyNow = () => {
        if (!selectedProduct) return;
        
        setContact({
            phoneNumber: selectedProduct.phoneNumber,
            instagram: selectedProduct.instagram,
            facebook: selectedProduct.facebook
        })
        setIsCart(false);
        setIsBuy(true);
    }

    const onClickMedia = (type) => {
        if (type === 'instagram') {
            Linking.openURL(`https://www.instagram.com/${contact.instagram}`)
        } else if (type === 'whatsapp') {
            Linking.openURL(`https://wa.me/${contact.phoneNumber}`)
        } else if (type === 'facebook') {
            Linking.openURL(`https://m.me/${contact.facebook}`)
        }
    }

    useEffect(() => {
        const ProductPage = navigation.addListener('focus', () => {
            CollectData()
            loadUserData()
        })
        return ProductPage
    }, [])

    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={Data}
                contentContainerStyle={styles.flatlistContainer}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={{
                        alignItems: 'center',
                        margin: 8
                    }}>
                        <Text style={{
                            color: '#a3a3a3ff',
                            fontFamily: 'AlanSans-Medium'
                        }}>
                            No Items
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    return (
                            <GradientBorderItem
                            onPress={() => {
                                if (userData.role == "seller") {
                                    navigation.navigate('EditProduct', { idProduct: item.id })
                                } else {
                                    DetailInfo(item.description, item.productName, item.price, item.imagePath)
                                }
                            }}
                                onLongPress={() => setIsRemove(true)}
                            >
                                <View style={styles.productContainer}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ImageZoomScreen', {imagePath: item.imagePath})}>
                                        <Image
                                            style={styles.image}
                                            source={{ uri:item.imagePath }}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.textContainer}>
                                        <TouchableOpacity onPress={() => DetailInfo(item.description, item.productName, item.price, item.imagePath)}>
                                            <Text style={styles.title}>
                                                {item.productName}
                                            </Text>                                    
                                            <Text style={styles.text}>  
                                                {item.description}
                                            </Text>                                    
                                            <Text style={styles.textInfo}>
                                                <Text style={styles.priceRp}>Rp</Text> {item.price.toLocaleString()}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    isRemove ?
                                        <CheckBox
                                            size={30}
                                            containerStyle={styles.checkBox}
                                            onPress={() => setCheckbox(item.id, item.checkedStatus)}
                                            checked={item.checkedStatus}
                                        />    
                                        :
                                        <TouchableOpacity
                                            style={styles.cartContainer}
                                            onPress={() => AddToCart(item)} 
                                        >
                                            <Icon
                                                name="shoppingcart"
                                                size={30}
                                                type="antdesign"
                                                style={styles.iconCart}
                                            />
                                        </TouchableOpacity>
                                }
                            </GradientBorderItem>
                    )
                }}
            />

            {isCart && selectedProduct && (
                <View style={styles.modalContainer}>
                    <GradientBorderBox onClose={() => setIsCart(false)}>
                        <View style={styles.centering}>
                            <Text style={[styles.sellerText, styles.title]}>
                                Add to Cart
                            </Text>
                        </View>
                        <View style={styles.cartModalContent}>
                            <Image
                                style={styles.cartProductImage}
                                source={{ uri: selectedProduct.imagePath }}
                            />
                            <View style={styles.cartProductInfo}>
                                <Text style={styles.cartProductName}>
                                    {selectedProduct.productName}
                                </Text>
                                <Text style={styles.cartProductPrice}>
                                    Rp {selectedProduct.price.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cartButtonContainer}>
                            <GradientButton
                                onPress={buyNow}
                                colors={['#8115EE', '#9400d3']}
                                borderRadius={10}
                                style={{ marginVertical: 10, }}
                            >
                                <Text style={styles.buyNowText}>Buy Now</Text>
                            </GradientButton>
                            <GradientButton
                                onPress={confirmAddToCart}
                                colors={['#74d1ffff', '#499effff']}
                                style={{ marginVertical: 10 }}
                            >
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </GradientButton>
                        </View>
                    </GradientBorderBox>
                </View>
            )}
            {
                isBuy ? 
                    <View style={styles.modalContainer}>
                        <GradientBorderBox onClose={() => setIsBuy(false)}>
                            <View style={styles.centering}>
                                <Text style={[
                                    styles.sellerText,
                                    styles.title
                                ]}>
                                    Seller Contact
                                </Text>
                            </View>
                            <View style={styles.container}>
                                {
                                    contact.phoneNumber !== '' ? 
                                        <MediaComponent
                                            source={require('../../assets/image/whatsapp.png')}
                                            value={contact.phoneNumber}
                                            onPress={() => onClickMedia('whatsapp')}
                                        />
                                        :
                                        null
                                }
                                {
                                    contact.instagram !== '' ?
                                        <MediaComponent
                                            source={require('../../assets/image/instagram.png')}
                                            value={contact.instagram}
                                            onPress={() => onClickMedia('instagram')}
                                        />
                                        : 
                                        null
                                }
                                {
                                    contact.facebook !== '' ?
                                        <MediaComponent
                                            source={require('../../assets/image/facebook(1).png')}
                                            value={contact.facebook}
                                            onPress={() => onClickMedia('facebook')}
                                        />
                                        : 
                                        null
                                }
                            </View>
                        </GradientBorderBox>
                    </View>
                    :
                    null
            }
            {
                isDesc ? 
                    <View style={styles.modalContainer}>
                        <GradientBorderBox onClose={() => setIsDesc(false)}>
                            <View style={styles.centering}>
                                <Text style={[
                                    styles.sellerText,
                                    styles.title
                                ]}>
                                   Product Detail Information
                                </Text>
                            </View>
                            <View style={styles.container2}>
                                <View style={styles.wrap}>
                                    <Text style={styles.title2}>
                                        Product Image:
                                    </Text>
                                    <View style={styles.centering2}>
                                        <Image
                                        style={styles.image2}
                                        source={{ uri: isDetail.imagePath }}
                                    />
                                    </View>
                                </View>
                                <View style={styles.wrap}>
                                    <Text style={styles.title2}>
                                        Product Name:
                                    </Text>
                                    <Text style={styles.textDetail}>
                                        {isDetail.productName}
                                    </Text>
                                </View>
                                <View style={styles.wrap}>
                                    <Text style={styles.title2}>
                                        Product Description:
                                    </Text>
                                    <Text style={styles.textDetail}>
                                        {isDetail.description}
                                    </Text>
                                </View>
                                <View style={styles.wrap}>
                                    <Text style={styles.title2}>
                                        Product Price:
                                    </Text>
                                    <Text style={styles.textDetail}>
                                        <Text style={styles.priceRp}>Rp</Text> {isDetail.price.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        </GradientBorderBox>
                    </View>
                    :
                    null
            }
            {
                isRemove ? 
                    <View style={styles.buttonContainer}>
                        <GradientButton2
                            onPress={() => onDelete()}
                            colors={['#ff0000', '#fd2290ff']}
                            borderRadius={0}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </GradientButton2>
                        <GradientButton2
                            onPress={() => onCancel()}
                            colors={['#1aff00ff', '#8dff0cff']}
                            borderRadius={0}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </GradientButton2>
                    </View>
                    :
                    null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        height: hp('7.9%')
    },
    cartContainer: {
        position: 'relative',
        top: 37,
        left: 3
    },
    gradientButton: {
        width: 150,
        height: 55,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientButton2: {
        width: 200,
        height: 60,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    wrap: {
        marginBottom: 10
    },
    checkBox: {
        position: 'absolute',
        right: 0
    },
    flatlistContainer: {
        padding: 8,
    },
    container: {
        marginTop: 0
    },
    container2: {
        marginTop: 5,
        width: '100%'
    },
    image: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius:7
    },  
    image2: {
        width: wp('35%'),
        height: wp('35%'),
        borderRadius: 7,
    },  
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    deleteText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('2.7%'),
    },
    cancelText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('2.7%'),
    },
    title: {
        color: 'black',
        fontSize: hp('2.4%'),
        fontFamily:"AlanSans-Medium",
        maxHeight:26        
    },
    title2: {
        color: 'black',
        fontSize: hp('2.3%'),
        fontFamily:"AlanSans-Medium"
    },
    textInfo: {
        color: 'black',
        marginTop: 15,
        fontSize: 12,
        fontFamily:"AlanSans-Light"
    },
    textDetail: {   
        color: 'black',
        marginTop: 2,
        fontSize: 14,
        fontFamily:"AlanSans-Light"
    },
    text: {
        color: 'black',
        fontSize: hp('2%'),
        height: 40,
        width: 180,
        fontFamily:"AlanSans-Light"
    },
    modalContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        position:'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradientBorder: {
        width: '85%',
        padding: 2,
        borderRadius: 13,
    },
    boxInner: {
        width: '100%',
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 10,
        alignItems: 'flex-start',
        position: 'relative',
    },
    gradientButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    gradientButtonBorder: {
        padding: 2,
        borderRadius: 8,
    },
    buttonInner: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 24,
        minHeight: 24,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    sellerText: {
        marginBottom: 8,
        marginTop: 6,
    },
    centering: {
        width:"100%",
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    centering2: {
        width:"100%",
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    // Styles baru untuk modal cart
    cartModalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        marginHorizontal: 5,
        width: '100%',
    },
    cartProductImage: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: 8,
        marginRight: 12,
    },
    cartProductInfo: {
        flex: 1,
    },
    cartProductName: {
        fontSize: hp('2.2%'),
        fontFamily: 'AlanSans-Medium',
        color: 'black',
        marginBottom: 4,
    },
    cartProductPrice: {
        fontSize: hp('2%'),
        fontFamily: 'AlanSans-Medium',
        color: 'black',
    },
    cartButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cartButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    buyNowButton: {
        backgroundColor: '#0061ff',
    },
    addToCartButton: {
        backgroundColor: '#01f4c3',
    },
    buyNowText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('2%'),
    },
    addToCartText: {
        color: 'white',
        fontFamily: 'AlanSans-Bold',
        fontSize: hp('2%'),
    },
})