# Esquema da Base de Dados - Quiz Orgulho Colombiano

## Tabela: `jogadores` (Perfis)
Guarda as informações de identificação e personalização do utilizador.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Identificador único do jogador. |
| `nome` | VARCHAR(100) | Nome ou apelido do jogador. |
| `email` | VARCHAR(150) | Email para login/recuperação (único). |
| `senha` | VARCHAR(255) | Hash da senha para segurança. |
| `foto_perfil` | VARCHAR(255) | Caminho ou URL da imagem de perfil. |
| `data_registo` | TIMESTAMP | Data e hora em que a conta foi criada. |

## Tabela: `rankings` (Pontuações)
Guarda os resultados das partidas realizadas pelos jogadores.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Identificador único do registo de ranking. |
| `jogador_id` | INT (FK) | Referência ao jogador na tabela `jogadores`. |
| `pontuacao` | INT | Número de respostas corretas. |
| `total_perguntas` | INT | Total de perguntas respondidas na sessão. |
| `tempo_total` | INT | Tempo total decorrido em segundos. |
| `maior_sequencia` | INT | Maior sequência de acertos consecutivos (streak). |
| `data_partida` | TIMESTAMP | Data e hora em que o quiz foi concluído. |

## Relacionamentos
- Uma entrada na tabela `rankings` pertence a um único `jogador`.
- Um `jogador` pode ter múltiplas entradas na tabela `rankings` (histórico de jogos).
