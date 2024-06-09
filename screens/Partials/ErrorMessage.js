import {Text, View} from "react-native";
import React from "react";

export default function App( props ){
    return(
        <View style={{ padding: 1}}>
            <Text style={{ color: 'crimson', fontWeight: "bold", fontSize: 12, letterSpacing: .4}}>
                { props.message}
            </Text>
        </View>
    );
}