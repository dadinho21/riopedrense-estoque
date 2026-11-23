<?php
require "verificar.php";

$produtos = buscar_todos($conexao, "SELECT * FROM produtos ORDER BY id");

responder($produtos);
