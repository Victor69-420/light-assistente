const menuButton = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");
const conversation = document.getElementById("conversation");
const clearChat = document.getElementById("clearChat");
const transferSupport = document.getElementById("transferSupport");
const shiftStatus = document.getElementById("shiftStatus");
const statusText = document.getElementById("statusText");
const quickButtons = document.querySelectorAll("[data-question]");

let transferredToSupport = false;

const responses = [
  {
    keywords: ["energia", "luz", "apagão", "falta"],
    text: "Para casos de falta de energia, confirme o endereço completo e verifique se há outros imóveis afetados. Consulte a previsão de normalização no sistema operacional e informe o protocolo ao cliente."
  },
  {
    keywords: ["segunda via", "conta", "fatura", "boleto"],
    text: "Oriente o cliente a acessar a Agência Virtual ou o aplicativo Light. Após validar os dados do titular, também é possível consultar débitos e emitir a segunda via pelos canais digitais."
  },
  {
    keywords: ["titularidade", "titular", "documentos", "cadastro"],
    text: "Para troca de titularidade, solicite documento de identificação, CPF e comprovante de vínculo com o imóvel. Confirme se não existem pendências que impeçam a alteração cadastral."
  },
  {
    keywords: ["religação", "pagamento", "prazo"],
    text: "Após a confirmação do pagamento, registre a solicitação de religação no sistema. Informe ao cliente que o prazo depende do tipo de religação e da disponibilidade da equipe de campo."
  }
];

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type === "user" ? "user-message" : "assistant-message"}`;

  message.innerHTML = type === "user"
    ? `<div class="message-content"><span class="message-author">Você <time>Agora</time></span><p>${escapeHtml(text)}</p></div>`
    : `<div class="message-avatar">✦</div><div class="message-content"><span class="message-author">Light Assist <time>Agora</time></span><p>${text}</p><div class="source-chip">▣ Base Light • Resposta sugerida</div></div>`;

  conversation.appendChild(message);
  conversation.scrollTop = conversation.scrollHeight;
}

function getResponse(question) {
  const normalized = question.toLowerCase();
  const match = responses.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));

  return match
    ? match.text
    : "Encontrei informações relacionadas na base de conhecimento. Confirme os dados do cliente, consulte o procedimento correspondente no sistema e, se necessário, encaminhe o caso para a área responsável. Posso ajudar com uma pergunta mais específica.";
}

function submitQuestion(question) {
  if (transferredToSupport) return;

  const text = question.trim();
  if (!text) return;

  addMessage(text, "user");
  questionInput.value = "";

  setTimeout(() => {
    if (!transferredToSupport) addMessage(getResponse(text), "assistant");
  }, 500);
}

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(questionInput.value);
});

questionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    questionForm.requestSubmit();
  }
});

quickButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (transferredToSupport) return;
    questionInput.value = button.dataset.question;
    questionInput.focus();
  });
});

clearChat.addEventListener("click", () => {
  conversation.innerHTML = `
    <div class="message assistant-message">
      <div class="message-avatar">✦</div>
      <div class="message-content">
        <span class="message-author">Light Assist <time>Agora</time></span>
        <p>Conversa limpa. Como posso ajudar no seu próximo atendimento?</p>
        <div class="source-chip">▣ Base Light • Atualizada hoje</div>
      </div>
    </div>
  `;
});

transferSupport.addEventListener("click", () => {
  if (transferredToSupport) return;

  transferredToSupport = true;
  statusText.textContent = "Aguardando suporte";
  shiftStatus.classList.add("support-mode");
  transferSupport.textContent = "Atendimento transferido";
  transferSupport.disabled = true;
  questionInput.disabled = true;
  questionInput.placeholder = "Atendimento encaminhado para o suporte";
  document.querySelector(".send-button").disabled = true;

  addMessage(
    "O atendimento foi transferido para o suporte interno. Um especialista será acionado em instantes. Protocolo: LS-" + Date.now().toString().slice(-6),
    "assistant"
  );
});

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => sidebar.classList.remove("open"));
});