import React from "react";
import {Alert, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import Loader from "./Loader";
import { normalize } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

class Transacoes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transacoes: [],
            modalVisible: false,
            account: {
                ponto_de_venda: {}
            }
        }
    }

    loadTransactions = async()=>{

        //console.log('account : ', this.props.route.params.account)
        let account = this.props.route.params.account.id
        try {
            await this.setLoading(true);
            const response = await httpClient.get(`/user/account-transactions/${account}`);
            

            if (response.status === 200) {
                //console.log(response.data);
                this.setState({
                    ...this.state,
                    account: response.data,
                    transacoes: [...response.data.transactions]
                });
            }
        } catch (error) {
            console.log('error: ', error)
            if (error.response !== undefined) {
                return this.handleErrorResponse(error.response);
            }

            Alert.alert("Erro", "Erro ao Efetuar busca" + error );
        } finally {
            this.setLoading(false);
        }
    }

    componentDidMount = async () => {
        this.loadTransactions();
        this.props.navigation.addListener('focus', () => {
            this.loadTransactions();
        });
    }

    setModalVisible = async (visible) => {
        this.setState({
            ...this.state,
            modalVisible: visible
        });
    }

    handleErrorResponse = async (response) => {
        //console.log('error: ', response)
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

            this.setModalVisible(true);

            return;
        }

        //server error
        if (response.status === 500) {
            Alert.alert('Erro de Servidor', 'Não foi possível efetuar a requisição, tente mais tarde');
        }

        //console.log( response.status, response.data );
    }

    setLoading = async (loading) => {
        this.setState({
            ...this.state,
            loading: loading
        });
    }


    render = () => {
        
        const renderItem = ({item}) => (
            <TouchableWithoutFeedback onPress={() => {
               /*this.props.navigation.navigate('recarga', {
                    pos: item.pos.id
                });*/
                    //console.log('item: ', JSON.stringify(item))
                }
            }>
                { item.type == 'Débito' ? 
                    (
                        <View style={styles.pos_container}>
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", }}>
                                <View style={{ marginLeft: "7%", }}>
                                    <Text style={{fontSize: 16, color: "black", fontWeight: "bold"}}>Consumo</Text>
                                    <Text style={{color: "gray"}}>{item.formated_date}</Text>
                                </View>
                                <View style={{ marginRight: "7%", }}>
                                    <Text style={ styles.debito }>- R$ {item.formated_amount}</Text>
                                </View>
                            </View>
                            
                            <View style={{width: '87%', marginTop: '3%', paddingVertical: '5%', alignSelf: 'center', backgroundColor: '#F3F3F3', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", borderRadius: 10}}>
                                <View style={{ marginLeft: "3%", }}>
                                    <Text style={{fontSize: 16, color: "black", fontWeight: "bold", marginBottom: '5%'}}>{item.consume_details ? item.consume_details.produto.name : 'Informação indisponível' }</Text>
                                    <Text style={{color: "black"}}>{item.consume_details ? item.consume_details.produto.brewery : '-' }</Text>
                                </View>
                                <View style={{ marginRight: "3%", }}>
                                    <Text style={{color: "black", textAlign: 'right', marginBottom: '5%'}}>R$ {item.consume_details ? item.consume_details.produto.preco_formatado : '-' }</Text>
                                    <Text style={{color: "black", textAlign: 'right'}}>Consumido: {item.consume_details ? item.consume_details.consumed_ml : '-' } / ml</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pos_container}>
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", }}> 
                                <View style={{ marginLeft: "7%", }}>
                                    <Text style={{fontSize: 16, color: "black", fontWeight: "bold"}}>Recarga</Text>
                                    <Text style={{color: "gray"}}>{item.formated_date}</Text>
                                </View>
                                <View style={{ marginRight: "7%", }}>
                                    <Text style={ styles.credito }>+ R$ {item.formated_amount}</Text>
                                </View>                                
                            </View>
                        </View>
                    )
                }
            </TouchableWithoutFeedback>
        );

        return (
            <SafeAreaView style={{flex: 1}}>
                <Header title={"Extrato"}/>
                <View style={styles.container}>

                    <View style={ styles.list_header }>
                        <View style={styles.pos_info}>
                            <Text style={styles.title}>
                                {this.state.account.ponto_de_venda.nome_fantasia}
                            </Text>
                            <Text style={{marginTop: 6, fontSize: normalize(12)}}>
                                {this.state.account.ponto_de_venda.endereco} {this.state.account.ponto_de_venda.numero}
                            </Text>
                            <Text style={{fontSize: normalize(12)}}>
                                {this.state.account.ponto_de_venda.cidade}
                            </Text>
                        </View>
                        <View style={styles.saldo_container}>
                            <Text style={{fontSize: normalize(12)}}>Saldo Atual:</Text>
                            <Text style={styles.text_balance}>
                                R$ {this.state.account.balance_formated}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: '75%' }}>
                        <FlatList 
                            contentContainerStyle={{width: "100%", paddingBottom: "10%"}} 
                            data={this.state.transacoes} renderItem={renderItem} 
                        />
                    </View>
                    
                </View>
                <Footer/>
                {this.state.loading && <Loader/>}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#efefef',
        width: '85%',
        alignSelf: "center",
        alignContent: "center",
        height: '80%',

    },

    list_header: {
        width: '100%',
        height: 100,
        backgroundColor: "#ffffff",
        borderRadius: 0,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomColor: "#dfc695",
    },

    pos_container: {
        width: '100%',
        paddingVertical: 25,
        backgroundColor: "#ffffff",
        borderRadius: 0,
        borderBottomColor: "lightgray",
        borderBottomWidth: 1
    },
    title: {
        color: "#000000",
        fontSize: normalize(14),
        fontWeight: "bold"
    },
    icon_container: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flex: 2,
        backgroundColor: "#cccccc",
        borderRadius: 10
    },
    pos_info: {
        marginLeft: "7%",
        width: '60%',
    },
    saldo_container: {
        marginRight: "7%",
        justifyContent: "center",
        alignItems: "center",
        width: '26%',
    },
    icons: {
        height: 35,
        width: 35,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 10
    },
    text_balance: {
        color: "black",
        fontSize: normalize(14),
        fontWeight: "bold"
    },
    credito: {
        color: "green",
        fontWeight: "bold"
    },
    debito: {
        color: 'red',
        fontWeight: "bold"
    }

});

export default Transacoes;