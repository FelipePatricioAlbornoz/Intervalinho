import React, {useState, useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen(){
  const [matricula,setMatricula] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const { signIn } = useContext(AuthContext)

  const entrar = () => {
    setLoading(true)
    signIn(matricula,password).catch(e=>{
      console.log("erro",e)
    }).finally(()=>setLoading(false))
  }

  return(
    <View style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
      <Text style={{fontSize:20,fontWeight:"bold",marginTop:50}}>Nome do app</Text>
      <Text>Intervalinho</Text>

      <TextInput 
        placeholder="Digite sua matrícula ou código"
        value={matricula}
        onChangeText={t=>setMatricula(t)}
        style={{borderWidth:1,width:"80%",marginTop:20,padding:10,borderRadius:8}}
      />

      <TextInput 
        placeholder="Digite sua senha"
        value={password}
        secureTextEntry={true}
        onChangeText={t=>setPassword(t)}
        style={{borderWidth:1,width:"80%",marginTop:15,padding:10,borderRadius:8}}
      />

      <TouchableOpacity onPress={entrar} style={{marginTop:15,backgroundColor:"black",padding:12,borderRadius:30,width:"80%",alignItems:"center"}}>
        <Text style={{color:"white"}}>{loading ? "Entrando..." : "Continuar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>Linking.openURL("#")} style={{marginTop:15}}>
        <Text>Não possui conta? <Text style={{textDecorationLine:"underline",color:"blue"}}>ir para cadastro</Text></Text>
      </TouchableOpacity>

      <Text style={{fontSize:11,color:"gray",textAlign:"center",marginTop:30,padding:10}}>
        Ao clicar em continuar, você concorda com os nossos Termos de Serviço e com a Política de Privacidade
      </Text>
    </View>
  )
}
