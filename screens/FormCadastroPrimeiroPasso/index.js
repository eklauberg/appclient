import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import HeaderCadastro from '../Partials/HeaderCadastro';
import {TextInputMask} from 'react-native-masked-text';
import { Formik} from "formik";
import * as yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';
import ErrorMessage from '../Partials/ErrorMessage';
import moment from 'moment';
import translations from '../../Utils/YupTranslations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { setLocale } from 'yup'
import { SafeAreaView } from 'react-native-safe-area-context';
setLocale(translations)

export default function App({route}) {

    const navigation = useNavigation();

    let handleButtonBackTouched = async () => {
        navigation.navigate('check-cpf');
    }

    let handleSubmit = async ( values, actions )=>{
        navigateToFormCadastroSegundoPasso( values );
    }

    let navigateToFormCadastroSegundoPasso = async ( values ) => {
        navigation.navigate('form-cadastro-segundo-passo', {
            values: values
        });
    }
    
    const initialValues = {
        nome : route.params.nome,
        cpf : route.params.cpf,
        email: '',
        telefone : '',
        nascimento : route.params.data_de_nascimento,
    };


    const ValidationsSchema = yup.object({
        nome : yup.string().required().min(3),
        email : yup.string().email().required(),
        nascimento : yup.string().required().test('is-data-nascimento-valid', "Data de Nascimento Inválida", ( dataString )=>{
            let data = moment( dataString, 'DD/MM/YYYY');
            return data.isValid() && data.isBefore();
        }),
        cpf : yup.string().required().test( 'cpf-schema','CPF Inválido',(val)=>{
            return cpf.isValid( val )
        }),
        telefone: yup.string().required().min(11),

    });

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d',}}>
            <HeaderCadastro handleButtonBackTouched={ handleButtonBackTouched } />
            <KeyboardAwareScrollView behavior="position" >
                <ScrollView style={styles.form_container}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={ handleSubmit }
                        validationSchema={ValidationsSchema}
                    >

                        { ( props )=> (
                            <View style={{paddingTop: '10%'}}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Nome Completo</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="white"
                                        autoCorrect={false}
                                        autoCapitalize={'words'}
                                        value={props.values.nome}
                                        // onChangeText={ props.handleChange('nome')}
                                        // onBlur={props.handleBlur('nome')}
                                    />
                                    { props.errors.nome && <ErrorMessage  message={props.errors.nome}/>}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>CPF</Text>
                                    <TextInputMask
                                        style={styles.input}
                                        keyboardType="number-pad"
                                        type={'cpf'}
                                        value={props.values.cpf}
                                        // onChangeText={props.handleChange('cpf')}
                                        // onBlur={props.handleBlur('cpf')}
                                    />
                                    { props.errors.cpf && <ErrorMessage  message={props.errors.cpf}/> }
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
                                        // onChangeText={props.handleChange('nascimento')}
                                        // onBlur={props.handleBlur('nascimento')}
                                    />
                                    { props.errors.nascimento && props.touched.nascimento && <ErrorMessage  message={props.errors.nascimento}/> }
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>E-mail</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="white"
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        keyboardType="email-address"
                                        value={props.values.email}
                                        onChangeText={props.handleChange('email')}
                                        onBlur={props.handleBlur('email')}
                                    />
                                    { props.errors.email && props.touched.email && <ErrorMessage  message={props.errors.email}/> }
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
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={ props.handleSubmit }
                                        style={styles.botaoProximo}>
                                        <Text style={styles.textoBotao}>Próximo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            )
                        }
                    </Formik>
                </ScrollView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
    label : {
      color: "white",
      fontSize: 13,
      alignSelf: 'flex-start',
      fontWeight: 'bold',
      marginBottom: 0
    },
    form_container: {
        height: '100%',
        backgroundColor: '#1d1d1d',
        paddingTop: 25,
        marginBottom: 150
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
        marginTop: '8%',
    },
    textoBotao: {
        color: 'black',
        fontWeight: "bold",
        fontSize: 20
    }

});
