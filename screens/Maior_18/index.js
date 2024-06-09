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

export default function App() {



	
	chamaTelaEscolhaLoginCadastro = async () => {

		navigation.navigate('PreLogin');
	}
	
	chamaTelaNaoMaior = async () => {

		navigation.navigate('Nao_Maior');
	}
	


const navigation = useNavigation();
	return (
		<View style={styles.background}>

			<Image
				style={{
				flex: 1,
				position: 'absolute',
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				}}
				source={require("../../imagens/fundos/fundo_login.jpg")}
				resizeMode={ImageResizeMode.contain}
			/>

            <View style={styles.containerLogo}>
				<Image
					style={{
					flex: 1,
					position: 'absolute',
					top: 30,
					bottom: 20,
					justifyContent: "center",
					alignContent: "center",
					alignItems :"center",
					}}
					source={require("../../imagens/logos/logo-chopp-station-144x144.png")}
					resizeMode={ImageResizeMode.contain}
				/>
			</View>
            <View style={styles.container}>
                <Text style={styles.titulos}>
                    Você é maior
                </Text>
                <Text style={styles.titulos}>
                    de 18 anos ?
                </Text>
                <TouchableOpacity
					onPress ={() => chamaTelaEscolhaLoginCadastro()}
					style={styles.botaoSim}>
					<Text style={styles.textoSim}>
						SIM
					</Text>
				</TouchableOpacity>
                <TouchableOpacity
					onPress ={() => chamaTelaNaoMaior()}
					style={styles.botaoNao}>
					<Text style={styles.textoNao}>
						NÃO
					</Text>
				</TouchableOpacity>
            </View>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		alignItems: "center",
    	justifyContent: "center",
	},
    botaoSim: {
		width: '45%',
		backgroundColor: '#2f4b12',
		borderRadius:10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		marginTop: 30,	
	},
    botaoNao: {
		width: '45%',
		backgroundColor: '#9b1712',
		borderRadius:10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		marginTop: 30,
	},
    textoSim: {
		color: 'white',
		fontWeight: "bold",
		fontSize : 20
  	},
      textoNao: {
		color: 'white',
		fontWeight: "bold",
		fontSize : 20
  	},
    containerLogo: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		alignItems :"center",
	},
	container: {
		flex: 1.8,
		width: '100%',
		alignContent: "center",
		alignItems: "center"
	},
    titulos :{
        color : "white",
        fontSize : 35,
        fontWeight : "bold",
        alignItems :"center",
        textAlign : "center",
        alignContent : "center",
      }

	});
