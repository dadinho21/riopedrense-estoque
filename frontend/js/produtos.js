const porPagina = 6;
let produtos = [];
let paginaAtual = 1;
let somenteAtencao = false;

const campoBusca = document.getElementById("busca");
const filtroCategoria = document.getElementById("filtro-categoria");
const botaoFiltrar = document.getElementById("botao-filtrar");
const janela = document.getElementById("janela");
const formProduto = document.getElementById("form-produto");
const erroProduto = document.getElementById("erro-produto");

const iconeCaixa = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>';

function emAtencao(produto) {
    return Number(produto.saldo) < Number(produto.estoque_minimo);
}

function filtrarProdutos() {
    const texto = campoBusca.value.toLowerCase();
    const categoria = filtroCategoria.value;
    const resultado = [];

    for (const produto of produtos) {
        const encontrouTexto = produto.nome.toLowerCase().includes(texto) || produto.codigo.toLowerCase().includes(texto);
        const encontrouCategoria = categoria == "" || produto.categoria == categoria;
        const encontrouAtencao = !somenteAtencao || emAtencao(produto);

        if (encontrouTexto && encontrouCategoria && encontrouAtencao) {
            resultado.push(produto);
        }
    }

    return resultado;
}

function mostrarTabela() {
    const lista = filtrarProdutos();
    const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));

    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }

    const inicio = (paginaAtual - 1) * porPagina;
    const pagina = lista.slice(inicio, inicio + porPagina);

    let html = "";
    for (const produto of pagina) {
        const status = emAtencao(produto)
            ? '<span class="etiqueta etiqueta-laranja">Atenção</span>'
            : '<span class="etiqueta etiqueta-verde">Disponível</span>';

        html += '<tr class="linha-clicavel" onclick="abrirJanela(' + produto.id + ')">' +
            '<td><div class="produto-nome"><span class="produto-icone">' + iconeCaixa + '</span><strong>' + produto.nome + '</strong></div></td>' +
            "<td>" + produto.codigo + "</td>" +
            "<td>" + produto.categoria + "</td>" +
            "<td><strong>" + formatarNumero(produto.saldo) + " un.</strong></td>" +
            "<td>" + formatarNumero(produto.estoque_minimo) + " un.</td>" +
            '<td class="direita">' + status + "</td>" +
            "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="6" class="vazio">Nenhum produto encontrado.</td></tr>';
    }

    document.getElementById("tabela-produtos").innerHTML = html;
    document.getElementById("texto-paginacao").textContent =
        "Exibindo " + pagina.length + " de " + lista.length + " produtos";

    let botoes = '<button type="button" onclick="irParaPagina(' + (paginaAtual - 1) + ')">‹</button>';
    for (let i = 1; i <= totalPaginas; i++) {
        const classe = i == paginaAtual ? "ativa" : "";
        botoes += '<button type="button" class="' + classe + '" onclick="irParaPagina(' + i + ')">' + i + "</button>";
    }
    botoes += '<button type="button" onclick="irParaPagina(' + (paginaAtual + 1) + ')">›</button>';
    document.getElementById("paginas").innerHTML = botoes;
}

function irParaPagina(numero) {
    const totalPaginas = Math.ceil(filtrarProdutos().length / porPagina);
    if (numero >= 1 && numero <= totalPaginas) {
        paginaAtual = numero;
        mostrarTabela();
    }
}

function mostrarResumo() {
    let disponiveis = 0;
    let atencao = 0;
    let unidades = 0;

    for (const produto of produtos) {
        unidades += Number(produto.saldo);
        if (emAtencao(produto)) {
            atencao++;
        } else {
            disponiveis++;
        }
    }

    document.getElementById("resumo-disponiveis").textContent = disponiveis + " produtos";
    document.getElementById("resumo-atencao").textContent = atencao + " produtos";
    document.getElementById("resumo-total").textContent = formatarNumero(unidades) + " unidades";
}

function montarCategorias() {
    const categorias = [];
    for (const produto of produtos) {
        if (!categorias.includes(produto.categoria)) {
            categorias.push(produto.categoria);
        }
    }

    const selecionada = filtroCategoria.value;
    let opcoes = '<option value="">Categoria</option>';
    let sugestoes = "";
    for (const categoria of categorias) {
        opcoes += "<option>" + categoria + "</option>";
        sugestoes += '<option value="' + categoria + '">';
    }

    filtroCategoria.innerHTML = opcoes;
    filtroCategoria.value = selecionada;
    document.getElementById("lista-categorias").innerHTML = sugestoes;
}

async function carregarProdutos() {
    produtos = await buscar("../backend/produtos_listar.php");
    montarCategorias();
    mostrarResumo();
    mostrarTabela();
}

function abrirJanela(id) {
    formProduto.reset();
    erroProduto.textContent = "";
    document.getElementById("produto-id").value = "";
    document.getElementById("janela-titulo").textContent = "Novo produto";
    document.getElementById("botao-excluir").style.display = "none";

    for (const produto of produtos) {
        if (produto.id == id) {
            document.getElementById("janela-titulo").textContent = "Editar produto";
            document.getElementById("botao-excluir").style.display = "inline-flex";
            document.getElementById("produto-id").value = produto.id;
            document.getElementById("produto-nome").value = produto.nome;
            document.getElementById("produto-codigo").value = produto.codigo;
            document.getElementById("produto-categoria").value = produto.categoria;
            document.getElementById("produto-saldo").value = produto.saldo;
            document.getElementById("produto-minimo").value = produto.estoque_minimo;
        }
    }

    janela.classList.add("aberta");
}

function fecharJanela() {
    janela.classList.remove("aberta");
}

async function excluirProduto() {
    if (!confirm("Deseja excluir este produto? As movimentações dele também serão apagadas.")) {
        return;
    }

    const dados = new FormData();
    dados.append("id", document.getElementById("produto-id").value);

    await enviar("../backend/produto_excluir.php", dados);
    fecharJanela();
    carregarProdutos();
}

formProduto.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    try {
        await enviar("../backend/produto_salvar.php", new FormData(formProduto));
        fecharJanela();
        carregarProdutos();
    } catch (erro) {
        erroProduto.textContent = erro.message;
    }
});

campoBusca.addEventListener("input", function () {
    paginaAtual = 1;
    mostrarTabela();
});

filtroCategoria.addEventListener("change", function () {
    paginaAtual = 1;
    mostrarTabela();
});

botaoFiltrar.addEventListener("click", function () {
    somenteAtencao = !somenteAtencao;
    botaoFiltrar.classList.toggle("botao-perigo", somenteAtencao);
    paginaAtual = 1;
    mostrarTabela();
});

janela.addEventListener("click", function (evento) {
    if (evento.target == janela) {
        fecharJanela();
    }
});

carregarProdutos();
