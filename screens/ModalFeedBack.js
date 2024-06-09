import React from "react";
import {Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

class ModalFeedBack extends React.Component{
    constructor(props) {
        super( props );
    }


    setModalVisible = async( visible ) =>{
        this.props.setModalVisible( visible );
    }


    render = ()=>{
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.setModalVisible( false );
                }}>

                <View style={styles.centeredView}>

                    <View style={styles.modal_view}>
                        <View style={styles.modal_header}>
                            <Text style={ styles.modalTitle }>{this.props.title}</Text>
                            {/* <TouchableWithoutFeedback onPress={() => this.setModalVisible( false )}>
                                <Icon name={"close"} style={styles.icon}
                                      size={40}
                                      color="#e1c797"/>
                            </TouchableWithoutFeedback> */}
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {this.props.children}
                        </View>
                        {/* <View style={styles.modal_footer}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={(e) => this.setModalVisible( false )}
                            >
                                <Text style={styles.textStyle}>Fechar</Text>
                            </Pressable>
                        </View> */}
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal_view: {
        marginTop: 0,
        backgroundColor: "white",
        borderRadius: 10,
        paddingTop: 0,
        //borderColor: "#990000",
        borderColor: "white",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '50%',
        width: '90%',
        position: "relative"
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#dfc695",
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: "#dfc695",
        width: '80%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        marginBottom: 20
    },
    error_message: {
        marginTop: '2%',
        color: 'black',
        fontWeight: "bold",
        textAlign: 'center',
      },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: '100%',
        position: "relative"
    },
    modal_header: {
        width: '100%',
        height: 50,
        position: "relative",
        borderBottomColor: '#e1c897',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    textStyle: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 25
    },
    modal_footer: {
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 15,
        height: "25%"
    },

    icon: {
        position: "absolute",
        right: 10,
        top: 0,
    },

    modalTitle:{
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    }

});

export default ModalFeedBack;