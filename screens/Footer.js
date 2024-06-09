import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Image, Text, Keyboard, ScrollView} from 'react-native';
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/MaterialIcons";
import ModalFeedBack from './ModalFeedBack';

export default function App(){

    const navigation = useNavigation();
    const [ footerPosition, setFooterPosition ] = useState(0 );
    const [ account, setAccount ] = useState('');
    const [ pdv, setPdv ] = useState('');
    
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState()

    Keyboard.addListener('keyboardDidShow', ()=>{
        setFooterPosition(-100);
    });

    Keyboard.addListener('keyboardDidHide', ()=>{
        setFooterPosition(0);
    });

    /* React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
          getUserAccount()

          //setAccount( account )
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]); */

    /* async function getUserAccount(){
        //return new Promise( async ( resolve, reject ) => {
            var pdv = await JSON.parse(await AsyncStorage.getItem('pdv'))
        
            if(pdv){
                setPdv(pdv)
                var account = await JSON.parse(await AsyncStorage.getItem('ac'))
                console.log('acc on footer: ', account)
                if(account){
                    setAccount(account)

                }
            }
        //});
    } */

    async function getUserAccount(){
        var pdv = await JSON.parse(await AsyncStorage.getItem('pdv'))
        if(pdv){
            var account = await JSON.parse(await AsyncStorage.getItem('ac'))
            console.log('acc on footer: ', account)
            if(account){                
                navigation.navigate('transacoes', { account : account })
            } else {
                setErrorMsg('Você ainda não tem transações neste estabelecimento\nFaça uma recarga para ter acesso ao seu extrato')
                setModalVisible(true)
            }
        } else {
            setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
            setModalVisible(true)
        }
    }

    return (
        <View style={{...styles.container, bottom: footerPosition }} elevation={5}>
            <ModalFeedBack title={''} visible={modalVisible} setModalVisible={setModalVisible}>
                <Icon name={"error"} size={60} color="red"/>
                <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
                    <Text style={styles.error_message}>{errorMsg}</Text>
                </ScrollView>
                <View style={{marginTop: '5%', width: '80%', alignItems: 'center',}}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#e1c897', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={{fontSize:22,color:'black',textAlign:'center',fontWeight:'bold'}}>Fechar</Text>
                    </TouchableOpacity>
                </View> 
            </ModalFeedBack>
            <TouchableOpacity style={styles.pressable} onPress={( ()=>{
                navigation.navigate('Principal');
            })}>
                <Image style={ styles.icons } source={require('../imagens/icones/home.png')} resizeMode={ImageResizeMode.contain} />
                <Text style={styles.label}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressable} 
                onPress={() => {                     
                    getUserAccount()
                }}>
                <Image style={ styles.icons } source={require('../imagens/icones/wallet.png')} resizeMode={ImageResizeMode.contain} />
                <Text style={styles.label}>Extrato</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressable} onPress={( ()=>{
                navigation.navigate('locais');
            })}>
                <Image style={ styles.icons } source={require('../imagens/icones/maps-and-flags.png')} resizeMode={ImageResizeMode.contain} />
                <Text style={styles.label}>Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressable} onPress={( ()=>{
                navigation.navigate('perfil');
            })}>
                <Image style={ styles.icons } source={require('../imagens/icones/user.png')} resizeMode={ImageResizeMode.contain} />
                <Text style={styles.label}>Perfil</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 0.1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: 3,
        alignContent: 'center',
        height: 70,
        width: '100%',
        backgroundColor: '#1D1D1D',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'red',
        shadowOffset: { height: 0, width: 0 },
        marginTop: 5,
        position: 'absolute',
        bottom: -10
    },
    pressable: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    icons:{
        height: 25,
        width: 25,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 10
    },
    label:{
        color: '#fff',
        fontSize: 11
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },

});

