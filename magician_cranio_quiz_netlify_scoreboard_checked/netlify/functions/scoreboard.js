const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  const store = getStore('cranio-magician-scoreboard');
  const key = 'scores.json';
  let scores = [];
  try { scores = (await store.get(key, { type: 'json' })) || []; } catch(e) { scores = []; }
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const clean = {
        name: String(body.name || 'Mystery Wizard').slice(0, 28).replace(/[<>]/g, ''),
        score: Number(body.score || 0),
        total: Number(body.total || 0),
        percent: Number(body.percent || 0),
        date: new Date().toISOString()
      };
      scores.push(clean);
      scores = scores.sort((a,b)=> b.percent-a.percent || b.score-a.score || new Date(a.date)-new Date(b.date)).slice(0,100);
      await store.setJSON(key, scores);
      return { statusCode: 200, headers, body: JSON.stringify({ ok:true, scores }) };
    } catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ ok:false, error:e.message })}; }
  }
  return { statusCode: 200, headers, body: JSON.stringify({ ok:true, scores }) };
};
