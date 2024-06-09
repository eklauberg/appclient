import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App( props ){
    return (
        <View style={styles.topo}>
            <View style={{ marginLeft: '2%', }}>
                <TouchableOpacity
                    onPress={() => props.handleButtonBackTouched()}
                    key={'TouchableOpacity1'}>
                    <Icon name={"arrow-back"} size={40} color="white"/>
                </TouchableOpacity>
            </View>

            <View >
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        backgroundColor: 'white',
                        borderRadius: 40,
                    }}
                    onPress={() => { }}
                    key={'TouchableOpacity2'}>
                    { props.image ? 
                        <Image style={ styles.image } source={{uri: props.image}}/>
                        :
                        <Icon name={"person"} size={34} color="#9b1712"/>
                    } 
                </TouchableOpacity>
            </View>

            <View style={{marginRight: '2%'}}>
                <TouchableOpacity
                    onPress={() => { }}
                    key={'TouchableOpacity3'}>
                    <Image source={require("../../imagens/logos/logo-chopp-station-48x48.png")} size={40}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topo: {
        height: 60,
        backgroundColor: '#9b1712',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image:{
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },

});
