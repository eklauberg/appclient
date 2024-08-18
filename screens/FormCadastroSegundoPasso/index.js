import {
    View,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Text, TouchableWithoutFeedback, Alert,
    StyleSheet, ScrollView, Modal, Pressable, ActivityIndicator, Linking, SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import httpClient from '../../Request';
import React, {useState, useEffect} from 'react';
import HeaderCadastro from "../Partials/HeaderCadastro";
import ModalFeedBack from '../ModalFeedBack';
import Icon from "react-native-vector-icons/MaterialIcons";
import ErrorMessage from "../Partials/ErrorMessage";

import api from '../../Api'

import TermosUso from "../ModalTermos";
import { normalize } from 'react-native-elements';
import Checkbox from '@react-native-community/checkbox';


export default function App({route}) {
    const [generoField, setGeneroField] = useState('');

    const [masculinoField, setMasculinoField] = useState('black');
    const [femininoField, setFemininoField] = useState('black');
    const [outroField, setOutroField] = useState('black');
    const [ocultarField, setOcultarField] = useState('black');

    const [senhaField, setSenhaField] = useState('');
    const [confirmaSenhaField, setConfirmaSenhaField] = useState('');
    const [checkedMaior18, setCheckedMaior18] = useState(false);
    const [checkedConcordo, setCheckedConcordo] = useState(false);
    const [checkedQueroReceber, setCheckedQueroReceber] = useState(false);
    let [validationErrors, setValidationErrors] = useState([])
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    const [showErrorSexo, setShowErrorSexo] = useState(false);
    const [showErrorConfirmarSenha, setShowErrorConfirmarSenha] = useState(false);
    const [showErrorAceitarTermos, setShowErrorAceitarTermos] = useState(false);
    const [showErrorMaioridade, setShowErrorMaioridade] = useState(false);
    const [loading, setLoading ] = useState(false) ;

    const [useTerms, setUseTerms] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalTermos, setModalTermos] = useState(false)

    const navigation = useNavigation();

    // == Modal Termos ====
    async function getTermos(){
        await api.termosDeUso()
          .then(res => {
              setUseTerms(res.termos.termos)
            })
    }

    async function accept() {
        setModalTermos(false)
        setShowErrorAceitarTermos(false)
        setCheckedConcordo(true)
    }

    function refuse(){
        setModalTermos(false)
        setCheckedConcordo(false)
        setShowErrorAceitarTermos(true)
    }
    // ==============

    const navigateToLogin = async () => {
        setModalSuccess(false);
        navigation.navigate('Login');
    }

    let handleButtonBackTouched = () => {
        navigation.navigate('form-cadastro-primeiro-passo');
    }

    function gravaGenero($genero) {
        if ($genero == 'Masculino') {
            setMasculinoField('#e1c897');
            setFemininoField('black');
            setOutroField('black');
            setOcultarField('black');
        }
        if ($genero == 'Feminino') {
            setMasculinoField('black');
            setFemininoField('#e1c897');
            setOutroField('black');
            setOcultarField('black');
        }
        if ($genero == 'Outro') {
            setMasculinoField('black');
            setFemininoField('black');
            setOutroField('#e1c897');
            setOcultarField('black');
        }
        if ($genero == 'Ocultar') {
            setMasculinoField('black');
            setFemininoField('black');
            setOutroField('black');
            setOcultarField('#e1c897');
        }

        setGeneroField($genero);
        setShowErrorSexo(false);
    }

    const handleErrorResponse = async (response) => {
        //validation error
        if (response.status === 422) {
            //console.log("Caiu dentro do IF");
            //console.log('error: ', response.data)
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([validationErrors, val]);
                })
            });

            if(response.data.nascimento){
                setValidationErrors([validationErrors, response.data.nascimento])
            }

            setModalVisible(true );

            return;
        }

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar o cadastro, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    const validate = ()=>{
        return new Promise( ( resolve, reject )=>{

            setShowErrorMaioridade( !checkedMaior18 );
            setShowErrorAceitarTermos( !checkedConcordo );
            setShowErrorPassword(false);
            setShowErrorConfirmarSenha(false);

            if( senhaField === ''){
                setShowErrorPassword( true );
            }else{
                setShowErrorPassword(false);
            }

            if( confirmaSenhaField === ''){
                setShowErrorConfirmarSenha( true );
            }else{
                setShowErrorConfirmarSenha(false);
            }

            if( generoField === '' || generoField === undefined ){
                setShowErrorSexo( true );
            }else{
                setShowErrorSexo(false);
            }
            resolve();
        })
    }

    const formIsValid = async ()=>{
        return new Promise( async ( resolve, reject ) =>{
            await validate();

            resolve(!( showErrorPassword || showErrorMaioridade || showErrorAceitarTermos || showErrorConfirmarSenha || showErrorSexo ));
        })
    };

    const registrarUsuario = async () => {
        try {
            setLoading( true );
            let isValid = await formIsValid();
            //console.log( "Form is valid", isValid );
            if( !isValid ){
                setLoading(false);
                return;
            }
            validationErrors = [];

            let payload = {
                name: route.params.values.nome,
                email: route.params.values.email,
                celular: route.params.values.telefone,
                cpf: route.params.values.cpf,
                nascimento: route.params.values.nascimento,
                password: senhaField,
                password_confirmation: confirmaSenhaField,
                sexo: generoField,
                receber_cupons: checkedQueroReceber,
                accepted_terms: checkedConcordo,
                type: 'consumer'
            }

            let response = await httpClient.post('/register', payload );
            console.log(response)
            if (response.status === 201) {
                setModalSuccess(true)                
            }

        } catch (error) {
            let response = error.response;
            
            if (response !== undefined) {
                handleErrorResponse(response);
                return;
            }

            Alert.alert('Erro', error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTermos()
    }, [])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d',}}>
            <ModalFeedBack title={'Erro de cadastro'} visible={modalVisible} setModalVisible={setModalVisible}>
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

            <ModalFeedBack title={'Cadastrado com Sucesso'} visible={modalSuccess} setModalVisible={setModalSuccess}>
                <Icon style={{marginTop: '5%'}} name={"check-circle"} size={40} color="green"/>
                <View style={{marginTop: '5%'}}>
                    <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Usuário cadastrado</Text>
                    <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>com sucesso</Text>
                </View>
                <View style={{marginTop: '10%', width: '80%', alignItems: 'center',}}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#304a22', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                        onPress={() => navigateToLogin()}
                        key={'TouchableOpacity1'}
                    >
                        <Text style={{fontSize:22,color:'white',textAlign:'center',fontWeight:'bold'}}> Fazer Login </Text>
                    </TouchableOpacity>
                </View>

            </ModalFeedBack>
            <HeaderCadastro handleButtonBackTouched={handleButtonBackTouched}/>

            <TermosUso termos={useTerms} visible={modalTermos} refuse={refuse} accept={accept} />

            <KeyboardAvoidingView behaviour="height" style={styles.container}>
                <ScrollView style={{ marginTop: '5%', height: '90%'}}>
                    <View style={styles.form_container}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Gênero</Text>
                            <View style={{...styles.genero_container}}>
                                <TouchableOpacity
                                    onPress={() => gravaGenero('Masculino')}
                                    style={{...styles.genero_masculino_touchable, backgroundColor: masculinoField}}>
                                    <Text style={styles.textoGenero}>Masculino</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => gravaGenero('Feminino')}
                                    style={{...styles.genero_feminino_touchable, backgroundColor: femininoField}}>
                                    <Text style={styles.textoGenero}>Feminino</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => gravaGenero('Outro')}
                                    style={{...styles.genero_outro_touchable, backgroundColor: outroField}}>
                                    <Text style={styles.textoGenero}>Outro</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => gravaGenero('Ocultar')}
                                    style={{...styles.genero_ocultar_touchable, backgroundColor: ocultarField}}>
                                    <Text style={styles.textoGenero}>Ocultar</Text>
                                </TouchableOpacity>

                            </View>
                            { showErrorSexo && <ErrorMessage message={"Selecione o Gênero"} />}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="white"
                                autoCorrect={false}
                                onChangeText={t => setSenhaField(t)}
                                secureTextEntry={true}
                            />
                            { showErrorPassword && <ErrorMessage message={"Preencha o Campo Senha"} />}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirmar Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="white"
                                autoCorrect={false}
                                onChangeText={t => setConfirmaSenhaField(t)}
                                secureTextEntry={true}
                            />
                            { showErrorConfirmarSenha && <ErrorMessage message={"Preencha o Campo Confirmar Senha"} />}
                        </View>
                        <View style={{...styles.inputContainer, marginTop: 15}}>
                            <View style={styles.checkbox_container}>
                                <Checkbox
                                    tintColors={{true:'#e5cfa5', false:'white'}}
                                    boxType={'square'}
                                    tintColor={'white'}
                                    onCheckColor={'#1d1d1d'}
                                    onFillColor={'#e5cfa5'}
                                    onTintColor={'#e5cfa5'}
                                    value={checkedMaior18}
                                    onValueChange={() => {
                                        setCheckedMaior18(!checkedMaior18);
                                        setShowErrorMaioridade( checkedMaior18 );
                                    }}
                                />
                                <Text style={styles.labelCheckbox}> Declaro ser maior de 18 anos</Text>
                            </View>
                            { showErrorMaioridade && <ErrorMessage message={"Cadastro aceito somente para maiores de 18 anos"} />}
                        </View>
                        <View style={{...styles.inputContainer, marginTop: 15}}>

                            <TouchableWithoutFeedback onPress={()=> {
                                if(checkedConcordo){
                                    setCheckedConcordo(!checkedConcordo)
                                } else {
                                    setModalTermos(true)
                                }
                            }}>
                                <View style={styles.checkbox_container} >
                                    <Checkbox
                                        tintColors={{true:'#e5cfa5', false:'white'}}
                                        tintColor={'white'}
                                        onCheckColor={'#1d1d1d'}
                                        onFillColor={'#e5cfa5'}
                                        onTintColor={'#e5cfa5'}
                                        boxType={'square'}
                                        value={checkedConcordo}
                                        disabled={true}
                                        /* onValueChange={() => {
                                            setCheckedConcordo(!checkedConcordo);
                                            setShowErrorAceitarTermos( checkedConcordo );
                                        }} */
                                    />
                                    <Text style={{
                                        ...styles.labelCheckbox,
                                        textDecorationLine: "underline",
                                        textDecorationStyle: "solid",
                                        textDecorationColor: "#000",
                                    }}> Li e concordo com os Termos de Uso </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            { showErrorAceitarTermos && <ErrorMessage message={"Você deve ler e aceitar os termos para poder se cadastrar"} /> }
                        </View>
                        <View style={{...styles.inputContainer, marginTop: 15}}>
                            <View style={styles.checkbox_container}>
                                <Checkbox
                                    tintColors={{true:'#e5cfa5', false:'white'}}
                                    tintColor={'white'}
                                    onCheckColor={'#1d1d1d'}
                                    onFillColor={'#e5cfa5'}
                                    onTintColor={'#e5cfa5'}
                                    boxType={'square'}
                                    value={checkedQueroReceber}
                                    onValueChange={() => {
                                        setCheckedQueroReceber(!checkedQueroReceber);
                                    }}
                                />
                                <Text style={styles.labelCheckbox}> Quero receber cupons de desconto e promoções da ChoppStation por e-mail, sms e aplicativos de mensagem. </Text>
                            </View>
                        </View>
                        <View style={{...styles.buttonContainer, marginTop: 30}}>
                            <TouchableOpacity
                                onPress={() => registrarUsuario()}
                                style={styles.botaoProximo}
                                disabled={loading}
                            >
                                <View style={{
                                    flexDirection : "row",
                                    justifyContent : "center",
                                    alignContent: "center"
                                }}>
                                    { loading ?
                                        <ActivityIndicator animating={loading} size="small" color="#990000"/> 
                                        :
                                        <Text style={styles.textoBotao}>Confirmar</Text>
                                    }
                                </View>

                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    label: {
        color: "white",
        fontSize: 13,
        alignSelf: 'flex-start',
        fontWeight: 'bold',

    },
    form_container: {
        height: '100%',
        backgroundColor: '#1d1d1d',
        paddingBottom: '15%'
    },
    inputContainer: {
        marginLeft: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        marginRight: 20

    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 10,
        borderColor: 'silver',
        borderRadius: 50,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        marginBottom: 10,
        fontSize: 18,
        textAlign: "left",
        color: "white",
        width: '100%',
        height: 45,
    },
    botaoProximo: {
        width: '60%',
        backgroundColor: '#e1c897',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        marginTop: 10,
    },
    textoBotao: {
        color: 'black',
        fontWeight: "bold",
        fontSize: 22
    },
    genero_container: {

        flexDirection: 'row',
        borderColor: 'white',
        height: 45,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: '7%',
        marginTop: 15,
        justifyContent: 'space-between',
    },

    botaoGenero: {
        width: '23%',
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderLeftWidth: 0,
        borderWidth: 1,
        borderColor: 'white',
    },
    textoGenero: {
        color: 'white',
        fontWeight: "bold",
        fontSize: normalize(11)
    },
    genero_masculino_touchable: {
        width: '23%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: 'white',
    },
    genero_feminino_touchable: {
        width: '23%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: 'white'
    },
    genero_outro_touchable: {
        width: '23%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: 'white'
    },
    genero_ocultar_touchable: {
        width: '23%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: 'white',
    },
    labelCheckbox: {
        color: "white",
        fontSize: 12,
        width: '80%',
        alignSelf: 'center',
        alignItems: "center",
        letterSpacing: .1,
        marginLeft: '2%'
    },
    checkbox_container: {
        flexDirection: 'row',
    },
    modal_view: {
        marginTop: 5,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        paddingTop: 20,
        borderColor: "#990000",
        borderWidth: 1,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '50%',
        width: '100%',
        position: "relative"
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: '96%',
        position: "relative",
        marginLeft: 5
    },
    modal_header: {
        width: '100%',
        height: 40,
        position: "relative",
        borderBottomColor: '#e1c897',
        borderBottomWidth: 1
    }


});