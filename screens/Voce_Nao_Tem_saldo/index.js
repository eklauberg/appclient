import {
	View,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	Text,
	Image,
	StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../Api';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text'




  
	


export default function App() {



	const [cpfField, setCpfField] = useState('');	

	chamaTelaEscolhaLoginCadastro = async () => {

		navigation.navigate('PreLogin');
	}

    
	chamaTelaCadastro2 = async () => {

		navigation.navigate('FormCadastroPrimeiroPasso');
	}
	

const navigation = useNavigation();
	return (
        <View>

        <View style={styles.topo}>

            <View 
                style={{width: '40%',marginLeft:5}}
                >

                <TouchableOpacity
                        
                
                        onPress ={() => chamaTelaCadastro1()}
                        key={'TouchableOpacity1'}
                    >
                    <Icon name={"arrow-back"}  size={40} color="white" />
                </TouchableOpacity>
            </View>

            <View 
                style={{width: '40%'}}
            >

                <TouchableOpacity
                        style={{
                            borderWidth:1,
                            borderColor:'rgba(0,0,0,0.2)',
                            alignItems:'center',
                            justifyContent:'center',
                            width:50,
                            height:50,
                            backgroundColor:'white',
                            borderRadius:50,
                        }}
                        onPress={() => {
                        banco.deletaAnalise(botoesHistorico.key);
                        this.chamaHistorico();
                        }}
                        key={'TouchableOpacity2'}
                    >
                    <Icon name={"person"}  size={40} color="#9b1712" />
                </TouchableOpacity>
            </View>

            <View 
                style={{width: '33%'}}
            >

                <TouchableOpacity
                        
                        onPress={() => {
                        banco.deletaAnalise(botoesHistorico.key);
                        this.chamaHistorico();
                        }}
                        key={'TouchableOpacity3'}
                    >
                    <Image source={require("../../imagens/logos/logo-chopp-station-48x48.png")} size={40} />
                </TouchableOpacity>
            </View>

          
        
      

        </View>                    
    </View>              


          

			


        
	);
}


const styles = StyleSheet.create({

 
	topo: {

        height :60,
	
        backgroundColor : '#9b1712',
        
        flexDirection: 'row',

        alignItems : "center"
	
	},

    	
	corpo: {

        height :'100%',
      
        backgroundColor : '#1d1d1d',
        
        alignContent: "center",

        alignItems : "center",

        paddingTop : 25,
	
	},

    titulos :{
        color : "white",
        fontSize :15,
        fontWeight : "bold",
        alignSelf : 'flex-start',
        paddingLeft : '15%'
        
      
      
   
    },

	input: {

		borderColor: 'silver',
		borderRadius: 50,
		borderWidth: 1,
		marginBottom: 15,
        paddingLeft: 10,
        fontSize :18,
        textAlign : "left",
        color: "white",
        width: '80%',
        height : 35,
	},

    botaoAcessar: {
	
		width: '60%',
		backgroundColor: '#e1c897',
		borderRadius:10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 35,
		marginTop: 10,
	},

	textoBotao: {
		color: 'black',
		fontWeight: "bold",
		fontSize : 20
	
  	},

    box: {
   
 
    
       

      
    },


	});
