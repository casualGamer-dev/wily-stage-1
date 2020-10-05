import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text,TextInput,Image, View ,TouchableOpacity,KeyboardAvoidingView,Alert} from 'react-native';
import * as Permissions from "expo-permissions";
import BarCodeScanner from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from  '../config'
export default class BookTranscation extends Component{
    constructor(){
     super();
    this.state={hasCamerPermissions:null,
    scanned:false,
    scannedBookID:'',
    scannedStudentID:'',
    buttonState:'normal',
    transactionMessage:''
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
 handleTransaction = async()=>{
   var transcationType=await this.checkBookEligibilty()
   if(!transcationType){
     Alert.alert('book doest not exist in the database')
     this.setState({
       scannedStudentID:'',
       scannedBookID:''
     })
   }
   else if(transcationType==="issue"){
     var isStudentEligible =await this.checkStudentEligibiltyForbookissue()
     if(isStudentEligible){
       this.initiateBookIssue()
       Alert.alert("BOOK HAS BEEN ISSUED");
     }
   }
   else if(transcationType==="return"){
    var isStudentEligible =await this.checkStudentEligibiltyForbookReturn()
    if(isStudentEligible){
      this.initiateBookReturn()
      Alert.alert("BOOK HAS BEEN returned");
   }
  }

 }
 initiateBookIssue=async ()=>{
  db.collection('transactions').add({
    studentID:this.state.scannedStudentID,
    bookID:this.state.scannedBookID,
date:firebase.firestore.Timestamp.now().toDate(),
transcationType:"issue"
  })
  db.collection('books').doc(this.state.scannedBookID).update({
    bookAvailability:false
  })
  db.collection('students').doc(this.state.scannedStudentID).update({
   booksIssued:firebase.firestore.FieldValue.increment(1)
 })
 this.setState({
   scannedStudentID:'',
   scannedBookID:''
 })
}
initiateBookReturn=async ()=>{
  db.collection('transactions').add({
    studentID:this.state.scannedStudentID,
    bookID:this.state.scannedBookID,
date:firebase.firestore.Timestamp.now().toDate(),
transcationType:"return"
  })
  db.collection('books').doc(this.state.scannedBookID).update({
    bookAvailability:true
  })
  db.collection('students').doc(this.state.scannedStudentID).update({
   booksIssued:firebase.firestore.FieldValue.increment(-1)
 })
 this.setState({
   scannedStudentID:'',
   scannedBookID:''
 })
}

 checkBookEligibilty=async()=>{
  const bookRef = await db.collection("books").where("bookID","==",this.state.scannedBookID).get()
  var transcationType=""
  if(bookRef.docs.length===0){
    transcationType=false
  }
  else{
    bookRef.docs.map((doc)=>{
var book=doc.data()
if(book.bookAvailability){
  transcationType="issue"
}
else{
  transcationType="return"
}
    })
  }
  return transcationType
}
checkStudentEligibiltyForbookissue=async ()=>{
  const studentRef = await db.collection("student").where("studentID","==",this.state.scannedStudentID).get()
  var isStudentEligible=""
  if(studentRef.doc.length===0){
    this.setState({
      scannedBookID:'',
      scannedStudentID:''
    })
    isStudentEligible=false
    Alert.alert("this studentID does not exist");
  }
  else{
    studentRef.docs.map((doc)=>{
      var student=doc.data()
      if(student.booksIssued<2){
        isStudentEligible=true
      }
      else{
        isStudentEligible=false
        Alert.alert("2 books have been already issued")
        this.setState({
          scannedBookID:"",
          scannedStudentID:""
        })
      }
    })
  }
  return isStudentEligible;
}
checkStudentEligibiltyForbookReturn =async ()=>{
  const transactionRef= await db.collection("transactions").where("bookID","==",this.state.scannedBookID).limit(1).get()
  var isStudentEligible =""
 transactionRef.docs.map((doc)=>{
var BookTranscation=doc.data()
if(BookTranscation.studentID=this.state.scannedStudentID){
isStudentEligible=true
}
else{
  isStudentEligible=false
  Alert.alert("book was not issued by the student")
  this.setState({
    scannedBookID:"",
    scannedStudentID:""
  })
}
return isStudentEligible
 })
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
         <KeyboardAvoidingView style={styles.container} behavior="padding"enabled>
             <View>
                 <Image source={require('../assets/booklogo.jpg')} style={{width:200,height:200}}></Image>
                 <Text style={{textAlign:"center",fontSize:30}}>
                  wily
                 </Text>
             </View>
             <View style={styles.inputView}>
                 <TextInput style={styles.inputBox} placeholder='bookID' value={this.state.scannedBookID}onChangeText={(text)=>{
                   this.setState({
                     scannedBookID:text
                   })
                 }} >
                
                 </TextInput>
                 <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getPermissionsAsync('bookID')}}>
                     <Text style={styles.buttonText}>scan</Text>
                 </TouchableOpacity>
             </View>
             <View style={styles.inputView}>
                 <TextInput style={styles.inputBox} placeholder='studentID' value={this.state.scannedStudentID}onChangeText={(text)=>{
                   this.setState({
                     scannedStudentID:text
                   })
                 }}>

                 </TextInput>
                 <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getPermissionsAsync('studentID')}}>
                     <Text style={styles.buttonText}>scan</Text>
                 </TouchableOpacity>
             </View>
             <TouchableOpacity style={styles.submitButton}onPress={async()=>{
               var tansactionMessage=await this.handleTransaction()
             }}>
     <Text style={styles.submitButtonText}> SUBMIT</Text>
             </TouchableOpacity>
             </KeyboardAvoidingView>
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
    },
    submitButton:{
      backgroundColor: '#6ABBBA',
      width: 100,
      height:50
    },
    submitbuttonText:{
      fontSize: 15,
      padding:10,
      textAlign: 'center',
      fontWeight:"bold",
      color:"white"
    },
  });