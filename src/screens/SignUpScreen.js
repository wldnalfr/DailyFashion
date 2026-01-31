import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, StyleSheet } from 'react-native';
import realm from '../store/realm';
import LinearGradient from 'react-native-linear-gradient';
import { InputComponent } from '../component/InputComponent';
import { Icon } from 'react-native-elements';

const RegisterScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
    });
    const [selectedRole, setSelectedRole] = useState('buyer');

    const handleRegister = () => {
    if (!formData.username || !formData.fullname || !formData.password) {
        Alert.alert('Error', 'Harap isi semua field');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Password tidak cocok');
        return;
    }

    try {
        realm.write(() => {
            const allUsers = realm.objects('User');
            const existingUser = allUsers.find(user => 
                user.username.toLowerCase() === formData.username.toLowerCase()
            );
            
            if (existingUser) {
                Alert.alert('Error', 'Username sudah digunakan');
                return;
            }

            const maxId = realm.objects('User').max('id') || 0;
            
            realm.create('User', {
                id: maxId + 1,
                username: formData.username, 
                fullname: formData.fullname,
                password: formData.password,
                role: selectedRole, 
                createdAt: new Date()
            });

            Alert.alert('Sukses', 'Registrasi berhasil!', [
                { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
            ]);
        });
    } catch (error) {
        Alert.alert('Error', 'Terjadi kesalahan');
    }
    };
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

    return (
        <View style={styles.mainContainer}>
            <View style={styles.gradientBackground}>
                <LinearGradient
                    colors={['#70FCF7', '#9074FF']}
                    style={styles.gradientContainer}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>
            <View>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View>
                        <Text style={styles.title}>
                            Sign Up
                        </Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper1}>
                                <InputComponent
                                    placeholder="Username"
                                    value={formData.username}
                                    onChangeText={(text) => setFormData({...formData, username: text})}
                                    isIcon={true}
                                    name="account"
                                    type="material-community"
                                    lengthInput={50}
                                />
                                <InputComponent
                                    placeholder="Nama Lengkap"
                                    value={formData.fullname}
                                    onChangeText={(text) => setFormData({ ...formData, fullname: text })}
                                    isIcon={true}
                                    name="account-details"
                                    type="material-community"
                                    lengthInput={50}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <InputComponent
                                    placeholder="Password"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({...formData, password: text})}
                                    secureTextEntry
                                    isIcon={true}
                                    name="lock"
                                    type="material-community"
                                    lengthInput={50}
                                    isPassword={true}
                                />
                                <InputComponent
                                    placeholder="Konfirmasi Password"
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                                    secureTextEntry
                                    isIcon={true}
                                    name="lock-check"
                                    type="material-community"
                                    lengthInput={50}
                                    isPassword={true}
                                />
                                <View style={styles.roleContainer}>
                                    <Text style={styles.roleTitle}>Pilih Role:</Text>
                                    <View style={styles.roleOptions}>
                                        <TouchableOpacity
                                            style={[
                                                styles.roleButton,
                                                selectedRole === 'buyer' && styles.roleButtonSelected
                                            ]}
                                            onPress={() => setSelectedRole('buyer')}
                                        >
                                            <Icon 
                                                name="account" 
                                                type="material-community" 
                                                color={selectedRole === 'buyer' ? '#fff' : '#666'} 
                                                size={26} 
                                            />
                                            <Text style={[
                                                styles.roleText,
                                                selectedRole === 'buyer' && styles.roleTextSelected
                                            ]}>
                                                Pembeli
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={[
                                                styles.roleButton,
                                                selectedRole === 'seller' && styles.roleButtonSelected
                                            ]}
                                            onPress={() => setSelectedRole('seller')}
                                        >
                                            <Icon 
                                                name="store" 
                                                type="material-community" 
                                                color={selectedRole === 'seller' ? '#fff' : '#666'} 
                                                size={26} 
                                            />
                                            <Text style={[
                                                styles.roleText,
                                                selectedRole === 'seller' && styles.roleTextSelected
                                            ]}>
                                                Penjual
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>    
                            <GradientButton
                                style={styles.saveButton}
                                onPress={() => handleRegister()}
                            >
                                <Text style={styles.saveText}>
                                    Sign Up
                                </Text>
                            </GradientButton>
                        </View>
                        
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('LoginScreen')}
                            style={styles.registerLink}
                        >
                            <Text style={styles.registerText}>
                                Already have an account?
                            </Text>
                            <Text style={styles.registerText2}>
                                Sign In
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
        backgroundColor: 'white'
    },
    gradientBackground: {
        height: 170, 
        width: '100%',
    },
    gradientContainer: {
        flex: 1,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 30,
    },
    scroll: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 50,
        paddingTop:40
    },
    roleContainer: {
        marginBottom: 25,
    },
    roleTitle: {
        fontSize: 16,
        fontFamily: 'AlanSans-Medium',
        color: '#376C94',
        marginVertical: 10,
    },
    roleOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    roleButtonSelected: {
        backgroundColor: '#01f4c3',
        borderColor: '#01f4c3',
    },
    roleText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'AlanSans-Medium',
        color: '#666',
    },
    roleTextSelected: {
        color: '#fff',
        fontFamily: 'AlanSans-Bold',
    },
    inputWrapper: {
        
    },
    inputWrapper1: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 36,
        fontFamily: 'AlanSans-Bold',
        marginBottom: 25,
        textAlign: 'center',
        color: '#376C94',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
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
    gradientButton: {
        borderRadius: 13,
        paddingVertical: 8,
        paddingHorizontal: 16,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginLeft: 6,
    },
})

export default RegisterScreen;