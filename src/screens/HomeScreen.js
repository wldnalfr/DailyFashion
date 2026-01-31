import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { imageSlider } from "../data/Data";
import { categoryList } from "../data/Data";
import { SliderBox } from 'react-native-image-slider-box';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen-hooks"

const GradientBorderButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            <LinearGradient
                colors={['#06a7bcff', 'rgba(28, 255, 210, 1)']}
                start={{x: 0.35, y: 0.98}}
                end={{x: 0.65, y: 0.02}}
                style={styles.gradientBorder}
            >
                <View style={styles.buttonInner}>
                    {children}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const HomeScreen = (props) => {
    const { navigation } = props

    return (
        <ScrollView>
        <View style={styles.mainContainer}>
            <SliderBox
                images={imageSlider}
                autoplay={true}
                circleLoop={true}
                sliderBoxHeight={hp('30%')}
            />
            <View style={styles.titleContainer}>
                <Text style={{ fontFamily: 'AlanSans-Medium', fontSize: 20, color: 'black' }}>
                    Categories
                </Text>
            </View>
            <FlatList
                data={categoryList}
                key={3}
                numColumns={3}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        
                            <GradientBorderButton
                                onPress={() => navigation.navigate('ShowProduct', {categoryid: item.id})}
                            >
                                <Image
                                    source={{ uri: item.icon }}
                                    style={styles.icon}
                                />
                                <Text style={styles.itemName}>{item.name}</Text>
                            </GradientBorderButton>
                       
                    )
                }}
            />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    titleContainer: {
        marginTop: 16,
        marginBottom: 5,   
        alignItems: 'center'
    },
    flatListContainer: {
        padding: 8,
    },
    gradientBorderShadow: {
        flex: 1,
        margin: 6,
        elevation: 10,
        borderRadius: 10, 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 35,
    },
    buttonContainer: {
        flex: 1,
        margin: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8, 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 35,
    },
    gradientBorder: {
        padding: 2, 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 35,
        height: hp('18%'),
    },
    buttonInner: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopLeftRadius: 27,
        borderTopRightRadius: 13,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 34,
    },
    icon: {
        width: wp('22%'),
        height: hp('11%'),
        resizeMode: 'contain',
        marginBottom: 6,
    },
    itemName: {
        color: 'black',
        fontSize: hp('1.7%'),
        fontFamily:'AlanSans-Medium',
        textAlign: 'center',
        fontWeight: '600',
    },
})

export default HomeScreen