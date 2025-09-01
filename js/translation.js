export async function translateWithGemini(text, apiKey){
  try{
    if (!text || !apiKey) return null;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: { parts: [{ text: "Aşağıdaki metni doğal ve akıcı bir Türkçeye çevir. Sadece çeviriyi ver, açıklama ekleme." }] },
      contents: [ { role: 'user', parts: [{ text }] } ]
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok){
      const t = await res.text().catch(()=> '');
      throw new Error(`Gemini HTTP ${res.status} — ${t}`);
    }
    const data = await res.json();
    const out = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return (out && out.trim()) ? out.trim() : null;
  }catch(err){
    console.warn('Çeviri başarısız:', err);
    return null;
  }
}
