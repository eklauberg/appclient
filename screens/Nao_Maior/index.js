import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode';
import React from 'react';


export default function App() {


    const chamaTelaEscolhaLoginCadastro = async () => {

        navigation.navigate('PreLogin');
    }

    const navigation = useNavigation();

    return (
        <View style={styles.background}>
            <Image
                style={styles.background_img}
                source={require("../../imagens/fundos/fundo_nao_maior.png")}
                resizeMode={ImageResizeMode.contain}
            />
            <View style={styles.containerLogo}>


                <Image
                    style={{

                        flex: 1,
                        position: 'absolute',
                        height: '90%',
                        width: '60%',
                        top: 30,
                        bottom: 20,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                    source={require("../../imagens/logos/logo_nao_maior.png")}
                    resizeMode={ImageResizeMode.contain}
                ></Image>

            </View>

            <View style={styles.container}>


                <Text
                    style={
                        styles.titulos
                    }
                >
                    Descupe,
                </Text>

                <Text
                    style={
                        styles.titulos
                    }
                >
                    App destinado para
                </Text>

                <Text
                    style={
                        styles.titulos
                    }
                >
                    Maiores de 18 anos.
                </Text>


                <TouchableOpacity
                    onPress={() => chamaTelaEscolhaLoginCadastro()}

                    style={
                        styles.botaoSair
                    }
                >

                    <Text
                        style={
                            styles.textoSair
                        }
                    >
                        Sair
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => chamaTelaEscolhaLoginCadastro()}

                    style={
                        styles.botaoSouMaior
                    }
                >
                    <Text
                        style={
                            styles.textoSouMaior
                        }
                    >
                        Sou Maior de 18 anos
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
	background_img:{
		flex: 1,
		position: 'absolute',
		width: '100%',
		height: '150%',
		justifyContent: 'center',
	},
    botaoSair: {
        marginLeft: '30%',
        width: '35%',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginTop: 30,
    },
    botaoSouMaior: {
        marginLeft: '10%',
        width: '80%',
        backgroundColor: '#2f4b12',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginTop: 30,
    },
    textoSair: {
        color: '#9b1712',
        fontWeight: "bold",
        fontSize: 20
    },
    textoSouMaior: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 20
    },
    container: {
        flex: 1.8,
        width: '80%',
        alignContent: "center",

    },
    containerLogo: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    titulos: {
        color: "white",
        fontSize: 30,
        alignItems: "center",
        textAlign: "center",
        alignContent: "center",
        fontWeight: 'bold'
    }

});
