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



    
	chamaTelaPrincipal= async () => {

		navigation.navigate('Principal');
	}

	chamaTelaRecarga = async () => {

		navigation.navigate('Recarga');
	}

	chamaTelaMinhasContas = async () => {

		navigation.navigate('Minhas_Contas');
	}
	
	chamaTelaEdicaoCadastro = async () => {

		navigation.navigate('Recarga');
	}

	chamaTelaEstabelecimentos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	chamaTelaMovimentacoes = async () => {

		navigation.navigate('Movimentacoes');
	}

	chamaTelaMensagens = async () => {

		navigation.navigate('Buscar_Chopp');
	}
	
	chamaTelaUltimosPedidos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	chamaTelaCupons = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	chamaTelaPagamentos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	chamaTelaConfiguracoes = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	

const navigation = useNavigation();
	return (
        <View  style={{backgroundColor : ' #22142b'}}>

            <View style={styles.topo}>

                <View 
                    style={{width: '20%',marginLeft:5}}
                    >

                    <TouchableOpacity
                            
                    
                            onPress ={() => chamaTelaPrincipal()}
                            key={'TouchableOpacity1'}
                        >
                        <Icon name={"arrow-back"}  size={40} color="#dfc695" />
                    </TouchableOpacity>
                </View>

                <View 
                    style={{width: '60%',alignSelf:'center',alignContent:'flex-start',textAlign:'left'}}
                >

                    <Text style={{fontSize:20,color:'#dfc695',fontWeight:'bold'}}> Buscar Chopp Station </Text>

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


            <View alignItems="center" marginTop='5%' >
                <TextInput backgroundColor="white"  width="90%" style={styles.inputProcurar} 
                    placeholder="Procurar"
                    
                  
              
                >      
               
                <Icon name={"search"}  size={40} style={styles.iconesRodape} color="silver" />
              

                </TextInput>
            </View>

           
            
            <View backgroundColor='#efefef' width='100%' height='60%' >

                <View backgroundColor='white' width='90%' height='20%'  marginLeft='5%' marginTop='5%' style={styles.card} >

                    <View   width ='100%' height='100%'  flexDirection="row">
                        <View  width ='25%' height='100%' backgroundColor='#efefef'>

                        </View>
                        <View width ='43%'  marginLeft='5%'>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Estabelecimento 1</Text>
                            <Text  style={{fontSize:14}}>Rua teste </Text>
                            <Text  style={{fontSize:14}}>Aberto das 18h - 22h </Text>
                        </View>       
                        <View width ='30%' marginTop='3%'>
                            <View flexDirection="row">
                                <Icon name={"room"}  size={25} style={styles.iconesRodape} color="#dfc695" />
                                <Text style={{fontSize:20,marginTop:10}}> 200 m </Text>
                            </View>
                            
                        </View>   
                    
                    </View>
                </View>   
            </View>





        	<View flexDirection="row"  style={{backgroundColor:'black',height : '40%',marginTop:'-15%'}}
				
					onPress={() => {setModalMenu(!ModalMenu)}}
				>
					<View 
						style={{width: '25%',marginLeft:'7%'}}
					>

						<TouchableOpacity
								
								onPress={() => {
                                    chamaTelaPrincipal();
								}}
								key={'TouchableOpacity3'}
							>
							   <Icon name={"home"}  size={35} style={styles.iconesRodape} color="#dfc695" />
							   <Text style={styles.tituloRodape}>Inicio</Text>
						</TouchableOpacity>
					</View>
					<View 
						style={{width: '25%'}}
					>

						<TouchableOpacity
								
								onPress={() => {
                                    chamaTelaMovimentacoes();
								}}
								key={'TouchableOpacity3'}
							>
							<Icon name={"account-balance-wallet"} style={styles.iconesRodape} size={35} color="#dfc695" />
							<Text style={styles.tituloRodape}>Consultar</Text>
							<Text style={styles.tituloRodape}>Créditos</Text>
							
						</TouchableOpacity>
					</View>
					<View 
						style={{width: '25%'}}
					>

						<TouchableOpacity
								
								onPress={() => {
                                    chamaTelaEstabelecimentos();
								}}
								key={'TouchableOpacity3'}
							>
							
							<Icon name={"room"}  size={35} style={styles.iconesRodape} color="#dfc695" />
							<Text style={styles.tituloRodape}>Locais</Text>
						</TouchableOpacity>
					</View>
					<View 
						style={{width: '25%'}}
					>

						<TouchableOpacity
								
								onPress={() => {
                                    chamaTelaEdicaoCadastro();
								}}
								key={'TouchableOpacity3'}
							>
							<Icon name={"person"}  size={35} style={styles.iconesRodape} color="#dfc695" />
							<Text style={styles.tituloRodape}>Perfil</Text>
						</TouchableOpacity>
					</View>
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

 

	});
