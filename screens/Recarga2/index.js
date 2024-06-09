import {
	View,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	Text,
	Image,
	StyleSheet,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../Api';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text'
import Header from "../Header";



  
	


export default function App() {



	const [cpfField, setCpfField] = useState('');	



    
	chamaTelaPrincipal = async () => {

		navigation.navigate('Principal');
	}
	

const navigation = useNavigation();
	return (

        <View  style={{backgroundColor : ' #22142b'}}>
            <Header title={"Recarga"}/>



            <View alignItems="center" marginTop='5%' >
                <Text style={{fontSize:24,color:'black'}}>Créditos</Text>
            </View>

           
            
            <View backgroundColor='white' alignSelf='center' width='90%' height='50%' marginBottom='30%' >

                <Text style={{marginTop:'5%', marginLeft:'5%'}}>Estabelecimento 1 </Text>

                 

                <SafeAreaView 
                  
                >

            </SafeAreaView>  
        </View>   






          
       
                       
                      
         </View>              


          

			


        
	);
}


const styles = StyleSheet.create({



    recarga : {
        flex: 1,
        width : '80%',
        backgroundColor : 'blue',
        height : '60%',
        borderWidth : 2,
        borderColor : 'black'
        

    },

 
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

    inputCredit:{

        borderColor: 'silver',
		borderRadius: 10,
		borderWidth: 1,
		marginBottom: 15,
        paddingLeft: 10,
        fontSize :18,
        textAlign : "left",
        color: "white",
        width: '90%',
        height : 50,

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


    card :{
        borderColor : 'white',
        borderRadius : 10,
        borderWidth: 2,
        
    },

    inputProcurar :{
        borderColor : 'white',
        borderRadius : 10,
        borderWidth: 2,
        fontSize:18
        
    },

    tituloRodape :{

		color : "#dfc695",
        fontSize :12,
  
        alignItems :"center",
        textAlign : "left",
        marginLeft : '5%',


	},

	iconesRodape : {
		marginTop : 10
	},

    scrollView: {
    
        marginHorizontal: 10,
        marginVertical :20,
       
      },

 

	});
