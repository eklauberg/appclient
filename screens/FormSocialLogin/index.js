import React, {useEffect, useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet, TouchableWithoutFeedback, Alert, ActivityIndicator, } from 'react-native'
import {useNavigation} from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/MaterialIcons"
import HeaderCadastro from '../Partials/HeaderCadastro';
import {TextInputMask} from 'react-native-masked-text';
import { Formik} from "formik";
import * as yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';
import ErrorMessage from '../Partials/ErrorMessage';
import moment from 'moment';
import httpClient from '../../Request';
import translations from '../../Utils/YupTranslations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Checkbox from '@react-native-community/checkbox';
import { normalize } from 'react-native-elements';
import ModalFeedBack from "../ModalFeedBack";

import api from '../../Api'

import TermosUso from "../ModalTermos";
import { SafeAreaView } from 'react-native-safe-area-context'

yup.setLocale(translations)

export default function FormSocialLogin({route}){
  const [generoField, setGeneroField] = useState('');

  const [masculinoField, setMasculinoField] = useState('black');
  const [femininoField, setFemininoField] = useState('black');
  const [outroField, setOutroField] = useState('black');
  const [ocultarField, setOcultarField] = useState('black');

  const [senhaField, setSenhaField] = useState('');
  const [confirmaSenhaField, setConfirmaSenhaField] = useState('');

  const [useTerms, setUseTerms] = useState('')
  const [modalTermos, setModalTermos] = useState(false)

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  let [validationErrors, setValidationErrors] = useState([]);

  const [checkedMaior18, setCheckedMaior18] = useState(false);
  const [checkedConcordo, setCheckedConcordo] = useState(false);
  const [checkedQueroReceber, setCheckedQueroReceber] = useState(false);

  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showErrorSexo, setShowErrorSexo] = useState(false);
  const [showErrorConfirmarSenha, setShowErrorConfirmarSenha] = useState(false );
  const [showErrorAceitarTermos, setShowErrorAceitarTermos] = useState(false );
  const [showErrorMaioridade, setShowErrorMaioridade] = useState(false );

  const [loading, setLoading ] = useState(false) ;

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

  async function navigateToPrincipal(){
    setModalSuccess(false)
    navigation.navigate('selecionar-ponto-de-venda')
  }

  async function navigateToLogin(){
    setModalSuccess(false);
    navigation.navigate('Login')
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
    setShowErrorSexo( false );
  }

  const initialValues = {
    cpf : '',
    telefone : '',
    nascimento : '',
  };

  const ValidationsSchema = yup.object({
    nascimento : yup.string().required().test('is-data-nascimento-valid', "Data de Nascimento Inválida", ( dataString )=>{
        let data = moment( dataString, 'DD/MM/YYYY');
        return data.isValid() && data.isBefore();
    }),
    cpf : yup.string().required().test( 'cpf-schema','CPF Inválido',(val)=>{
        return cpf.isValid( val )
    }),
    telefone: yup.string().required().min(11)

  });

  const handleErrorResponse = async (response) => {

    //validation error
    if (response.status === 422) {
      console.log("Caiu dentro do IF");
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

  const validate = ()=>{
    return new Promise( ( resolve, reject )=>{

      setShowErrorMaioridade( !checkedMaior18 );
      setShowErrorAceitarTermos( !checkedConcordo );
      setShowErrorPassword( false );
      setShowErrorConfirmarSenha( false );

      if( senhaField === ''){
          setShowErrorPassword( true );
      }else{
          setShowErrorPassword( false );
      }

      if( confirmaSenhaField === ''){
          setShowErrorConfirmarSenha( true );
      }else{
          setShowErrorConfirmarSenha( false );
      }

      if( generoField === '' || generoField === undefined ){
          setShowErrorSexo( true );
      }else{
          setShowErrorSexo( false );
      }
      resolve();
    })
  }

  const formIsValid = async ()=>{
    return new Promise( async ( resolve, reject ) =>{
      await validate();

      /* console.log(`password: ${showErrorPassword},\nMaioridade: ${showErrorMaioridade},\ntermos: ${showErrorAceitarTermos},\npassowrod 2: ${showErrorConfirmarSenha},\nsexo: ${showErrorSexo}, `)

      console.log('sdfasdf: ', ( showErrorPassword || showErrorMaioridade || showErrorAceitarTermos || showErrorConfirmarSenha || showErrorSexo )) */

      resolve(!( showErrorPassword || showErrorMaioridade || showErrorAceitarTermos || showErrorConfirmarSenha || showErrorSexo ));
    })
  };

  async function handleSubmit(values){
    try {
      setLoading( true );
      let isValid = await formIsValid();
      if( !isValid ){
        setLoading( false );
        return;
      } else {

        validationErrors = [];

        let payload = {
          name: route.params.user.user.name,
          email: route.params.user.user.email,
          celular: values.telefone,
          cpf: values.cpf,
          data_nascimento: values.nascimento,
          password: senhaField,
          password_confirmation: confirmaSenhaField,
          sexo: generoField,
          receber_cupons: checkedQueroReceber,
          accepted_terms: checkedConcordo,
        }

        //console.log('data: ', payload)
        let response = await httpClient.put('/user', payload );

        if (response.status === 200) {
          let userAtt = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            cpf: response.data.cpf,
            uuid: response.data.uuid,
            nascimento: response.data.nascimento_formatted,
            celular: response.data.celular,
            profile_image: route.params.user.user.profile_image
          }

          await AsyncStorage.setItem('user', JSON.stringify( userAtt ) )
          setModalSuccess(true)
        }
      }

    } catch (error) {
      let response = error.response;

      if (response !== undefined) {
        handleErrorResponse(response);
        return;
      }

      Alert.alert('Erro', error.message);
    }finally {
      setLoading( false );
    }
  }

  useEffect(() => {
    //console.log('user.: ', route.params.user)
    getTermos()
  }, [])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d'}}>
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
                  onPress={() => navigateToPrincipal()}
                  key={'TouchableOpacity1'}
              >
                  <Text style={{fontSize:22,color:'white',textAlign:'center',fontWeight:'bold'}}> Concluir </Text>
              </TouchableOpacity>
          </View>

      </ModalFeedBack>

      <TermosUso termos={useTerms} visible={modalTermos} refuse={refuse} accept={accept} />
      <KeyboardAwareScrollView behavior="position" style={{backgroundColor: '#1d1d1d',}}>
        <HeaderCadastro handleButtonBackTouched={ navigateToLogin } image={ route.params.user.user.profile_image }/>

        <View style={ styles.socialInfo }>
          <View style={ styles.socialData }>
            <Text style={ styles.label }>Nome: {route.params.user.user.name} </Text>
            <Text style={ styles.label }>Email: {route.params.user.user.email} </Text>
          </View>
          {/* <View >
            <Image style={ styles.image } source={{uri: route.params.user.user.profile_image}}/> 
          </View> */}
        </View>

        <ScrollView style={styles.form_container}>
          <Formik
            initialValues={initialValues}
            onSubmit={ handleSubmit }
            validationSchema={ValidationsSchema}
          >
            { ( props )=> (
              <View style={{ marginTop: '3%' }}>
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
                  <Text style={styles.label}>CPF</Text>
                  <TextInputMask
                    style={styles.input}
                    keyboardType="number-pad"
                    type={'cpf'}
                    value={props.values.cpf}
                    onChangeText={props.handleChange('cpf')}
                    onBlur={props.handleBlur('cpf')}
                  />
                  { props.errors.cpf && <ErrorMessage message={props.errors.cpf}/> }
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Data de Nascimento</Text>
                  <TextInputMask
                    type="custom"
                    options={{mask: '99/99/9999'}}
                    style={styles.input}
                    placeholderTextColor="white"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    value={props.values.nascimento}
                    onChangeText={props.handleChange('nascimento')}
                    onBlur={props.handleBlur('nascimento')}
                  />
                  { props.errors.nascimento && props.touched.nascimento && <ErrorMessage message={props.errors.nascimento}/> }
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefone com DDD</Text>
                  <TextInputMask
                    type="cel-phone"
                    style={styles.input}
                    placeholderTextColor="white"
                    autoCorrect={false}
                    value={props.values.telefone}
                    onChangeText={ props.handleChange('telefone')}
                    onBlur={props.handleBlur('telefone')}
                  />
                  { props.errors.telefone && props.touched.telefone && <ErrorMessage message={props.errors.telefone}/>}
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
                      tintColor={'white'}
                      onCheckColor={'#1d1d1d'}
                      onFillColor={'#e5cfa5'}
                      onTintColor={'#e5cfa5'}
                      boxType={'square'}
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
                    <Text style={styles.labelCheckbox}>Quero receber cupons de desconto e promoções da ChoppStation por e-mail, sms e aplicativos de mensagem.</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={ props.handleSubmit }
                    style={styles.botaoProximo}
                  >
                    { loading && <ActivityIndicator animating={loading} size="small" color="#990000"/> }
                    <Text style={styles.textoBotao}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({

  socialInfo: {
    //flexDirection: 'row',
    width: '85%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginVertical: '5%',
    alignSelf: 'center',
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
  },
  socialData: {
    height: 60,
    justifyContent: 'space-evenly',
  },
  
  image:{
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 15,
    borderColor: 'white'
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

  label : {
    color: "white",
    fontSize: 13,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 0
  },
  form_container: {
    height: '100%',
  },
  inputContainer: {
    // marginLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    // marginRight: 20
    marginHorizontal: '7%',
    marginBottom: 5

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
    fontSize: 16,
    textAlign: "left",
    color: "white",
    width: '100%',
    height: 45,
  },
  botaoProximo: {
    width: '50%',
    backgroundColor: '#e1c897',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: '5%',
  },
  textoBotao: {
    color: 'black',
    fontWeight: "bold",
    fontSize: 20
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
  error_message: {
    marginTop: '2%',
    color: 'black',
    fontWeight: "bold",
    textAlign: 'center',
  },

});