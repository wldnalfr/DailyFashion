import React, { useEffect } from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import realm from "../store/realm";

export default SplashScreen = (props) => {
    const { navigation } = props;
    
    useEffect(() => {
    const initializeApp = () => {
        const activeSession = realm.objects('Session').filtered('isLoggedIn == true AND rememberMe == true')[0];
        
        if (activeSession) {
            console.log('User sudah login dengan remember me, redirect ke Home');
            navigation.replace('Drawer');
        } else {
            const hasUsers = realm.objects('User').length > 0;
            const hasProducts = realm.objects('Product').length > 0;
            
            if (!hasUsers) createDefaultUser();
            if (!hasProducts) createDefaultProducts();
        
            setTimeout(() => {
                navigation.replace('LoginScreen');
            }, 2000);
        }
    };
    
    initializeApp();
}, []);

    const createDefaultUser = () => {
        try {
            realm.write(() => {
                realm.create('User', {
                    id: 1,
                    username: 'User1',
                    password: 'User123',
                    fullname: 'User Dummy',
                    email: 'User_dummy@mail.com',
                    phone: '08123456789',
                    createdAt: new Date(),
                    role: 'seller'
                });
                console.log('User demo: demo/demo123');
            });
        } catch (error) {
            console.log('Error creating user:', error);
        }
    };

    const createDefaultProducts = () => {
        try {
            realm.write(() => {
                const products = [
                    {
                        id: 1, 
                        productName: 'Black T-Shirt',
                        imagePath: 'https://suuupply.com/cdn/shop/files/proclub-manches-courtes-heavyweight-noir.jpg?v=1734430309&width=1946',
                        category: 1,
                        description: 'Comfortable cotton t-shirt',
                        price: 299000,
                        instagram: '@ShirtAtShop',
                        facebook: 'ShirtAtShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 2,
                        productName: 'Running Shoes',
                        imagePath: 'https://contents.mediadecathlon.com/p2606751/k$5211ddac45b25d0224e88eb6ddac9ff3/sepatu-jogging-pria-run-active-biru-tua-kalenji-8559090.jpg?f=1920x0&format=auto',
                        category: 2,
                        description: 'Sports running shoes',
                        price: 799000,
                        instagram: '@SportsShoeShop',
                        facebook: 'SportsShoesShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 3,
                        productName: 'Apple Watch',
                        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt_eeBcrdpQfGtM-PdlGk2tZnzvFGjmpKo2w&s',
                        category: 3,
                        description: 'Apple smart watch',
                        price: 1999000,
                        instagram: '@AppleShop',
                        facebook: 'AppleShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 4,
                        productName: 'Khaki Pants',
                        imagePath: 'https://www.1620usa.com/cdn/shop/files/Shop-Khaki_2000x.jpg?v=1739805263',
                        category: 4,
                        description: 'Casual pants',
                        price: 499000,
                        instagram: '@PantsShop',
                        facebook: 'Shop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 5,
                        productName: 'Cotton Hoodie',
                        imagePath: 'https://www.screamous.com/cdn/shop/files/id-11134207-7r98z-lzu7cpa4lt0off_14c42e14-4e63-4350-ada6-0a3285fc5a88_grande.jpg?v=1726114460',
                        category: 5,
                        description: 'Warm hoodie',
                        price: 599000,
                        instagram: '@WillShop',
                        facebook: 'WillShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 6,
                        productName: 'Baseball Cap',
                        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4KS4ATvJMlCQJ2TK24v91WbuGyKAU2h9IDw&s',
                        category: 6,
                        description: 'Adjustable cap',
                        price: 129000,
                        instagram: '@BBShop',
                        facebook: 'BBShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 7,
                        productName: 'Sunglasses',
                        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSORdO1_wy18Ss6JJGfzzaYoL1v3_-BB0UwXw&s',
                        category: 7,
                        description: 'UV protection',
                        price: 209000,
                        instagram: '@SunEyesShop',
                        facebook: 'SunEyesShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 8,
                        productName: 'Leather Backpack',
                        imagePath: 'https://www.tumi.co.id/dw/image/v2/AAWQ_PRD/on/demandware.static/-/Sites-Tumi/default/dwe8265fec/images/tu-150210/hi-res/150210_1041_hi-res_main_1.jpg?sw=750&sh=911',
                        category: 8,
                        description: 'Premium backpack',
                        price: 299000,
                        instagram: '@CasualShop',
                        facebook: 'CasualShop',
                        phoneNumber: '08123456789'
                    },
                    {
                        id: 9,
                        productName: 'Cute Patrick Sticker',
                        imagePath: 'https://www.calendarclub.ca/cdn/shop/files/67781DCE-E10F-459C-B287-411B3293E7C5.jpg?v=1728043523',
                        category: 9,
                        description: 'Sticker of Patrick',
                        price: 9000,
                        instagram: '@StickerShop',
                        facebook: 'StickerShop',
                        phoneNumber: '08123456789'
                    }
                ];
                products.forEach(product => {
                    realm.create('Product', product);
                });
                
                console.log('9 products created for all categories!');
            });
        } catch (error) {
            console.log('Error creating products:', error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <ImageBackground
                style={styles.imageBackground}
                source={require('../../assets/image/splash.png')}
            >
                <Image
                    style={styles.image}
                    source={require('../../assets/image/splash-text.png')}
                />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '150%',
        resizeMode: 'contain'
    },
})