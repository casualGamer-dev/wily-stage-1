import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class searchScreen extends Component{
    render(){
        return(
           <View style ={{flex:1, alignItems:"center",justifyContent:"center"}}>
            <Text >
                Search book
            </Text>
            </View>
        )
    }
    
}