# Guia de Utilização do Banco de Dados SQL (XAMPP)

Este documento descreve como importar e utilizar o script SQL criado para o seu projeto de Quiz. O banco de dados foi desenhado para suportar perfis de jogadores e um sistema de rankings, conforme solicitado.

## Estrutura do Banco de Dados

O banco de dados `quiz_colombiano` contém duas tabelas principais:

### 1. Tabela `jogadores` (Perfis)
Esta tabela armazena as informações de identificação dos utilizadores.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INT | Identificador único (Chave Primária). |
| `nome` | VARCHAR | Nome de exibição do jogador. |
| `email` | VARCHAR | Email único para login. |
| `senha` | VARCHAR | Armazenamento de hash de senha. |
| `foto_perfil` | VARCHAR | Caminho para a imagem de perfil. |
| `data_registo` | TIMESTAMP | Data de criação da conta. |

### 2. Tabela `rankings` (Pontuações)
Esta tabela armazena os resultados de cada partida, ligada à tabela de jogadores.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INT | Identificador único do registo. |
| `jogador_id` | INT | ID do jogador (Chave Estrangeira). |
| `pontuacao` | INT | Número de acertos. |
| `total_perguntas` | INT | Total de perguntas na partida. |
| `tempo_total` | INT | Tempo total em segundos. |
| `maior_sequencia` | INT | Maior sequência de acertos (streak). |
| `data_partida` | TIMESTAMP | Data e hora da conclusão. |

## Como Importar no XAMPP

1. Inicie o **XAMPP Control Panel** e ative os módulos **Apache** e **MySQL**.
2. Abra o seu navegador e aceda a `http://localhost/phpmyadmin`.
3. No menu superior, clique em **Importar** (ou *Import*).
4. Clique em **Escolher ficheiro** e selecione o arquivo `quiz_database.sql` fornecido.
5. Clique no botão **Executar** (ou *Go*) no final da página.
6. O banco de dados `quiz_colombiano` será criado automaticamente com todas as tabelas e relações.

## Consultas Úteis

Para obter o Top 10 de jogadores com base na pontuação e menor tempo:

```sql
SELECT j.nome, r.pontuacao, r.tempo_total, r.maior_sequencia
FROM rankings r
JOIN jogadores j ON r.jogador_id = j.id
ORDER BY r.pontuacao DESC, r.tempo_total ASC
LIMIT 10;
```
