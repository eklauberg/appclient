import {Text, View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App( props ){
    const navigation = useNavigation();

    

    return (
        <TouchableWithoutFeedback onPress={ async ()=>{
               await AsyncStorage.setItem('pdv', JSON.stringify(props.ponto))
               await AsyncStorage.removeItem('ac')
               navigation.navigate('Principal')
            }
        }>
            <View style={styles.pos_container}>
                <View style={styles.icon_container}>
                    <Image style={styles.rounded_image} source={{ uri : props.ponto.logo }} />
                    {/*<Icon name={"storefront"} size={60} color={'gray'} />*/}
                </View>
                {/* <View style={styles.icon_container}>
                    <Icon name={"storefront"} size={60} color={'gray'} />
                </View> */}
                <View style={styles.text_container}>
                    <Text style={styles.title}>
                        {props.ponto.nome_fantasia}
                    </Text>
                    <Text>
                        {props.ponto.endereco} {props.ponto.numero}
                    </Text>
                    <Text>
                        {props.ponto.cidade}
                    </Text>
                    {props.ponto.balance !== undefined && <>
                        <View style={styles.balance}>
                            <Text>Saldo Atual</Text>
                            <Text style={styles.text_balance}>R$ {props.ponto.balance_formated}</Text>
                        </View>
                    </>}
                </View>
                {/* <View style={styles.location_icon_container}>
                <TouchableOpacity onPress={ async () => {
                    let address = props.ponto.endereco + ' ' + props.ponto.numero + ", " + props.ponto.bairro
                        + " " + props.ponto.cidade + "-" + props.ponto.estado;
                    let options = {
                        longitude: Number(props.ponto.longitude),
                        latitude : Number(props.ponto.latitude),
                        //title: props.ponto.nome_fantasia,
                        address: address,
                        dialogTitle: 'Abrir Navegação',
                        dialogMessage: 'Escolha seu app preferido para navegar',
                        cancelText: 'Cancelar'
                    };
                    console.log( options );
                    await setOptions( options );
                    await setIsVisible( true );
                    //showLocation( options );
                }}>
                    <Image style={styles.icons} source={require('../imagens/icones/maps-and-flags.png')} resizeMode={ImageResizeMode.contain} />
                    {props.ponto.distance !== undefined && <Text style={styles.label}>{ Number(props.ponto.distance / 1000).toFixed(2) } km</Text>}
                </TouchableOpacity>

            </View> */}
                
            </View>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    pos_container: {
        marginTop: 10,
        width: '95%',
        height: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        justifyContent: "space-around",
        flexDirection: "row",
        borderColor: "#c6c6c6",
        borderWidth: 1
    },
    title:{
        height: "auto",
        color: "#000000",
        marginBottom: 5,
        fontSize: 14,
        fontWeight: "bold"
    },
    icon_container: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flex: 1,
        //backgroundColor: "#cccccc",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginLeft: 10


    },
    text_container: {
        flex: 3,
        padding: 10
    },
    location_icon_container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    balance: {
        paddingTop: 2
    },
    icons:{
        height: 35,
        width: 35,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 5,
        alignSelf: "center"
    },
    text_balance : {
        color: "black",
        fontSize: 16,

    },
    rounded_image: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: "hidden",
        resizeMode:"contain"
    },

})