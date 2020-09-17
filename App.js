import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text,TextInput,Image, View } from 'react-native';
import BookTransaction from './screens/BookTranscationScreen';
import searchScreen from './screens/SearchScreen';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

export default class App extends Component {
  render(){


  return (
    <Appcontainer></Appcontainer>
  );
}
}
const TabNavigator =createBottomTabNavigator({
Transaction:{screen:BookTransaction},
  Search:{screen:searchScreen}
},
{
defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routeName = navigation.state.routeName;
    if(routeName ==="Transcation"){
      return(
<Image source={require('./assets/book.png')} style={{width:40,height:40}}></Image>
      ) 
    }
    else if(routeName==='Search'){
  return(
    <Image source={require('./assets/searchingbook.png')} style={{width:40,height:40}}></Image>
  )
    }
  }
})
})
const Appcontainer=createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
