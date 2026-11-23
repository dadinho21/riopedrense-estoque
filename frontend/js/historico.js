async function carregarHistorico() {
    const movimentacoes = await buscar("../backend/movimentacoes_listar.php");

    let html = "";
    for (const mov of movimentacoes) {
        html += "<tr>" +
            "<td><strong>" + mov.produto + "</strong></td>" +
            "<td>" + etiquetaTipo(mov.tipo) + "</td>" +
            "<td>" + quantidadeTipo(mov) + "</td>" +
            "<td>" + mov.destino + "</td>" +
            "<td>" + mov.responsavel + "</td>" +
            "<td>" + formatarData(mov.data_movimentacao) + "</td>" +
            "<td>#MOV-" + mov.id + "</td>" +
            '<td class="direita"><button class="etiqueta botao-perigo" type="button" onclick="excluirMovimentacao(' + mov.id + ')">Excluir</button></td>' +
            "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="8" class="vazio">Nenhuma movimentação registrada.</td></tr>';
    }

    document.getElementById("tabela-historico").innerHTML = html;
}

async function excluirMovimentacao(id) {
    if (!confirm("Deseja excluir a movimentação #MOV-" + id + "? O saldo do produto será corrigido.")) {
        return;
    }

    const dados = new FormData();
    dados.append("id", id);

    await enviar("../backend/movimentacao_excluir.php", dados);
    carregarHistorico();
}

carregarHistorico();
