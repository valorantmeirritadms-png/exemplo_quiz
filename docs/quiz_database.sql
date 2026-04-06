-- ╔══════════════════════════════════════════════════════════════════╗
-- ║           Quiz Colombiano — Esquema SQL Melhorado               ║
-- ║           Compatível com MySQL/MariaDB (XAMPP)                  ║
-- ╚══════════════════════════════════════════════════════════════════╝
-- 
-- MELHORIAS FACE À VERSÃO ANTERIOR:
--   • Tabela `sessoes` para tokens de autenticação seguros
--   • Campo `username` único para exibição pública no ranking
--   • Campo `nivel` e `xp_total` calculados no servidor
--   • Campo `ativo` para soft-delete de utilizadores
--   • Índices adicionados para melhorar performance nas queries mais comuns
--   • Tabela `conquistas` e `jogador_conquistas` para o sistema de badges
--   • VIEW `v_ranking` pronta a usar no PHP
--   • Triggers para actualizar XP/nível automaticamente após cada partida

-- ─── CRIAÇÃO DA BASE DE DADOS ────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS `quiz_colombiano`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `quiz_colombiano`;


-- ─── TABELA: jogadores ───────────────────────────────────────────────
-- Guarda os dados de cada utilizador registado.
CREATE TABLE IF NOT EXISTS `jogadores` (
    `id`            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    `username`      VARCHAR(50)     NOT NULL,                       -- Nome de exibição público (único)
    `email`         VARCHAR(150)    NOT NULL,
    `senha_hash`    VARCHAR(255)    NOT NULL,                       -- Sempre bcrypt/argon2 — nunca texto claro
    `foto_perfil`   VARCHAR(255)    DEFAULT 'default.png',
    `nivel`         TINYINT UNSIGNED NOT NULL DEFAULT 1,            -- Calculado pelo trigger abaixo
    `xp_total`      INT UNSIGNED    NOT NULL DEFAULT 0,             -- Actualizado pelo trigger
    `ativo`         BOOLEAN         NOT NULL DEFAULT TRUE,          -- FALSE = conta desactivada (soft-delete)
    `data_registo`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ultimo_login`  TIMESTAMP       NULL,

    CONSTRAINT `uq_jogadores_email`    UNIQUE (`email`),
    CONSTRAINT `uq_jogadores_username` UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── TABELA: sessoes ─────────────────────────────────────────────────
-- Guarda tokens de sessão gerados no login (alternativa a cookies de session PHP).
-- O token é um hash aleatório; a coluna expires define a validade.
CREATE TABLE IF NOT EXISTS `sessoes` (
    `id`            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    `jogador_id`    INT UNSIGNED    NOT NULL,
    `token`         CHAR(64)        NOT NULL,                       -- SHA-256 do token gerado em PHP
    `expires`       TIMESTAMP       NOT NULL,                       -- Validade do token (ex: 30 dias)
    `criado_em`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `uq_sessoes_token`   UNIQUE (`token`),
    CONSTRAINT `fk_sessoes_jogador` FOREIGN KEY (`jogador_id`)
        REFERENCES `jogadores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índice para limpeza de tokens expirados (tarefa agendada)
CREATE INDEX `idx_sessoes_expires` ON `sessoes` (`expires`);


-- ─── TABELA: partidas ────────────────────────────────────────────────
-- Regista cada tentativa de quiz (com ou sem utilizador logado).
CREATE TABLE IF NOT EXISTS `partidas` (
    `id`              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    `jogador_id`      INT UNSIGNED  NULL,                           -- NULL = jogador convidado (sem conta)
    `nome_convidado`  VARCHAR(100)  NULL,                           -- Nome exibido se for convidado
    `pontuacao`       TINYINT UNSIGNED NOT NULL,                    -- Número de respostas correctas
    `total_perguntas` TINYINT UNSIGNED NOT NULL,                    -- Total de perguntas respondidas
    `tempo_total`     SMALLINT UNSIGNED NOT NULL,                   -- Tempo total em segundos
    `maior_sequencia` TINYINT UNSIGNED NOT NULL DEFAULT 0,          -- Maior streak consecutiva
    `xp_ganho`        SMALLINT UNSIGNED NOT NULL DEFAULT 0,         -- XP atribuído por esta partida
    `data_partida`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_partidas_jogador` FOREIGN KEY (`jogador_id`)
        REFERENCES `jogadores`(`id`) ON DELETE SET NULL             -- Manter partida mesmo se conta for apagada
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para queries de ranking (ordenação por pontuação e data)
CREATE INDEX `idx_partidas_jogador`    ON `partidas` (`jogador_id`);
CREATE INDEX `idx_partidas_pontuacao`  ON `partidas` (`pontuacao` DESC, `tempo_total` ASC);
CREATE INDEX `idx_partidas_data`       ON `partidas` (`data_partida` DESC);


-- ─── TABELA: conquistas ──────────────────────────────────────────────
-- Catálogo de badges/achievements disponíveis no jogo.
CREATE TABLE IF NOT EXISTS `conquistas` (
    `id`          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `codigo`      VARCHAR(50)  NOT NULL UNIQUE,                     -- Ex: 'puro_sangue', 'explorador'
    `nome_es`     VARCHAR(100) NOT NULL,
    `nome_pt`     VARCHAR(100) NOT NULL,
    `descricao_es` VARCHAR(255) NULL,
    `descricao_pt` VARCHAR(255) NULL,
    `icone`       VARCHAR(50)  NOT NULL DEFAULT 'star',             -- Nome do Material Icon
    `condicao`    VARCHAR(255) NULL                                 -- Descrição da condição (para referência)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── TABELA: jogador_conquistas ──────────────────────────────────────
-- Regista quais conquistas cada jogador já desbloqueou.
CREATE TABLE IF NOT EXISTS `jogador_conquistas` (
    `jogador_id`    INT UNSIGNED    NOT NULL,
    `conquista_id`  TINYINT UNSIGNED NOT NULL,
    `desbloqueado_em` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`jogador_id`, `conquista_id`),
    CONSTRAINT `fk_jc_jogador`    FOREIGN KEY (`jogador_id`)    REFERENCES `jogadores`(`id`)    ON DELETE CASCADE,
    CONSTRAINT `fk_jc_conquista`  FOREIGN KEY (`conquista_id`)  REFERENCES `conquistas`(`id`)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── VIEW: v_ranking ─────────────────────────────────────────────────
-- Vista pronta para usar no PHP: ranking agregado por jogador.
-- Pega a MELHOR partida de cada jogador (maior pontuação, menor tempo em caso de empate).
CREATE OR REPLACE VIEW `v_ranking` AS
SELECT
    j.id                                    AS jogador_id,
    j.username,
    j.foto_perfil,
    j.nivel,
    j.xp_total,
    MAX(p.pontuacao)                        AS melhor_pontuacao,
    p.total_perguntas,
    MIN(p.tempo_total)                      AS melhor_tempo,        -- Menor tempo na melhor pontuação
    COUNT(p.id)                             AS total_partidas,
    MAX(p.maior_sequencia)                  AS melhor_sequencia,
    MAX(p.data_partida)                     AS ultima_partida,
    RANK() OVER (
        ORDER BY MAX(p.pontuacao) DESC,
                 MIN(p.tempo_total) ASC
    )                                       AS posicao
FROM `jogadores` j
INNER JOIN `partidas` p ON p.jogador_id = j.id
WHERE j.ativo = TRUE
GROUP BY j.id, j.username, j.foto_perfil, j.nivel, j.xp_total, p.total_perguntas
ORDER BY melhor_pontuacao DESC, melhor_tempo ASC;


-- ─── TRIGGER: calcular_xp_e_nivel ────────────────────────────────────
-- Actualiza automaticamente o XP e o nível do jogador após cada partida.
-- Fórmula XP: (pontuação × 100) + bónus de velocidade (max 3000 pts de bónus)
DELIMITER $$

CREATE TRIGGER `after_partida_insert`
AFTER INSERT ON `partidas`
FOR EACH ROW
BEGIN
    DECLARE v_xp_ganho SMALLINT UNSIGNED;

    -- Calcular XP apenas para jogadores registados
    IF NEW.jogador_id IS NOT NULL THEN
        SET v_xp_ganho = (NEW.pontuacao * 100) + GREATEST(0, (600 - NEW.tempo_total) * 5);

        -- Actualizar XP ganho na linha que acabou de ser inserida
        UPDATE `partidas`
        SET `xp_ganho` = v_xp_ganho
        WHERE `id` = NEW.id;

        -- Actualizar XP total e recalcular nível do jogador
        -- Fórmula de nível: cada 1000 XP = 1 nível
        UPDATE `jogadores`
        SET
            `xp_total` = `xp_total` + v_xp_ganho,
            `nivel`    = FLOOR((`xp_total` + v_xp_ganho) / 1000) + 1
        WHERE `id` = NEW.jogador_id;
    END IF;
END$$

DELIMITER ;


-- ─── DADOS INICIAIS ──────────────────────────────────────────────────
-- Conquistas base disponíveis no jogo
INSERT INTO `conquistas` (`codigo`, `nome_es`, `nome_pt`, `descricao_es`, `descricao_pt`, `icone`, `condicao`) VALUES
('puro_sangue',   'Puro Sangre',    'Puro Sangue',    '100% de aciertos en Historia',        '100% em História',         'workspace_premium', 'pontuacao = total_perguntas AND categoria = historia'),
('explorador',    'Explorador',     'Explorador',      'Completa 5 quizzes de Geografía',     'Completa 5 quizzes de Geog.', 'map',               'total_partidas >= 5'),
('vallenatero',   'Vallenatero',    'Vallenatero',     'Maestro del Ritmo — streak de 10',    'Mestre do Ritmo — streak 10', 'music_note',        'maior_sequencia >= 10'),
('velocidade',    'Relámpago',      'Relâmpago',       'Completa el quiz en menos de 2 min',  'Completa em menos de 2 min',  'bolt',              'tempo_total < 120'),
('persistente',   'Persistente',    'Persistente',     'Juega 10 partidas',                   'Joga 10 partidas',            'repeat',            'total_partidas >= 10');


-- ─── EXEMPLO DE USO NO PHP ───────────────────────────────────────────
-- 
-- // Login seguro com prepared statements:
-- $stmt = $pdo->prepare("SELECT id, senha_hash FROM jogadores WHERE email = ? AND ativo = 1");
-- $stmt->execute([$email]);
-- $row = $stmt->fetch();
-- if ($row && password_verify($password_input, $row['senha_hash'])) {
--     // Login bem-sucedido
--     $token = bin2hex(random_bytes(32));
--     $stmt2 = $pdo->prepare("INSERT INTO sessoes (jogador_id, token, expires) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))");
--     $stmt2->execute([$row['id'], hash('sha256', $token)]);
-- }
-- 
-- // Guardar partida:
-- $stmt = $pdo->prepare("INSERT INTO partidas (jogador_id, pontuacao, total_perguntas, tempo_total, maior_sequencia) VALUES (?, ?, ?, ?, ?)");
-- $stmt->execute([$jogador_id, $score, $total, $tempo, $streak]);
-- 
-- // Buscar ranking:
-- $ranking = $pdo->query("SELECT * FROM v_ranking LIMIT 10")->fetchAll();
