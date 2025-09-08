import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import storage from '../services/storage';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ onBack }) {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [roleAluno, setRoleAluno] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const cadastrar = async () => {
    if (!name || !matricula) {
      alert('Nome e matrícula são obrigatórios');
      return;
    }
    setLoading(true);
    try {
        
      // criar registro de aluno

      const student = { name, matricula };
  const created = await storage.addStudent(student);

  // faça login automaticamente no novo usuário (sem verificação de senha nesta demonstração simples)

  await signIn(matricula, '');
    } catch (e) {
      console.log('erro cadastro', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex:1,alignItems:'center',backgroundColor:'#fff'}}>
      <Text style={{fontSize:20,fontWeight:'700',marginTop:50}}>Nome do app</Text>
      <Text style={{marginTop:10}}>Cadastre seu usuario</Text>

      <TextInput placeholder="Digite seu nome" value={name} onChangeText={setName} style={{borderWidth:1,width:'86%',marginTop:20,padding:12,borderRadius:8}} />
      <TextInput placeholder="Digite sua matricula ou e-mail" value={matricula} onChangeText={setMatricula} style={{borderWidth:1,width:'86%',marginTop:12,padding:12,borderRadius:8}} />
      <TextInput placeholder="Digite sua senha" value={password} onChangeText={setPassword} secureTextEntry={true} style={{borderWidth:1,width:'86%',marginTop:12,padding:12,borderRadius:8}} />

      <View style={{flexDirection:'row',width:'86%',justifyContent:'flex-start',marginTop:12}}>
        <TouchableOpacity onPress={() => setRoleAluno(!roleAluno)} style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{width:18,height:18,backgroundColor:roleAluno ? 'black' : '#eee',marginRight:8}} />
          <Text>Aluno</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRoleAluno(!roleAluno)} style={{flexDirection:'row',alignItems:'center',marginLeft:20}}>
          <View style={{width:18,height:18,backgroundColor:!roleAluno ? 'black' : '#eee',marginRight:8}} />
          <Text>Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={cadastrar} style={{marginTop:20,backgroundColor:'black',padding:14,borderRadius:12,width:'86%',alignItems:'center'}}>
        <Text style={{color:'white'}}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onBack && onBack()} style={{marginTop:12}}>
        <Text>Já tem conta? <Text style={{color:'blue',textDecorationLine:'underline'}}>ir para login</Text></Text>
      </TouchableOpacity>

      <Text style={{fontSize:11,color:'#999',textAlign:'center',marginTop:30,padding:10}}>
        Ao clicar em continuar, você concorda com os nossos Termos de Serviço e com a Política de Privacidade
      </Text>
    </View>
  );
}
