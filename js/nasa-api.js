export async function fetchNasaKeys(base='', apiStatus){
  if (apiStatus) apiStatus.textContent = 'Anahtarlar sunucudan bekleniyor...';
  try{
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    const [nasaRes, googleRes] = await Promise.all([
      fetch(`${base}/api/get-nasa-key`, { headers }),
      fetch(`${base}/api/get-google-key`, { headers })
    ]);
    const nasaData = await nasaRes.json().catch(()=>({}));
    const googleData = await googleRes.json().catch(()=>({}));
    window.KAIRA_NASA = {
      nasaApiKey: (nasaRes.ok && nasaData.apiKey) ? nasaData.apiKey : null,
      googleApiKey: (googleRes.ok && googleData.apiKey) ? googleData.apiKey : null
    };
    if (window.KAIRA_NASA.nasaApiKey){
      if (apiStatus){
        apiStatus.textContent = 'Bağlantı kuruldu';
        apiStatus.classList.remove('text-gray-400');
        apiStatus.classList.add('text-green-400');
      }
    } else {
      throw new Error(nasaData?.error || 'NASA API anahtarı alınamadı.');
    }
  }catch(e){
    if (apiStatus){
      apiStatus.textContent = 'Hata: ' + (e?.message || e);
      apiStatus.classList.add('text-red-400');
    }
    throw e;
  }
}

export async function fetchJson(url){
  const res = await fetch(url);
  if (!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`HTTP ${res.status} — ${txt}`);
  }
  return res.json();
}
