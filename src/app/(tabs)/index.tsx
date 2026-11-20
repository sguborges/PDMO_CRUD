import { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Define a estrutura (modelo de dados) de um Aluno conforme o PDF
interface Aluno {
  id: number;
  nome: string;
  curso: string;
}

export default function Index() {
  // =========================================================================
  // 1. ESTADOS DO APLICATIVO (useState)
  // =========================================================================

  // Guarda o texto digitado no campo "Nome"
  const [nome, setNome] = useState<string>('');

  // Guarda o texto digitado no campo "Curso"
  const [curso, setCurso] = useState<string>('');

  // Guarda o ID do aluno que está sendo editado.
  // Quando for null, significa que estamos cadastrando um novo aluno.
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  // Guarda a lista de alunos (Fase 1: dados armazenados localmente no estado)
  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: 1, nome: 'João', curso: 'Informática' },
    { id: 2, nome: 'Maria', curso: 'Desenvolvimento de Sistemas' },
  ]);

  // =========================================================================
  // 2. FUNÇÃO AUXILIAR
  // =========================================================================

  // Limpa os campos de texto e sai do modo de edição
  function limparFormulario() {
    setNome('');
    setCurso('');
    setIdEmEdicao(null);
  }

  // =========================================================================
  // 3. OPERAÇÕES DO CRUD LOCAL (CREATE, UPDATE, DELETE)
  // =========================================================================

  // Função chamada pelo botão principal ("Cadastrar" ou "Salvar Alteração")
  function handleSalvarAluno() {
    // Etapa 6: Validação para não cadastrar ou salvar com campos vazios
    if (nome.trim() === '' || curso.trim() === '') {
      Alert.alert('Atenção', 'Por favor, preencha o nome e o curso do aluno.');
      return; // Interrompe a execução aqui se houver campo vazio
    }

    // Verifica se estamos editando um aluno existente ou criando um novo
    if (idEmEdicao !== null) {
      // ---------------------------------------------------------------------
      // UPDATE (Atualizar aluno existente)
      // ---------------------------------------------------------------------
      // O .map() percorre toda a lista. Ao encontrar o aluno com o ID selecionado,
      // retorna um novo objeto atualizado. Os demais alunos permanecem iguais.
      const listaAtualizada = alunos.map((aluno) => {
        if (aluno.id === idEmEdicao) {
          return {
            ...aluno, // Mantém o mesmo ID
            nome: nome.trim(),
            curso: curso.trim(),
          };
        }
        return aluno;
      });

      setAlunos(listaAtualizada);
      Alert.alert('Sucesso', 'Dados do aluno atualizados!');
    } else {
      // ---------------------------------------------------------------------
      // CREATE (Cadastrar novo aluno)
      // ---------------------------------------------------------------------
      // Cria o objeto do novo aluno com um ID único (Date.now() gera um número único)
      const novoAluno: Aluno = {
        id: Date.now(),
        nome: nome.trim(),
        curso: curso.trim(),
      };

      // Atualiza a lista copiando os alunos antigos (...alunos) e adicionando o novo
      setAlunos([...alunos, novoAluno]);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    }

    // Limpa os campos e volta para o modo de cadastro
    limparFormulario();
  }

  // Prepara o formulário ao clicar no botão "Editar" de um item da lista
  function iniciarEdicao(aluno: Aluno) {
    setNome(aluno.nome); // Preenche o campo Nome com os dados do aluno
    setCurso(aluno.curso); // Preenche o campo Curso com os dados do aluno
    setIdEmEdicao(aluno.id); // Guarda o ID para saber qual registro alterar ao salvar
  }

  // -------------------------------------------------------------------------
  // DELETE (Excluir aluno)
  // -------------------------------------------------------------------------
  function excluirAluno(id: number) {
  // Função interna que realmente apaga o aluno
  const confirmarExclusao = () => {
    const listaFiltrada = alunos.filter((aluno) => aluno.id !== id);
    setAlunos(listaFiltrada);

    if (idEmEdicao === id) {
      limparFormulario();
    }
  };

  // Se estiver rodando no navegador (Web), usa window.confirm
  if (Platform.OS === 'web') {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      confirmarExclusao();
    }
  } else {
    // Se estiver no Android ou iOS, usa o Alert nativo
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este aluno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmarExclusao },
      ]
    );
  }
}

  // =========================================================================
  // 4. INTERFACE DO USUÁRIO (READ com FlatList + Formulário)
  // =========================================================================
  return (
    <SafeAreaView style={styles.container}>
      {/* Título da tela conforme Etapa 1 */}
      <Text style={styles.titulo}>Cadastro de Alunos</Text>

      {/* Área do Formulário */}
      <View style={styles.formulario}>
        <Text style={styles.label}>Nome do Aluno:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João Silva"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Curso:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Informática"
          value={curso}
          onChangeText={setCurso}
        />

        {/* Botão Principal: muda texto e cor dependendo se está editando ou cadastrando */}
        <Pressable
          style={[
            styles.botaoPrincipal,
            idEmEdicao !== null ? styles.botaoSalvar : styles.botaoCadastrar,
          ]}
          onPress={handleSalvarAluno}
        >
          <Text style={styles.textoBotao}>
            {idEmEdicao !== null ? 'Salvar Alteração' : 'Cadastrar'}
          </Text>
        </Pressable>

        {/* Botão extra para cancelar a edição caso o usuário desista */}
        {idEmEdicao !== null && (
          <Pressable style={styles.botaoCancelar} onPress={limparFormulario}>
            <Text style={styles.textoBotaoCancelar}>Cancelar Edição</Text>
          </Pressable>
        )}
      </View>

      {/* Título da Lista */}
      <Text style={styles.subtitulo}>Alunos Cadastrados ({alunos.length})</Text>

      {/* READ: Exibição da lista usando FlatList */}
      <FlatList
        data={alunos}
        // keyExtractor informa ao React Native qual propriedade identifica cada item
        keyExtractor={(item) => String(item.id)}
        // Mensagem exibida se todos os alunos forem excluídos
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhum aluno cadastrado.</Text>
        }
        // Como cada aluno será desenhado na tela
        renderItem={({ item }) => (
          <View style={styles.cardAluno}>
            {/* Dados do aluno */}
            <View style={styles.infoAluno}>
              <Text style={styles.nomeAluno}>{item.nome}</Text>
              <Text style={styles.cursoAluno}>Curso: {item.curso}</Text>
            </View>

            {/* Botões Editar e Excluir */}
            <View style={styles.botoesItem}>
              <Pressable
                style={styles.botaoEditar}
                onPress={() => iniciarEdicao(item)}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </Pressable>

              <Pressable
                style={styles.botaoExcluir}
                onPress={() => excluirAluno(item.id)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ===========================================================================
// 5. ESTILIZAÇÃO SIMPLES E LIMPA
// ===========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  botaoPrincipal: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoCadastrar: {
    backgroundColor: '#2563EB', // Azul para cadastrar
  },
  botaoSalvar: {
    backgroundColor: '#16A34A', // Verde para salvar edição
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoCancelar: {
    marginTop: 8,
    padding: 10,
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    color: '#64748B',
    fontSize: 14,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
  },
  listaVazia: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
    fontSize: 16,
  },
  cardAluno: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  infoAluno: {
    flex: 1,
    paddingRight: 10,
  },
  nomeAluno: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cursoAluno: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  botoesItem: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoEditar: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoExcluir: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});