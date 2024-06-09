import React from "react";
import {
    StyleSheet,
    View,
    Alert,
    Text,
    FlatList
} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import Loader from "./Loader";
import HCE from "react-native-nfc-hce";
import SelecionarPontoDeVendaCardWithAccountForNFC from './SelecionarPontoDeVendaCardWithAccountForNFC';

class Nfc extends React.Component {

    constructor(props) {
        super( props );
        this.state = {
            habilitado : false,
            suporte : false
        }
    }

    setModalVisible = async( visible )=>{
        this.setState({
            ...this.state,
            modalVisible : visible
        });
    }

    handleErrorResponse = async (response) => {

        //validation error
        if (response.status === 422) {
            let errorsKeys = Object.keys(response.data.errors);

            errorsKeys.forEach((key) => {
                response.data.errors[key].forEach((val) => {
                    this.setState({
                        ...this.state,
                        validationErrors: [...this.state.validationErrors, val]
                    });
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
        });
    }


    componentDidMount = async () => {
        try {
            await this.setLoading( true );
            const response = await httpClient.get('/user/account');

            if( response.status === 200 ){
                console.log( response );
                this.setState({
                   ...this.state,
                   accounts : [...response.data]
                });
            }
        }catch ( error ){
            if( error.response !== undefined ){
                return this.handleErrorResponse( error.response );
            }

            Alert.alert("Erro", "Erro ao Efetuar busca");
        }finally {
            this.setLoading( false );
        }

        
    }

    setNfcContent = async ( account ) => {
        try {
            
            const { support, enabled } = HCE.supportNFC();
            
            console.log("enable: ", HCE.supportNFC());
            if (!support) {
                Alert.alert("Seu aparelho não tem suporte a NFC");
                return;
            }

            if (!enabled) {
                Alert.alert("Habilite NFC nas configurações do seu celular");
                return;
            } 

            
            
            HCE.setCardContent( account.card_identification );

            

            Alert.alert( "Uso definido para usar a conta do Ponto de Venda " + account.pos.nome_fantasia );
        } catch (error) {
            Alert.alert("Error", error.message );
        }
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

        const renderAccount = ( { item } ) => {
            return <SelecionarPontoDeVendaCardWithAccountForNFC 
                setNFCContent={this.setNfcContent} account={item}
                ponto={item.pos} balance={item.balance_formated} />
        };

        return (
            <>
                <Header title={"Ativar NFC"}/>
                <View style={styles.container}>
                <Text style={{ textAlign: "center", margin: 5}} >Selecione a conta que deseja usar com o NFC</Text>
                    <FlatList

                        contentContainerStyle={{ justifyContent: 'center'}}
                        data={this.state.accounts} renderItem={ renderAccount } />                       

                </View>

                <Footer/>
                { this.state.loading && <Loader /> }
            </>
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

export default Nfc;