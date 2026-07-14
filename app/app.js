# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
/* ═══════════════════════════════════════════════════
   AGENDA DE CONTATOS — Frontend JS Puro
   Consome a API REST em /api/contatos.php
═══════════════════════════════════════════════════ */

const API = '/api/contatos.php';

/* ─── Estado ─────────────────────────────────────── */
let todosContatos = [];
let idParaExcluir  = null;

/* ─── Seletores ──────────────────────────────────── */
const el = id => document.getElementById(id);

const $grid          = el('cardsGrid');
const $loading       = el('loadingState');
const $empty         = el('emptyState');
const $busca         = el('campoBusca');
const $modalOverlay  = el('modalOverlay');
const $confirmOverlay= el('confirmOverlay');
const $formContato   = el('formContato');
const $toast         = el('toast');
const $toastMsg      = el('toastMensagem');
const $modalTitulo   = el('modalTitulo');
const $btnSalvar     = el('btnSalvar');

/* ─── Init ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  carregarContatos();
  bindEventos();
});

/* ─── Event Listeners ────────────────────────────── */
function bindEventos() {
  el('btnNovoContato').addEventListener('click', abrirModalNovo);
  el('btnFecharModal').addEventListener('click', fecharModal);
  el('btnCancelar').addEventListener('click', fecharModal);
  el('btnCancelarExclusao').addEventListener('click', () => toggleOverlay($confirmOverlay, false));
  el('btnConfirmarExclusao').addEventListener('click', confirmarExclusao);
  $formContato.addEventListener('submit', salvarContato);
  $busca.addEventListener('input', () => renderContatos(filtrarContatos($busca.value)));

  // Fechar modal ao clicar fora
  $modalOverlay.addEventListener('click', e => { if (e.target === $modalOverlay) fecharModal(); });
  $confirmOverlay.addEventListener('click', e => { if (e.target === $confirmOverlay) toggleOverlay($confirmOverlay, false); });

  // Radio buttons visuais
  document.querySelectorAll('.radio-option').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
    });
  });
}

/* ─── API ─────────────────────────────────────────── */
async function carregarContatos() {
  toggleLoading(true);
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Falha ao carregar contatos');
    todosContatos = await res.json();
    renderContatos(todosContatos);
    atualizarStats();
  } catch (err) {
    mostrarToast('Erro ao conectar com o servidor', 'erro');
    toggleLoading(false);
  }
}

async function salvarContato(e) {
  e.preventDefault();
  if (!validarForm()) return;

  const id = el('contatoId').value;
  const dados = {
    nome:     el('inputNome').value.trim(),
    endereco: el('inputEndereco').value.trim(),
    telefone: el('inputTelefone').value.trim(),
    email:    el('inputEmail').value.trim(),
    sexo:     document.querySelector('input[name="sexo"]:checked')?.value || '',
  };

  $btnSalvar.disabled = true;
  $btnSalvar.textContent = 'Salvando...';

  try {
    const res = await fetch(id ? `${API}?id=${id}` : API, {
      method:  id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(dados),
    });
    const json = await res.json();

    if (!res.ok) {
      mostrarToast(json.erros?.join(', ') || 'Erro ao salvar', 'erro');
      return;
    }

    fecharModal();
    mostrarToast(id ? 'Contato atualizado!' : 'Contato adicionado!');
    await carregarContatos();
  } catch {
    mostrarToast('Erro ao comunicar com o servidor', 'erro');
  } finally {
    $btnSalvar.disabled = false;
    $btnSalvar.textContent = 'Salvar Contato';
  }
}

async function confirmarExclusao() {
  if (!idParaExcluir) return;
  toggleOverlay($confirmOverlay, false);
  try {
    const res = await fetch(`${API}?id=${idParaExcluir}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    mostrarToast('Contato excluído!');
    await carregarContatos();
  } catch {
    mostrarToast('Erro ao excluir contato', 'erro');
  } finally {
    idParaExcluir = null;
  }
}

/* ─── Render ──────────────────────────────────────── */
function renderContatos(lista) {
  toggleLoading(false);
  $grid.innerHTML = '';

  if (!lista.length) {
    $empty.classList.remove('hidden');
    return;
  }
  $empty.classList.add('hidden');

  lista.forEach(c => {
    const card = criarCard(c);
    $grid.appendChild(card);
  });
}

function criarCard(c) {
  const isMasc = c.sexo === 'M';
  const inicial = c.nome.charAt(0).toUpperCase();

  const div = document.createElement('div');
  div.className = 'contact-card';
  div.innerHTML = `
    <div class="card-top">
      <div class="card-avatar ${isMasc ? 'masc' : 'fem'}">${inicial}</div>
      <div class="card-info">
        <div class="card-name">${escapeHtml(c.nome)}</div>
        <span class="card-badge ${isMasc ? 'badge-m' : 'badge-f'}">
          ${isMasc ? '♂ Masculino' : '♀ Feminino'}
        </span>
      </div>
    </div>
    <div class="card-details">
      <div class="card-detail"><span class="icon">📍</span><span>${escapeHtml(c.endereco)}</span></div>
      <div class="card-detail"><span class="icon">📞</span><span>${escapeHtml(c.telefone)}</span></div>
      <div class="card-detail"><span class="icon">✉️</span><span>${escapeHtml(c.email)}</span></div>
    </div>
    <div class="card-actions">
      <button class="btn btn-edit btn-icon" data-id="${c.id}">✏️ Editar</button>
      <button class="btn btn-delete btn-icon" data-id="${c.id}">🗑️ Excluir</button>
    </div>
  `;

  div.querySelector('.btn-edit').addEventListener('click', () => abrirModalEdicao(c));
  div.querySelector('.btn-delete').addEventListener('click', () => abrirConfirmarExclusao(c.id));
  return div;
}

/* ─── Filtro & Stats ──────────────────────────────── */
function filtrarContatos(termo) {
  if (!termo.trim()) return todosContatos;
  const t = termo.toLowerCase();
  return todosContatos.filter(c =>
    c.nome.toLowerCase().includes(t) ||
    c.email.toLowerCase().includes(t) ||
    c.telefone.toLowerCase().includes(t)
  );
}

function atualizarStats() {
  el('totalContatos').textContent  = todosContatos.length;
  el('totalMasculino').textContent = todosContatos.filter(c => c.sexo === 'M').length;
  el('totalFeminino').textContent  = todosContatos.filter(c => c.sexo === 'F').length;
}

/* ─── Modal ───────────────────────────────────────── */
function abrirModalNovo() {
  $formContato.reset();
  el('contatoId').value = '';
  $modalTitulo.textContent = 'Novo Contato';
  $btnSalvar.textContent = 'Salvar Contato';
  limparErros();
  document.querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
  toggleOverlay($modalOverlay, true);
  el('inputNome').focus();
}

function abrirModalEdicao(c) {
  $formContato.reset();
  el('contatoId').value   = c.id;
  el('inputNome').value      = c.nome;
  el('inputEndereco').value  = c.endereco;
  el('inputTelefone').value  = c.telefone;
  el('inputEmail').value     = c.email;
  $modalTitulo.textContent   = 'Editar Contato';
  $btnSalvar.textContent     = 'Atualizar Contato';
  limparErros();

  document.querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
  const radio = document.querySelector(`input[name="sexo"][value="${c.sexo}"]`);
  if (radio) {
    radio.checked = true;
    radio.closest('.radio-option').classList.add('selected');
  }
  toggleOverlay($modalOverlay, true);
}

function abrirConfirmarExclusao(id) {
  idParaExcluir = id;
  toggleOverlay($confirmOverlay, true);
}

function fecharModal() {
  toggleOverlay($modalOverlay, false);
  limparErros();
}

/* ─── Validação ───────────────────────────────────── */
function validarForm() {
  limparErros();
  let valido = true;

  const nome     = el('inputNome').value.trim();
  const endereco = el('inputEndereco').value.trim();
  const telefone = el('inputTelefone').value.trim();
  const email    = el('inputEmail').value.trim();
  const sexo     = document.querySelector('input[name="sexo"]:checked');

  if (!nome)     { setErro('inputNome', 'erroNome', 'Nome é obrigatório'); valido = false; }
  if (!endereco) { setErro('inputEndereco', 'erroEndereco', 'Endereço é obrigatório'); valido = false; }
  if (!telefone) { setErro('inputTelefone', 'erroTelefone', 'Telefone é obrigatório'); valido = false; }
  if (!email) {
    setErro('inputEmail', 'erroEmail', 'Email é obrigatório'); valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setErro('inputEmail', 'erroEmail', 'Email inválido'); valido = false;
  }
  if (!sexo) { el('erroSexo').textContent = 'Selecione o sexo'; valido = false; }

  return valido;
}

function setErro(inputId, erroId, msg) {
  el(inputId).classList.add('invalid');
  el(erroId).textContent = msg;
}

function limparErros() {
  ['inputNome','inputEndereco','inputTelefone','inputEmail'].forEach(id => {
    el(id)?.classList.remove('invalid');
  });
  ['erroNome','erroEndereco','erroTelefone','erroEmail','erroSexo'].forEach(id => {
    const span = el(id);
    if (span) span.textContent = '';
  });
}

/* ─── Toast ───────────────────────────────────────── */
let toastTimer;
function mostrarToast(msg, tipo = 'sucesso') {
  $toastMsg.textContent = msg;
  $toast.classList.remove('hidden', 'erro');
  if (tipo === 'erro') $toast.classList.add('erro');
  requestAnimationFrame(() => $toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $toast.classList.remove('show');
    setTimeout(() => $toast.classList.add('hidden'), 300);
  }, 3000);
}

/* ─── Helpers ─────────────────────────────────────── */
function toggleOverlay(el, show) {
  el.classList.toggle('hidden', !show);
  document.body.style.overflow = show ? 'hidden' : '';
}

function toggleLoading(show) {
  $loading.classList.toggle('hidden', !show);
  if (show) {
    $grid.innerHTML = '';
    $empty.classList.add('hidden');
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
