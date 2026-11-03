import { Text, View } from "react-native";

const Alerta = () => {
  alert("Aluno Cadastrado");
}

class cad {
  state = {
    data: [
      { id: "01", name: "Huguinho"},
      { id: "02", name: "Zezinho"},
      { id: "03", name: "Luisinho"}
    ]
  }
}

export default function App() {
  return (
    <View>
      <h1>CADASTRO DE ALUNOS</h1>
      <Text>Nome do aluno: <input name="nome"/></Text>
      <Text>Curso do aluno: <input name="curso"/></Text>
      <button onClick={Alerta}>Cadastrar</button>
    </View>
  )
}