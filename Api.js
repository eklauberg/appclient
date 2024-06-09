import AsyncStorage from '@react-native-async-storage/async-storage';
import { add } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
var jsonRetornoDesenho;

const BASE_API = 'https://app-api.beermatic.com.br/api/';

var $tentatisvas = 0;

export default {

    user: async () => { 
        const token = await AsyncStorage.getItem('token');
    
        const req = await fetch(`${BASE_API}/user/`, { 
            
            method: 'GET', 
            headers: {
                Accept: 'application/json',
        
                'Authorization': `Bearer ${token}`
            
            },
        
        });
        try {
            const json = await req.json(); 
            console.log('Haniel ', json)
            return json;
        } catch (_err) {
            
    
            return 'error'
        
        }

    },


    registerUser: async (json) => { 

            const req = await fetch(`${BASE_API}/register`, { 
                
            method: 'POST', 
            headers: {
                Accept: 'application/json',
               'Content-Type': 'application/json',
               
            },
            body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
           
            return json;
        } catch (_err) {
            
       
            return 'error'
           
        }

    
    },

    login : async (email,password) => {
        var dados =  new Object();;
        dados.email =  email ;
        dados.password =  password ;
        const req = await fetch(`${BASE_API}/login`, { 
    
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
               
                
            },
            
            body: JSON.stringify(dados)
        });
     
        const json = await req.json();        
        return json;
    },

    acceptTerms: async (json) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/update-read-terms`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(json)
        });
        try{
            const json = await req.json();
            return json;
        } catch (_err) {
            return 'error'
        }

    },

    consultarSaldo: async (json) => { 

        const req = await fetch(`${BASE_API}/balance/sidfosiuasdfoasdfuasdgfiasdsdsdsdf`, { 
            
        method: 'POST', 
        headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json',
           
        },
            body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
        
            return json;
        } catch (_err) {
            

            return 'error'
        
        }

    },
    pontoDeVenda: async (json) => { 

        const req = await fetch(`${BASE_API}/pos/38593134-3b9e-48e3-9ac0-d4ee6af75fd5`, { 
            
        method: 'GET', 
        headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json',
           
        },
        body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
        
            return json;
        } catch (_err) {
            
    
            return 'error'
        
        }
    },

    pontoDeVenda: async (json) => { 

        const req = await fetch(`${BASE_API}/pos/38593134-3b9e-48e3-9ac0-d4ee6af75fd5`, { 
            
        method: 'POST', 
        headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json',
           
        },
        body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
        
            return json;
        } catch (_err) {
            
    
            return 'error'
        
        }


    },
    termosDeUso: async () => { 

        const req = await fetch(`${BASE_API}/termos-de-uso`, { 
            
        method: 'GET', 
        headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json',
           
        },
        //body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
        
            return json;
        } catch (_err) {
            
    
            return 'error'
        
        }


    },

    pagamentos: async (json) => { 

        const req = await fetch(`${BASE_API}/user/account/hsdfasodfiuhasdfhasdfohasdfisauhfdausdfhasodfiasdhfauosdfau/transactions`, { 
            
        method: 'GET', 
        headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json',
           
        },
        body: JSON.stringify(json)
        });
        try {
            const json = await req.json(); 
        
            return json;
        } catch (_err) {
            
    
            return 'error'
        
        }


    },

    
   
    socialLogin: async (json, social) => {
        
        const req = await fetch(`${BASE_API}/social-login/${social}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(json)
        });
        try{
            const json = await req.json();

            return json;
        } catch (_err){
            return 'error'
        }
    }

    

};