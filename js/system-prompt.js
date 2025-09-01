export const DEFAULT_SYSTEM_PROMPT = `Türkçe yanıt ver. Alaycı davran, ama aynı zamanda bilgilendirici ol, Üstten konuş, şakacı ol. Cevapların kısa ve öz olsun. Mizah kat. Gereksiz detaylardan kaçın. Cevapların 3 cümleyi geçmesin. Kullanıcıyı güldürmeye çalış.`;

export function ensureDefaultSystemPrompt(){
  const el = document.getElementById('system-prompt');
  if (el && !el.value.trim()) el.value = DEFAULT_SYSTEM_PROMPT;
}

export function injectStealthDefaultOnce(){
  const el = document.getElementById('system-prompt');
  if (!el || el.value.trim()) return;
  el.dataset.kairaWasEmpty = '1';
  el.value = DEFAULT_SYSTEM_PROMPT;
  setTimeout(() => {
    if (el && el.dataset.kairaWasEmpty === '1') {
      el.value = '';
      delete el.dataset.kairaWasEmpty;
    }
  }, 0);
}

export function wipeSystemPromptOnEnterChat(){
  const sys = document.getElementById('system-prompt');
  if (sys && !sys.dataset.userTouched) sys.value = '';
}

export function clearChatUI(){
  try {
    const hist = document.getElementById('chat-history');
    if (hist) hist.innerHTML = '';
    const hist2 = document.getElementById('chat-container');
    if (hist2) hist2.innerHTML = '';

    document.querySelectorAll('#chat-view .chat-user-bubble, #chat-view .chat-assistant-bubble, #chat-view [data-chat-item]').forEach(el => el.remove());

    const err = document.getElementById('error-message');
    if (err) { err.classList.add('hidden'); err.textContent = ''; }
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    const userIn = document.getElementById('user-input');
    if (userIn) userIn.value = '';

    try {
      const g = window;
      const CANDIDATES = ['conversation','messages','chatHistory','history','chatMessages','__kairaMessages','__chatCtx'];
      CANDIDATES.forEach(k => {
        if (Array.isArray(g[k])) { g[k].length = 0; }
        else if (g[k] && typeof g[k].clear === 'function') { try { g[k].clear(); } catch(_){} }
        else if (g[k] && typeof g[k] === 'object') { try { Object.keys(g[k]).forEach(p => { delete g[k][p]; }); } catch(_){} }
      });
      if (typeof g.resetChat === 'function') { try { g.resetChat(); } catch(_){} }
      if (typeof g.clearHistory === 'function') { try { g.clearHistory(); } catch(_){} }
    } catch(_){ }

    try {
      const nuke = storage => {
        const toDel = [];
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (/chat|kaira/i.test(k)) toDel.push(k);
        }
        toDel.forEach(k => { try { storage.removeItem(k); } catch(_){} });
      };
      if (window.localStorage) nuke(window.localStorage);
      if (window.sessionStorage) nuke(window.sessionStorage);
    } catch(_){ }

    const sys = document.getElementById('system-prompt');
    if (sys && sys.value && sys.value.trim() === DEFAULT_SYSTEM_PROMPT.trim()) sys.value = '';

    const wrap = document.getElementById('chat-view');
    if (wrap && typeof wrap.scrollTo === 'function') wrap.scrollTo({ top: 0, behavior: 'smooth' });

    document.dispatchEvent(new CustomEvent('kaira:chat-cleared', { detail: { source: 'clear-button' } }));

    console.log('[Chat] cleared');
  } catch(e){ console.warn('[Chat Clear] ', e); }
}

function wireUp(){
  document.addEventListener('click', ev => {
    const target = ev.target;
    if (!target || typeof target.closest !== 'function') return;
    if (target.closest('#send-button')) {
      ensureDefaultSystemPrompt();
      injectStealthDefaultOnce();
    }
    if (target.closest('#clear-chat')) {
      ev.preventDefault();
      clearChatUI();
    }
    if (target.closest('#select-chat')) {
      wipeSystemPromptOnEnterChat();
      ensureDefaultSystemPrompt();
    }
  }, true);

  const input = document.getElementById('user-input');
  if (input) {
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        injectStealthDefaultOnce();
      }
    }, true);
  }

  const sys = document.getElementById('system-prompt');
  if (sys) {
    sys.addEventListener('input', () => { sys.dataset.userTouched = '1'; });
  }

  ensureDefaultSystemPrompt();
}

document.addEventListener('DOMContentLoaded', wireUp);
window.__kairaClearChat = clearChatUI;
