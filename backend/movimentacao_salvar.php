<?php
require "verificar.php";

$produto_id = numero("produto_id");
$tipo = ($_POST["tipo"] ?? "") == "entrada" ? "entrada" : "saida";
$quantidade = numero("quantidade");
$destino = texto($conexao, "destino");
$motivo = texto($conexao, "motivo");
$responsavel = texto($conexao, "responsavel");
$data = texto($conexao, "data_movimentacao");
$observacoes = texto($conexao, "observacoes");

$produto = buscar_um($conexao, "SELECT * FROM produtos WHERE id = $produto_id");

if (!$produto) {
    responder(["erro" => "Selecione um produto válido."], 400);
}

if ($quantidade <= 0 || $data == "") {
    responder(["erro" => "Informe a quantidade e a data da movimentação."], 400);
}

if ($tipo == "saida" && $quantidade > $produto["saldo"]) {
    responder(["erro" => "Quantidade maior que o saldo disponível."], 400);
}

mysqli_query($conexao, "INSERT INTO movimentacoes
    (produto_id, tipo, quantidade, destino, motivo, responsavel, data_movimentacao, observacoes)
    VALUES ($produto_id, '$tipo', $quantidade, '$destino', '$motivo', '$responsavel', '$data', '$observacoes')");

if ($tipo == "entrada") {
    mysqli_query($conexao, "UPDATE produtos SET saldo = saldo + $quantidade WHERE id = $produto_id");
} else {
    mysqli_query($conexao, "UPDATE produtos SET saldo = saldo - $quantidade WHERE id = $produto_id");
}

responder(["mensagem" => "Movimentação registrada com sucesso."]);
