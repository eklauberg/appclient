import React, { Component } from 'react';
import httpClient from '../Request'
import Loader from "./Loader";
import Header from "./Header";
import Footer from "./Footer";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView
  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

class SelecionarCartao extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = { 
            loading: false,
            credit_cards : []
        }
    }

    loadCards = async ()=> {
        try {
            this.setLoading( true );
            let response = await httpClient.get('user-credit-cards');

            if( response.status === 200 ){
                console.log('=================================================================');
                console.log( response.data )
                console.log('=================================================================');
                this.setState( { ...this.state, credit_cards: response.data.cards } )
            }


        } catch (error) {
            console.log( error )
            
        }finally{
            this.setLoading( false )
        }


        var imgs = document.getElementById('drapeaux').getElementsByTagName('img');    //Grab the <img>'s
        for (var i in imgs) {   //Loop through them
            if(imgs[i].src !== ''){
                URLs.push(imgs[i].src); //Put the src into an array
            }
            
        }

    }

    componentDidMount =async()=>{
        
        this.props.navigation.addListener('focus', async ()=>{
            await this.loadCards();

        })
    } 
    
    setLoading = async ( loading )=>{
        this.setState({
            ...this.state,
            loading : loading
        })
    }

    navigation = this.props.navigation;

    render = () => {

        const renderCard = ( { item } ) => {
            
            let icon = <Icon name="credit-card-outline" size={30} />;

            if( item.image !== null )
            {
                icon = <Image style={ styles.icons } source={ {uri : item.image }} />;
            }
            
            return (
                <TouchableWithoutFeedback onPress={ ()=>{
                    this.navigation.navigate('recarga', {
                        pos: this.props.route.params.pos,
                        cartao: item
                    });
                }
            }>
                <View style={styles.pos_container}>
                    <View style={styles.icon_container}>
                        { icon }
                    </View>
                    {/* <View style={styles.icon_container}>
                        <Icon name={"storefront"} size={60} color={'gray'} />
                    </View> */}
                    <View style={styles.text_container}>
                        <Text style={styles.title}>
                          Cartão: ****{item.last_numbers}
                        </Text>
                        <Text style={styles.title}>
                            Validade: {item.expiration_month}/{item.expiration_year}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            );
        };

        return (
            <SafeAreaView style={{flex: 1}}>
                <Header title={"Adicionar Créditos"}/>
                <View style={styles.container}>
                    <View style={ styles.pdv }>
                        <Icon style={{marginRight: '3%', }} name='map-marker' color={'white'} size={18}  />
                        <Text style={{ marginVertical: '1%', color: 'white', textAlign: 'center' }}>{this.props.route.params.pos.nome_fantasia}</Text>
                    </View>

                    <Text style={{ textAlign: "center", margin: 10}} >Selecione ou adicione um Cartão</Text>
                    <View style={{width: '100%', maxHeight: '73%'}}>
                        <FlatList
                            contentContainerStyle={{ width:'100%', paddingBottom: 10}}
                            data={this.state.credit_cards} renderItem={ renderCard } 
                        />     
                    </View>

                    <TouchableOpacity onPress={ ()=>{
                        this.navigation.navigate('credit-card', {
                                pos: this.props.route.params.pos
                            });
                        }} 
                        style={{ 
                            width: '65%',
                            backgroundColor: '#e1c897',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 45,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ color: 'black', fontWeight: "bold", fontSize: 22, }}>Adicionar Cartão</Text>    
                    </TouchableOpacity>                    

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
        alignItems: 'center',
        alignContent: "center",
        marginTop: 10,
    },

    pdv: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D1D1D',
        paddingHorizontal: 5,
        borderRadius: 20,
        borderWidth: 1
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
    // pos_container: {
    //     marginTop: 25,
    //     width: '90%',
    //     height: 100,
    //     backgroundColor: "#cccccc",
    //     padding: 20,
    //     borderRadius: 20,
    //     justifyContent: "center"
    // },
    list_container: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginLeft: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "black"
    },
    pos_container: {
        marginTop: 10,
        width: '85%',
        height: 70,
        alignSelf: 'center',
        backgroundColor: "#ffffff",
        borderRadius: 10,
        flexDirection: "row",
        borderColor: "#c6c6c6",
        borderWidth: 1
    },
    title:{
        alignSelf: "flex-start",
        color: "#000000",
        fontSize: 15,
        fontWeight: "bold",
        
    },
    icon_container: {
        marginLeft: 30,
        flex: 1,
        //backgroundColor: "#cccccc",
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    text_container: {
        flex: 3,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    location_icon_container: {
    },
    icons:{
        height: 35,
        width: 35,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 10,
        alignSelf: "center"
    },
    text_balance : {
        color: "black",
        fontSize: 20,

    },
    rounded_image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
        resizeMode:"contain"
    },

});

 
export default SelecionarCartao;