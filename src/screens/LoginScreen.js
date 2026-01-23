import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, Image } from 'react-native';
import realm from '../store/realm';
import { InputComponent } from '../component/InputComponent';
import LinearGradient from 'react-native-linear-gradient';
import { CheckBox } from 'react-native-elements';

const LoginScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(true);

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

    const handleLogin = () => {
    if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Harap isi username dan password');
        return;
    }

    try {
        const user = realm.objects('User').filtered('username == $0 AND password == $1', formData.username, formData.password)[0];
        const userName = realm.objects('User').filtered('username == $0', formData.username)[0];

        if (user) {
            realm.write(() => {
                const existingSessions = realm.objects('Session');
                realm.delete(existingSessions);
                
                realm.create('Session', {
                    id: 'current_session',
                    userId: user.id.toString(),
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email || '',
                    role: user.role, // <-- SIMPAN role user
                    isLoggedIn: true,
                    loginTime: new Date(),
                    rememberMe: rememberMe
                });
            });
            
            Alert.alert('Sukses', `Selamat datang, ${user.fullname}!`);
            navigation.replace('Drawer');
        } else if (!userName) {
            Alert.alert('Error', 'Username Salah');
        } else {
            Alert.alert('Error', 'Password Salah');
        }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat login');
    }
};

    useEffect(() => {
        const user = realm.objects('User')
        console.log(user)
    }, [])

    return (
        <View style={styles.mainContainer}>
            <View style={{ flex: 1 }}>
                <LinearGradient
                    colors={['#70FCF7', '#9074FF']}
                    style={styles.gradientContainer}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.7 }}
                />
            </View>
            <View style={styles.loginFormContainer}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View>
                        <Text style={styles.title}>
                            Welcome Back
                        </Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <InputComponent
                                    placeholder="Username"
                                    value={formData.username}
                                    onChangeText={(text) => setFormData({...formData, username: text})}
                                    isIcon={true}
                                    name="account"
                                    type="material-community"
                                    lengthInput={50}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <InputComponent
                                    placeholder="Password"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({...formData, password: text})}
                                    isIcon={true}
                                    name="lock"
                                    type="material-community"
                                    lengthInput={50}
                                    isPassword={true}
                                />
                                <View style={styles.rememberContainer}>
                                    <CheckBox
                                        checked={rememberMe}
                                        onPress={() => setRememberMe(!rememberMe)}
                                        iconType="material-community"
                                        checkedIcon="checkbox-marked"
                                        uncheckedIcon="checkbox-blank-outline"
                                        checkedColor="#01f4c3"
                                        containerStyle={styles.checkboxContainer}
                                    />
                                    <Text style={styles.rememberText}>Remember me</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <GradientButton
                                style={styles.saveButton}
                                onPress={() => handleLogin()}
                            >
                                <Text style={styles.saveText}>
                                    Login
                                </Text>
                            </GradientButton>
                        </View>
        
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('RegisterScreen')}
                            style={styles.registerLink}
                        >
                            <Text style={styles.registerText}>
                                Doesn't have an account?
                            </Text>
                            <Text style={styles.registerText2}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    gradientContainer: {
        flex: 1,
    },
    headerImage: {
        width: 150,
        height: 150,
        position: 'absolute',
        left: 118,
        top: -210
    },
     rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginLeft: 40,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    rememberText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
        fontFamily: 'AlanSans-Medium',
    },
    input: {
        borderWidth:1
    },
    gradientButton: {
        borderRadius: 13,
        paddingVertical: 8,
        paddingHorizontal: 16,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 40
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    saveButton: {
        marginTop: 16,
        elevation: 4,
        width: 320
    },
    saveText: {
        color: 'white',
        fontFamily: "AlanSans-Bold",
        fontSize: 20
    },
    loginFormContainer: {
        
    },
    scroll: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 50,
        paddingTop: 60,
        borderTopStartRadius: 100
        
    },
    title: {
        fontSize: 34,
        fontFamily: 'AlanSans-Bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#376C94',
    },
    inputWrapper: {
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    loginButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerLink: {
        marginTop: 15,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    registerText: {
        textAlign: 'center',
        fontSize: 14,
        marginLeft: 6,
        color: 'black'
    },
    registerText2: {
        textAlign: 'center',
        color: '#9074FF',
        fontSize: 14,
        marginLeft: 6
    },
});

export default LoginScreen;