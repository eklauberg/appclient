import React,  { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,} from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple, 
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalFeedBack from './ModalFeedBack';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';



export default class DrawerContent extends React.Component{

    constructor( props ){
        super(props)

        this.state = {
            user: {
                profile_image: 'https://app-api.beermatic.net/img/user_profile.png'
            },
            modalVisible: false,
            errorMsg: '',
        };
        this.interval = null;
        this.navigation = this.props.navigation;   
    }

    setModalVisible = (visible) => {
        this.setState({
            ...this.state,
            modalVisible: visible
        })
    }

    setErrorMsg = (msg) => {
        this.setState({
            ...this.state,
            errorMsg: msg
        })
    }
    
    setUser = async( user ) => {
        this.setState({
            ...this.state,
            user: user 
        });
    }

    async loadUserFromStorage() {
        user = await AsyncStorage.getItem('user');
        //console.log(user);

        if( user !== null ){
            this.setUser(JSON.parse(user));
        }
    }

    async getUserPdv(){
        var pdv = await JSON.parse(await AsyncStorage.getItem('pdv'))
        if(pdv){
            this.props.navigation.navigate('selecionar-cartao', { pos: pdv })
        }else {
            this.setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
            this.setModalVisible(true)
        }
    }

    async getUserAccount(){
        var pdv = await JSON.parse(await AsyncStorage.getItem('pdv'))
        if(pdv){
            var account = await JSON.parse(await AsyncStorage.getItem('ac'))
            console.log('acc on footer: ', account)
            if(account){                
                this.props.navigation.navigate('transacoes', { account : account })
            } else {
                this.setErrorMsg('Você ainda não tem transações neste estabelecimento\nFaça uma recarga para ter acesso ao seu extrato')
                this.setModalVisible(true)
            }
        } else {
            this.setErrorMsg('Você precisa selecionar um estabelecimento para ter acesso a essa função')
            this.setModalVisible(true)
        }
    }

    componentDidMount = async()=>{
        await this.loadUserFromStorage();

        try {
            this.interval = setInterval( async () =>{
                await this.loadUserFromStorage();
            }, 8000 );
        } catch(e) {
            console.log(e.message);
        }
    }

    componentWillUnmount = ()=>{
        clearInterval( this.interval);
    }

    render = ()=>{
        return(
            <SafeAreaView style={{flex:1}}>
                <ModalFeedBack title={''} visible={this.state.modalVisible}>
                    <Icon name={"alert-circle"} size={60} color="red"/>
                    <ScrollView style={{ width: '90%', height: '30%', marginTop: '2%',}}>
                        <Text style={{color: 'crimson', fontWeight: "bold", fontSize: 12, textAlign: 'center', }}>{this.state.errorMsg}</Text>
                    </ScrollView>
                    <View style={{marginTop: '5%', width: '80%', alignItems: 'center',}}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#e1c897', justifyContent: 'center', borderRadius: 10, height: 40, width: '55%',}}
                            onPress={() => this.setModalVisible(false)}
                        >
                            <Text style={{fontSize:22,color:'black',textAlign:'center',fontWeight:'bold'}}>Fechar</Text>
                        </TouchableOpacity>
                    </View> 
                </ModalFeedBack>
                <View style={{ padding: 5, backgroundColor: "#1D1D1D", height: 60, justifyContent: "center", paddingLeft: 10}}>
                    <TouchableRipple onPress={ ()=> { this.navigation.closeDrawer()}}>
                        <View style={{flexDirection: "row"}}>
                            <Icon color="#DFC695" name="close" size={25} />
                            <Text style={{marginLeft: 50, color: "#DFC695",fontSize: 18}}>Menu</Text>
                        </View>
                    </TouchableRipple>
                        </View>
                <DrawerContentScrollView {...this.props}>
    
                    <View style={styles.drawerContent}>
    
                        <View style={styles.userInfoSection}>
    
                            <View style={{flexDirection:'row',marginTop: 15}}>
                                <Avatar.Image
                                    source={{
                                        uri: this.state.user.profile_image
                                    }}
                                    size={50}
                                />
                                <View style={{marginLeft:15, flexDirection:'column'}}>
                                    <Title style={styles.title}>{this.state.user.name || ''}</Title>
                                    {/* <Caption style={styles.caption}>{ user.email || ''}</Caption> */}
                                </View>
                            </View>
                        </View>
    
                        <Drawer.Section style={styles.drawerSection}>
                            <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                        name="home-outline"
                                        color={color}
                                        size={size}
                                    />
                                )}
                                label="Home"
                                onPress={() => {this.props.navigation.navigate('Principal')}}
                            />
                        </Drawer.Section>
                        <Drawer.Section>
                            <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Perfil"
                                onPress={() => {this.props.navigation.navigate('perfil')}}
                            />
                        </Drawer.Section>
                        <Drawer.Section>
                            <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                    name="message-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Mensagens"
                                onPress={() => {this.props.navigation.navigate('mensagens')}}
                            />
                        </Drawer.Section>
                        <Drawer.Section>
                            <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                    name="map-marker"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Buscar Chopp Station"
                                onPress={() => {this.props.navigation.navigate('locais')}}
                            />
                        </Drawer.Section>
                        {/* <Drawer.Section>
                             <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                    name="credit-card-plus-outline"
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label="Adicionar Créditos"
                                onPress={() => {
                                    this.getUserPdv()
                                }}
                            />
                        </Drawer.Section> */}
                        <Drawer.Section>
                            <DrawerItem
                                icon={({color, size}) => (
                                    <Icon
                                        name="credit-card-outline"
                                        color={color}
                                        size={size}
                                    />
                                )}
                                label="Extrato"
                                onPress={() => {
                                    this.getUserAccount() 
                                }}
                            />
                        </Drawer.Section>
                        
                    </View>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection} >
                    <DrawerItem
                        icon={({color, size}) => (
                            <Icon
                            name="information-outline"
                            color={color}
                            size={size}
                            />
                        )}
                        label="Sobre"
                        onPress={ () => { this.props.navigation.navigate('sobre-app') }}
                    />
                </Drawer.Section>
                <Drawer.Section>
                    <DrawerItem
                        icon={({color, size}) => (
                            <Icon
                                name="exit-to-app"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Sair"
                        onPress={ async() => {
                            await AsyncStorage.removeItem("token");
                            await AsyncStorage.removeItem("user");
                            await AsyncStorage.removeItem("pdv");
                            await AsyncStorage.removeItem("ac");

                            this.props.navigation.navigate('Login');
                        }}
                    />
                </Drawer.Section>
    
            </SafeAreaView>
        );

    }

   

    

    
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
    },
  });