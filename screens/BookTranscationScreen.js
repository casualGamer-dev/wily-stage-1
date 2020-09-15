import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import * as Permissions from "expo-permissions";
import BarCodeScanner from 'expo-barcode-scanner';
export default class fb extends Component{
    constructor(){
     super();
    this.state={hasCamerPermissions:null,
    scanned:false,
    scannedData:'',
    buttonState:'normal',
    }
    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermissions: status === 'granted',buttonState:'clicked',scanned:false });
        console.log(status)
      };
    }
    handleBarecodeScanned = async({type,data})=>{
       this.setState({
    scanned:true,
    scannedData:data,
    buttonState:normal
       }) 
    }
    render(){
        const hasCameraPermissions=this.state.hasCamerPermissions;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;
        if(buttonState==="clicked"&& hasCameraPermissions){
            return(
              <BarCodeScanner onBarCodeScanned={
                  scanned ? undefined
                  :this.handleBarecodeScanned
              }
              style={StyleSheet.absoluteFillObject}>

              </BarCodeScanner>
             )
        }
        else if(buttonState==='normal'){
     return(
         <View style={styles.container}>
             <Text style={styles.displayText}>
                 {
                     hasCameraPermissions===true? this.state.scannedData
                     :'requestCamerPermissions'
                 }
             </Text>
             <TouchableOpacity style={styles.ScannedButton}onPress={this.getPermissionsAsync}>
<Text style={styles.buttonText}>
scan QR Code
</Text>
             </TouchableOpacity>
             </View>
     )
        }
        
    }
    
}

const styles=StyleSheet.create({
    container:{flex:1,justifyContent:'center',alignItems:'center'},
    displayText:{fontSize:15},
    ScannedButton:{backgroundColor:'aqua',padding:10,margin:10},
    buttonText:{fontSize:20}
})