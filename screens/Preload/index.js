import React, {useEffect, useContext} from 'react';
import {Container, LoadingIcon} from './styles';
//import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import {UserContext} from '../../contexts/UserContext';


import {
    View,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

export default () => {

    const {dispatch: userDispatch} = useContext(UserContext);
    const navigation = useNavigation();

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            checkToken()
        })

        return unsubscribe;
    }, [navigation]);

    async function checkToken(){
        const token = await AsyncStorage.getItem('token');
        if (token) {
            navigation.navigate('selecionar-ponto-de-venda');
        } else {
            navigation.navigate('maioridade');
        }
    }

    return (
        <Container>
            <Image
                style={{

                    flex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',

                }}
                source={require("../../imagens/splash/splash–1.png")} resizeMode={ImageResizeMode.contain}
            />
            <LoadingIcon size="large" color="white"/>
        </Container>
    );
}