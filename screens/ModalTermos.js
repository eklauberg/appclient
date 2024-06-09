import React from 'react'
import { StyleSheet, View, Image, Modal, Text, ScrollView, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'

import api from '../Api'

export default class TermosUso extends React.Component{

  constructor(props) {
    super( props );
    this.state = {
      scrollEnd: false
    }
  }
  
  render = () => {

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <script>
      </script>
      <body>        
        ${this.props.termos}
      </body>
    </html>`;

    return(
      <Modal 
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.refuse()
        }}
      >
        <View style={ styles.centeredView }>
          <View style={ styles.imageContainer }>
            <Image style={ styles.image } source={require('../imagens/logos/logo-chopp-station-96x96.png')} />
          </View>

          <View style={ styles.modalHeader }>
            <Text style={ styles.title }>Termos de Uso</Text>
          </View>

          <View style={ styles.webViewContainer }>
            <WebView 
              originWhitelist={['*']}
              javaScriptEnabled={true}
              source={{ html }}
            />
          </View>
            { this.props.onClose ? 
              (
                <View style={ styles.modalBtnRow }>
                  <TouchableOpacity 
                    style={ styles.btnClose }
                    onPress={(e) => this.props.onClose(false)}
                  >
                    <Text style={ styles.btnTextBlack }>Fechar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={ styles.modalBtnRow }>
                  <TouchableOpacity 
                    style={ styles.btnDeny }
                    onPress={(e) => this.props.refuse()}
                  >
                    <Text style={ styles.btnText }>Recusar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={ styles.btnAccept }
                    onPress={(e) => this.props.accept()}
                  >
                    <Text style={ styles.btnText }>Aceitar</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          
        </View>

      </Modal>

    )
  }

}

const styles = StyleSheet.create({

  centeredView: {
    width: '90%',
    maxHeight: '90%',
    marginTop: "10%",
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  image:{
    width: 60,
    height: 60,
  },

  modalHeader: {
    width: '95%',
    height: 55,
    justifyContent: 'center',
    borderColor: '#e1c897',
    borderBottomWidth: 1.5
  },

  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', 
    textAlign: 'center',
  },

  webViewContainer: {
    width: '95%',
    height: '60%',
    marginTop: 10,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  modalBtnRow: {
    flexDirection: 'row',
    width: '90%',
    marginVertical: '4%',
    justifyContent: 'space-evenly',    
  },

  btnDeny: {
    width: '40%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8c1313',
    borderRadius: 8,
  },

  btnAccept: {
    width: '40%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#304a22',
    borderRadius: 8,
  },

  btnClose: {
    width: '40%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1c897',
    borderRadius: 8,
  },

  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },

  btnTextBlack: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },



})