const campoMes = document.getElementById("mes");

function montarMeses() {
    const hoje = new Date();
    let opcoes = "";

    for (let i = 0; i < 12; i++) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const valor = data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0");
        const nome = meses[data.getMonth()];
        const texto = nome.charAt(0).toUpperCase() + nome.slice(1) + " de " + data.getFullYear();
        opcoes += '<option value="' + valor + '">' + texto + "</option>";
    }

    campoMes.innerHTML = opcoes;
}

function textoVariacao(atual, anterior) {
    if (anterior == 0) {
        return "Sem dados no período anterior";
    }
    const variacao = ((atual - anterior) / anterior) * 100;
    const sinal = variacao >= 0 ? "+ " : "− ";
    return sinal + Math.abs(variacao).toFixed(1).replace(".", ",") + "% em relação ao período anterior";
}

function textoPeriodo(mes) {
    const partes = mes.split("-");
    const ano = Number(partes[0]);
    const numeroMes = Number(partes[1]);
    const hoje = new Date();
    let ultimoDia = new Date(ano, numeroMes, 0).getDate();

    if (ano == hoje.getFullYear() && numeroMes == hoje.getMonth() + 1) {
        ultimoDia = hoje.getDate();
    }

    return "01 a " + String(ultimoDia).padStart(2, "0") + " de " + meses[numeroMes - 1] + " de " + ano;
}

function montarGraficoLinhas(semanas) {
    const entradas = [0, 0, 0, 0, 0];
    const saidas = [0, 0, 0, 0, 0];

    for (const item of semanas) {
        entradas[item.semana - 1] = Number(item.entradas);
        saidas[item.semana - 1] = Number(item.saidas);
    }

    let maior = 1;
    for (let i = 0; i < 5; i++) {
        maior = Math.max(maior, entradas[i], saidas[i]);
    }

    let svg = "";
    for (let i = 0; i < 4; i++) {
        const y = 30 + i * 50;
        svg += '<line x1="20" y1="' + y + '" x2="720" y2="' + y + '" stroke="#e8eef4" stroke-dasharray="4 4"/>';
    }

    function linha(valores, cor) {
        let pontos = "";
        let circulos = "";
        for (let i = 0; i < 5; i++) {
            const x = 35 + i * 167;
            const y = 185 - (valores[i] / maior) * 150;
            pontos += x + "," + y + " ";
            circulos += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + cor + '"/>';
        }
        return '<polyline points="' + pontos + '" fill="none" stroke="' + cor + '" stroke-width="3"/>' + circulos;
    }

    svg += linha(entradas, "#1269a8");
    svg += linha(saidas, "#159652");

    for (let i = 0; i < 5; i++) {
        svg += '<text x="' + (35 + i * 167) + '" y="222" text-anchor="middle" font-size="11" fill="#8a9bb0">Semana ' + (i + 1) + "</text>";
    }

    document.getElementById("grafico-linhas").innerHTML = svg;
}

function montarRanking(ranking) {
    let html = "";
    let maior = 1;

    if (ranking.length > 0) {
        maior = Number(ranking[0].total) * 1.28;
    }

    for (const item of ranking) {
        const largura = (Number(item.total) / maior) * 100;
        html += '<div class="ranking-item">' +
            "<div><span>" + item.nome + "</span><b>" + formatarNumero(item.total) + " un.</b></div>" +
            '<div class="ranking-barra"><span style="width: ' + largura + '%"></span></div>' +
            "</div>";
    }

    if (html == "") {
        html = '<p class="vazio">Nenhuma saída no período.</p>';
    }

    document.getElementById("ranking").innerHTML = html;
}

async function carregarRelatorio() {
    const mes = campoMes.value;
    const dados = await buscar("../backend/relatorio.php?mes=" + mes);

    const entradas = Number(dados.atual.entradas);
    const saidas = Number(dados.atual.saidas);
    const liquida = entradas - saidas;

    document.getElementById("exportar").href = "../backend/exportar.php?mes=" + mes;
    document.getElementById("periodo-texto").textContent = textoPeriodo(mes);
    document.getElementById("total-entradas").textContent = formatarNumero(entradas) + " un.";
    document.getElementById("total-saidas").textContent = formatarNumero(saidas) + " un.";
    document.getElementById("variacao-entradas").textContent = textoVariacao(entradas, Number(dados.anterior.entradas));
    document.getElementById("variacao-saidas").textContent = textoVariacao(saidas, Number(dados.anterior.saidas));

    const campoLiquida = document.getElementById("variacao-liquida");
    const textoLiquida = document.getElementById("texto-liquida");
    if (liquida >= 0) {
        campoLiquida.textContent = "+ " + formatarNumero(liquida) + " un.";
        campoLiquida.className = "texto-verde";
        textoLiquida.textContent = "Saldo positivo no período";
        textoLiquida.className = "texto-verde";
    } else {
        campoLiquida.textContent = "− " + formatarNumero(Math.abs(liquida)) + " un.";
        campoLiquida.className = "texto-laranja";
        textoLiquida.textContent = "Saldo negativo no período";
        textoLiquida.className = "texto-laranja";
    }

    const total = entradas + saidas;
    let porcentagemEntradas = 0;
    if (total > 0) {
        porcentagemEntradas = Math.round((entradas / total) * 100);
    }
    const porcentagemSaidas = total > 0 ? 100 - porcentagemEntradas : 0;

    document.getElementById("porcentagem-entradas").textContent = porcentagemEntradas + "%";
    document.getElementById("porcentagem-saidas").textContent = porcentagemSaidas + "%";
    document.getElementById("rosca").style.background = total > 0
        ? "conic-gradient(#1269a8 0 " + porcentagemEntradas + "%, #159652 " + porcentagemEntradas + "% 100%)"
        : "#edf1f5";

    montarGraficoLinhas(dados.semanas);
    montarRanking(dados.ranking);
}

campoMes.addEventListener("change", carregarRelatorio);

montarMeses();
carregarRelatorio();
