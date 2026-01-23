import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export const MediaComponent = (props) => {
    const { value } = props
    return (
        <TouchableOpacity
            style={styles.button}
            {...props}
        >
            <Image
                style={styles.image}
                {...props}
            />
            <Text style={styles.text}>
                {value}
            </Text>
        </TouchableOpacity>    
    )
}   

const styles = StyleSheet.create({ 
    button: {
        flexDirection: "row",
        marginVertical: 8,
    },
    text: {
        color: "black",
        fontSize: 18,
        marginLeft: 8,
        marginTop:5,
        fontFamily:"AlanSans-Medium"
    },
    image: {
        width: 30,
        height: 30,
        borderRadius:6
    },
})