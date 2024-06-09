import React, {Component} from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from "react-native-vector-icons/MaterialIcons";
import httpClient from '../Request';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from 'react-native-elements';


class EditarFotoCard extends Component {


    uploadFoto = async ()=>{
        let formData = new FormData();
        const {photo} = this.state;

        formData.append("image",{
            name: photo.fileName,
            type: photo.type,
            uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        })

        const response = await httpClient.post('/user-profile-picture', formData ,{
            headers: {
                'Content-Type' : 'multipart/form-data',
            }
        });

        console.log( "=========================================================");
        console.log( "RESPONSE", response.data );
        console.log( "=========================================================");
        if( response.status === 200 )
        {
            AsyncStorage.setItem("user", JSON.stringify( response.data.user ) );

            Alert.alert("Imagem Atualizada");
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            photo: ''
        }
    }


    componentDidMount() {

    }

    handleOnPressEditarFoto = async()=>{
        // const options = {
        //     noData: true,
        //     selectionLimit: 1
        // }

        // launchCamera(options, response => {
        //     if (response.assets) {
        //         this.setState({ photo: response.assets[0] });
        //     }
        //     console.log( response);

        // })
        this.props.bs.current.snapTo(0)
    };

    render() {
        const picture = <Image style={styles.rounded_image} source={{ uri : this.state.photo.uri || this.props.user.profile_image }} />;

        return (
            <View style={styles.card_container}>
                <View style={{width: '25%', alignItems: 'center'}}>
                    <TouchableWithoutFeedback onPress={this.handleOnPressEditarFoto}>
                        { picture }
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection: "column", width: '75%',}}>
                    <TouchableWithoutFeedback onPress={this.handleOnPressEditarFoto}>
                        <Text style={styles.edit_text}>Olá, {this.props.user.name || ''}</Text>

                    </TouchableWithoutFeedback>
                    { this.state.photo !== '' && <TouchableOpacity onPress={this.uploadFoto}>
                        <Text style={{marginLeft: 15, padding: 5}}>Salvar Foto</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card_container : {
        flexDirection: 'row',
        backgroundColor: "#d1d1d1",
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        paddingTop:'4%',
        paddingBottom:'4%',
    },
    rounded_image: {
        width: 60,
        height: 60,
        borderRadius: 60,
        overflow: "hidden",
    },
    edit_text: {
        marginLeft: '2%',
        color: 'black',
        fontSize: normalize(17),
        letterSpacing: .2,
        fontWeight: "bold",
        textDecorationLine: "underline"
    }
})

export default EditarFotoCard;
