import { escapeHTML } from './utils.js';
import { fetchJson } from './nasa-api.js';

let marsBound = false;

function renderMarsLoading(){
  const r = document.getElementById('mars-results');
  if (r) r.innerHTML = '<div class="col-span-full text-center text-gray-400 p-8">Yükleniyor...</div>';
}
function renderMarsError(msg){
  const r = document.getElementById('mars-results');
  if (r) r.innerHTML = `<div class="col-span-full text-center text-red-400 p-8">Hata: ${escapeHTML(msg)}</div>`;
}
function renderMarsPhotos(photos){
  const results = document.getElementById('mars-results');
  if (!results) return;
  if (!photos || !photos.length){
    results.innerHTML = '<div class="col-span-full text-center text-gray-400 p-8">Sonuç bulunamadı. Farklı tarih/kamera deneyin veya "En Son"a basın.</div>';
    return;
  }
  const html = photos.map(p=>`<article class="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden"><img src="${p.img_src}" alt="${escapeHTML(p.camera?.full_name||'Mars')}" class="w-full h-48 object-cover" /><div class="p-4"><h3 class="text-white font-semibold mb-1">${escapeHTML(p.rover?.name||'Rover')} • ${escapeHTML(p.camera?.name||'Kamera')}</h3><p class="text-gray-400 text-sm">${escapeHTML(p.earth_date||'')}</p></div></article>`).join('');
  results.innerHTML = html;
}

export async function fetchMars(params={}){
  try{
    renderMarsLoading();
    const apiKey = window.KAIRA_NASA?.nasaApiKey;
    if(!apiKey) throw new Error('NASA API anahtarı yok.');
    const rover = (params.rover||'curiosity').toLowerCase();
    let url;
    if(params.latest){
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${apiKey}`;
    } else {
      const q = new URLSearchParams({ api_key: apiKey });
      if(params.earth_date) q.set('earth_date', params.earth_date);
      if(params.camera) q.set('camera', params.camera);
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${q.toString()}`;
    }
    const data = await fetchJson(url);
    const photos = data.latest_photos || data.photos || [];
    renderMarsPhotos(photos);
  }catch(e){
    renderMarsError(e?.message || e);
  }
}

export function initMars(){
  if (marsBound) return; marsBound = true;
  const roverSel = document.getElementById('mars-rover');
  const dateInp  = document.getElementById('mars-date');
  const camSel   = document.getElementById('mars-camera');
  const btnLatest= document.getElementById('mars-latest');
  const btnFetch = document.getElementById('mars-fetch');
  if(btnLatest) btnLatest.addEventListener('click', () => fetchMars({ rover: roverSel.value, latest: true }));
  if(btnFetch) btnFetch.addEventListener('click', () => {
    fetchMars({ rover: roverSel.value, earth_date: dateInp.value || undefined, camera: camSel.value || undefined });
  });
  fetchMars({ latest: true, rover: 'curiosity' });
}
