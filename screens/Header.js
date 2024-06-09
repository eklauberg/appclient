import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

export default function Header( props ){

        const navigation = useNavigation();

        return (
            <View style={styles.topo}>
                <View style={{justifyContent: "flex-start", position: "absolute", left: 5}}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        key={'TouchableOpacity1'}>
                        <Icon name={"arrow-back"} size={30} color="#dfc695"/>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{color: "#dfc695", fontSize: 20, fontWeight: "bold"}}>{props.title}</Text>
                </View>

                <View style={{position: "absolute", right: 5}}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Principal');
                        }}
                        key={'TouchableOpacity3'}>
                        <Image style={{width: 50, height: 50}} source={require("../imagens/logos/new-logo-chopp.png")} size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
}
const styles = StyleSheet.create({
    topo: {
        height: 60,
        backgroundColor: '#1D1D1D',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        width: '100%'
    },

});
