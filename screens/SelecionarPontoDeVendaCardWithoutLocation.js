import {Text, View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import {useNavigation} from "@react-navigation/native";

export default function App( props ){
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback disabled={props.disable} onPress={ ()=>{
                navigation.navigate('recarga', {
                    pos: props.ponto.id
                });
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
                </View>                
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
        borderWidth: 1,
        marginBottom: 20
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

})