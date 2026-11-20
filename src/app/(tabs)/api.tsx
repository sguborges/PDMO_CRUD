import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface Aluno {
  id: number;
  nome: string;
  curso: string;
}

// URL base da API (substitua pela URL fornecida pelo professor quando houver)
const API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function Fase2Api() {
  // =========================================================================
  // 1. ESTADOS DO APLICATIVO (useState)
  // =========================================================================
  const [nome, setNome] = useState<string>('');
  const [curso, setCurso] = useState<string>('');
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  // Estado obrigatório da Fase 2: controla a exibição do ActivityIndicator
  const [carregando, setCarregando] = useState<boolean>(false);

  // =========================================================================
  // 2. USEEFFECT: CONSULTA INICIAL AO ABRIR A TELA
  // =========================================================================
  useEffect(() => {
    buscarAlunos();
  }, []);

  function limparFormulario() {
    setNome('');
    setCurso('');
    setIdEmEdicao(null);
  }

  // =========================================================================
  // 3. READ (GET) - Buscar lista de alunos na API
  // =========================================================================
  async function buscarAlunos() {
    setCarregando(true); // Ativa o indicador de carregamento

    try {
      // Faz a requisição GET usando fetch e aguarda com await
      const response = await fetch(API_URL);

      // Verifica se a resposta HTTP foi aceita (status 200-299)
      if (!response.ok) {
        throw new Error('Erro ao buscar alunos na API.');
      }

      // Converte a resposta JSON recebida da API para objeto JavaScript
      const dados = await response.json();

      // Adapta os 4 primeiros registros de exemplo da API para o formato { id, nome, curso }
      const alunosFormatados: Aluno[] = dados.slice(0, 4).map((item: any) => ({
        id: item.id,
        nome: item.name,
        curso: item.company?.bs || 'Informática',
      }));

      setAlunos(alunosFormatados);
    } catch (erro) {
      // Exibe alerta caso falhe a conexão ou ocorra erro na API
      Alert.alert('Erro de Rede', 'Não foi possível carregar os alunos da API.');
    } finally {
      // O bloco finally sempre executa ao final, desativando o carregamento
      setCarregando(false);
    }
  }

  // =========================================================================
  // 4. CREATE (POST) E UPDATE (PUT) NA API
  // =========================================================================
  async function handleSalvarAluno() {
    if (nome.trim() === '' || curso.trim() === '') {
      Alert.alert('Atenção', 'Por favor, preencha o nome e o curso do aluno.');
      return;
    }

    setCarregando(true);

    try {
      if (idEmEdicao !== null) {
        // -------------------------------------------------------------------
        // UPDATE (PUT) - Alterar um aluno existente pelo ID
        // -------------------------------------------------------------------
        const response = await fetch(`${API_URL}/${idEmEdicao}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          // JSON.stringify() transforma o objeto JS em texto JSON para envio
          body: JSON.stringify({
            id: idEmEdicao,
            nome: nome.trim(),
            curso: curso.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar aluno na API.');
        }

        // Atualiza a lista na tela após confirmação da API
        const listaAtualizada = alunos.map((aluno) =>
          aluno.id === idEmEdicao
            ? { ...aluno, nome: nome.trim(), curso: curso.trim() }
            : aluno
        );
        setAlunos(listaAtualizada);
        Alert.alert('Sucesso (PUT)', 'Aluno atualizado na API!');
      } else {
        // -------------------------------------------------------------------
        // CREATE (POST) - Cadastrar um novo aluno na API
        // -------------------------------------------------------------------
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // JSON.stringify() transforma os dados antes de enviar no corpo (body)
          body: JSON.stringify({
            nome: nome.trim(),
            curso: curso.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao cadastrar aluno na API.');
        }

        // Converte o retorno da API
        const dadoCriado = await response.json();

        const novoAluno: Aluno = {
          id: dadoCriado.id || Date.now(),
          nome: nome.trim(),
          curso: curso.trim(),
        };

        setAlunos([...alunos, novoAluno]);
        Alert.alert('Sucesso (POST)', 'Aluno cadastrado na API!');
      }

      limparFormulario();
    } catch (erro) {
      Alert.alert('Erro', 'Ocorreu um problema ao salvar os dados na API.');
    } finally {
      setCarregando(false);
    }
  }

  function iniciarEdicao(aluno: Aluno) {
    setNome(aluno.nome);
    setCurso(aluno.curso);
    setIdEmEdicao(aluno.id);
  }

  // =========================================================================
  // 5. DELETE (DELETE) - Excluir aluno na API pelo ID
  // =========================================================================
  async function excluirAluno(id: number) {
    setCarregando(true);

    try {
      // Envia o ID na URL usando o método HTTP DELETE
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir aluno na API.');
      }

      // Remove o aluno da lista exibida na tela após confirmação da API
      const listaFiltrada = alunos.filter((aluno) => aluno.id !== id);
      setAlunos(listaFiltrada);

      if (idEmEdicao === id) {
        limparFormulario();
      }

      Alert.alert('Sucesso (DELETE)', 'Aluno excluído da API!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível excluir o aluno na API.');
    } finally {
      setCarregando(false);
    }
  }

  // =========================================================================
  // 6. INTERFACE DO USUÁRIO
  // =========================================================================
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Alunos (API HTTP)</Text>

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

        <Pressable
          style={[
            styles.botaoPrincipal,
            idEmEdicao !== null ? styles.botaoSalvar : styles.botaoCadastrar,
          ]}
          onPress={handleSalvarAluno}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {idEmEdicao !== null ? 'Salvar Alteração (PUT)' : 'Cadastrar (POST)'}
          </Text>
        </Pressable>

        {idEmEdicao !== null && (
          <Pressable style={styles.botaoCancelar} onPress={limparFormulario}>
            <Text style={styles.textoBotaoCancelar}>Cancelar Edição</Text>
          </Pressable>
        )}
      </View>

      {/* Cabeçalho da lista com botão de recarregar (GET) */}
      <View style={styles.linhaSubtitulo}>
        <Text style={styles.subtitulo}>Lista da API ({alunos.length})</Text>
        <Pressable style={styles.botaoRecarregar} onPress={buscarAlunos}>
          <Text style={styles.textoRecarregar}>Atualizar (GET)</Text>
        </Pressable>
      </View>

      {/* ActivityIndicator: aparece sempre que uma requisição HTTP está em andamento */}
      {carregando && (
        <View style={styles.areaCarregando}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.textoCarregando}>Comunicando com a API...</Text>
        </View>
      )}

      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          !carregando ? (
            <Text style={styles.listaVazia}>Nenhum aluno encontrado na API.</Text>
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={styles.cardAluno}>
            <View style={styles.infoAluno}>
              <Text style={styles.nomeAluno}>{item.nome}</Text>
              <Text style={styles.cursoAluno}>Curso: {item.curso}</Text>
            </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
    backgroundColor: '#2563EB',
  },
  botaoSalvar: {
    backgroundColor: '#16A34A',
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
  linhaSubtitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  botaoRecarregar: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  textoRecarregar: {
    color: '#1E293B',
    fontWeight: '600',
    fontSize: 12,
  },
  areaCarregando: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  textoCarregando: {
    color: '#2563EB',
    fontWeight: '600',
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