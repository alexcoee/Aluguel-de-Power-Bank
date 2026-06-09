// =========================
// ELEMENTOS
// =========================

const alugarBtn = document.getElementById("alugarBtn");
const aluguelBox = document.getElementById("aluguelBox");
const tempoRange = document.getElementById("tempoRange");
const tempoTexto = document.getElementById("tempoTexto");
const valorTotal = document.getElementById("valorTotal");
const priceValue = document.getElementById("price");
const paymentModal = document.getElementById("paymentModal");
const continuarPagamento = document.getElementById("continuarPagamento");
const closeModal = document.getElementById("closeModal");
const cartaoBtn = document.getElementById("cartaoBtn");
const pixBtn = document.getElementById("pixBtn");
const cartaoBox = document.getElementById("cartaoBox");
const pixBox = document.getElementById("pixBox");
const copyPix = document.getElementById("copyPix");
const PowerBank = document.getElementById("PowerBank");
const modalValor = document.getElementById("modalValor");

// =========================
// CONFIGURAÇÕES
// =========================

const precoHora = 8;

// =========================
// SLIDER — PROGRESSO
// =========================

function updateSliderProgress() {
  const min = +tempoRange.min;
  const max = +tempoRange.max;
  const val = +tempoRange.value;
  const pct = ((val - min) / (max - min)) * 100;
  tempoRange.style.background = `linear-gradient(to right, #0a0a0a ${pct}%, #e5e7eb ${pct}%)`;
}

// =========================
// CALCULAR PREÇO
// =========================

function atualizarPreco() {
  const horas = tempoRange.value / 2;
  const total = horas * precoHora;

  const textoHora = horas === 1
    ? "1 hora"
    : horas % 1 === 0
      ? `${horas} horas`
      : `${horas.toString().replace(".", ",")} horas`;

  const valorFormatado = `R$ ${total.toFixed(2).replace(".", ",")}`;

  tempoTexto.textContent = textoHora;
  valorTotal.textContent = valorFormatado;

  // Anima o preço principal
  priceValue.classList.remove("bump");
  requestAnimationFrame(() => {
    priceValue.textContent = valorFormatado;
    priceValue.classList.add("bump");
  });

  // Atualiza modal
  if (modalValor) modalValor.textContent = valorFormatado;

  updateSliderProgress();
}

tempoRange.addEventListener("input", atualizarPreco);
atualizarPreco();

// =========================
// ABRIR/FECHAR ALUGUEL BOX
// =========================

alugarBtn.addEventListener("click", () => {
  const isOpen = aluguelBox.classList.contains("active");
  aluguelBox.classList.toggle("active");
  alugarBtn.innerHTML = isOpen
    ? `<i data-lucide="zap"></i> Alugar Agora`
    : `<i data-lucide="x"></i> Cancelar`;
  lucide.createIcons();
});

// =========================
// MODAL PAGAMENTO
// =========================

continuarPagamento.addEventListener("click", () => {
  paymentModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

function fecharModal() {
  paymentModal.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(resetModal, 400);
}

closeModal.addEventListener("click", fecharModal);

window.addEventListener("click", (e) => {
  if (e.target === paymentModal) fecharModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModal();
});

// =========================
// MÉTODOS DE PAGAMENTO
// =========================

cartaoBtn.addEventListener("click", () => {
  cartaoBox.classList.add("active");
  pixBox.classList.remove("active");
  cartaoBtn.classList.add("active");
  pixBtn.classList.remove("active");
});

pixBtn.addEventListener("click", () => {
  pixBox.classList.add("active");
  cartaoBox.classList.remove("active");
  pixBtn.classList.add("active");
  cartaoBtn.classList.remove("active");
});

// =========================
// COPIAR PIX
// =========================

copyPix.addEventListener("click", async () => {
  const pixCode = document.getElementById("pixCode");
  try {
    await navigator.clipboard.writeText(pixCode.value.trim());
  } catch {
    pixCode.select();
    document.execCommand("copy");
  }

  copyPix.classList.add("copied");
  copyPix.innerHTML = `<i data-lucide="check"></i> PIX Copiado!`;
  lucide.createIcons();

  setTimeout(() => {
    copyPix.classList.remove("copied");
    copyPix.innerHTML = `<i data-lucide="copy"></i> Copiar código PIX`;
    lucide.createIcons();
  }, 2500);
});

// =========================
// PARAR AUTO-ROTATE ao interagir
// =========================

PowerBank.addEventListener("pointerdown", () => {
  PowerBank.removeAttribute("auto-rotate");
});

// =========================
// TELAS DO MODAL
// =========================

const mainModalContent = document.querySelector(".modal-content > .modal-header");
const successScreen    = document.getElementById("successScreen");
const mapScreen        = document.getElementById("mapScreen");

const modalInnerSections = [
  document.querySelector(".modal-header"),
  document.querySelector(".modal-total"),
  document.querySelector(".payment-selector"),
  document.getElementById("cartaoBox"),
  document.getElementById("pixBox"),
];

function showScreen(screen) {
  modalInnerSections.forEach(el => { if (el) el.style.display = "none"; });
  successScreen.classList.remove("active");
  mapScreen.classList.remove("active");
  screen.classList.add("active");
  lucide.createIcons();
}

function resetModal() {
  modalInnerSections.forEach(el => { if (el) el.style.display = ""; });
  successScreen.classList.remove("active");
  mapScreen.classList.remove("active");
}

// =========================
// MAPA
// =========================

let mapInitialized = false;
let mapPreviewInitialized = false;

function initMapPreview() {
  if (mapPreviewInitialized) return;
  mapPreviewInitialized = true;

  const map = L.map("mapPreview", { zoomControl: true, scrollWheelZoom: false })
    .setView([-23.5600, -46.6600], 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(map);

  const icon = L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:#00b26f;
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,178,111,0.5)
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  pontosRecolha.forEach(p => {
    L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong style="font-family:Inter,sans-serif;font-size:13px">${p.nome}</strong><br><span style="font-family:Inter,sans-serif;font-size:12px;color:#6b7280">Disponível agora</span>`);
  });
}

// Inicializa o mapa preview quando entrar na viewport
const previewObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    initMapPreview();
    previewObserver.disconnect();
  }
}, { threshold: 0.1 });

const mapPreviewEl = document.getElementById("mapPreview");
if (mapPreviewEl) previewObserver.observe(mapPreviewEl);

const pontosRecolha = [
  { lat: -23.5505, lng: -46.6333, nome: "Estação Centro"         },
  { lat: -23.5617, lng: -46.6556, nome: "Estação Av. Paulista"   },
  { lat: -23.5656, lng: -46.6974, nome: "Estação Pinheiros"      },
  { lat: -23.5542, lng: -46.6884, nome: "Estação Vila Madalena"  },
  { lat: -23.5997, lng: -46.6618, nome: "Estação Moema"          },
  { lat: -23.5854, lng: -46.6750, nome: "Estação Itaim Bibi"     },
  { lat: -23.5363, lng: -46.6684, nome: "Estação Perdizes"       },
  { lat: -23.5605, lng: -46.6344, nome: "Estação Liberdade"      },
  { lat: -23.5480, lng: -46.6144, nome: "Estação Brás"           },
  { lat: -23.5278, lng: -46.6506, nome: "Estação Santana"        },
];

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const map = L.map("map", { zoomControl: true, scrollWheelZoom: false })
    .setView([-23.5600, -46.6600], 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(map);

  const icon = L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:#00b26f;
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,178,111,0.5)
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  pontosRecolha.forEach(p => {
    L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong style="font-family:Inter,sans-serif;font-size:13px">${p.nome}</strong><br><span style="font-family:Inter,sans-serif;font-size:12px;color:#6b7280">Disponível agora</span>`);
  });

  document.getElementById("legendCount").textContent = `${pontosRecolha.length} pontos`;

  // força re-render do mapa após aparecer
  setTimeout(() => map.invalidateSize(), 50);
}

// =========================
// BOTÃO FINALIZAR PAGAMENTO
// =========================

const payBtn = document.querySelector(".pay-btn");
if (payBtn) {
  payBtn.addEventListener("click", () => {
    showScreen(successScreen);
    setTimeout(() => {
      showScreen(mapScreen);
      initMap();
    }, 2400);
  });
}

document.getElementById("closeModalMap")?.addEventListener("click", fecharModal);
document.getElementById("btnMapClose")?.addEventListener("click", fecharModal);

// =========================
// FORMATAÇÃO CARTÃO
// =========================

const cardInput = document.querySelector('input[placeholder="0000 0000 0000 0000"]');
if (cardInput) {
  cardInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = v.substring(0, 19);
  });
}

const validadeInput = document.querySelector('input[placeholder="MM/AA"]');
if (validadeInput) {
  validadeInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2) v = v.substring(0, 2) + "/" + v.substring(2, 4);
    e.target.value = v;
  });
}

const cvvInput = document.querySelector('input[placeholder="•••"]');
if (cvvInput) {
  cvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
  });
}
