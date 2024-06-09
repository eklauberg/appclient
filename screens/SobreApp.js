import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Linking, SafeAreaView } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import Header from "./Header";

import api from '../Api'

import TermosUso from "./ModalTermos";

export default function SobreApp(){

  const [useTerms, setUseTerms] = useState('')
  const [modalTermos, setModalTermos] = useState(false)

  const navigation = useNavigation();

  async function getTermos(){
    await api.termosDeUso()
      .then(res => {
        setUseTerms(res.termos.termos)
      })
  }

  useEffect(() => {
    getTermos()
  }, [])

  return(
    <SafeAreaView style={ styles.container }>
      <TermosUso termos={useTerms} visible={modalTermos} onClose={setModalTermos}/>
      <Header title={"ChoppStation"}/>
      <View>
        <View style={ styles.infoBox }>
          <Text style={ styles.infoText }>ChoppStation</Text>
          <Text style={ styles.infoText }>v1.0.0</Text>
          <Text style={ styles.infoText }>30/08/2021</Text>
        </View>
        <View style={ styles.descriptionBox }>
          <Text style={ styles.descriptionText }>Texto ChoppStation</Text>
        </View>
        <View style={ styles.linksContainer }>

          <Text style={ styles.links } onPress={() => {Linking.openURL('https://www.choppstation.com.br/')}}>Site</Text>
          
          {/* <TouchableOpacity
            style={ styles.linkBtn}
            onPress={ () => {console.log('Email')}}
          >
            <Text style={ styles.links }>E-mail</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={ styles.linkBtn}
            onPress={ () => {setModalTermos(true)}}
          >
            <Text style={ styles.links }>Termos de Uso</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={ styles.licenses }>
        <Text style={ styles.licencesText }>
          {'Icons made by '}
          <Text style={{textDecorationLine: 'underline'}} onPress={() => {Linking.openURL('https://www.flaticon.com/authors/pixel-buddha')}}>Pixel Buddha</Text>
          {' from '}
          <Text style={{textDecorationLine: 'underline'}} onPress={() => {Linking.openURL('https://www.flaticon.com/')}}>www.flaticon.com</Text>
        </Text>
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  infoBox: {
    alignItems: 'center',
    marginVertical: '5%',
  },

  infoText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },

  descriptionBox: {
    alignItems: 'center',
  },

  descriptionText: {
    fontSize: 14
  },

  linksContainer:{
    height: '30%',
    marginVertical: '5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  linkBtn: {
    marginVertical: '2%',
  },  

  links: {
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
    letterSpacing: .3,
    margin: '2%',
  },

  licenses: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  licensesText: {
    fontSize: 14,
    letterSpacing: .3,
  },

})