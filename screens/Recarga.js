import React, {useEffect, useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    ScrollView, ActivityIndicator, SafeAreaView
} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import ErrorMessage from "./Partials/ErrorMessage";
import {Checkbox} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import * as yup from "yup";
import {Formik} from "formik";
import {TextInputMask} from "react-native-masked-text";
//import RNJuno from 'react-native-juno';
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalFeedBack from "./ModalFeedBack";
import Loader from "./Loader";
import SelecionarPontoDeVenda from './SelecionarPontoDeVendaCardWithoutLocation';



export default function App ({route}){

    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ loading, setLoading ] = useState(false );
    const [ modalVisible, setModalVisible ] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false)


    const navigation = useNavigation();

    const navigateToLogin = async () => {
        navigation.navigate('Login');
    }


    const handleErrorResponse = async (response) => {

        //validation error
        if (response.status === 422 || response.status === 400 ) {
            console.log("Caiu dentro do IF");

            // console.log( response.data.errors[0].details);

            let errorsKeys = Object.keys(response.data.errors || response.data.errors[0].details);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([validationErrors, val]);
                })
            });

            setModalVisible(true );

            return;
        }//validation error

        if (response.status === 400 ) {
            console.log("Caiu dentro do IF");
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([...validationErrors, val]);
                })
            });

            setModalVisible(true );

            return;
        }

        //server error
        if (response.status === 500) {
            console.log( response );
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar o cadastro, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    const loadUserFromStorage = async ()=> {
        user = await AsyncStorage.getItem('user');
        //console.log(user);

        if( user !== null ){
            this.setUser(JSON.parse(user));
        }
    }

    const getCardHash = async ( number, nome, cvv, mes, ano ) =>{
        return new Promise( ( resolve, reject )=>{
            RNJuno.initialize('BD0ED67FEE0A99B48C1BB3A743ADA24F715653E349A4F7B4D2C14FD12CF61FEE8DD02FADA4715566', false );

            RNJuno.getCardHash( number, nome, cvv, mes, ano, (error, data) => {
                if (error) {
                    reject( error );
                } else {
                    console.log("Token", data );
                   resolve( data );
                }
            });
        } )
    }

    

    
    const recarga = async ( values ) => {
        try {
            setValidationErrors([]);
            setLoading( true );

            // let mesExpiracao = values.expiracao.split('/')[0]
            // let anoExpiracao = values.expiracao.split('/')[1]

            // let cardHash = await getCardHash( values.numero_cartao, values.nome, values.cvv, mesExpiracao, anoExpiracao );

            let valor = values.valor.replace('.','')
                .replace(',', '.')
                .replace("R$","");

            let payload = {
                "amount": valor,
                "credit_card_id" : route.params.cartao.credit_card_id,
                "ponto_de_venda_id" : route.params.pos.id,
                "logradouro" : values.rua,
                "numero" : values.numero,
                "cidade" : values.cidade,
                "cep" : values.cep,
                "estado" : values.estado.toUpperCase(),
                //"armazenar_cartao" : false,
            }

            // if( route.params.cartao !== undefined ){
            //     payload['credit_card_id'] = route.params.cartao.credit_card_id;
            // }

            console.log( payload );

            let response = await httpClient.post('/payment', payload );

            if ( response.status === 201 ) {
                setModalSuccess(true)
            }

            console.log( response.data );

        } catch (error) {
            let response = error.response;

            console.log( error );
            if (response !== undefined) {
                console.log( response.data );
                handleErrorResponse(response);
                return;
            }

            Alert.alert('Erro', error.message);
        }finally {
            setLoading( false );
        }
    }

    const initialValues = {
        valor : '',
        numero_cartao : '',
        //nome: '',
        //cvv : '',
        //expiracao : '',
        //armazenar_cartao : false,
        cep: '',
        cidade : '',
        estado : '',
        rua: '',
        numero : '',
        bairro : ''

    };


    const ValidationsSchema = yup.object({
        valor : yup.string().required(),
        //numero_cartao : yup.string().required("Número do Cartão é Obrigatório"),
        //expiracao : yup.string().required('Data de Expiração é obrigatório'),
        //cvv : yup.string().required('CVV é obrigatório'),
        //nome : yup.string().required('Nome é obrigatório'),
        cep: yup.string().required('CEP é obrigatório'),
        cidade: yup.string().required('Cidade é obrigatório'),
        estado: yup.string().required('Estado é obrigatório'),
        rua: yup.string().required('Rua é obrigatório'),
        numero: yup.string().required('Número é obrigatório'),
        bairro: yup.string().required('Bairro é obrigatório'),
    });


    return (
            <SafeAreaView style={{flex: 1}}>
                <Header title={"Recarga"}/>
                <ModalFeedBack title={'Recarga'} visible={modalVisible} setModalVisible={setModalVisible}>
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

                <ModalFeedBack title={'Recarga'} visible={modalSuccess} setModalVisible={setModalSuccess}>
                    <Icon style={{marginTop: '5%'}} name={"check-circle"} size={40} color="green"/>
                    <View style={{marginTop: '5%'}}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Recarga</Text>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Efetuada</Text>
                    </View>
                    <View style={{marginTop: '10%', width: '80%', alignItems: 'center',}}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#304a22', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                            onPress={() => {
                                setModalSuccess(false)
                                navigation.navigate('Principal')
                            }}
                            key={'TouchableOpacity1'}
                        >
                            <Text style={{fontSize:22,color:'white',textAlign:'center',fontWeight:'bold'}}> Concluir </Text>
                        </TouchableOpacity>
                    </View>

                </ModalFeedBack>

                <KeyboardAwareScrollView behavior="position">
                    <View style={styles.container}>
                        
                        

                        <ScrollView style={styles.form_container}>
                        <SelecionarPontoDeVenda disable={true} ponto={ route.params.pos } />
                            <Formik
                                initialValues={initialValues}
                                onSubmit={ (values)=>{
                                    recarga( values );
                                } }
                                validationSchema={ValidationsSchema}
                            >

                                { ( props )=> (
                                    <View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Valor</Text>
                                            <TextInputMask
                                                type={"money"}
                                                style={styles.input}
                                                placeholderTextColor="white"
                                                autoCorrect={false}
                                                value={props.values.valor}
                                                onChangeText={props.handleChange('valor')}
                                                onBlur={props.handleBlur('valor')}
                                            />
                                            { props.errors.valor && <ErrorMessage  message={props.errors.valor}/>}
                                        </View>
                                        {/* <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Número do Cartão</Text>
                                            <TextInputMask
                                                style={styles.input}
                                                keyboardType="number-pad"
                                                type={'credit-card'}
                                                value={props.values.numero_cartao}
                                                onChangeText={props.handleChange('numero_cartao')}
                                                onBlur={props.handleBlur('numero_cartao')}
                                            />
                                            { props.errors.numero_cartao && <ErrorMessage  message={props.errors.numero_cartao}/> }
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Nome Impresso no Cartão</Text>
                                            <TextInput
                                                style={styles.input}
                                                type="custom"
                                                placeholderTextColor="black"
                                                value={props.values.nome}
                                                onChangeText={props.handleChange('nome')}
                                                onBlur={props.handleBlur('nome')}
                                            />
                                            { props.errors.nome && props.touched.nome && <ErrorMessage  message={props.errors.nome}/> }
                                        </View>
                                        <View style={{...styles.inputContainer, flexDirection: 'row', margin: 5, justifyContent: "space-between"}}>
                                            <View style={{ flex: 1}}>
                                                <Text style={styles.label}>CVV</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholderTextColor="black"
                                                    autoCorrect={false}
                                                    value={props.values.cvv}
                                                    onChangeText={props.handleChange('cvv')}
                                                    onBlur={props.handleBlur('cvv')}
                                                />
                                                { props.errors.cvv && props.touched.cvv && <ErrorMessage  message={props.errors.cvv}/> }
                                            </View>
                                            <View style={{ flex: 1, marginLeft: 5}}>
                                                <Text style={styles.label}>Expiração</Text>
                                                <TextInputMask
                                                    type={"custom"}
                                                    options={{mask: '99/9999'}}
                                                    style={styles.input}
                                                    placeholder={'MM/AAAA'}
                                                    placeholderTextColor="black"
                                                    autoCorrect={false}
                                                    value={props.values.expiracao}
                                                    onChangeText={props.handleChange('expiracao')}
                                                    onBlur={props.handleBlur('expiracao')}
                                                />
                                                { props.errors.expiracao && props.touched.expiracao && <ErrorMessage  message={props.errors.expiracao}/> }
                                            </View>
                                        </View> */}
                                        {/* <View style={{ ...styles.inputContainer, flexDirection: "row", alignItems: "center"}}>
                                            <Checkbox
                                                color='green'
                                                status={props.values.armazenar_cartao ? 'checked' : 'unchecked'}
                                                value={ props.values.armazenar_cartao}
                                                onPress={ ()=>{
                                                    props.setFieldValue('armazenar_cartao', !props.values.armazenar_cartao )
                                                }}
                                            />
                                            <Text style={styles.labelCheckbox}> Armazenar Cartão </Text>
                                        </View> */}

                                        <View style={{...styles.inputContainer, flexDirection: "row", justifyContent: "space-between"}}>
                                            <View style={{flex: 0.5 }}>
                                                <Text style={styles.label}>CEP</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="white"
                                                    value={props.values.cep}
                                                    onChangeText={props.handleChange('cep')}
                                                    onBlur={props.handleBlur('cep')}
                                                />
                                                { props.errors.cep && props.touched.cep && <ErrorMessage  message={props.errors.cep}/> }
                                            </View>
                                            <View style={{flex: 1, marginLeft: 5 }}>
                                                <Text style={styles.label}>Cidade</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    placeholderTextColor="white"
                                                    value={props.values.cidade}
                                                    onChangeText={props.handleChange('cidade')}
                                                    onBlur={props.handleBlur('cidade')}
                                                />
                                                { props.errors.cidade && props.touched.cidade && <ErrorMessage  message={props.errors.cidade}/> }
                                            </View>
                                        </View>
                                        <View style={{...styles.inputContainer, flexDirection: "row", justifyContent: "space-between"}}>
                                            <View style={{flex: 0.5 }}>
                                                <Text style={styles.label}>Estado</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    placeholder={"UF Ex: PR"}
                                                    placeholderTextColor="gray"
                                                    maxLength={2}
                                                    autoCapitalize={"characters"}
                                                    value={props.values.estado}
                                                    onChangeText={props.handleChange('estado')}
                                                    onBlur={props.handleBlur('estado')}
                                                />
                                                { props.errors.estado && props.touched.estado && <ErrorMessage  message={props.errors.estado}/> }
                                            </View>
                                            <View style={{flex: 1, marginLeft: 5 }}>
                                                <Text style={styles.label}>Bairro</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    placeholderTextColor="gray"
                                                    value={props.values.bairro}
                                                    onChangeText={props.handleChange('bairro')}
                                                    onBlur={props.handleBlur('bairro')}
                                                />
                                                { props.errors.bairro && props.touched.bairro && <ErrorMessage  message={props.errors.bairro}/> }
                                            </View>
                                        </View>
                                        <View style={{...styles.inputContainer, flexDirection: "row", justifyContent: "space-between"}}>
                                            <View style={{flex: 1 }}>
                                                <Text style={styles.label}>Rua</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    placeholderTextColor="white"
                                                    value={props.values.rua}
                                                    onChangeText={props.handleChange('rua')}
                                                    onBlur={props.handleBlur('rua')}
                                                />
                                                { props.errors.rua && props.touched.rua && <ErrorMessage  message={props.errors.rua}/> }
                                            </View>
                                            <View style={{flex: 0.4, marginLeft: 5 }}>
                                                <Text style={styles.label}>Número</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    type="custom"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="white"
                                                    value={props.values.numero}
                                                    onChangeText={props.handleChange('numero')}
                                                    onBlur={props.handleBlur('numero')}
                                                />
                                                { props.errors.numero && props.touched.numero && <ErrorMessage  message={props.errors.numero}/> }
                                            </View>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                onPress={ props.handleSubmit }
                                                style={styles.botaoProximo}>
                                                <Text style={styles.textoBotao}>Comprar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                                }
                            </Formik>
                        </ScrollView>
                    </View>
                </KeyboardAwareScrollView>

                <Footer/>
                { loading && <Loader /> }
            </SafeAreaView>
        );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 150
    },
    item:{
        height: 22,
        color: "#990000",
        fontSize: 18,
        fontWeight: "bold"
    },

    label: {
        color: "black",
        fontSize: 14,
        alignSelf: 'flex-start'
    },
    form_container: {
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginLeft: 10,

    },
    inputContainer: {
        marginLeft: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        marginRight: 5,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 2,
        borderColor: '#8b8888',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        marginBottom: 5,
        fontSize: 16,
        textAlign: "left",
        color: "black",
        width: '100%',
        height: 45,
    },
    botaoProximo: {
        width: '75%',
        backgroundColor: '#e1c897',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        marginTop: 10,
    },
    textoBotao: {
        color: 'black',
        fontWeight: "bold",
        fontSize: 22
    },
    image_container: {
        marginTop: 5,
        width: '100%',
        borderRadius: 20,
        padding: 20,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 5,
        marginRight: 5
    },
    pos_container: {
        marginTop: 25,
        width: '90%',
        height: 100,
        backgroundColor: "#cccccc",
        padding: 20,
        borderRadius: 20,
        justifyContent: "center"
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },

});
