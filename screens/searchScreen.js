import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text,TextInput,Image, View,FlatList ,TouchableOpacity,KeyboardAvoidingView,Alert} from 'react-native';
import firebase from 'firebase';
import db from  '../config'
export default  class SearchScreen extends Component{
    constructor(props){
    super(props)
    this.state={
     allTransactions:[],
     lastVisibleTransaction:null,
     search:""
    }
    }
    componentDidMount=async()=>{
        const query=await db.collection("transactions").limit(10).get()
        query.docs.map((doc)=>{
        this.setState({
            allTransactions:[],
            lastVisibleTransaction:doc
        })
        })
    }
    searchTransactions=async(text)=>{
    var enterText = text.split("")
    if(enterText[0].toUpperCase()==="B"){
        const transactions=await db.collection("transactions").where("bookID","==",text).get()
        transactions.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    else  if(enterText[0].toUpperCase()==="S"){
        const transactions=await db.collection("transactions").where("studentID","==",text).get()
        transactions.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    }
    fetchmoreTransactions=async ()=>{
        var text=this.state.search.toUpperCase()
        var enterText = text.split("")
    if(enterText[0].toUpperCase()==="B"){
        const transactions=await db.collection("transactions").where("bookID","==",text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        transactions.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    else  if(enterText[0].toUpperCase()==="S"){
        const transactions=await db.collection("transactions").where("studentID","==",text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        transactions.docs.map((doc)=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()],
                lastVisibleTransaction:doc
            })
        })
    }
    }
    render(){
        return(
        <View style ={styles.container}>
          <View style ={styles.searchBar}>
    <TextInput style={styles.bar} placeholder="enter your book ID or StudentID"onChangeText={(text)=>{
        search:text
    }}> </TextInput>
    <TouchableOpacity style={styles.searchButton}onPress={()=>{
        this.searchTransactions(this.state.search)
    }}>  <Text>search </Text> </TouchableOpacity>
           </View>
           <FlatList data={this.state.allTransactions}renderItem={({item})=>(
               <View style={{borderBottomWidth:2}}>
                  <Text>
                      {"bookID:"+item.bookID}
                    </Text> 
                    <Text>
                        {"studentID:"+item.studentID}
                    </Text>
                    <Text>
                        {"Transaction type :"+item.transactionType}
                    </Text>
                    <Text>
                        {"date:"+item.date.toDate()}
                    </Text>
                    </View>
           )} keyExtractor={(item,index)=>{index.toString()}}onEndReached={this.fetchmoreTransactions}onEndReachedThreshold={0.7} ></FlatList>
            </View>
        );
    }

}
const styles =StyleSheet.create({
    container:{
flex:1,
marginTop:20
    },
    searchBar:{
        flexDirection:"row",
        height:40,
        width:"auto",
        borderWidth:0.5,
        alignItems:"center"
    },
    bar:{
        borderWidth:2,
        height:30,
        width:300,
        paddingLeft:10
    },
    searchButton:{
        borderWidth:1,
        height:30,
        width:50,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"green"
    }
})