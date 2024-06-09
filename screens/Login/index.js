import {
    View,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Text, SafeAreaView,
    Image, ScrollView,
    StyleSheet, Alert, ActivityIndicator,
    Platform,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconFa from "react-native-vector-icons/FontAwesome";
import {Formik} from "formik";
import * as yup from "yup";
import ErrorMessage from "../Partials/ErrorMessage";
import httpClient from '../../Request';
import { getDeviceName } from 'react-native-device-info';
import ModalFeedBack from "../ModalFeedBack";
import { Settings, AccessToken, LoginManager, } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { normalize } from "react-native-elements";
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';

GoogleSignin.configure({
    webClientId: '654611912375-fq7pgn28lqkricdb303tluvg2pkfsb6d.apps.googleusercontent.com',
    offlineAccess: true, 
    iosClientId : '654611912375-grb4a9782on5f7ipqk0hikdct1prfomc.apps.googleusercontent.com',
});

import api from '../../Api'

import TermosUso from "../ModalTermos";

const backgroundImage = require("../../imagens/fundos/fundo_login.jpg");

export default function App() {
    Settings.initializeSDK();

    const [useTerms, setUseTerms] = useState('')
    const [modalTermos, setModalTermos] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    let [validationErrors, setValidationErrors] = useState([])

    const [ showPassword, setShowPassword ] = useState(true)

    let handleBackButtonTouched = async () => {
        navigation.navigate("PreLogin");
    };

    async function getTermos(){
        await api.termosDeUso()
          .then(res => {
              setUseTerms(res.termos.termos)
            })
    }

    async function accept() {
        let payload = {
            "accepted_terms": true
        }

        await api.acceptTerms(payload)
        
        navigation.navigate('selecionar-ponto-de-venda');

        setModalTermos(false)

    }

    function refuse(){
        setModalTermos(false)
        Alert.alert('Erro de Login', 'É necessário concordar com os termos para utilizar o Chopp Station')
    }

    const [loading, setLoading ] = useState(false) ;

    const navigation = useNavigation();

    const handleSubmit = async ( values )=>{
        try {
            setLoading(true);
            let device = await getDeviceName();
            //console.log( device );

            let payload = {
                email : values.email,
                password : values.senha,
                device_name : device
            };

            let firebaseToken = await AsyncStorage.getItem('fcm_token');
            
            if( firebaseToken !== undefined && firebaseToken !== null ){
                payload.fcm_token = firebaseToken;
            }

            //console.log( values, payload );
            let response = await httpClient.post('/login', payload );

            if( response.status === 200 ){
                if(response.data.user.type === 'consumer'){
                    let token = response.data.token;

                    await AsyncStorage.setItem('token', token );
                    await AsyncStorage.setItem('user', JSON.stringify(response.data.user) );
                    
                    //let res = await api.user()
                    let res = await httpClient.get('/user')

                    if(res.data.user.read_terms){
                        navigation.navigate('selecionar-ponto-de-venda');
                    } else {
                        setModalTermos(true)
                    }
                } else {
                    validationErrors.push('Login Inválido')
                    setModalVisible(true)
                }
            }
        }catch ( error ){
            console.log( error );
            let response = error.response;
            console.log( response.data )

            if (response !== undefined) {
                handleErrorResponse(response);
                return;
            }

            //Alert.alert('Erro', error.message);
        }finally {
            setLoading( false );
        }
    }

    const handleErrorResponse = async (response) => {
        console.log( response.data );
        //validation error
        if (response.status === 422) {
            //console.log("Caiu dentro do IF");
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([validationErrors, val]);
                })
            });

            setModalVisible(true );

            return;
        }

        if ( response.status === 401) {

            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([validationErrors, val]);
                })
            });

            setModalVisible(true );

            return;
        }

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar o cadastro, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    const initialValues = {
        'email': '',
        'senha' : ''
    };

    const ValidationsSchema = yup.object({
        email : yup.string().required(),
        senha : yup.string().required()
    });

    async function handleFacebookLogin(){
        //LoginManager.setLoginBehavior(LoginManager.LoginBehaviors.Native);
        LoginManager.logOut()
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            function(result) {
              if (result.isCancelled) {
                console.log("Login cancelled");
              } else {
                    AccessToken.getCurrentAccessToken().then(async (data) => {
                        //console.log("token.:", data.accessToken.toString())
                        try{
                            setLoading( true );
                            let device_name = await getDeviceName();
                            let token = data.accessToken.toString()

                            let payload = {
                                token,
                                device_name,
                            };

                            console.log('data.: ', payload)

                            let res = await httpClient.post('/social-login/facebook', payload );

                            console.log('res.: ', res.data)

                            if( res.status === 200 ){
                                await AsyncStorage.setItem('token', res.data.token );
                                if(res.data.recently_registered){
                                    navigation.navigate("form-social-login", {user: res.data} )
                                } else {
                                    await AsyncStorage.setItem('user', JSON.stringify(res.data.user) );
                                    navigation.navigate('selecionar-ponto-de-venda');
                                }
                            }

                        }
                        catch(error){
                            console.log( error );
                            let response = error;
                            console.log( response )

                            if (response !== undefined) {
                                handleErrorResponse(response);
                                return;
                            }

                        }
                        finally {
                            setLoading( false );
                        }
                    }
                )
              }
            },
            function(error) {
              console.log("Login fail with error: " + error);
            }
        );
    }

    async function handleAppleLogin(){
        console.log('Entrou: ')
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    
        if (credentialState === appleAuth.State.AUTHORIZED) {
            try{
                let token = appleAuthRequestResponse.identityToken
                let device_name = await getDeviceName();

                let payload = {
                    token,
                    device_name
                };
                
                let res = await httpClient.post('/social-login/apple', payload );
                
                if( res.status === 200 ){
                    await AsyncStorage.setItem('token', res.data.token );
                    if(res.data.recently_registered){
                        navigation.navigate("form-social-login", {user: res.data} )
                    } else {
                        await AsyncStorage.setItem('user', JSON.stringify(res.data.user) );
                        navigation.navigate('selecionar-ponto-de-venda');
                    }
                }
            }catch(error){
                console.log( error );
                let response = error;
                console.log( response )

                if (response !== undefined) {
                    handleErrorResponse(response);
                    return;
                }

            }
            finally {
                setLoading( false );
            }
        }else{
            console.log('Erro: ', credentialState)
        }
    }

    async function handleGoogleLogin(){
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        await GoogleSignin.signIn();
        try {
            
            await GoogleSignin.getTokens().then(async (data) => {
                    setLoading( true );
                    let device_name = await getDeviceName();
                    let token = data.accessToken.toString()

                    let payload = {
                        token,
                        device_name,
                    }
                    //console.log('data.: ', payload)

                    let res = await httpClient.post('/social-login/google', payload );

                    console.log('google: ', res)

                    if( res.status === 200 ){
                        await AsyncStorage.setItem('token', res.data.token );
                        if(res.data.recently_registered){
                            navigation.navigate("form-social-login", {user: res.data} )
                        } else {
                            await AsyncStorage.setItem('user', JSON.stringify(res.data.user) );
                            navigation.navigate('selecionar-ponto-de-venda');
                        }
                    }
                }
            )
            
        } catch (error) {
            console.log( error );
            let response = error.response;
            console.log( response.data )

            if (response !== undefined) {
                handleErrorResponse(response);
                return;
            }
        }
        finally {
            setLoading( false );
        }
    }

    useEffect(() => {
        getTermos()
        if(Platform.OS === 'ios'){
            return appleAuth.onCredentialRevoked(async () => {
                console.warn('If this function executes, User Credentials have been Revoked');
            });
        }
    }, [])

    return (
        <SafeAreaView behavior={"height"} style={styles.background}>
            <ModalFeedBack title={'Erro de Login'} visible={modalVisible} setModalVisible={setModalVisible}>
                <Icon name={"error"} size={60} color="red"/>
                <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
                    {validationErrors.map((value, index) => {
                        return (
                            <Text key={index} style={styles.error_message}>
                                {value}
                            </Text>
                        );
                    })}
                </ScrollView>
                <View style={{marginTop: '5%', width: '80%', alignItems: 'center',}}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#e1c897', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                        onPress={() => {
                            setValidationErrors([])
                            setModalVisible(false)
                        }}
                    >
                        <Text style={{fontSize:22,color:'black',textAlign:'center',fontWeight:'bold'}}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </ModalFeedBack>
            
            <TermosUso termos={useTerms} visible={modalTermos} refuse={refuse} accept={accept} />

            {/* <Image style={styles.background_image}
                   source={backgroundImage}
                   resizeMode={ImageResizeMode.contain}/> */}

            <View style={styles.header_container}>
                <TouchableOpacity style={styles.goBack} onPress={() => handleBackButtonTouched()}>
                    <Icon name={"arrow-back"} size={40} color="#DFC695"/>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={ styles.body_container }>
                <View style={styles.containerLogo}>
                    <Image
                        style={styles.logo_image}
                        source={require("../../imagens/logos/logo-chopp.png")}
                        resizeMode={ImageResizeMode.contain}
                    />

                    <Text style={styles.titulosLogo}>DISCOVER{"\n"}THE FINEST BREWS</Text>
                </View>

                <Formik
                    initialValues={initialValues}
                    onSubmit={ handleSubmit }
                    validationSchema={ValidationsSchema}
                >
                    { ( props) => (
                        <>
                            <View style={styles.form_container}>
                                <View style={ styles.inputContainer }>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="CPF, e-mail ou telefone"
                                        placeholderTextColor="silver"
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        value={props.values.email}
                                        onChangeText={ props.handleChange('email') }
                                    />
                                </View>
                                { props.errors.email && <ErrorMessage  message={props.errors.email}/>}
                                <View style={ styles.inputContainer }>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Senha"
                                        placeholderTextColor="silver"
                                        autoCorrect={false}
                                        value={props.values.senha}
                                        onChangeText={ props.handleChange('senha')}
                                        secureTextEntry={showPassword}
                                    />
                                    <TouchableOpacity
                                        style={ styles.showPassword }
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <IconFa name={ showPassword?'eye':'eye-slash'} size={20} color={'gray'}/>
                                    </TouchableOpacity>
                                </View>
                                { props.errors.senha && <ErrorMessage  message={props.errors.senha}/>}

                                <TouchableOpacity 
                                    style={{ alignSelf: 'center', marginVertical: '4%',}}
                                    onPress={()=>{ navigation.navigate('recuperar-senha') }}
                                >
                                    <Text style={styles.esqueci_senha_text}>Esqueci minha senha</Text>
                                </TouchableOpacity>
                                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity
                                        onPress={ props.handleSubmit }
                                        style={styles.botaoAcessar}>
                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignContent: "center"
                                        }}>
                                            { loading ? 
                                                <ActivityIndicator animating={loading} size="small" color="#990000"/> 
                                                :
                                                <Text style={styles.textoBotao}>Entrar</Text>
                                            }
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </View>
        
                            <Text style={styles.titulosOu}>ou</Text>
                            <View style={styles.social_container}>       
                                {/* <TouchableOpacity onPress={() => handleFacebookLogin()} style={styles.botaoFacebook}>
                                    <IconFa name={"facebook"} size={15} color={"white"} />
                                    <Text style={styles.textoFacebook}>CONTINUAR COM O FACEBOOK</Text>
                                </TouchableOpacity> */}

                                {/* {Platform.OS === 'ios'&&
                                    <TouchableOpacity onPress={() => handleAppleLogin()} style={styles.botaoApple}>                                
                                        <IconFa name={"apple"} size={15} color={"white"} />
                                        <Text style={styles.textoApple}>CONTINUAR COM A APPLE</Text>                               
                                    </TouchableOpacity>
                                } */}

                                <TouchableOpacity onPress={() => handleGoogleLogin()} style={styles.botaoGoogle}>                                
                                    <IconFa name={"google"} size={15} color={"black"} />
                                    <Text style={styles.textoGoogle}>CONTINUAR COM O GOOGLE</Text>                               
                                </TouchableOpacity>
                            </View>
                            
                        </>
                    )}
                </Formik>
            </KeyboardAvoidingView>
            

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        //alignItems: "center",
        //justifyContent: "center",
        backgroundColor: "#010101",
    },

    header_container: {
        width: "100%",
        height: 55,
        justifyContent: 'center',
    },

    body_container: {
        height: '80%',
        alignItems: 'center',
    },

    titulosLogo: {
        color: "#E1C897",
        fontSize: 16,
        alignItems: "center",
        textAlign: "center",
        alignContent: "center",
        fontWeight: "bold",
    },

    containerLogo: {
        alignItems: "center",
        marginBottom: '3%'
    },

    form_container: {
        width: "80%",
    },

    inputContainer:{
        flexDirection: 'row',
        backgroundColor: "white",
        marginTop: "2%",
        borderRadius: 8,
        width: "100%",
    },

    input: {        
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 13,
        textAlign: "left",
        color: "black",
        width: "90%",
    },

    showPassword: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '10%',
    },

    botaoAcessar: {
        width: "60%",
        backgroundColor: "#e1c897",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center',
        height: 45,
    },

    botaoFacebook: {
        flexDirection: 'row',
        width: "85%",
        marginVertical: '2%',
        backgroundColor: "#3b5998",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 40,
    },

    botaoApple: {
        flexDirection: 'row',
        width: "85%",
        backgroundColor: "#262626",
        borderWidth: 0.5,
        borderColor: 'white',
        marginVertical: '2%',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 40,
    },

    botaoGoogle: {
        flexDirection: 'row',
        width: "85%",
        backgroundColor: "#ffffff",
        marginVertical: '2%',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 40,
    },

    textoFacebook: {
        color: "white",
        fontWeight: "bold",
        fontSize: 11,
        marginLeft: 10,
    },

    textoApple: {
        color: "white",
        fontWeight: "bold",
        fontSize: 11,
        marginLeft: 10,
    },

    textoGoogle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 11,
        marginLeft: 10,
    },

    textoBotao: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
    },

    tamanhoLogo: {
        width: 250,
        height: 68,
    },

    titulosOu: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
        alignItems: "center",
        textAlign: "center",
        marginVertical: '4%'
    },

    esqueci_senha_text: {
        color: "white",
        fontSize: 12,
        fontWeight: "700",
        alignItems: "center",
        textAlign: "center",
        textDecorationLine: "underline",
        letterSpacing: .4,
    },

    titulos: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
        alignItems: "center",
        textAlign: "center",
        alignContent: "center",
        textDecorationLine: "underline",
    },

    background_image: {

        backgroundColor: "#ccc",
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },

    goBack: {
        width: '10%',
        marginLeft: '2%',
    },

    logo_image: {
        width: 130,
        height: 130,
    },

    buttons_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    social_container: {
        width: "80%",
        alignItems: 'center',
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },

});
