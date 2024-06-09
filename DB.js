import SQLite from 'react-native-sqlite-storage';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    SafeAreaView,
    Text,
  } from 'react-native';
import { useCallback } from 'react';

  let db;
  let $retorno='';


export default {


  abreBanco(){

    db = SQLite.openDatabase(
      {
        name: 'analise.db',
        createFromLocation : 1,
      
      
      },
      () => { 
        //console.log('entrou na conexao');
      },
      error => {
        console.log("ERROR: " + error);
      }
    )

  },
 

  
  deletaAnalise (id){

    this.abreBanco();

    db.transaction(
      tx => {
      
        tx.executeSql(
          "delete from analise where id= ?",
          [id],
         
          (tx, results) => {
         
                        
            
          },
          (tx, error) => {
            //console.log("Could not execute query");
          }
        );
      },

      error => {
        console.log('error' , error);
      },
      () => {
       // console.log("Transaction done");
      }
    );
      
  },

  deletaAnalises (){

    this.abreBanco();

    db.transaction(
      tx => {
      
        tx.executeSql(
          "delete from analise",
          [],
         
          (tx, results) => {
         
                        
            
          },
          (tx, error) => {
            //console.log("Could not execute query");
          }
        );
      },

      error => {
        console.log('error' , error);
      },
      () => {
       // console.log("Transaction done");
      }
    );
      
  },




  gravaAnalise($descricao,jsonEnviado,$cordenadaGuardada,$poligonoDesenhado){
      console.log('descricao',$descricao);
      console.log('jsonEnviado',jsonEnviado);
      console.log('cordenadaGuardada',$cordenadaGuardada);
      console.log('poligonoDesenhado',$poligonoDesenhado)

      this.abreBanco();
  
      db.transaction(
        tx => {
        
          tx.executeSql(
            "insert into analise(descricao,json,cordenada,desenho) values(?,?,?,?)",
            [$descricao,jsonEnviado,$cordenadaGuardada,$poligonoDesenhado],
           
         /*   (tx, results) => {
           
                          
              
            },
            (tx, error) => {
              //console.log("Could not execute query",error);
            }*/
          );
        },
  
       /* error => {
          //console.log('error' , error);
        },
        () => {
          //console.log("Transaction done");
        }*/
      );
        
    },

  

}