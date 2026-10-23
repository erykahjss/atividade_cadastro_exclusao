// Localizar os elementos pelo ID do HTML
const formulario = document.getElementById("formulario");
const formularioExclusao = document.getElementById("formulario-exclusao");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("botao");
const botaoExcluir = document.getElementById("botao-excluir");

// 2. CADASTRO COM POST
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault(); // Impede o recarregamento da página

  // Captura nome, e-mail e curso
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const curso = document.getElementById("curso").value;

  botao.disabled = true;
  mensagem.textContent = "Enviando...";

  try {
    const resposta = await fetch("/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome, email: email, curso: curso })
    });

    const dados = await resposta.json();
    mensagem.textContent = dados.mensagem; // Apresenta a mensagem e ID informados pela API

    if (resposta.ok) {
      formulario.reset(); // Limpa os campos somente após cadastro bem-sucedido
    }
  } catch (erro) {
    mensagem.textContent = "Falha na comunicação. Verifique o servidor e tente novamente";
  } finally {
    botao.disabled = false;
  }
});

// 3. EXCLUSÃO COM DELETE
formularioExclusao.addEventListener("submit", async function (evento) {
  evento.preventDefault(); // Impede o recarregamento da página

  const idTexto = document.getElementById("id-exclusao").value.trim();
  const idNum = Number(idTexto);

  // Valida se é um número inteiro positivo
  if (!idTexto || !Number.isInteger(idNum) || idNum <= 0) {
    mensagem.textContent = "Informe um ID válido (número inteiro positivo).";
    return;
  }

  // Solicita confirmação antes de excluir
  const confirmado = confirm(`Tem certeza que deseja excluir o aluno de ID ${idNum}?`);
  if (!confirmado) {
    return;
  }

  botaoExcluir.disabled = true;
  mensagem.textContent = "Excluindo...";

  try {
    const resposta = await fetch(`/api/alunos/${idNum}`, {
      method: "DELETE"
    });

    const dados = await resposta.json();
    mensagem.textContent = dados.mensagem; // Mostra a resposta da API sem recarregar a página

    if (resposta.ok) {
      formularioExclusao.reset();
    }
  } catch (erro) {
    mensagem.textContent = "Falha na comunicação ao tentar excluir o aluno.";
  } finally {
    botaoExcluir.disabled = false;
  }
});