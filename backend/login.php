<?php
require "conexao.php";

$email = texto($conexao, "email");
$senha = $_POST["senha"] ?? "";

$usuario = buscar_um($conexao, "SELECT * FROM usuarios WHERE email = '$email'");

if (!$usuario || !password_verify($senha, $usuario["senha"])) {
    responder(["erro" => "E-mail ou senha incorretos."], 401);
}

$_SESSION["usuario"] = [
    "id" => $usuario["id"],
    "nome" => $usuario["nome"],
    "perfil" => $usuario["perfil"]
];

responder(["usuario" => $_SESSION["usuario"]]);
