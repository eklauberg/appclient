import React from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
    TouchableWithoutFeedback, Image
} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import SelecionarPontoDeVendaCard from "./SelecionarPontoDeVendaCard";
import Icon from "react-native-vector-icons/MaterialIcons";
import Loader from "./Loader";


class Creditos extends React.Component {

    constructor(props) {
        super( props );
        this.state = {
            accounts : [],
            modalVisible : false,

        }
    }

    componentDidMount = async () => {
        await this.loadAccounts();
        
        this.props.navigation.addListener( 'focus',async ()=> {
            await this.loadAccounts();
        });
    }

    loadAccounts = async ()=>{

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





    render = () => {

        const renderItem = ({ item }) => (
                <View style={styles.card_container}>
                    <View style={styles.pos_container}>
                        <View style={styles.icon_container}>
                            <Image style={styles.rounded_image} source={{ uri : item.pos.logo }} />
                        </View>
                        <View style={styles.text_container}>
                            <Text style={styles.title}>
                                {item.pos.nome_fantasia}
                            </Text>
                            <Text>
                                {item.pos.endereco} {item.pos.numero}
                            </Text>
                            <Text>
                                {item.pos.cidade}
                            </Text>
                        </View>
                        <View style={styles.location_icon_container}>
                            <Text>Saldo Atual:</Text>
                            <Text style={styles.text_balance}>
                                R$ {item.balance_formated}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row", justifyContent: 'space-between'}}>
                        <TouchableOpacity style={ styles.button} onPress={()=> this.props.navigation.navigate('transacoes', { account : item })}>
                            <Text style={{ color: "#dfc695"}}>
                                Extrato
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...styles.button, marginLeft: 10 }} onPress={ ()=> this.props.navigation.navigate('selecionar-cartao', {
                            pos : item.pos,
                        })}>
                            <Text style={{ color: "#dfc695"}}>
                                Comprar Créditos
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
        );

        return (
            <>
                <Header title={"Créditos"}/>
                <View style={styles.container}>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 200}}
                        data={this.state.accounts} renderItem={ renderItem } />

                </View>
                <Footer/>
                { this.state.loading && <Loader /> }
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    button: {
        flex: 1,
        backgroundColor: "#9b1712",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        alignContent: "center"
    },
    card_container: {
        marginTop: 10,
        width: '94%',
        height: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 5,
        borderColor: "#c6c6c6",
        borderWidth: 1
    },
    label: {
        color: "black",
        fontSize: 14,
        alignSelf: 'flex-start'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginTop: 2,
        borderColor: '#8b8888',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        marginBottom: 5,
        fontSize: 16,
        textAlign: "left",
        color: "black",
        width: '100%',
        height: 45,
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
        width: '96%',
        height: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        justifyContent: "space-around",
        flexDirection: "row",
        padding: 5,
        
    
    },
    title:{
        height: "auto",
        color: "#000000",
        marginBottom: 3,
        fontSize: 14,
        fontWeight: "bold"
    },
    icon_container: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flex: 2,
        borderRadius: 10
    },
    text_container: {
        flex: 3,
        padding: 20
    },
    location_icon_container: {
        flex: 3,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    icons:{
        height: 35,
        width: 35,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 10
    },
    text_balance : {
        color: "black",
        fontSize: 16,
        fontWeight: "bold"
    },
    rounded_image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
        resizeMode:"contain"
    },

});

export default Creditos;