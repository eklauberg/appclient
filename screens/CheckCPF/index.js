import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView, ScrollView,
} from "react-native";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TextInputMask } from "react-native-masked-text";
import { Component} from 'react';
import { cpf } from 'cpf-cnpj-validator';
import httpClient from '../../Request';
import { normalize } from "react-native-elements";
import { replace } from "formik";


class CheckCadastro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpf: "",
      loading : false
    };
  }

  chamaTelaEscolhaLoginCadastro = async () => {
    this.props.navigation.navigate("PreLogin");
  };

  handleClickButtonProximoTouched = async () => {
    if( this.state.cpf === '' || this.state.cpf === null ){
        Alert.alert("CPF", "O Campo CPF precisa sem preenchido");
        return;
    }

    if( ! cpf.isValid( this.state.cpf ) ){
      Alert.alert("CPF Inválido", "Forneça um CPF Válido");
      return;
    }

    await this.setLoading( true );
    try {

      const payload = {
        "cpf" : this.state.cpf
      };

      const response = await httpClient.post('/user-exists', payload );

      /**
       * Existe Usuário com o CPF informado
       */
      if( response.status === 200 && response.data.cpf === "Existente"){
        Alert.alert("CPF Cadastrado", "Já existe uma conta para o CPF informado. Tente fazer login ou recuperar a sua senha");
        this.props.navigation.navigate("Login" );
      }

    }catch ( error ){

      let response = error.response;

      if( response.status === 422){
        console.log( response.data );
      }

      if( response.status === 404 )
      {
          this.props.navigation.navigate("form-cadastro-primeiro-passo", {
            cpf: this.state.cpf,
          });
      }

    }finally {
      await this.setLoading( false );
    }
  };

  setCpfField = async (cpf) => {
    this.setState({
      ...this.state,
      cpf: cpf,
    });
  };

  setLoading = async ( loading )=>{
      this.setState({
        ...this.state,
        loading : loading
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.background}>
        
        <View style={ styles.header_container }>
          <View style={ styles.goBack }>
            <TouchableOpacity
              onPress={() => this.chamaTelaEscolhaLoginCadastro()}
              key={"TouchableOpacity1"}
            >
              <Icon name={"arrow-back"} size={40} color="#DFC695" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={ styles.body_container }>
          <ScrollView>
            <View style={ styles.containerLogo }>
              <Image
                style={{
                  width: 130,
                  height: 130,
                }}
                source={require("../../imagens/logos/logo-chopp.png")}
                resizeMode={ImageResizeMode.contain}
                />
              <Text style={ styles.titulos }>DISCOVER {"\n"} THE FINEST BREWS</Text>
            </View>

            <View style={ styles.container }>
              <Text style={ styles.subTitulo }>Cadastro</Text>

              <View style={ styles.box }>
                <Text style={ styles.cpf }>CPF</Text>

                <TextInputMask
                  style={styles.input}
                  type={"cpf"}
                  value={this.state.cpf}
                  onChangeText={(t) => this.setCpfField(t)}
                />

                <TouchableOpacity
                  onPress={() => this.handleClickButtonProximoTouched(this.state.cpf)}
                  style={styles.botaoProximo}
                  disabled={this.state.loading}
                >
                  
                  { this.state.loading ? 
                    <ActivityIndicator animating={this.state.loading} size="small" color="#990000"/>
                    :
                    <Text style={styles.textoProximo}>Próximo</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }


}

export default CheckCadastro;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
    backgroundColor: "#010101",
  },

  header_container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },

  body_container: {
    flex: 1,
    width: '100%',
  },

  botaoProximo: {
    width: "60%",
    backgroundColor: "#e1c897",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginTop: 30,
  },

  box: {
    width: "100%",
    //backgroundColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e1c897",
    height: "auto",
    marginTop: 5,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },

  cpf: {
    color: "white",
    fontSize: 16,
    letterSpacing: .5,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    alignContent: "flex-start",
    alignSelf: "flex-start",
    left: "12%",
  },

  textoProximo: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },

  container: {
    alignSelf: 'center',
    marginTop: '5%',
    height: '50%',
    width: "90%",
  },

  containerLogo: {
    alignItems: "center",
    alignSelf: 'center',
  },

  titulos: {
    color: "#DFC695",
    fontSize: normalize(16),
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: '3%'
  },

  subTitulo: {
    color: "#DFC695",
    fontSize: normalize(25),
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "700",
  },

  input: {
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 5,
    borderWidth: 2,
    paddingLeft: 10,
    fontSize: 12,
    textAlign: "left",
    color: "black",
    width: "80%",
    height: 40,
    alignItems: "center",

  },

  goBack: {
    width: '10%',
    marginLeft: '2%',
  },

});
