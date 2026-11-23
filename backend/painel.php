<?php
require "verificar.php";

$totais = buscar_um($conexao, "SELECT COUNT(*) AS produtos, COALESCE(SUM(saldo), 0) AS unidades,
    COALESCE(SUM(saldo < estoque_minimo), 0) AS atencao FROM produtos");

$saidas = buscar_um($conexao, "SELECT COALESCE(SUM(quantidade), 0) AS total FROM movimentacoes
    WHERE tipo = 'saida' AND DATE_FORMAT(data_movimentacao, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')");

$semana = buscar_todos($conexao, "SELECT data_movimentacao AS dia, SUM(quantidade) AS total FROM movimentacoes
    WHERE tipo = 'saida' AND data_movimentacao >= CURDATE() - INTERVAL 6 DAY
    GROUP BY data_movimentacao");

$alertas = buscar_todos($conexao, "SELECT * FROM produtos WHERE saldo < estoque_minimo
    ORDER BY saldo DESC LIMIT 3");

$ultimas = buscar_todos($conexao, "SELECT m.*, p.nome AS produto FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.data_movimentacao DESC, m.id DESC LIMIT 3");

responder([
    "produtos" => $totais["produtos"],
    "unidades" => $totais["unidades"],
    "atencao" => $totais["atencao"],
    "saidas_mes" => $saidas["total"],
    "semana" => $semana,
    "alertas" => $alertas,
    "ultimas" => $ultimas
]);
