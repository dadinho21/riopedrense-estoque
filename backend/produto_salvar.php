<?php
require "verificar.php";

$id = numero("id");
$nome = texto($conexao, "nome");
$codigo = texto($conexao, "codigo");
$categoria = texto($conexao, "categoria");
$saldo = numero("saldo");
$minimo = numero("estoque_minimo");

if ($nome == "" || $codigo == "" || $categoria == "") {
    responder(["erro" => "Preencha todos os campos obrigatórios."], 400);
}

$repetido = buscar_um($conexao, "SELECT id FROM produtos WHERE codigo = '$codigo' AND id <> $id");

if ($repetido) {
    responder(["erro" => "Já existe um produto com esse código."], 400);
}

if ($id > 0) {
    mysqli_query($conexao, "UPDATE produtos SET nome = '$nome', codigo = '$codigo', categoria = '$categoria',
        saldo = $saldo, estoque_minimo = $minimo WHERE id = $id");
} else {
    mysqli_query($conexao, "INSERT INTO produtos (nome, codigo, categoria, saldo, estoque_minimo)
        VALUES ('$nome', '$codigo', '$categoria', $saldo, $minimo)");
}

responder(["mensagem" => "Produto salvo com sucesso."]);
