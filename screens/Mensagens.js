import React from "react";
import {
    StyleSheet,
    View,
    Alert,
    Text,
    SafeAreaView
} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import Loader from "./Loader";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';




class Mensagens extends React.Component {

    constructor(props) {
        super( props );
        this.state = {

        }
    }


    componentDidMount = async () => {

    }

    setModalVisible = async( visible )=>{

    }

    handleErrorResponse = async (response) => {

        //validation error
        if (response.status === 422) {
            console.log("Caiu dentro do IF");
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    /*this.setState({
                        ...this.state,
                        validationErrors: [...this.state.validationErrors, val]
                    });*/
                })
            });

            this.setModalVisible(true );

            return;
        }

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar a requisição, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    setLoading = async ( loading )=>{
        this.setState({
            ...this.state,
            loading : loading
        })
    }





    render = () => {



        return (
            <SafeAreaView style={{flex: 1}}>
                <Header title={"Mensagens"}/>
                <View style={styles.container}>
                    <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", height: "70%"}}>
                        <Icon name={"message-outline"} size={200} />
                        <Text>Sem Mensagens no momento!</Text>
                    </View>
                </View>

                <Footer/>
                { this.state.loading && <Loader /> }
            </SafeAreaView>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#efefef',
        width: '100%',
        justifyContent: 'center',
        //alignItems: 'center',
        alignContent: 'center',
        marginLeft: 10
    },
    item:{
        height: 22,
        color: "#990000",
        fontSize: 18,
        fontWeight: "bold"
    },

    label: {
        color: "black",
        fontSize: 14,
        alignSelf: 'flex-start'
    },
    form_container: {
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10

    },
    inputContainer: {
        marginLeft: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        marginRight: 10,
        width: '95%',
        padding: 5
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 15,
        borderColor: '#e6e2d3',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        marginBottom: 5,
        fontSize: 16,
        textAlign: "left",
        color: "black",
        width: '100%',
        height: 55,
        backgroundColor: "white",
    },
    botaoProximo: {
        width: '75%',
        backgroundColor: '#e1c897',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        marginTop: 10,
    },
    textoBotao: {
        color: 'black',
        fontWeight: "bold",
        fontSize: 22
    },
    image_container: {
        marginTop: 5,
        width: '100%',
        borderRadius: 20,
        padding: 20,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 5,
        marginRight: 5
    },
    pos_container: {
        marginTop: 25,
        width: '90%',
        height: 100,
        backgroundColor: "#cccccc",
        padding: 20,
        borderRadius: 20,
        justifyContent: "center"
    },
    list_container: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginLeft: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "black"
    }

});

export default Mensagens;