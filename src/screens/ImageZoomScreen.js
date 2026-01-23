import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom'

export default ImageZoomScreen = (props) => {
    const { route } = props
    const ImageSource = route.params.imagePath
    
    return (
        <View style={styles.mainContainer}>
            <ImageZoom
                cropHeight={Dimensions.get('window').height}
                cropWidth={Dimensions.get('window').width}
                imageHeight={Dimensions.get('window').height}
                imageWidth={Dimensions.get('window').width}
            >
                <Image
                    style={styles.image}
                    source={{uri: ImageSource}}
                />
            </ImageZoom>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor:'black',
    },
    image: {
        width: '100%',
        height: '100%',
    },
})