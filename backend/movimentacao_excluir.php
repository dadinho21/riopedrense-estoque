<?php
require "verificar.php";

$id = numero("id");

$movimentacao = buscar_um($conexao, "SELECT * FROM movimentacoes WHERE id = $id");

if (!$movimentacao) {
    responder(["erro" => "Movimentação não encontrada."], 404);
}

$produto_id = $movimentacao["produto_id"];
$quantidade = $movimentacao["quantidade"];

if ($movimentacao["tipo"] == "entrada") {
    mysqli_query($conexao, "UPDATE produtos SET saldo = GREATEST(saldo - $quantidade, 0) WHERE id = $produto_id");
} else {
    mysqli_query($conexao, "UPDATE produtos SET saldo = saldo + $quantidade WHERE id = $produto_id");
}

mysqli_query($conexao, "DELETE FROM movimentacoes WHERE id = $id");

responder(["mensagem" => "Movimentação excluída com sucesso."]);
