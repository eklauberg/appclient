import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet, SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import React from "react";
import { normalize } from "react-native-elements";

export default function App() {
  function chamaCadastrar() {
    navigation.navigate("check-cpf");
  }

  function chamaLogin() {
	navigation.navigate("Login");
  }

  const navigation = useNavigation();
  return (
	  
    <SafeAreaView style={styles.background}>
      {/* <Image
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
        source={require("../../imagens/fundos/fundo_login.jpg")}
        resizeMode={ImageResizeMode.contain}
      /> */}
      
      <View style={styles.containerLogo}>
        <Image
          style={{
            // flex: 1,
            // position: "absolute",
            // top: 30,s
            width: normalize(170),
            height: normalize(170),
          }}
          source={require("../../imagens/logos/logo-chopp.png")}
          resizeMode={ImageResizeMode.contain}
        />
        <Text style={styles.titulosLogo}>DISCOVER{"\n"}THE FINEST BREWS</Text>
      </View>      

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => chamaLogin()}
          style={styles.botaoLogin}
        >
          <Text style={styles.textoLogin}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => chamaCadastrar()}
          style={styles.botaoCadastrar}
        >
          <Text style={styles.textoCadastrar}>Quero me cadastrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#010101",
    //backgroundColor: 'black',
    // paddingVertical: '12%',
    // paddingHorizontal: '15%'
  },

  botaoLogin: {
    backgroundColor: "#E1C897",
    borderRadius: 10,
    height: 45,
    textAlign: 'center',
    justifyContent: "center",
    alignItems: "center",
    minWidth: 210
  },

  botaoCadastrar: {
    //backgroundColor: "#9b1712",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1c897",
    height: 45,
    textAlign: 'center',
    justifyContent: "center",
    alignItems: "center",
    minWidth: 210
  },

  textoLogin: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: .1
  },

  textoCadastrar: {
    color: "#ddbd89",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: .1

  },

  containerLogo: {
    alignItems: "center",
  },

  container: {
    height: '20%',
    justifyContent: 'space-evenly',
  },

  titulosLogo: {
    color: "#E1C897",
    fontSize: normalize(20),
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: '5%'
  },

});
