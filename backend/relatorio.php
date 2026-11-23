<?php
require "verificar.php";

$mes = mysqli_real_escape_string($conexao, $_GET["mes"] ?? date("Y-m"));
$anterior = date("Y-m", strtotime($mes . "-01 -1 month"));

function totais_do_mes($conexao, $mes)
{
    return buscar_um($conexao, "SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN quantidade END), 0) AS entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN quantidade END), 0) AS saidas
        FROM movimentacoes WHERE DATE_FORMAT(data_movimentacao, '%Y-%m') = '$mes'");
}

$semanas = buscar_todos($conexao, "SELECT LEAST(FLOOR((DAY(data_movimentacao) - 1) / 7) + 1, 5) AS semana,
    COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN quantidade END), 0) AS entradas,
    COALESCE(SUM(CASE WHEN tipo = 'saida' THEN quantidade END), 0) AS saidas
    FROM movimentacoes WHERE DATE_FORMAT(data_movimentacao, '%Y-%m') = '$mes'
    GROUP BY semana");

$ranking = buscar_todos($conexao, "SELECT p.nome, SUM(m.quantidade) AS total FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    WHERE m.tipo = 'saida' AND DATE_FORMAT(m.data_movimentacao, '%Y-%m') = '$mes'
    GROUP BY p.id, p.nome ORDER BY total DESC LIMIT 3");

responder([
    "mes" => $mes,
    "atual" => totais_do_mes($conexao, $mes),
    "anterior" => totais_do_mes($conexao, $anterior),
    "semanas" => $semanas,
    "ranking" => $ranking
]);
