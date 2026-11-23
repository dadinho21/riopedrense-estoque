<?php
require "verificar.php";

$id = numero("id");

mysqli_query($conexao, "DELETE FROM produtos WHERE id = $id");

responder(["mensagem" => "Produto excluído com sucesso."]);
