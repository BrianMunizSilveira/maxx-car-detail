// Elementos do menu mobile
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("overlay");
const hamburger = document.getElementById("hamburger");
const telefoneInput = document.getElementById("telefone");

// Elementos da navegação
const sectionsNav = document.querySelectorAll("header[id], section[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

// Toggle menu mobile
function toggleMenu() {
  mobileMenu.classList.toggle("open");
  overlay.classList.toggle("show");
  hamburger.classList.toggle("open");
}

// Função para enviar WhatsApp
function enviarWhatsApp() {
  let nome = document.getElementById("nome").value.trim();
  let telefone = document.getElementById("telefone").value.trim();
  let data = document.getElementById("data").value;
  let hora = document.getElementById("hora").value;
  let servicos = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    servicos.push(checkbox.value);
  });

  if (!nome || !telefone || !data || !hora || servicos.length === 0) {
    alert("⚠️ Preencha todos os campos para continuar.");
    return;
  }

  let mensagem = `🧽 *NOVO AGENDAMENTO – ESTÉTICA AUTOMOTIVA* 🚗✨

👤 *Cliente:* ${nome}
📞 *Telefone:* ${telefone}

🛠️ *Serviços Escolhidos:*
• ${servicos.join("\n• ")}

📅 *Data:* ${data.split("-").reverse().join("/")}
⏰ *Horário:* ${hora}

📍 Brumadinho - MG`;

  let url = `https://wa.me/5511983162439?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// Máscara de telefone
if (telefoneInput) {
  telefoneInput.addEventListener("input", e => {
    let valor = e.target.value.replace(/\D/g, "");
    
    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d*)/, "($1");
    }
    
    e.target.value = valor;
  });
}

// Scroll spy - detectar seção ativa
window.addEventListener("scroll", () => {
  let current = "inicio"; // Valor padrão
  
  // Verificar se está no final da página (para pegar a última seção)
  const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
  
  if (isBottom) {
    // Se está no final, selecionar a última seção (dúvidas)
    current = "duvidas";
  } else {
    sectionsNav.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });
  }
  
  // Atualizar tanto nav-links quanto mobile-menu
  navLinksAll.forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href && href === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// Fechar menu mobile ao clicar em qualquer link
document.querySelectorAll(".mobile-menu .nav-link, .mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    if (hamburger) hamburger.classList.remove("open");
  });
});

// Função para verificar horário de funcionamento
function verificarHorario() {
  const agora = new Date();
  const dia = agora.getDate();
  const diaSemana = agora.getDay(); // 0 = Domingo, 6 = Sábado
  const hora = agora.getHours();
  const mes = agora.getMonth(); // 0 = Janeiro
  
  const statusCard = document.getElementById('statusCard');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusTexto = document.getElementById('statusTexto');
  const statusDetalhes = document.getElementById('statusDetalhes');
  
  // Se os elementos não existirem, retornar
  if (!statusCard || !statusIndicator || !statusTexto || !statusDetalhes) {
    return;
  }
  
  // Verifica se é janeiro (mês 0)
  const isJaneiro = mes === 0;
  
  // Domingo sempre fechado
  if (diaSemana === 0) {
    statusCard.className = 'status-card fechado';
    statusIndicator.className = 'status-indicator fechado';
    statusIndicator.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    statusTexto.textContent = '🔴 Fechado';
    statusDetalhes.textContent = 'Não abrimos aos domingos';
    return;
  }
  
  // Em janeiro, só abre em dias pares
  if (isJaneiro && dia % 2 !== 0) {
    statusCard.className = 'status-card fechado';
    statusIndicator.className = 'status-indicator fechado';
    statusIndicator.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    statusTexto.textContent = '🔴 Fechado hoje';
    statusDetalhes.textContent = `Abrimos amanhã (dia ${dia + 1}) das 8h às 18h`;
    return;
  }
  
  // Verifica horário de funcionamento (8h às 18h)
  if (hora >= 8 && hora < 18) {
    statusCard.className = 'status-card aberto';
    statusIndicator.className = 'status-indicator aberto';
    statusIndicator.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    statusTexto.textContent = '🟢 Aberto agora!';
    statusDetalhes.textContent = `Funcionando até às 18h`;
  } else {
    statusCard.className = 'status-card fechado';
    statusIndicator.className = 'status-indicator fechado';
    statusIndicator.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    statusTexto.textContent = '🔴 Fechado';
    
    if (hora < 8) {
      statusDetalhes.textContent = 'Abrimos às 8h';
    } else {
      // Verifica próximo dia de funcionamento
      let proximoDia = dia + 1;
      if (isJaneiro && proximoDia % 2 !== 0) {
        proximoDia++;
      }
      statusDetalhes.textContent = `Abrimos amanhã às 8h`;
    }
  }
}

// Executar verificação de horário ao carregar a página
document.addEventListener('DOMContentLoaded', verificarHorario);

// Atualizar horário a cada minuto
setInterval(verificarHorario, 60000);