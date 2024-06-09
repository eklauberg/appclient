import React from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform,
    SafeAreaView, ScrollView, ActivityIndicator, TouchableWithoutFeedback
} from 'react-native';
import Header from "./Header";
import Footer from "./Footer";
import httpClient from '../Request';
import Geolocation from '@react-native-community/geolocation';
import Loader from "./Loader";
import PontoDeVendaCard from "./PontoDeVendaCard";
import Icon from "react-native-vector-icons/MaterialIcons";



class Locais extends React.Component {

    constructor(props) {
        super( props );
        this.state = {
            latitude : '',
            longitude : '',
            name : '',
            pos : []
        }
    }

    callLocation = async () => {
        if(Platform.OS === 'ios') {
            this.getLocation();
        } else {
            const requestLocationPermission = async () => {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Permissão de Acesso à Localização",
                        message: "Usamos sua localização para mostrar onde tem ChopStation próximo a você.",
                        buttonNeutral: "Pergunte-me depois",
                        buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getLocation();

                } else {
                    //alert('Permissão de Localização negada');
                }
            };
            requestLocationPermission();
        }
    }





    getLocation = async () => {



        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLatitude = await JSON.stringify(position.coords.latitude);
                const currentLongitude = await JSON.stringify(position.coords.longitude);

                
                    await this.setState({
                        latitude : currentLatitude,
                        longitude : currentLongitude
                    });
    
    
    
                    this.loadPontosDeVendas();
                

            },
            (error) => { 
                console.log(error.message);
                //this.loadPontosDeVendas();
            
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );


    }

    componentDidMount = async () => {
        this.setLoading( true );
        this.callLocation();
        await this.loadPontosDeVendas();
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

    loadPontosDeVendas = async () =>{

        try {

            let url = `/search-pos`;

            if( this.state.latitude !== '' && this.state.longitude !== ''){
                url = `/search-pos?longitude=${this.state.longitude}&latitude=${this.state.latitude}`;
            }

            if( this.state.name !== ''){
                url = `/search-pos?nome=${encodeURIComponent(this.state.name)}`;
            }

            const response = await httpClient.get( url );

            if( response.status === 200 && response.data.data.length >  0 ){
                this.setState({
                    ...this.state,
                    pos : response.data.data
                })
            }
            console.log('=======================================================================');
            console.log( 'RESPONSE **********************',response.data );
            console.log('=======================================================================');


        }catch ( error )
        {
            if( error.response ){
                this.handleErrorResponse( error.response );
            }

            Alert.alert("Error", error.message );
        }finally {
            this.setLoading( false );
        }

    }

    setName = async( text )=>{
        console.log("Nome", text );
        await this.setState({
            ...this.state,
            name : text
        })

        setTimeout( ()=>{
            this.loadPontosDeVendas();
        }, 1000 )
    }


    render = () => {

        const renderItem = ({ item }) => (
            <PontoDeVendaCard ponto={item}/>
        );

        return (
            <SafeAreaView style={{flex: 1}}>
                <Header title={"Buscar Chopp Station"}/>
                    <View style={styles.container}>
                            <View style={{
                                flexDirection: 'row',
                                width: '96%',
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <TextInput
                                    value={this.state.name}
                                    placeholder={"Buscar Chopp Station"}
                                    onChangeText={ this.setName}
                                    style={styles.input} />
                                    <Icon style={{ 
                                        position: "relative", 
                                        left: -35, 
                                        marginTop: 15
                                        }} 
                                        name={'search'} 
                                        size={30} />
                            </View>
                            <FlatList
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    //justifyContent: 'center',
                                    paddingBottom: 150
                                }}
                                data={this.state.pos} renderItem={ renderItem } />
                    </View>

                <Footer/>
                { this.state.loading && <Loader /> }
            </SafeAreaView>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: '#efefef',
        width: '100%',
        justifyContent: 'center',
        //alignItems: 'center',
        alignContent: 'center',
        marginLeft: 10,
        marginBottom: 300
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

export default Locais;