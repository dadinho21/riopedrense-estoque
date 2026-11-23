<?php
require "verificar.php";

$movimentacoes = buscar_todos($conexao, "SELECT m.*, p.nome AS produto, p.codigo
    FROM movimentacoes m
    INNER JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.data_movimentacao DESC, m.id DESC");

responder($movimentacoes);
