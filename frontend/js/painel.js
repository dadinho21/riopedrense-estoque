const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function montarGrafico(semana) {
    const totais = {};
    for (const item of semana) {
        totais[item.dia] = Number(item.total);
    }

    const dias = [];
    for (let i = 6; i >= 0; i--) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        dias.push({
            nome: diasSemana[data.getDay()],
            total: totais[dataISO(data)] || 0
        });
    }

    let maior = 1;
    for (const dia of dias) {
        if (dia.total > maior) {
            maior = dia.total;
        }
    }

    let barras = "";
    let nomes = "";
    for (const dia of dias) {
        const altura = (dia.total / maior) * 135;
        const classe = dia.total == maior ? "destaque" : "";
        barras += '<div class="' + classe + '" title="' + dia.total + ' unidades">' +
            '<span style="height: ' + altura + 'px"></span></div>';
        nomes += "<span>" + dia.nome + "</span>";
    }

    document.getElementById("grafico-barras").innerHTML = barras;
    document.getElementById("grafico-dias").innerHTML = nomes;
}

function montarAlertas(alertas) {
    const lista = document.getElementById("lista-alertas");

    if (alertas.length == 0) {
        lista.innerHTML = '<p class="vazio">Nenhum produto abaixo do mínimo.</p>';
        return;
    }

    let html = "";
    for (const produto of alertas) {
        const porcentagem = Math.min((produto.saldo / produto.estoque_minimo) * 100, 100);
        html += '<div class="alerta-item">' +
            '<div><strong>' + produto.nome + '</strong>' +
            '<small>Estoque mínimo: ' + produto.estoque_minimo + ' unidades</small></div>' +
            '<div><b>' + produto.saldo + ' unidades</b>' +
            '<div class="progresso"><span style="width: ' + porcentagem + '%"></span></div></div>' +
            '</div>';
    }
    lista.innerHTML = html;
}

function montarUltimas(ultimas) {
    let html = "";
    for (const mov of ultimas) {
        html += "<tr>" +
            "<td><strong>" + mov.produto + "</strong></td>" +
            "<td>" + etiquetaTipo(mov.tipo) + "</td>" +
            "<td>" + quantidadeTipo(mov) + "</td>" +
            "<td>" + mov.responsavel + "</td>" +
            "<td>" + formatarData(mov.data_movimentacao) + "</td>" +
            '<td class="direita">#MOV-' + mov.id + "</td>" +
            "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="6" class="vazio">Nenhuma movimentação registrada.</td></tr>';
    }

    document.getElementById("tabela-ultimas").innerHTML = html;
}

async function carregarPainel() {
    const dados = await buscar("../backend/painel.php");

    document.getElementById("total-produtos").textContent = formatarNumero(dados.produtos);
    document.getElementById("total-unidades").textContent = formatarNumero(dados.unidades);
    document.getElementById("total-saidas").textContent = formatarNumero(dados.saidas_mes);
    document.getElementById("total-atencao").textContent = String(dados.atencao).padStart(2, "0");

    montarGrafico(dados.semana);
    montarAlertas(dados.alertas);
    montarUltimas(dados.ultimas);
}

carregarPainel();
