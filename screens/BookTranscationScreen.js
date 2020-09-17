import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text,TextInput,Image, View ,TouchableOpacity} from 'react-native';
import * as Permissions from "expo-permissions";
import BarCodeScanner from 'expo-barcode-scanner';
export default class BookTranscation extends Component{
    constructor(){
     super();
    this.state={hasCamerPermissions:null,
    scanned:false,
    scannedBookID:'',
    scannedStudentID:'',
    buttonState:'normal',
    }
    }
    getPermissionsAsync = async (id) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermissions: status === 'granted',buttonState:id,scanned:false });
        console.log(status)
      };

    handleBarecodeScanned = async({type,data})=>{
        const {buttonState}=this.state
        if(buttonState==="bookID"){

       
       this.setState({
    scanned:true,
    scannedBookID:data,
    buttonState:'normal'
       }) 
    }
    else if(buttonState==='studentID'){
this.setState({
    scanned:true,
    scannedStudentID:data,
    buttonState:'normal'
})
    }
 }
    render(){
        const hasCameraPermissions=this.state.hasCamerPermissions;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;
        if(buttonState!=='normal'&& hasCameraPermissions){
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
             <View>
                 <Image source={require('../assets/booklogo.jpg')} style={{width:200,height:200}}></Image>
                 <Text style={{textAlign:"center",fontSize:30}}>
                  wily
                 </Text>
             </View>
             <View style={styles.inputView}>
                 <TextInput style={styles.inputBox} placeholder='bookID' value={this.state.scannedBookID}>
      
                 </TextInput>
                 <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getPermissionsAsync('bookID')}}>
                     <Text style={styles.buttonText}>scan</Text>
                 </TouchableOpacity>
             </View>
             <View style={styles.inputView}>
                 <TextInput style={styles.inputBox} placeholder='studentID' value={this.state.scannedStudentID}>
      
                 </TextInput>
                 <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getPermissionsAsync('studentID')}}>
                     <Text style={styles.buttonText}>scan</Text>
                 </TouchableOpacity>
             </View>
             </View>
     )
        }
        
    }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    }
  });