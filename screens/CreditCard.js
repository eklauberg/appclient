import * as React from 'react'
import {
  Alert, SafeAreaView, View,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native';
import Footer from '../screens/Footer'
import Header from '../screens/Header'
import CreditCard from 'fork-react-native-credit-card-form-ui';
//import RNJuno from 'react-native-juno';
import httpClient from '../Request'
import { TabRouter, useNavigation } from '@react-navigation/native';

export default function App( { route } ) {
  const creditCardRef = React.useRef();
  const navigation = useNavigation();

  const handleSubmit = React.useCallback( async () => {

    if (creditCardRef.current) {
      try {
        const { error, data } = creditCardRef.current.submit();
         
         let mesExpiracao = data.expiration.split('/')[0]
         let anoExpiracao = data.expiration.split('/')[1]
  
        let cardHash = await getCardHash( data.number, data.holder, data.cvv, mesExpiracao, anoExpiracao );


        registerCreditCard( cardHash, data.brand )
        
      } catch (error) {

          console.log( error )
      }
    }
  }, []);


  const registerCreditCard = async ( hash, bandeira )=>{
      try {
        console.log("========================================================");
        console.log( hash );
        console.log("========================================================");

        let response = await httpClient.post('credit-card', {
            hash: hash,
            bandeira : bandeira
        });

        console.log("========================================================");
        console.log( response );
        console.log("========================================================");
        
        if( response.status == 201 ){
            navigation.navigate('recarga', { cartao :response.data, pos : route.params.pos })
        } 
      } catch (error) {
        console.log("========================================================");
        Alert.alert('Erro', `Err: ${error.message}`)
        console.log('err', error.response );
        console.log("========================================================");
      }
  }

  const getCardHash = async ( number, nome, cvv, mes, ano ) =>{
    return new Promise( ( resolve, reject )=>{
        RNJuno.initialize('BD0ED67FEE0A99B48C1BB3A743ADA24F715653E349A4F7B4D2C14FD12CF61FEE8DD02FADA4715566', true );

        RNJuno.getCardHash( number, nome, cvv, mes, ano, (error, data) => {
            if (error) {
                console.log('err hash: ', error)
                reject( error );
            } else {
                console.log("Token", data );
               resolve( data );
            }
        });
    } )
}

  return (
    <SafeAreaView style={{flex: 1}}>
        <Header title="Adicionar Cartão" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={10}
          style={styles.container}
        >
          <View style={{ justifyContent: "center", alignContent:"center", marginVertical: '8%', }}>
            <Text style={{ fontWeight: "bold", fontSize: 18}}>Insira os dados do seu cartão</Text>
          </View>
        
          <CreditCard placeholderTextColor={'#615c5c'} background={'#242121'} ref={creditCardRef} />  
        
          <TouchableOpacity 
            style={{ 
              width: '80%',
              backgroundColor: '#e1c897',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              marginTop: 10
            }} 
            onPress={handleSubmit}
          >
            <Text style={{ color: 'black', fontWeight: "bold", fontSize: 22, }}>Próximo</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Footer /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
});