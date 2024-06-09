import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View, ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import React, {useEffect, useState} from 'react';
import {Divider} from 'react-native-paper';
import Footer from "../Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import httpClient from "../../Request";
//import Icon from 'react-native-vector-icons/Entypo';
import Icon from "react-native-vector-icons/MaterialIcons";

import ModalFeedBack from '../ModalFeedBack';
import { normalize } from 'react-native-elements';

export default function App() {

    const [selectedPdv, setSelectedPdv] = useState({})
    const [ModalMenu, setModalMenu] = useState(false);
    const [user, setUser] = useState('');
    const [account, setAccount] = useState({});

    const [modalVisible, setModalVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')

    const navigation = useNavigation();

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("pdv");
        await AsyncStorage.removeItem("ac")

        navigation.navigate('Login');
    }

    async function navigateTo(screen) {
        if (screen === 'sair') {
            return logout();
        }

        navigation.navigate(screen);
    }

    async function loadUserFromStorage () {
        return new Promise( async ( resolve, reject )=> {
            var userRaw = await JSON.parse( await AsyncStorage.getItem("user"));

            if (userRaw === null) {
                navigateTo('Login');
                return;
            }
            setUser(userRaw);

            var pdv = await JSON.parse(await AsyncStorage.getItem("pdv"))
            setAccount('')
            await AsyncStorage.removeItem('ac')

            setSelectedPdv(pdv)
            if(pdv){
                fethUserAccounts(userRaw, pdv)
            }
            resolve();
        });
    }

    React.useEffect(() => {
        
        const unsubscribe = navigation.addListener('focus', async () => {
            await loadUserFromStorage();
        });

        return unsubscribe;
      }, [navigation]);

    async function fethUserAccounts (user, pdv){
        
        try {
            const response = await httpClient.get(`/user/account/${user.id}/${pdv.id}`);
            
            if( response.status === 200 ){
                //console.log('//////////////////////////////////////////////////////')
                //console.log("acc: ", response.data[0])
                //console.log('//////////////////////////////////////////////////////') */

                if(response.data[0] !== undefined){
                    setAccount( response.data[0] );
                    await AsyncStorage.setItem('ac', JSON.stringify(response.data[0])  )
                }
            }

        }catch ( error ){
            if( error.response !== undefined ){
                return handleErrorResponse( error.response );
            }
            Alert.alert("Erro", "Erro ao Efetuar busca");
        } /* finally {
            console.log('acc data: ', account)
            console.log('pdv selected ', selectedPdv)
        } */
    }

    const handleErrorResponse = async (response) => {

        //server error
        if (response.status === 500) {
            setErrorMsg('Não foi possível obter os dados da sua conta, tente novamente mais tarde')
            setModalVisible(true)
        }
    }

    return (
        <SafeAreaView style={styles.background} onPress={() => setModalMenu(!ModalMenu)}>

            <ModalFeedBack title={''} visible={modalVisible} setModalVisible={setModalVisible}>
                <Icon name={"error"} size={60} color="red"/>
                <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
                    <Text style={styles.error_message}>{errorMsg}</Text>
                </ScrollView>
                <View style={{marginTop: '5%', width: '80%', alignItems: 'center',}}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#e1c897', justifyContent: 'center', borderRadius: 10, height: 40, width: '65%',}}
                        onPress={() => {
                            if(errorMsg.includes('selecionar um estabelecimento')){
                                navigateTo('locais')
                            }
                            setModalVisible(false)
                        }}
                    >
                        <Text style={{fontSize:20,color:'black',textAlign:'center',fontWeight:'bold'}}>{errorMsg.includes('selecionar um estabelecimento')?'Selecionar Chopp Station':'Fechar'}</Text>
                    </TouchableOpacity>
                </View> 
            </ModalFeedBack>
            
            <View style={{height: '30%', alignContent: 'flex-start',}}>
                <Image style={ styles.bg_image } source={require("../../imagens/fundos/header-bg.png")} resizeMode={ImageResizeMode.contain}/>
                <View style={ styles.header_container }>
                    <View style={{ flexDirection: 'row', alignItems: 'center', left: '2%', width: '80%'}}>
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                        >
                            <Icon color="#DFC695" name="more-vert" size={35} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1D1D1D', height: '75%', width: '80%',borderRadius: 15,  }}
                            onPress={() => navigateTo('locais')}
                        >
                            <Icon style={{ marginHorizontal: '1%' }} color="white" name="expand-more" size={20} />
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: normalize(14)}} >{selectedPdv ?.nome_fantasia || 'Selecionar CHOPP STATION'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: '2%',}}>
                        <Image style={{width: 50, height: 60}} source={require("../../imagens/logos/new-logo-chopp.png")} />
                    </View>
                </View>
                <View style={{ height: '70%', alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={styles.titulos}>Olá, {user.name}!</Text>
                    <View style={ styles.saldoView }>
                        <Text style={ styles.titulosSaldo }>Seu saldo: </Text>
                        <View style={{ flexDirection: 'row',}}>
                            {  selectedPdv ?
                                (
                                    <>
                                        { account.balance_formated ? 
                                            (   
                                                <>
                                                    <Text style={ styles.sifrao }>R$ </Text>
                                                    <Text style={ styles.inputSaldo }>{ account.balance_formated }</Text>
                                                </>
                                            ) : (
                                                <TouchableWithoutFeedback
                                                    style={{width: '95%'}}
                                                    //onPress={() => navigation.navigate('selecionar-cartao', { pos: selectedPdv })}
                                                    onPress={() => navigateTo('locais')}
                                                >
                                                    <Text style={ styles.semSaldo }>{'Não possui Creditos neste esbalecimentos.\nSelecione outro estabelecimento ou recarregue no ponto de venda'}</Text>
                                                    {/* <Text style={ styles.semSaldo }>Não possui Creditos neste esbalecimentos. Use "Adicionar Créditos" para fazer uma recarga</Text> */}
                                                </TouchableWithoutFeedback>
                                            )    
                                        }
                                    </>
                                    
                                ) : (
                                    <TouchableWithoutFeedback
                                        style={{width: '95%'}}
                                        onPress={() => navigateTo('locais')}
                                    >
                                        <Text style={ styles.semSaldo }>Selecione um estabelecimentos para vizualizar o saldo</Text>
                                    </TouchableWithoutFeedback>
                                )
                            }
                        </View>
                    </View>
                </View>
            </View>
                
            
            <View style={{height: '60%', alignContent: 'flex-start'}}>
                <ScrollView style={{paddingTop: '8%'}}>
                <View style={styles.menu_container}>
                        
                        <View style={ styles.icon_container }>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => { 
                                    if(selectedPdv){
                                        if(account){
                                            navigation.navigate('transacoes', { account : account })
                                        }else{
                                            setErrorMsg('Você ainda não tem transações neste estabelecimento\nFaça uma recarga para ter acesso ao seu extrato')
                                            setModalVisible(true)
                                        }
                                    } else {
                                        setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
                                        setModalVisible(true)
                                    }
                                }} 
                            >
                                <Image style={ styles.iconImg } source={require("../../imagens/icones/extrato.png")}/>
                                <Text style={ styles.iconLabel }>Extrato</Text>
                            </TouchableOpacity>
                        </View> 

                        <View style={ styles.icon_container }>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}
                                onPress={() => { 
                                    /* if(selectedPdv){
                                        navigation.navigate('selecionar-cartao', { pos: selectedPdv })
                                    } else {
                                        setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
                                        setModalVisible(true)
                                    } */
                                    setErrorMsg('Em Breve...')
                                    setModalVisible(true)
                                }}
                            >
                                <Image style={[ styles.iconImg , { opacity: 0.5 }]} source={require("../../imagens/icones/recarga.png")}/>
                                <Text style={[ styles.iconLabel, { marginTop: '3%' } ]}>{'Adicionar Créditos'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ styles.icon_container }>
                            <TouchableOpacity 
                                style={{ justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => { navigateTo('locais') }}
                            >
                                <Image style={ styles.iconImg } source={require("../../imagens/icones/localizar.png")}/>
                                <Text style={ styles.iconLabel }>{'Buscar\nCHOPP STATION'}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={ styles.icon_container }>
                            <TouchableOpacity 
                                style={{ justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => { navigateTo('perfil') }}
                            >
                                <Image style={ styles.iconImg } source={require("../../imagens/icones/perfil.png")}/>
                                <Text style={ styles.iconLabel }>Perfil</Text>
                            </TouchableOpacity>
                        </View>
                        

                        {/* <View style={ styles.icon_container }>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => { navigateTo('nfc-activator') }}>
                                <Image style={ styles.iconImg } source={require("../../imagens/icones/nfc.png")}/>
                                <Text style={ styles.iconLabel }>Aproximação</Text>
                            </TouchableOpacity>
                        </View> */}

                        <View style={ styles.icon_container }>
                            <TouchableOpacity 
                                style={{ justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => { 
                                    if(selectedPdv){
                                        if(account){
                                            navigation.navigate('qr-code')
                                        }else{
                                            setErrorMsg('Você ainda não tem conta neste estabelecimento\nFaça uma recarga para ter acessar o leitor')
                                            setModalVisible(true)
                                        }
                                    } else {
                                        setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
                                        setModalVisible(true)
                                    }
                                }}
                            >
                                <Image style={ styles.iconImgQr } source={require("../../imagens/icones/qr-code.png")}/>
                                <Text style={ styles.iconLabel }>Liberar Torneira</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </View>
            <Footer/>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },

    header_container: {
        flexDirection: 'row',
        height: '20%',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: '2%',
    },

    titulos: {
        width: '90%',
        color: "white",
        fontSize: normalize(20),
        fontWeight: 'bold',
        marginVertical: '2%',
    },

    saldoView: {
        backgroundColor: '#2E2E2E',
        width: '90%',
        height: '50%',
        alignItems: 'center',
        borderRadius: 10,

    },

    titulosSaldo: {
        color: "white",
        fontSize: normalize(14),
        width: '95%',
    },

    sifrao: {
        color: 'white',
        paddingTop: 7,
        textAlign: 'right',
        textAlignVertical: 'top',
    },

    inputSaldo: {
        fontSize: normalize(30),
        textAlignVertical: 'top',
        color: 'white',
        fontWeight: 'bold',
    },

    semSaldo: {
        fontSize: normalize(11),
        width: '95%',
        marginTop: '1%',
        color: 'white',
        fontWeight: 'bold',
    },

    menu_container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        flexWrap: 'wrap',
        //borderWidth: 1
    },

    icon_container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '35%',
        marginHorizontal: '5%',
        paddingVertical: '3%',
    },

    iconBtn: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconImg: {
        width: normalize(45),
        height: normalize(45),
        resizeMode: 'contain',        
    },

    iconImgQr: {
        marginTop: '5%',
        width: normalize(70),
        height: normalize(70),
        resizeMode: 'contain',        
    },

    iconLabel: {
        marginTop: '5%',
        textAlign: 'center',
        fontWeight: "bold",
    },

    inputBusca: {
        backgroundColor: "#F4E8CE",
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        marginTop: '2%',
        fontSize: normalize(10),
        paddingHorizontal: 10,
        textAlign: "left",
        color: "#8A8477",
        width: '90%',
        height: 45,
        marginLeft: '5%',
        alignSelf: "center"
    },


    botaoSair: {
        marginLeft: '30%',
        width: '35%',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 30,
    },

    botaoSouMaior: {
        marginLeft: '10%',
        width: '80%',
        backgroundColor: '#2f4b12',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 30,
    },

    textoSair: {
        color: '#9b1712',
        fontWeight: "bold",
        fontSize: 20
    },

    textoSouMaior: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 20
    },
    
    containerLogo: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",

    },
    
    container: {
        flex: 1.8,
        width: '80%',
        alignContent: "center",
    },
    
    tituloRodape: {
        color: "#dfc695",
        fontSize: 12,
        alignItems: "center",
        textAlign: "left",
        marginLeft: '5%',
    },
    
    iconesRodape: {
        marginTop: 10
    },
    
    container_menu: {
        alignSelf: 'flex-start',
        width: (Dimensions.get('window').width - (Dimensions.get('window').width / 2)) + 50,
        height: Dimensions.get('window').height - 70,
        backgroundColor: "white",
        marginBottom: 40
    },
    
    card_container: {
        flexDirection: 'row',
        backgroundColor: "#363636",
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingBottom: '10%',
        paddingLeft: 10,
    },
    
    rounded_image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
    },
    
    edit_text: {
        marginLeft: 10,
        color: '#666666',
        fontSize: 14,
        letterSpacing: .2,
        fontWeight: "bold",
        justifyContent: "center",
        alignContent: "center"
    },
    
    user_name_text: {
        color: "white",
        fontSize: 16,
        letterSpacing: .2,
        fontWeight: "bold",
        marginLeft: 10,
    },
    
    list_menu_container: {
        backgroundColor: "#363636"
    },
    
    bg_image: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.98,
    },

    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },
    

});