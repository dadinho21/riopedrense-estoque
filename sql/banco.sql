DROP DATABASE IF EXISTS riopedrense_estoque;
CREATE DATABASE riopedrense_estoque CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE riopedrense_estoque;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL DEFAULT 'Perfil administrativo'
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    categoria VARCHAR(60) NOT NULL,
    saldo INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    destino VARCHAR(120),
    motivo VARCHAR(120),
    responsavel VARCHAR(100),
    data_movimentacao DATE NOT NULL,
    observacoes VARCHAR(255),
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
) AUTO_INCREMENT = 2001;

INSERT INTO usuarios (nome, email, senha) VALUES
('Equipe de estoque', 'admin@riopedrense.com.br', '$2y$10$jFX2qrIsyKZI.28MzPWqO.a7OoY6UlRF2iiX/BzSER/DvTJiT6Ree');

INSERT INTO produtos (nome, codigo, categoria, saldo, estoque_minimo) VALUES
('Grelha GM-850', 'GM-850', 'Grelhas para moinho', 240, 50),
('Grelha GM-620', 'GM-620', 'Grelhas para moinho', 26, 50),
('Grelha GM-900', 'GM-900', 'Grelhas para moinho', 385, 80),
('Suporte lateral SL-40', 'SL-40', 'Componentes', 18, 50),
('Placa de desgaste PD-120', 'PD-120', 'Componentes', 164, 40),
('Anel de fixação AF-70', 'AF-70', 'Componentes', 92, 30),
('Grelha GM-450', 'GM-450', 'Grelhas para moinho', 210, 60),
('Grelha GM-1000', 'GM-1000', 'Grelhas para moinho', 34, 40),
('Parafuso de fixação PF-16', 'PF-16', 'Componentes', 1250, 300),
('Bucha de desgaste BD-30', 'BD-30', 'Componentes', 140, 50),
('Martelo de moinho MM-12', 'MM-12', 'Peças de reposição', 96, 40),
('Peneira classificadora PC-08', 'PC-08', 'Peças de reposição', 22, 25),
('Revestimento interno RI-55', 'RI-55', 'Peças de reposição', 78, 20),
('Eixo de transmissão ET-200', 'ET-200', 'Peças de reposição', 45, 15);

INSERT INTO movimentacoes (produto_id, tipo, quantidade, destino, motivo, responsavel, data_movimentacao, observacoes) VALUES
(3, 'entrada', 320, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 18 DAY, 'Lote inicial do mês'),
(1, 'entrada', 260, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 17 DAY, ''),
(1, 'saida', 70, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 16 DAY, 'Pedido comercial nº 4510'),
(5, 'entrada', 180, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 15 DAY, ''),
(3, 'saida', 110, 'Moinhos Brasil S.A.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 14 DAY, ''),
(9, 'entrada', 400, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 13 DAY, ''),
(5, 'saida', 85, 'Agro Sul Cereais', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 12 DAY, ''),
(1, 'saida', 120, 'Cooperativa Vale Verde', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 11 DAY, ''),
(7, 'entrada', 150, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 10 DAY, ''),
(3, 'saida', 95, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 9 DAY, ''),
(5, 'saida', 70, 'Moinhos Brasil S.A.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 8 DAY, ''),
(10, 'entrada', 90, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 7 DAY, ''),
(1, 'saida', 66, 'Agro Sul Cereais', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 6 DAY, ''),
(3, 'saida', 48, 'Cooperativa Vale Verde', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 5 DAY, ''),
(11, 'saida', 40, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 4 DAY, ''),
(6, 'saida', 52, 'Moinhos Brasil S.A.', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 3 DAY, ''),
(9, 'saida', 70, 'Agro Sul Cereais', 'Pedido de venda', 'Mariana Costa', CURDATE() - INTERVAL 2 DAY, ''),
(4, 'saida', 12, 'Indústria Alfa Ltda.', 'Reposição de cliente', 'Mariana Costa', CURDATE() - INTERVAL 1 DAY, ''),
(2, 'entrada', 80, 'Produção interna', 'Lote de produção', 'João Oliveira', CURDATE() - INTERVAL 1 DAY, ''),
(1, 'saida', 24, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', CURDATE(), 'Pedido comercial nº 4582 · lote do mês'),
(2, 'entrada', 150, 'Produção interna', 'Lote de produção', 'João Oliveira', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-03'), ''),
(1, 'saida', 110, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-04'), ''),
(3, 'entrada', 210, 'Produção interna', 'Lote de produção', 'João Oliveira', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-09'), ''),
(5, 'saida', 140, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-10'), ''),
(7, 'entrada', 230, 'Produção interna', 'Lote de produção', 'João Oliveira', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-15'), ''),
(3, 'saida', 165, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-17'), ''),
(9, 'entrada', 300, 'Produção interna', 'Lote de produção', 'João Oliveira', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-22'), ''),
(1, 'saida', 190, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-24'), ''),
(10, 'entrada', 380, 'Produção interna', 'Lote de produção', 'João Oliveira', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-27'), ''),
(5, 'saida', 250, 'Indústria Alfa Ltda.', 'Pedido de venda', 'Mariana Costa', DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-28'), '');
