import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import httpClient from "../Request";
import QRCodeScanner from 'react-native-qrcode-scanner';

import Icon from "react-native-vector-icons/MaterialIcons";
import ModalFeedBack from './ModalFeedBack';

import Header from "./Header";

export default function QrCode(){

  const [ modalFail, setModalFail ] = useState(false)
  const [ modalSuccess, setModalSuccess ] = useState(false)

  const [ errorMsg, setErrorMsg ] = useState('')

  const [ loading, setLoading ] = useState(false)

  const navigation = useNavigation()

  async function liberarChopp(chopeira){
    var account = await JSON.parse(await AsyncStorage.getItem("ac"))

    const acNumber = account.card_identification
    try{
      setLoading(true)
      const res = await httpClient.get(`/push-qrcode-read/${acNumber}/${chopeira}`)

      if(res.status === 200){
        setModalSuccess(true)
      }

    }catch (err){
      //console.log('deu errpo: ', err)
      if(err.toString().includes("404")){
        setModalFail(true)
        setErrorMsg('Esse código não corresponde a uma estação da ChoppStation!')
        return
      }

      if(err.toString().includes("422")){
        setModalFail(true)
        setErrorMsg('Esse código não corresponde a uma estação do estabelecimento selecionado.\nFavor, verifique o estabelecimento selecionado e tente novamente.')
        return
      }
    }finally{
      setLoading(false)
    }
    
  
  }

  function finish(){
    setModalFail(false)
    setModalSuccess(false)
    navigation.navigate('Principal')
  }

  return (
    <SafeAreaView style={ styles.container }>

      <ModalFeedBack title={'Erro de identificação'} visible={modalFail} setModalVisible={setModalFail}>
        <Icon name={"error"} size={60} color="red"/>
        <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
          <Text style={styles.error_message}>{errorMsg}</Text>
        </ScrollView>
        <View style={{marginTop: '5%', width: '80%', alignItems: 'center',}}>
          <TouchableOpacity
            style={{ backgroundColor: '#e1c897', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
            onPress={() => finish()}
          >
            <Text style={{fontSize:22,color:'black',textAlign:'center',fontWeight:'bold'}}>Fechar</Text>
          </TouchableOpacity>
        </View> 
      </ModalFeedBack>

      <ModalFeedBack title={'Sucesso'} visible={modalSuccess} setModalVisible={setModalSuccess}>
        <Icon style={{marginTop: '5%'}} name={"check-circle"} size={40} color="green"/>
        <View style={{marginTop: '5%', width: '80%', justifyContent: 'center', }}>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Chopeira</Text>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', }}>Liberada</Text>
        </View>
        <View style={{marginTop: '10%', width: '80%', alignItems: 'center',}}>
          <TouchableOpacity
            style={{ backgroundColor: '#304a22', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
            onPress={() => finish()}
            key={'TouchableOpacity1'}
          >
            <Text style={{fontSize:22,color:'white',textAlign:'center',fontWeight:'bold'}}> Concluir </Text>
          </TouchableOpacity>
        </View>

      </ModalFeedBack>
      <Header title={"Liberar Torneira"}/>

      <View style={ styles.descriptionView }>
        <View style={ styles.image }>
          <Image style={ styles.iconImg } source={require("../imagens/icones/qr-code.png")}/>
        </View>
        <Text style={ styles.description }>{'Use a camera do seu celular para fazer a leitura do código na estação de chopp'}</Text> 
      </View> 

      <View style={ styles.scannerView }>
        <QRCodeScanner
          onRead={(e) => liberarChopp(e.data)}
          fadeIn={true}
          reactivate={true}
          reactivateTimeout={3000}
          showMarker={true}     
          topContent={(
            <View>
              { loading &&
                <ActivityIndicator animating={loading} size="large" color="#990000"/>
              }
            </View>
          )}     
          customMarker={(
            <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
              <View style={{width: '100%', height: '20%', backgroundColor: "rgba(0,0,0,0.5)", }} /> 
              <View style={{ height: '62%', width: '100%', flexDirection: 'row', }}>
                <View style={{ height: '100%', width: '20%', backgroundColor: "rgba(0,0,0,0.5)" }} />
                <View style={{height: '100%', width: '61%', backgroundColor: "transparent", borderColor: 'lime', borderWidth: 1 }} />
                <View style={{ height: '100%', width: '20%', backgroundColor: "rgba(0,0,0,0.5)" }} />
              </View>
              <View style={{width: '100%', height: '20%', backgroundColor: "rgba(0,0,0,0.5)", }} /> 
            </View>
          )}
        />  
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },

  descriptionView: {
    flexDirection: 'row',
    height: '30%',
    backgroundColor: '#dddddd',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  
  image: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconImg: {
    width: 75,
    height: 75,
    resizeMode: 'contain',        
  },
  
  description: {
    height: 100,
    width: 200,
    fontSize: 16,
    paddingHorizontal: '1%',
    textAlign: 'left',
    textAlignVertical: 'center',
  },

  scannerView: {
    flex: 1,
    alignSelf: 'center'
  },

  error_message: {
    marginTop: '2%',
    color: 'black',
    fontWeight: "bold",
    textAlign: 'center',
  },
})