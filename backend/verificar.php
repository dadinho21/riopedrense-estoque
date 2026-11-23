<?php
require "conexao.php";

if (!isset($_SESSION["usuario"])) {
    responder(["erro" => "Sessão expirada. Faça login novamente."], 401);
}
