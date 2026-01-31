import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from "react-native";
import ImagePicker from 'react-native-image-crop-picker'
import { InputComponent } from "../component/InputComponent";
import SelectDropdown from 'react-native-select-dropdown'
import LinearGradient from "react-native-linear-gradient";
import { categoryList } from "../data/Data";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen-hooks"
import realm from "../store/realm";

const GradientButton = ({ children, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <LinearGradient
                colors={['#01f4c3', '#60efff']}
                start={{x: 0.35, y: 0.98}}
                end={{x: 0.65, y: 0.02}}
                style={styles.gradientButton}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const GradientImageButton = ({ children, onPress, style, hasImage }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style}>
            <LinearGradient
                colors={hasImage ? ['transparent', 'transparent'] : ['#01f4c3', '#60efff']}
                start={{x: 0.35, y: 0.98}}
                end={{x: 0.65, y: 0.02}}
                style={[
                    styles.gradientImageButton,
                    hasImage && styles.gradientImageButtonWithImage
                ]}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default EditProductScreen = (props) => {
    const { navigation, route } = props;
    const idProduct = route.params.idProduct;
    const dropdownRef = useRef({})

    const [productData, setProductData] = useState({
        productName: "",
        imagePath: "",
        category: null,
        description: "",
        price: null,
        instagram: "",
        facebook: "",
        phoneNumber: "",
    })

    const onInputChange = (type, value) => {
        setProductData({
            ...productData,
            [type]: value
        })
    }

    const addImage = () => {
        ImagePicker.openPicker({
            width: 2000,
            height: 2000,
            cropping: true
        }).then(image => {
            console.log(image)
            setProductData({
                ...productData,
                imagePath: image.path
            })
        }).catch(errorMessage => {
            console.log(errorMessage);
        })
    }

    const saveData = () => {
        if (productData.productName === '' ||
            productData.imagePath === '' ||
            productData.description === '' ||
            productData.price === '' ||
            productData.category == null
        ) {
            alert('Please fill all your product information!')
        } else if (
            productData.phoneNumber === '' &&
            productData.instagram === '' &&
            productData.facebook === ''
        ) {
            alert('Please fill at least one seller contact!')
        } else {
            const updateData = realm.objects('Product').filtered(`id = ${idProduct}`)[0]
            
            const hasChanges = 
                productData.productName !== updateData.productName ||
                productData.imagePath !== updateData.imagePath ||
                productData.description !== updateData.description ||
                productData.price !== String(updateData.price) ||
                productData.category !== updateData.category ||
                productData.instagram !== updateData.instagram ||
                productData.facebook !== updateData.facebook ||
                productData.phoneNumber !== updateData.phoneNumber;

            if (!hasChanges) {
                alert('Nothing to update!')
            } else {
                realm.write(() => {
                    updateData.productName = productData.productName;
                    updateData.imagePath = productData.imagePath;
                    updateData.category = productData.category;
                    updateData.description = productData.description;
                    updateData.price = parseInt(productData.price);
                    updateData.instagram = productData.instagram;
                    updateData.facebook = productData.facebook;
                    updateData.phoneNumber = productData.phoneNumber;
                })
                Alert.alert(
                    "Success",
                    "Successfully update your product information!",
                    [{
                        text: "OK", onPress: () => navigation.goBack()
                    }]
                )
            }
        }
    }

    useEffect(() => {
        const data = realm.objects('Product').filtered(`id = ${idProduct}`)[0]
        setProductData({
            productName: data.productName,
            imagePath: data.imagePath,
            category: data.category,
            description: data.description,
            price: String(data.price),
            instagram: data.instagram,
            facebook: data.facebook,
            phoneNumber: data.phoneNumber,
        })
    }, [idProduct])

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.imageContainer}>
                    <GradientImageButton
                        style={styles.imageButtonContainer}
                        onPress={() => addImage()}
                        hasImage={productData.imagePath !== ''}
                    >
                        <Image
                            style={{
                                width: productData.imagePath !== '' ? wp('50%') : 50,
                                height: productData.imagePath !== '' ? wp('50%') : 50,
                                borderRadius: 10
                            }}
                            source={{
                                uri: productData.imagePath !== '' ? productData.imagePath :
                                    'https://www.geosamples.org/wp-content/uploads/2021/06/photography-icon-300x241.png'
                            }}
                        />
                        {productData.imagePath === '' && (
                            <Text style={styles.addImageText}>Add Image</Text>
                        )}
                    </GradientImageButton>
                </View>
                <View style={styles.horizontalContainer}>
                    <InputComponent
                        placeholder='Product Name'
                        value={productData.productName}
                        onChangeText={(text) => onInputChange('productName', text)}
                    />
                    <View style={styles.selectContainer}>
                        <LinearGradient
                            colors={['#0061ff', '#01f4c3']}
                            start={{x: 0.35, y: 0.98}}
                            end={{x: 0.65, y: 0.02}}
                            style={styles.gradientSelectBorder}
                        >
                            <SelectDropdown
                                data={categoryList}
                                defaultValueByIndex={productData.category - 1}
                                defaultButtonText="Select Category"
                                onSelect={(item) => onInputChange('category', item.id)}
                                buttonTextAfterSelection={(item) => { return item.name }}
                                rowTextForSelection={(item) => { return item.name }}
                                buttonStyle={styles.selectDropdown}
                                buttonTextStyle={styles.selectText}
                                ref={dropdownRef}
                            />
                        </LinearGradient>
                    </View>
                </View>
                <View style={styles.horizontalContainer}>
                    <InputComponent
                        placeholder='Description'
                        value={productData.description}
                        onChangeText={(text) => onInputChange('description', text)}
                        isDescription={true}
                    />
                    <InputComponent
                        placeholder='Price'
                        value={productData.price}
                        onChangeText={(text) => onInputChange('price', text)}
                        isIcon={true}
                        name='dollar'
                        type='font-awesome'
                        keyboardType='numeric'
                    />
                </View>
                <Text style={styles.sellerText}>
                    Seller Contact
                </Text>
                <InputComponent
                    placeholder='Whatsapp number (ex : +1234567890)'
                    value={productData.phoneNumber}
                    onChangeText={(text) => onInputChange('phoneNumber', text)}
                    isIcon={true}
                    name='whatsapp'
                    type='font-awesome'
                />
                <InputComponent
                    placeholder='Instagram username (ex : timedooracademy)'
                    value={productData.instagram}
                    onChangeText={(text) => onInputChange('instagram', text)}
                    isIcon={true}
                    name='instagram'
                    type='font-awesome'
                />
                <InputComponent
                    placeholder='Facebook username (ex : timedooracademy)'
                    value={productData.facebook}
                    onChangeText={(text) => onInputChange('facebook', text)}
                    isIcon={true}
                    name='facebook'
                    type='font-awesome'
                /> 
                <View style={styles.buttonContainer}>
                    <GradientButton
                        style={styles.saveButton}
                        onPress={() => saveData()}
                    >
                        <Text style={styles.saveText}>
                            UPDATE
                        </Text>
                    </GradientButton>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    scroll: {
        margin: 8,
        paddingBottom: 8,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    imageButtonContainer: {
        width: wp('50%'),
        height: wp('50%'),
        borderRadius: 10,
        elevation: 4,
    },
    gradientImageButton: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    gradientImageButtonWithImage: {
        borderWidth: 2,
        borderColor: '#0061ff',
    },
    addImageText: {
        color: 'white',
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: hp('1.8%'),
        fontFamily: "AlanSans-Medium"
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    sellerText: {
        fontSize: hp('2.5%'),
        marginTop: 16,
        marginBottom: 0,
        marginLeft: 8,
        color: 'black',
        fontFamily: "AlanSans-Medium"
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    gradientButton: {
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        marginTop: 16,
        elevation: 4,
    },
    saveText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: "AlanSans-Medium"
    },
    selectContainer: {
        marginLeft: 8,
    },
    gradientSelectBorder: {
        borderRadius: 10,
        padding: 2,
    },
    selectDropdown: {
        borderRadius: 8,
        backgroundColor: 'white',
        width: wp('40%'),
        height: hp('4%'),
    },
    selectText: {
        fontSize: hp('1.8%'),  
        color: '#333',
        fontFamily: "AlanSans-Medium"
    }
})