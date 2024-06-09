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

	const hamaTelaPrincipal= async () => {

		navigation.navigate('Principal');
	}

	const chamaTelaRecarga = async () => {

		navigation.navigate('Recarga');
	}

	const chamaTelaMinhasContas = async () => {

		navigation.navigate('Minhas_Contas');
	}
	
	const chamaTelaEdicaoCadastro = async () => {

		navigation.navigate('Recarga');
	}

	const chamaTelaEstabelecimentos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	const chamaTelaMovimentacoes = async () => {

		navigation.navigate('Movimentacoes');
	}

	const chamaTelaMensagens = async () => {

		navigation.navigate('Buscar_Chopp');
	}
	
	const chamaTelaUltimosPedidos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	const chamaTelaCupons = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	const chamaTelaPagamentos = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	const chamaTelaConfiguracoes = async () => {

		navigation.navigate('Buscar_Chopp');
	}

	

const navigation = useNavigation();
	return (
        <View  style={{backgroundColor : ' #22142b'}}>

            <View style={styles.topo}>

                <View 
                    style={{width: '40%',marginLeft:5}}
                    >

                    <TouchableOpacity
                            
                    
                            onPress ={() => chamaTelaPrincipal()}
                            key={'TouchableOpacity1'}
                        >
                        <Icon name={"arrow-back"}  size={40} color="#dfc695" />
                    </TouchableOpacity>
                </View>

                <View 
                    style={{width: '40%',alignSelf:'center',alignContent:'center',textAlign:'center'}}
                >

                    <Text style={{fontSize:30,color:'#dfc695',fontWeight:'bold'}}>Recarga</Text>

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

            <View >
                <Text style={{fontSize : 18,marginTop:10}}> Selecione a conta que deseja recarregar </Text> 
            </View>
            
            <View backgroundColor='#efefef' width='100%' height='68%' >

                <View backgroundColor='white' width='90%' height='20%'  marginLeft='5%' marginTop='5%' style={styles.card} >

                    <View  marginTop='3%'  marginLeft='5%' width ='100%' height='80%'  flexDirection="row">
                        <View marginLeft='0%' width ='25%' height='80%' backgroundColor='#efefef'>

                        </View>
                        <View width ='40%' marginTop='5%' marginLeft='5%'>
                            <Text>Estabelecimento 1</Text>
                        </View>       
                        <View width ='30%' marginTop='3%'>
                            <Text>Saldo atual:</Text>
                            <Text style={{fontWeight :'bold',fontSize:20}}>R$2,56</Text>
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
									chamaTelaEstabelecimentos()
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
