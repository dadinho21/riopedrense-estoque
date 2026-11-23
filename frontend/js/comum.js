const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
    "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatarNumero(valor) {
    return Number(valor).toLocaleString("pt-BR");
}

function formatarData(data) {
    const partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function dataISO(data) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return data.getFullYear() + "-" + mes + "-" + dia;
}

function etiquetaTipo(tipo) {
    if (tipo == "entrada") {
        return '<span class="etiqueta etiqueta-verde">Entrada</span>';
    }
    return '<span class="etiqueta etiqueta-laranja">Saída</span>';
}

function quantidadeTipo(movimentacao) {
    const sinal = movimentacao.tipo == "entrada" ? "+" : "−";
    return sinal + " " + formatarNumero(movimentacao.quantidade) + " un.";
}

async function buscar(url) {
    const resposta = await fetch(url);

    if (resposta.status == 401) {
        window.location.href = "index.html";
        throw new Error("Sessão expirada");
    }

    return resposta.json();
}

async function enviar(url, dados) {
    const resposta = await fetch(url, {
        method: "POST",
        body: dados
    });
    const json = await resposta.json();

    if (!resposta.ok) {
        throw new Error(json.erro);
    }

    return json;
}

async function carregarUsuario() {
    const hoje = new Date();
    document.getElementById("data-hoje").textContent =
        hoje.getDate() + " de " + meses[hoje.getMonth()] + " de " + hoje.getFullYear();

    const dados = await buscar("../backend/sessao.php");
    document.getElementById("usuario-nome").textContent = dados.usuario.nome;
    document.getElementById("usuario-perfil").textContent = dados.usuario.perfil;
}

carregarUsuario();
