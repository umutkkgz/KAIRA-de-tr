(function(){
  // Varsayılan sistem promptu — boşsa bu doldurulur
  const DEFAULT_SYSTEM_PROMPT = `Türkçe yanıt ver. Alaycı davran, ama aynı zamanda bilgilendirici ol, Üstten konuş, şakacı ol. Cevapların kısa ve öz olsun. Mizah kat. Gereksiz detaylardan kaçın. Cevapların 3 cümleyi geçmesin. Kullanıcıyı güldürmeye çalış.`;

  function ensureDefaultSystemPrompt(){
    const el = document.getElementById('system-prompt');
    if (el && !el.value.trim()) el.value = DEFAULT_SYSTEM_PROMPT;
  }

  // Sayfa yüklenince ve sohbet görünümü seçilince doldur
  document.addEventListener('DOMContentLoaded', ensureDefaultSystemPrompt);
  const selectChat = document.getElementById('select-chat');
  if (selectChat) selectChat.addEventListener('click', ensureDefaultSystemPrompt);

  // Gönder'e basıldığında da boşsa otomatik doldur (capture=true: önce bizimki çalışır)
  const sendBtn = document.getElementById('send-button');
  if (sendBtn) sendBtn.addEventListener('click', function(){
    ensureDefaultSystemPrompt();
  }, true);
})();
