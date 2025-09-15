// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import axios from "axios";

const apiUrl = "https://localhost:7020/api/Aluno"; // Substitua com a URL da sua API

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editId, setEditId] = useState(null);

  // Carregar alunos
  const carregarAlunos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAlunos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar os alunos");
    }
  };

  // Adicionar ou editar aluno
  const handleSubmit = async () => {
    if (!nome || !email || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      if (editId) {
        // Editar aluno
        await axios.put(`${apiUrl}/${editId}`, { nome, email, telefone });
        Alert.alert("Sucesso", "Aluno atualizado com sucesso!");
      } else {
        // Adicionar aluno
        await axios.post(apiUrl, { nome, email, telefone });
        Alert.alert("Sucesso", "Aluno cadastrado com sucesso!");
      }
      setNome("");
      setEmail("");
      setTelefone("");
      setEditId(null);
      carregarAlunos();
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar os dados");
    }
  };

  // Excluir aluno
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      Alert.alert("Sucesso", "Aluno excluído com sucesso!");
      carregarAlunos();
    } catch (error) {
      Alert.alert("Erro", "Erro ao excluir aluno");
    }
  };

  // Editar aluno
  const handleEdit = (aluno) => {
    setNome(aluno.nome);
    setEmail(aluno.email);
    setTelefone(aluno.telefone);
    setEditId(aluno.id);
  };

  // Carregar lista de alunos ao inicializar
  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gerenciamento de Alunos</Text>

      {/* Formulário de cadastro */}
      <View style={styles.form}>
        <TextInputstyle={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInputstyle={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInputstyle={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="numeric"
        />
        <Button title={editId ? "Atualizar Aluno" : "Cadastrar Aluno"} onPress={handleSubmit} />
      </View>

      {/* Lista de alunos */}
      <FlatListdata={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alunoItem}>
            <Text>{item.nome}</Text>
            <Text>{item.email}</Text>
            <Text>{item.telefone}</Text>
            <Button title="Editar" onPress={() => handleEdit(item)} />
            <Button title="Excluir" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  alunoItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
});

