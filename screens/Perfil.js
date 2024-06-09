import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";
import moment from "moment";
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import {Formik} from "formik";
import ErrorMessage from './Partials/ErrorMessage';
import {TextInputMask} from 'react-native-masked-text';
import EditarFotoCard from "./EditarFotoCard";
import httpClient from '../Request';
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalFeedBack from "./ModalFeedBack";
import Loader from "./Loader";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from "@react-navigation/native";

export default function App(props){

    const navigation = useNavigation();
    
    const [loading, setLoading ] = useState();
    const [modalVisible, setModalVisible ] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false)
    const [ user, setUser ] = useState({});
    const [ validationErrors, setValidationErrors] = useState([]);

    const bs = React.createRef();
    const fall = new Animated.Value(1);

    const takePhotoFromCamera = () => {
        const options = {
            noData: true,
            selectionLimit: 1
        }

        launchCamera(options, async response => {
            if (response.assets) {
                await uploadFoto( response.assets[0] );
            }
            
        })  

        bs.current.snapTo(1)
      
    }
    
      const choosePhotoFromLibrary = () => {
        const options = {
            noData: true,
            selectionLimit: 1
        }

        launchImageLibrary(options, async response => {
            if (response.assets) {
                await uploadFoto( response.assets[0] );
                
            }
            console.log( response);

        })  
        bs.current.snapTo(1)
      }

      const renderInner = () => (
    
        <View style={styles.panel}>            
          <ScrollView>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Enviar Foto</Text>
                <Text style={styles.panelSubtitle}>Escolha sua foto</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={ takePhotoFromCamera }>
                <Text style={styles.panelButtonTitle}>Usar a Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Escolher da Galeria de Fotos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    
      const renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
      );
    
      

    const loadUserFromStorage = async ()=>{
        try {
            const user = await AsyncStorage.getItem('user');
            //console.log( 'Perfil',user )

            setUser( JSON.parse( user ) );
          } catch(e) {
            console.log(e);
          }  

    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadUserFromStorage()
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

    
    

    const handleErrorResponse = async (response) => {

        //validation error
        if (response.status === 422) {
            console.log("Caiu dentro do IF");
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    setValidationErrors([validationErrors, val])
                })
            });

            setModalVisible(true );

            return;
        }

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar a requisição, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }




    const uploadFoto = async ( photo )=>{
        setLoading( true );
        try {
            let formData = new FormData();

            formData.append("image",{
                name: photo.fileName,
                type: photo.type,
                uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
            })

            const response = await httpClient.post('/user-profile-picture', formData ,{
                headers: {
                    'Content-Type' : 'multipart/form-data',
                }
            });

            console.log( "=========================================================");
            console.log( "RESPONSE", response.data );
            console.log( "=========================================================");
            if( response.status === 200 )
            {
                AsyncStorage.setItem("user", JSON.stringify( response.data.user ) );

                setUser( response.data.user );
            }
        } catch (error) {
            console.log( error );
        } finally{
            setLoading( false );
        }
    };

    const handleSubmit = async (values) => {

        try {
            setLoading( true );
            let payload;
            
            if(values.senha){
                payload = {
                    name : values.name,
                    data_nascimento : values.nascimento,
                    celular : values.celular,
                    email: values.email,
                    senha: values.senha,
                    senha_confirmation: values.confirmar_senha
                };
            } else {
                payload = {
                    name : values.name,
                    data_nascimento : values.nascimento,
                    celular : values.celular,
                    email: values.email,
                };
            }

            let response = await httpClient.put('/user',  payload );
            console.log('wfwfwfwwf', payload)

            if (response.status === 200) {
                const userAtt = {
                    id: response.data.id,
                    name: response.data.name,
                    celular: response.data.celular,
                    cpf: response.data.cpf,
                    email: response.data.email,
                    nascimento: response.data.nascimento_formatted,
                    profile_image: user.profile_image,
                    uuid: response.data.uuid,
                }

                await AsyncStorage.setItem('user', JSON.stringify( userAtt ) )
                //Alert.alert("Perfil Atualizado", "Perfil Atualizado com Sucesso");
                setModalSuccess(true)
            }

        } catch (error) {
            let response = error.response;

            //console.log( response );
            if (response !== undefined) {
                handleErrorResponse(response);
                return;
            }

            Alert.alert('Erro', error.message);
        }finally {
            setLoading( false );
        }
    }    

    const initialValues = {
        name: user.name,
        email: user.email,
        celular: user.celular || '',
        nascimento: user.nascimento || '',
        senha: '',
        confirmar_senha: ''

    };

    const ValidationsSchema = yup.object({
        name: yup.string().required("Nome é Obrigatório").min(3),
        email: yup.string().email("E-mail inválido").required(),
        nascimento: yup.string().required().test('is-data-nascimento-valid', "Data de Nascimento Inválida", (dataString) => {
            let data = moment(dataString, 'DD/MM/YYYY');
            return data.isValid() && data.isBefore();
        }),
        senha : yup.string().min(8),
        celular : yup.string().required().min(14),
        confirmar_senha: yup.string().min(8)
    });



        return (
            <SafeAreaView style={{flex: 1}}>
                <ModalFeedBack title={'Atualizar Perfil'} visible={modalVisible} setModalVisible={setModalVisible}>
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

                <ModalFeedBack title={'Atualizar Perfil'} visible={modalSuccess} setModalVisible={setModalSuccess}>
                    <Icon style={{marginTop: '5%'}} name={"check-circle"} size={40} color="green"/>
                    <View style={{marginTop: '5%'}}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Dados</Text>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Atualizados</Text>
                    </View>
                    <View style={{marginTop: '10%', width: '80%', alignItems: 'center',}}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#304a22', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                            onPress={() =>  setModalSuccess(false)}
                            key={'TouchableOpacity1'}
                        >
                            <Text style={{fontSize:22,color:'white',textAlign:'center',fontWeight:'bold'}}> Concluir </Text>
                        </TouchableOpacity>
                    </View>

                </ModalFeedBack>

                <Header title={"Editar Conta"}/>

                <KeyboardAwareScrollView>
                    <BottomSheet
                        ref={bs}
                        snapPoints={[530, 0]}
                        renderContent={renderInner}
                        renderHeader={renderHeader}
                        initialSnap={1}
                        callbackNode={fall}
                        enabledGestureInteraction={true}
                        enabledContentTapInteraction={false}
                    />
                    <View style={styles.container}>
                        <View style={styles.image_container}>
                            <EditarFotoCard user={user} bs={bs}/>
                        </View>
                        <View style={styles.form_container}>
                            <Formik
                                enableReinitialize={true}
                                initialValues={initialValues}
                                onSubmit={ ( values, options)=>{
                                    handleSubmit( values );
                                } }
                                validationSchema={ValidationsSchema}
                            >

                                {(props) => (

                                    <View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Nome Completo</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor="black"
                                                autoCorrect={false}
                                                value={props.values.name}
                                                onChangeText={props.handleChange('name')}
                                                onBlur={props.handleBlur('name')}
                                            />
                                            {props.errors.nome && <ErrorMessage message={props.errors.nome}/>}
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
                                            {props.errors.nascimento && props.touched.nascimento &&
                                            <ErrorMessage message={props.errors.nascimento}/>}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>E-mail</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor="white"
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                value={props.values.email}
                                                onChangeText={props.handleChange('email')}
                                                onBlur={props.handleBlur('email')}
                                            />
                                            {props.errors.email && props.touched.email &&
                                            <ErrorMessage message={props.errors.email}/>}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Celular (DDD)</Text>
                                            <TextInputMask
                                                type="cel-phone"
                                                style={styles.input}
                                                placeholderTextColor="white"
                                                keyboardType="number-pad"
                                                autoCorrect={false}
                                                value={props.values.celular}
                                                onChangeText={props.handleChange('celular')}
                                                onBlur={props.handleBlur('celular')}
                                            />
                                            {props.errors.celular && props.touched.celular &&
                                            <ErrorMessage message={props.errors.celular}/>}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Senha</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor="white"
                                                autoCorrect={false}
                                                value={props.values.senha}
                                                onChangeText={props.handleChange('senha')}
                                                onBlur={props.handleBlur('senha')}
                                                secureTextEntry={true}
                                            />
                                            {props.errors.senha && props.touched.senha &&
                                            <ErrorMessage message={props.errors.senha}/>}
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Confirmar Senha</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor="white"
                                                autoCorrect={false}
                                                value={props.values.confirmar_senha}
                                                onChangeText={props.handleChange('confirmar_senha')}
                                                onBlur={props.handleBlur('confirmar_senha')}
                                                secureTextEntry={true}
                                            />
                                            {props.errors.confirmar_senha && props.touched.confirmar_senha &&
                                            <ErrorMessage message={props.errors.confirmar_senha}/>}
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                onPress={ props.handleSubmit }
                                                style={styles.botaoProximo}>
                                                <Text style={styles.textoBotao}>Salvar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                                }
                            </Formik>
                        </View>
                    </View>

                </KeyboardAwareScrollView>
                <Footer />
                { loading && <Loader />}
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
        paddingTop: '4%',
        paddingBottom: 100,
    },

    label: {
        color: "black",
        fontSize: 12,
        alignSelf: 'flex-start'
    },
    form_container: {
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 20,
        paddingHorizontal: '5%',
        paddingVertical: '5%'
        // paddingLeft: 10,
        // paddingRight: 10,
        // paddingBottom: 10,
        // marginHorizontal: '20%'

    },
    inputContainer: {
        marginLeft: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        marginRight: 5,
        marginBottom: 3
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 2,
        borderColor: '#8B8B8B',
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
        height: 45,
        marginTop: '3%',
        marginBottom: '10%'
    },
    textoBotao: {
        color: 'black',
        fontWeight: "bold",
        fontSize: 20
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
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 100,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.7,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
    },

    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#9b1712',
        alignItems: 'center',
        marginVertical: '2%',
    },

    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },

    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },

    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },

    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },

});