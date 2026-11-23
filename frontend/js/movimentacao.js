let produtos = [];

const formMovimentacao = document.getElementById("form-movimentacao");
const campoProduto = document.getElementById("produto");
const campoQuantidade = document.getElementById("quantidade");
const campoTipo = document.getElementById("tipo");

function produtoSelecionado() {
    for (const produto of produtos) {
        if (produto.id == campoProduto.value) {
            return produto;
        }
    }
    return null;
}

function atualizarResumo() {
    const produto = produtoSelecionado();
    const quantidade = Number(campoQuantidade.value);
    const entrada = campoTipo.value == "entrada";

    if (!produto) {
        return;
    }

    const saldo = Number(produto.saldo);
    const minimo = Number(produto.estoque_minimo);
    const previsto = entrada ? saldo + quantidade : saldo - quantidade;

    document.getElementById("codigo").value = produto.codigo;
    document.getElementById("resumo-nome").textContent = produto.nome;
    document.getElementById("resumo-categoria").textContent = produto.categoria + " · " + produto.codigo;
    document.getElementById("resumo-saldo").textContent = formatarNumero(saldo) + " unidades";
    document.getElementById("resumo-quantidade").textContent =
        (entrada ? "+ " : "− ") + formatarNumero(quantidade) + " unidades";
    document.getElementById("resumo-previsto").textContent = formatarNumero(previsto) + " unidades";

    const aviso = document.getElementById("resumo-aviso");
    const textoPrevisto = document.getElementById("resumo-previsto");

    if (previsto < 0) {
        aviso.className = "aviso aviso-laranja";
        aviso.textContent = "A quantidade informada é maior que o saldo disponível.";
        textoPrevisto.className = "texto-laranja";
    } else if (previsto < minimo) {
        aviso.className = "aviso aviso-laranja";
        aviso.textContent = "O saldo previsto fica abaixo do estoque mínimo de " + minimo + " unidades.";
        textoPrevisto.className = "texto-laranja";
    } else {
        aviso.className = "aviso aviso-verde";
        aviso.textContent = "O saldo previsto permanece acima do estoque mínimo de " + minimo + " unidades.";
        textoPrevisto.className = "texto-verde";
    }
}

function trocarTipo(tipo) {
    campoTipo.value = tipo;
    const entrada = tipo == "entrada";

    document.getElementById("aba-entrada").className = entrada ? "ativa" : "";
    document.getElementById("aba-saida").className = entrada ? "" : "ativa";

    document.getElementById("texto-descricao").textContent = entrada
        ? "Preencha as informações abaixo para registrar uma entrada no estoque."
        : "Preencha as informações abaixo para registrar uma baixa no estoque.";
    document.getElementById("resumo-descricao").textContent = entrada
        ? "Confira o impacto desta entrada no saldo disponível."
        : "Confira o impacto desta saída no saldo disponível.";

    document.getElementById("rotulo-destino").textContent = entrada ? "Origem / fornecedor *" : "Destino / cliente *";
    document.getElementById("rotulo-data").textContent = entrada ? "Data da entrada *" : "Data da saída *";
    document.getElementById("rotulo-motivo").textContent = entrada ? "Motivo da entrada *" : "Motivo da saída *";
    document.getElementById("resumo-rotulo").textContent = entrada ? "Quantidade de entrada" : "Quantidade de saída";
    document.getElementById("texto-botao").textContent = entrada ? "Registrar entrada" : "Registrar saída";

    atualizarResumo();
}

async function carregarProdutos() {
    produtos = await buscar("../backend/produtos_listar.php");

    let opcoes = "";
    for (const produto of produtos) {
        opcoes += '<option value="' + produto.id + '">' + produto.nome + "</option>";
    }
    campoProduto.innerHTML = opcoes;

    document.getElementById("data").value = dataISO(new Date());
    atualizarResumo();
}

formMovimentacao.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    try {
        await enviar("../backend/movimentacao_salvar.php", new FormData(formMovimentacao));
        alert("Movimentação registrada com sucesso!");
        window.location.href = "historico.html";
    } catch (erro) {
        document.getElementById("erro-movimentacao").textContent = erro.message;
    }
});

campoProduto.addEventListener("change", atualizarResumo);
campoQuantidade.addEventListener("input", atualizarResumo);

carregarProdutos();
