import React from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

export default function ModalLogout({modal, modalClose}) {

  const navigation = useNavigation()

  async function logout(){
    console.log('dfasd')
    await AsyncStorage.clear()
    navigation.navigate('Login')
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modal}
      onRequestClose={() => {
        modalClose(!modal);
      }}
    >
      <View style={ styles.background }>
        <View style={ styles.card }>
          <View style={ styles.header }>
            <Text style={ styles.title }>Deseja sair da sua conta?</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', }}>
            <TouchableOpacity
              style={[ styles.btnContainer, { backgroundColor: '#000000' } ]}
              onPress={() => modalClose(!modal)}
            >
              <Text style={ styles.formBtnText }>Cancelar</Text>
            </TouchableOpacity> 
            <TouchableOpacity
              style={[ styles.btnContainer, { backgroundColor: '#9b1712' } ]}
              onPress={() => logout()}
            >
              <Text style={ styles.formBtnText }>Sair</Text>
            </TouchableOpacity> 
          </View> 
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '60%',
    padding: '5%',
    minHeight: '25%',
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: '30%',
  },

  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 80,
    borderRadius: 5,
    
  },

  formBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

})