const formLogin = document.getElementById("form-login");
const campoSenha = document.getElementById("senha");
const botaoMostrar = document.getElementById("mostrar-senha");
const erroLogin = document.getElementById("erro-login");

botaoMostrar.addEventListener("click", function () {
    if (campoSenha.type == "password") {
        campoSenha.type = "text";
        botaoMostrar.textContent = "Ocultar";
    } else {
        campoSenha.type = "password";
        botaoMostrar.textContent = "Mostrar";
    }
});

document.getElementById("esqueceu").addEventListener("click", function (evento) {
    evento.preventDefault();
    alert("Procure o administrador do sistema para redefinir sua senha.");
});

formLogin.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    erroLogin.textContent = "";

    const resposta = await fetch("../backend/login.php", {
        method: "POST",
        body: new FormData(formLogin)
    });
    const dados = await resposta.json();

    if (resposta.ok) {
        window.location.href = "painel.html";
    } else {
        erroLogin.textContent = dados.erro;
    }
});
