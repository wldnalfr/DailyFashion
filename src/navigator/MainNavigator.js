import React, { useEffect, useState } from "react";
import realm from "../store/realm";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from "../screens/HomeScreen";
import AddProductScreen from "../screens/AddProductScreen";
import ShowProductScreen from "../screens/ShowProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import ImageZoomScreen from "../screens/ImageZoomScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/SignUpScreen";
import CartScreen from "../screens/CartScreen"; 

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Komponen gradient header yang dapat dikustomisasi
const CustomGradientHeader = ({ colors = ['#01f4c3', '#60efff'], start = {x: 0, y: 0}, end = {x: 1, y: 0} }) => {
    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={{ flex: 1 }}
        />
    );
};

// Gradient untuk drawer header
const CustomDrawerHeader = ({ colors = ['#01f4c3', '#60efff'], start = {x: 0, y: 0}, end = {x: 1, y: 0} }) => {
    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={{ flex: 1 }}
        />
    );
};

// Komponen custom untuk header left
const CustomHeaderLeft = () => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            style={{ padding: 10, marginLeft: 10 }}
        >
            <Icon name="menu" type="ionicons" color="#ffffffff" size={28} />
        </TouchableOpacity>
    );
};

// Komponen custom untuk header right (Cart Icon dengan badge)
const CustomHeaderRight = () => {
    const navigation = useNavigation();
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        // Load initial cart count
        const cartData = realm.objects('Cart');
        const updateCartCount = () => {
            const totalItems = Array.from(cartData).reduce((total, item) => total + item.quantity, 0);
            setCartItemCount(totalItems);
        };
        
        updateCartCount();
        
        // Setup listener untuk update real-time
        const subscription = cartData.addListener((collection, changes) => {
            updateCartCount();
        });
    }, []);

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            style={{ padding: 10, marginRight: 10, flexDirection: 'row', alignItems: 'center' }}
        >
            <Icon name="shopping-cart" type="material-icons" color="#ffffffff" size={24} />
            {cartItemCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

// Custom Drawer Content seperti Telegram
const CustomDrawerContent = (props) => {
    const { navigation } = props
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
                role: activeSession.role // <-- Tambahkan role
            });
        } else {
            setUserData(null);
        }
    };

    const handleLogout = () => {
    const activeSession = realm.objects('Session').filtered('isLoggedIn == true')[0];
    
    if (activeSession) {
        realm.write(() => {
            // Hapus cart saat logout
            const allCartItems = realm.objects('Cart');
            realm.delete(allCartItems);
            
            // SELALU hapus session saat logout, tidak peduli rememberMe
            // Ini untuk memastikan user harus login ulang
            realm.delete(activeSession);
            console.log('Session dihapus (logout)');
        });
    }
    
    navigation.replace("LoginScreen");
    };

    useEffect(() => {
        loadUserData()
    }, [])

    return (
        <DrawerContentScrollView 
            {...props}
            contentContainerStyle={styles.drawerContainer}
        >
            {/* Header Drawer dengan Gradient */}
            <View style={styles.drawerHeader}>
                <CustomDrawerHeader 
                    colors={['#01f4c3', '#60efff']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                />
                <View style={styles.drawerHeaderContent}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Icon 
                                name={userData.role === 'seller' ? "store" : "user-circle"} 
                                type={userData.role === 'seller' ? "material-community" : "font-awesome"} 
                                color="#01f4c3" 
                                size={32} 
                            />
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={styles.userStatus}>
                                {userData.fullname}
                            </Text>
                            <Text style={styles.userName}>
                                {userData.username} ({userData.role})
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
                <DrawerItemList {...props} />
            </View>

            {/* Footer Section */}
            <View style={styles.footerSection}>
                <TouchableOpacity
                    style={styles.footerItem}
                    onPress={handleLogout}
                >
                    <Icon name="logout" type="material-community" color="#ff0404ff" size={24} />
                    <Text style={styles.footerText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const DrawerNav = () => {
    const navigation = useNavigation();
    
    // Fungsi untuk mendapatkan role user saat ini
    const getUserRole = () => {
        const activeSession = realm.objects('Session').filtered('isLoggedIn == true')[0];
        return activeSession ? activeSession.role : 'buyer';
    };
    
    const currentRole = getUserRole();
    const isSeller = currentRole === 'seller';
    
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: '#ffffffff',
                headerLeft: () => <CustomHeaderLeft />,
                headerRight: () => <CustomHeaderRight />,
                drawerStyle: {
                    backgroundColor: '#ffffff',
                    width: 300,
                },
                drawerLabelStyle: {
                    color: '#000000',
                    fontSize: 16,
                    marginLeft: -16,
                },
                drawerActiveBackgroundColor: '#E8F4FD',
                drawerActiveTintColor: '#01f4c3',
                drawerInactiveTintColor: '#000000',
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'DailyFashion',
                    headerBackground: () => <CustomGradientHeader />,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: '#ffffffff',
                        fontFamily:'AlanSans-Medium',
                        fontSize: 18,
                    },
                    drawerIcon: ({focused, color, size}) => (
                        <Icon 
                            name="home" 
                            type="material-community" 
                            color={focused ? '#01f4c3' : '#666'} 
                            size={24} 
                        />
                    ),
                }}
            />
            
            {isSeller && (
                <Drawer.Screen
                    name="AddProduct"
                    component={AddProductScreen}
                    options={{
                        title: 'Add Product',
                        headerBackground: () => <CustomGradientHeader />,
                        headerTitleStyle: {
                            color: '#ffffffff',
                            fontFamily:"AlanSans-Medium",
                            fontSize: 18,
                        },
                        headerTitleAlign: 'center',
                        drawerIcon: ({focused}) => (
                            <Icon 
                                name="plus-box" 
                                type="material-community" 
                                color={focused ? '#01f4c3' : '#666'} 
                                size={24} 
                            />
                        ),
                    }}
                />
            )}
            
            <Drawer.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    title: 'Shopping Cart',
                    headerBackground: () => <CustomGradientHeader />,
                    headerTitleStyle: {
                        color: '#ffffffff',
                        fontFamily:"AlanSans-Medium",
                        fontSize: 18,
                    },
                    headerTitleAlign: 'center',
                    drawerIcon: ({focused, color, size}) => (
                        <Icon 
                            name="cart" 
                            type="material-community" 
                            color={focused ? '#01f4c3' : '#666'} 
                            size={24} 
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="SplashScreen"
                screenOptions={{
                    headerTintColor: '#ffffffff'
                }}
            >
                <Stack.Screen
                    name="Drawer"
                    component={DrawerNav}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="ShowProduct"
                    component={ShowProductScreen}
                    options={{
                        title: "Product",
                        headerTitleAlign: 'center',
                        headerBackground: () => <CustomGradientHeader />,
                        headerTitleStyle: {
                            color: '#ffffffff',
                            fontFamily: 'AlanSans-Medium'
                        },
                    }}
                />
                <Stack.Screen
                    name="ImageZoomScreen"
                    component={ImageZoomScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="EditProduct"
                    component={EditProductScreen}
                    options={{
                        title: 'Edit Product',
                        headerTitleAlign: 'center',
                        headerBackground: () => <CustomGradientHeader />,
                        headerTitleStyle: {
                            color: '#ffffffff',
                            fontFamily: 'AlanSans-Medium'
                        },
                    }}
                />
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{
                        headerShown: false
                    }}
                />
                {/* Tambahkan CartScreen di Stack Navigator juga jika perlu */}
                <Stack.Screen
                    name="CartScreen"
                    component={CartScreen}
                    options={{
                        title: 'Shopping Cart',
                        headerTitleAlign: 'center',
                        headerBackground: () => <CustomGradientHeader />,
                        headerTitleStyle: {
                            color: '#ffffffff',
                            fontFamily: 'AlanSans-Medium'
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

// Styles untuk custom drawer dan badge
const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingTop: 0,
    },
    drawerHeader: {
        height: 140,
        position: 'relative',
        overflow: 'hidden',
    },
    drawerHeaderContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        paddingTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    Role: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    qrButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    menuSection: {
        flex: 1,
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuIcon: {
        width: 24,
        marginRight: 32,
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        color: '#000',
    },
    footerSection: {
        borderTopWidth: 0.5,
        borderTopColor: '#a8a8a8ff',
        paddingVertical: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#ff0000ff',
        marginLeft: 5,
        fontWeight: '500',
    },
    // ... semua style sebelumnya tetap sama
    
    // Tambahkan style untuk badge
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'AlanSans-Bold',
    },
    
    // ... style lainnya tetap sama
});

export default MainNavigator;