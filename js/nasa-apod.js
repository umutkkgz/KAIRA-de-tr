import { escapeHTML } from './utils.js';
import { translateWithGemini } from './translation.js';
import { fetchJson } from './nasa-api.js';

let apodContainer;

function renderApodLoading(){
  if (apodContainer) apodContainer.innerHTML = '<div class="text-center text-gray-400 p-8">Yükleniyor...</div>';
}
function renderApodError(msg){
  if (apodContainer) apodContainer.innerHTML = `<div class="text-center text-red-400 p-8">Hata: ${escapeHTML(msg)}</div>`;
}
function renderApod(data){
  if (!apodContainer) return;
  const title   = data?.title || 'Astronomy Picture of the Day';
  const date    = data?.date  || '';
  const explain = data?.explanation || '';
  const credit  = data?.copyright ? `© ${escapeHTML(data.copyright)}` : '';
  let mediaHtml = '';
  if (data?.media_type === 'image') {
    const src = data.hdurl || data.url || data.thumbnail_url || '';
    mediaHtml = `<img src="${src}" alt="${escapeHTML(title)}" class="w-full rounded-xl border border-gray-700" />`;
  } else if (data?.media_type === 'video') {
    const src = data.url || '';
    mediaHtml = `<div class="aspect-video w-full"><iframe src="${src}" class="w-full h-full rounded-xl border border-gray-700" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="no-referrer"></iframe></div>`;
  } else {
    mediaHtml = `<div class="text-center text-gray-400">Desteklenmeyen medya türü: ${escapeHTML(String(data?.media_type))}</div>`;
  }
  apodContainer.innerHTML = `<div class="bg-gray-800/60 border border-gray-700 rounded-xl p-4 md:p-6"><div class="flex items-baseline justify-between gap-3"><div><h3 class="text-2xl font-semibold text-white mb-1">${escapeHTML(title)}</h3><p class="text-gray-400 text-sm">${escapeHTML(date)} ${credit ? '• '+credit : ''}</p></div><button id="apod-refresh" class="al-btn">Yenile</button></div><div class="mt-3">${mediaHtml}</div><p class="text-gray-300 leading-relaxed mt-4 whitespace-pre-wrap">${escapeHTML(explain)}</p><div class="mt-3 text-xs text-gray-500">Kaynak: NASA APOD</div></div>`;
  const btn = document.getElementById('apod-refresh');
  if (btn) btn.addEventListener('click', () => fetchApod());
}

export async function fetchApod(date){
  try{
    renderApodLoading();
    const apiKey = window.KAIRA_NASA?.nasaApiKey;
    if (!apiKey) throw new Error('NASA API anahtarı yok.');
    const q = new URLSearchParams({ api_key: apiKey, thumbs:'true' });
    if (date) q.set('date', date);
    const data = await fetchJson(`https://api.nasa.gov/planetary/apod?${q.toString()}`);
    const gKey = window.KAIRA_NASA?.googleApiKey || null;
    let trTitle = null, trExpl = null;
    if (gKey){
      trTitle = await translateWithGemini(data.title, gKey).catch(()=>null);
      trExpl  = await translateWithGemini(data.explanation, gKey).catch(()=>null);
    }
    renderApod({
      ...data,
      title: trTitle || data.title,
      explanation: trExpl || data.explanation
    });
  }catch(e){
    renderApodError(e?.message || e);
  }
}

export function initApod(){
  apodContainer = document.getElementById('apod-container');
  if (!apodContainer) return;
  fetchApod().catch(()=>{});
}
