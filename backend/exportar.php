<?php
require "verificar.php";

$mes = mysqli_real_escape_string($conexao, $_GET["mes"] ?? date("Y-m"));

$movimentacoes = buscar_todos($conexao, "SELECT m.id, p.nome, p.codigo, m.tipo, m.quantidade, m.destino,
    m.motivo, m.responsavel, m.data_movimentacao FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    WHERE DATE_FORMAT(m.data_movimentacao, '%Y-%m') = '$mes'
    ORDER BY m.data_movimentacao, m.id");

header("Content-Type: text/csv; charset=utf-8");
header("Content-Disposition: attachment; filename=relatorio-$mes.csv");

$arquivo = fopen("php://output", "w");
fwrite($arquivo, "\xEF\xBB\xBF");
fputcsv($arquivo, ["Registro", "Produto", "Código", "Tipo", "Quantidade", "Destino", "Motivo", "Responsável", "Data"], ";");

foreach ($movimentacoes as $linha) {
    $linha["id"] = "#MOV-" . $linha["id"];
    $linha["tipo"] = $linha["tipo"] == "entrada" ? "Entrada" : "Saída";
    $linha["data_movimentacao"] = date("d/m/Y", strtotime($linha["data_movimentacao"]));
    fputcsv($arquivo, $linha, ";");
}

fclose($arquivo);
