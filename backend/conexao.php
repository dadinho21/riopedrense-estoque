<?php
session_start();

$conexao = mysqli_connect("localhost", "root", "", "riopedrense_estoque");
mysqli_set_charset($conexao, "utf8mb4");

header("Content-Type: application/json; charset=utf-8");

function responder($dados, $status = 200)
{
    http_response_code($status);
    echo json_encode($dados);
    exit;
}

function texto($conexao, $campo)
{
    return mysqli_real_escape_string($conexao, trim($_POST[$campo] ?? ""));
}

function numero($campo)
{
    return intval($_POST[$campo] ?? 0);
}

function buscar_todos($conexao, $sql)
{
    $resultado = mysqli_query($conexao, $sql);
    return mysqli_fetch_all($resultado, MYSQLI_ASSOC);
}

function buscar_um($conexao, $sql)
{
    $resultado = mysqli_query($conexao, $sql);
    return mysqli_fetch_assoc($resultado);
}
