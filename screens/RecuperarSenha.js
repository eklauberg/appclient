import {ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView} from "react-native";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import React, {Component} from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import httpClient from '../Request';
import {validate} from 'react-email-validator';
import { normalize } from 'react-native-elements';
import ModalFeedBack from "./ModalFeedBack";


class RecuperarSenha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            modalVisible: false,
            validationErrors: []
        };
    }

    chamaTelaEscolhaLoginCadastro = async () => {
        this.props.navigation.navigate("Login");
    };

    setModalVisible = async (visible) => {
        this.setState({
            ...this.state,
            modalVisible: visible
        })
    }

    setValidationErrors = async (errors) => {
        this.setState({
            ...this.state,
            validationErrors: [...errors]
        })
    }

    handleErrorResponse = async (response) => {

        //validation error
        if (response.status === 422 || response.status === 400) {
            console.log("Caiu dentro do IF");
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    this.setValidationErrors([...this.state.validationErrors, val]);
                })
            });

            this.setModalVisible(true);

            return;
        }//validation error

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar o cadastro, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    handleClickButtonProximoTouched = async () => {

        await this.setValidationErrors([]);

        if (this.state.email === '' || this.state.email === null) {
            Alert.alert("E-mail", "O Campo E-mail precisa sem preenchido");
            return;
        }

        if (!validate(this.state.email)) {
            Alert.alert("E-mail Inválido", "Forneça um E-mail Válido");
            return;
        }

        await this.setLoading(true);

        try {

            const payload = {
                "email": this.state.email
            };

            console.log("PAYLOAD", payload );

            const response = await httpClient.post('/forgot-password', payload);

            console.log(response, payload);
            if (response.status === 200 && response.data.status === "Enviamos um email com link para redefinição de senha") {
                Alert.alert("Link Enviado", response.data.status);
                this.props.navigation.navigate("Login");
            }

        } catch (error) {

            let response = error.response;

            if (response !== undefined) {
                this.handleErrorResponse(response);
                console.log(response.data);
            }

            console.log(error);

        } finally {
            await this.setLoading(false);
        }
    };

    setEmailField = async (email) => {
        this.setState({
            ...this.state,
            email: email,
        });
    };

    setLoading = async (loading) => {
        this.setState({
            ...this.state,
            loading: loading
        })
    }

    render() {
        return (
            <SafeAreaView style={ styles.background }>
                <ModalFeedBack visible={this.state.modalVisible} setModalVisible={this.setModalVisible}>
                    <Icon name={"error"} size={60} color="red"/>
                    <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
                        {this.state.validationErrors.map((value, index) => {
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
                            onPress={() => this.setModalVisible(false)}
                        >
                            <Text style={{fontSize:22,color:'black',textAlign:'center',fontWeight:'bold'}}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </ModalFeedBack>

                <View style={styles.header_container}>
                    <TouchableOpacity style={styles.goBack} onPress={() => this.chamaTelaEscolhaLoginCadastro()}>
                        <Icon name={"arrow-back"} size={40} color="#DFC695"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    
                    {/* <Image
                        style={{
                            flex: 1,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                        }}
                        source={require("../imagens/fundos/fundo_login.jpg")}
                        resizeMode={ImageResizeMode.contain}
                    /> */}
                        
                    <ScrollView>
                        <View style={styles.containerLogo}>
                            <Image
                                style={{
                                    width: 120,
                                    height: 120,
                                }}
                                source={require("../imagens/logos/logo-chopp.png")}
                                resizeMode={ImageResizeMode.contain}
                            />
                            <Text style={styles.titulosLogo}>DISCOVER{"\n"}THE FINEST BREWS</Text>
                        </View>

                        <View style={styles.container}>

                            <Text style={styles.subTitulo}>Esqueci Minha Senha</Text>
                            <Text style={styles.secondary}>Digite seu e-mail para receber por e-mail
                                um link para alteração de senha</Text>

                            <View style={styles.box}>
                                <Text style={styles.cpf}>E-mail</Text>

                                <TextInput
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCompleteType="email"
                                    autoCapitalize="none"
                                    value={this.state.email}
                                    onChangeText={(t) => this.setEmailField(t)}
                                />

                                <TouchableOpacity
                                    onPress={() => this.handleClickButtonProximoTouched(this.state.email)}
                                    style={styles.botaoProximo}
                                >
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignContent: "center"
                                    }}>
                                        <Text style={styles.textoProximo}>Enviar</Text>
                                        {this.state.loading &&
                                        <ActivityIndicator animating={this.state.loading} size="small" color="#990000"/>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }


}

export default RecuperarSenha;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#010101",
    },

    body: {
        flex: 1,
        width: '100%',
    },

    botaoProximo: {
        width: "60%",
        backgroundColor: "#e1c897",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        marginTop: 30,
    },

    box: {
        width: "100%",
        height: "auto",
        marginTop: 5,
        alignItems: "center",
        paddingTop: 10,
    },

    cpf: {
        color: "white",
        fontSize: 16,
        letterSpacing: .5,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        alignItems: "flex-end",
        textAlign: "left",
        alignContent: "flex-start",
        alignSelf: "flex-start",
        left: "12%",
    },

    textoProximo: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
    },

    textoNao: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },

    container: {
        marginTop: '5%',
        width: "90%",
        alignItems: 'center',
        alignSelf: 'center',
    },

    containerLogo: {
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

    subTitulo: {
        color: "white",
        fontSize: normalize(20),
        textAlign: "center",
        fontWeight: "700",
    },

    secondary: {
        color: "white",
        fontSize: normalize(16),
        marginTop: 20,
        textAlign: "center",
        fontWeight: "700",
    },

    input: {
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: 5,
        borderWidth: 2,
        alignContent: "center",
        paddingLeft: 10,
        fontSize: 12,
        textAlign: "left",
        color: "black",
        width: "80%",
        height: 40,
        alignItems: "center",

    },

    header_container: {
        width: "100%",
        height: 55,
        justifyContent: 'center',
    },

    goBack: {
        width: '10%',
        marginLeft: '2%',
    },

    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },

});
