import { Icon } from "@rneui/themed";
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export const InputComponent = (props) => {
    const { 
        isDescription, 
        isIcon, 
        lengthInput, 
        isPassword, // Prop baru untuk menandai input password
        ...textInputProps 
    } = props
    
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.mainContainer}>
            {
                isIcon ?
                    <Icon
                        size={24}
                        {...props}
                        style={styles.icon}
                    />
                    :
                    null
            }
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input,
                        {
                            height: isDescription ? 100 : 40,
                            textAlignVertical: isDescription ? 'bottom' : 'center',
                            paddingBottom: isDescription ? 7 : 4,
                            paddingRight: isPassword ? 40 : 10, // Beri space untuk icon mata
                        }
                    ]}
                    maxLength={lengthInput}
                    placeholderTextColor='#a3a3a3ff'
                    multiline={isDescription}
                    secureTextEntry={isPassword && !showPassword} // Hide text jika password dan tidak show
                    {...textInputProps}
                />
                
                {/* Icon Show/Hide Password */}
                {isPassword && (
                    <TouchableOpacity 
                        style={styles.eyeIcon}
                        onPress={toggleShowPassword}
                    >
                        <Icon
                            name={showPassword ? "eye-off" : "eye"}
                            type="material-community"
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>
                )}
                
                <LinearGradient
                    colors={['#0061ff', '#01f4c3']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.gradientLine}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 8,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputContainer: {
        flex: 1,
        position: 'relative',
    },
    input: {
        color: "black",
        fontSize: 16,
        width: '100%',
        marginLeft: 0,
        fontFamily:"AlanSans-Medium",
        paddingBottom: 4,
        paddingLeft: 10,
    },
    icon: {
        marginRight: 4,
        marginTop: 10,
        width: 25
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
    },
    gradientLine: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: 1,
        height: 2
    }
});