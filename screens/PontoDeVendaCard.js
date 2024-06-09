import {Text, View, StyleSheet, Image, TouchableOpacity, Linking} from "react-native";
import React, {useState} from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showLocation, Popup } from 'react-native-map-link'
import {useNavigation} from "@react-navigation/native";

export default function App( props ){
    const navigation = useNavigation();
    
    const [isVisible , setIsVisible ] = useState(false);
    const [options, setOptions ] = useState({});
    


    return (


        <View style={styles.pos_container}>
            <View style={ styles.dataContainer }>
                <Popup
                    isVisible={isVisible}
                    onCancelPressed={() => setIsVisible(false)}
                    onAppPressed={() => setIsVisible(false)}
                    onBackButtonPressed={() => setIsVisible(false)}
                    options={options}
                />
                <View style={styles.icon_container}>
                    <Image style={styles.rounded_image} source={{ uri : props.ponto.logo }} />
                    {/*<Icon name={"storefront"} size={60} color={'gray'} />*/}
                </View>
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
                </View>
                <View style={styles.location_icon_container}>
                    <TouchableOpacity onPress={ async () => {
                        let address = props.ponto.endereco + ' ' + props.ponto.numero + ", " + props.ponto.bairro
                            + " " + props.ponto.cidade + "-" + props.ponto.estado;
                        let options = {
                            longitude: Number(props.ponto.longitude),
                            latitude : Number(props.ponto.latitude),
                            //title: props.ponto.nome_fantasia,
                            address: address,
                            dialogTitle: 'Abrir Navegação',
                            dialogMessage: 'Se beber não dirija!',
                            cancelText: 'Cancelar'
                        };
                        console.log( options );
                        await setOptions( options );
                        await setIsVisible( true );
                        //showLocation( options );
                    }}>
                        <Image style={styles.icons} source={require('../imagens/icones/location-pin.png')} resizeMode={ImageResizeMode.contain} />
                        {props.ponto.distance !== undefined && <Text style={styles.label}>{ Number(props.ponto.distance / 1000).toFixed(2) } km</Text>}
                    </TouchableOpacity>

                </View>
            </View>
            <TouchableOpacity
                style={ styles.selecionarPdv }
                onPress={ async ()=>{
                    await AsyncStorage.setItem('pdv', JSON.stringify(props.ponto))
                    await AsyncStorage.removeItem('ac')
                    navigation.navigate('Principal')
                }}
            >
                <Text style={ styles.selecionarText }>Selecionar Ponto de Venda</Text>
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({
    pos_container: {
        marginTop: 10,
        width: '95%',
        height: 'auto',
        backgroundColor: "#ffffff",
        borderRadius: 10,
        borderColor: "#c6c6c6",
        borderWidth: 1
    },
    dataContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    selecionarPdv: {
        borderTopWidth: 1,
        borderColor: "#c6c6c6",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selecionarText: {
        fontWeight: 'bold',
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
        padding: 20
    },
    location_icon_container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    icons:{
        height: 35,
        width: 35,
        aspectRatio: 1,
        resizeMode: "contain",
        marginBottom: 10,
        alignSelf: "center",
    },
    rounded_image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
    },

})