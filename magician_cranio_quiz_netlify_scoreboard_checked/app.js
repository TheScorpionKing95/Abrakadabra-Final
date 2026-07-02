let order=[...questions.keys()], i=0, score=0, streak=0, player='', answered=false, soundOn=true, totalAnswered=0;
const $=id=>document.getElementById(id);
const correctLines=[
  'CORRECT! Merlin just asked to borrow your notes. 🧙‍♂️📚',
  'YES! The mandible bowed. The maxilla clapped. The goblin cried. 🦷👏🧌',
  'BOOM. Critical spell hit! Professor Lin lost 10 HP and some emotional stability. 💥🪄',
  'Correct! That answer erupted cleaner than a textbook first molar. 🦷✨',
  'Wizard behavior. Absolutely illegal levels of craniofacial excellence. 🔮👑',
  'Correct! The dental follicle is throwing confetti in the bone crypt. 🎉🦷',
  'You cooked. The cranial base is now your hype man. 🧠🔥',
  'YES! The Sorting Hat screamed “orthodontics.” 🎩🪄',
  'Correct! Even the sphenoethmoid synchondrosis reopened just to applaud. 👏💀'
];
const wrongLines=[
  'WRONG. The goblins have revoked your wizard license. 🧌📜',
  'Nope. That answer belongs in the extraction bucket. 🪣🦷',
  'Incorrect. The lecture slide just slammed its laptop shut. 💀💻',
  'That was academically feral. Read the spellbook, apprentice. 📚🔥',
  'Wrong. A confused troll with a hand-wrist film could’ve done better. 🧌🩻',
  'INCORRECT. Professor Lin cast ExpelliGrade-us. 🪄😭',
  'Nope. Your wand just filed for early retirement. 🪄🧳',
  'Tragic. The maxilla displaced downward and forward to escape that choice. 🏃‍♀️🦷',
  'Wrong. The zygomatic process is more stable than your answer. 😤'
];
const streakAwards={3:'🔥 Hat trick! Your wand is warming up.',5:'⚡ 5-streak! The owls are gossiping about you.',10:'🐉 10-streak! Tiny dragon unlocked.',20:'👑 20-streak! Grand Molar Mage behavior.'};
function escapeHTML(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function sound(ok=true){
  if(!soundOn) return;
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const now=ctx.currentTime;
    const notes=ok?[523,659,784,1046]:[220,196,155,110];
    notes.forEach((f,n)=>{
      const osc=ctx.createOscillator(); const gain=ctx.createGain();
      osc.type=ok?(n%2?'triangle':'sine'):'sawtooth'; osc.frequency.value=f;
      gain.gain.setValueAtTime(.0001,now+n*.075);
      gain.gain.exponentialRampToValueAtTime(ok?.18:.22,now+n*.075+.02);
      gain.gain.exponentialRampToValueAtTime(.0001,now+n*.075+(ok?.20:.33));
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now+n*.075); osc.stop(now+n*.075+(ok?.22:.35));
    });
    if(!ok){
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type='square'; osc.frequency.setValueAtTime(85,now); osc.frequency.exponentialRampToValueAtTime(45,now+.45);
      gain.gain.setValueAtTime(.09,now); gain.gain.exponentialRampToValueAtTime(.0001,now+.45);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now+.46);
    }
  }catch(e){}
}
function shuffle(){for(let j=order.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[order[j],order[k]]=[order[k],order[j]]}}
function wandBurst(ok=true, mega=false){
  const n=mega?60:(ok?34:24);
  const good=['✨','🪄','🦷','🔮','⭐','🎩','🦉','🃏','💫','🧙‍♀️','🪙'];
  const bad=['💀','🔥','🧌','🪣','🐸','☠️','🧹','🤡','💣','😤'];
  for(let x=0;x<n;x++){
    const p=document.createElement('span');p.className='particle '+(ok?'goodP':'badP');p.textContent=(ok?good:bad)[Math.floor(Math.random()*(ok?good:bad).length)];
    p.style.left=(38+Math.random()*24)+'vw';p.style.top=(34+Math.random()*18)+'vh';
    p.style.setProperty('--dx',(Math.random()*360-180)+'px');p.style.setProperty('--dy',(Math.random()*-280-40)+'px');
    document.body.appendChild(p);setTimeout(()=>p.remove(),1300);
  }
}
function achievement(text){
  const a=document.createElement('div');a.className='achievement';a.textContent=text;document.body.appendChild(a);setTimeout(()=>a.remove(),1900);
}
function updateHUD(){
  $('progress').textContent=`Spell ${i+1}/${order.length}`;
  $('score').textContent=`Score ${score}`;
  $('streak').textContent=`🔥 Streak ${streak}`;
  $('accuracy').textContent=`Accuracy ${totalAnswered?Math.round(score/totalAnswered*100):0}%`;
  $('meterFill').style.width=`${(i/order.length)*100}%`;
  $('manaFill').style.width=`${Math.min(100,streak*10)}%`;
  $('bossHealthFill').style.width=`${Math.max(0,100-(score/order.length*100))}%`;
}
function render(){
  answered=false; const Q=questions[order[i]]; updateHUD();
  $('playerLabel').textContent=`${player} the Question-Slayer`;
  $('badge').textContent=Q.verified==='Verified with caution'?'⚠️ Verified with caution — wording/image mattered':'✅ Lecture-verified spell';
  $('question').textContent=Q.q;
  const box=$('choices'); box.innerHTML='';
  Q.c.forEach((ch,idx)=>{const b=document.createElement('button');b.className='choice';b.textContent=String.fromCharCode(65+idx)+') '+ch;b.onclick=()=>choose(idx);box.appendChild(b)});
  $('feedback').className='feedback hidden'; $('nextBtn').classList.add('hidden');
}
function wrongWhy(Q,idx){return `Your choice, “${escapeHTML(Q.c[idx])},” does not match the lecture-verified key. The correct concept is: ${escapeHTML(Q.why)}`;}
function choose(idx){
  if(answered)return; answered=true; totalAnswered++;
  const Q=questions[order[i]], ok=idx===Q.a;
  document.querySelectorAll('.choice').forEach((el,n)=>{if(n===Q.a)el.classList.add('correct'); if(n===idx&&!ok)el.classList.add('wrong'); el.disabled=true;});
  document.body.classList.add(ok?'screenGood':'screenBad'); setTimeout(()=>document.body.classList.remove('screenGood','screenBad'),500);
  if(ok){score++;streak++;sound(true);wandBurst(true,streak>0&&streak%10===0); if(navigator.vibrate) navigator.vibrate([35,25,35]); if(streakAwards[streak]) achievement(streakAwards[streak]);}
  else{streak=0;sound(false);wandBurst(false); if(navigator.vibrate) navigator.vibrate([140,70,140,70,220]); achievement('💀 Goblin penalty: confidence -2, humility +8');}
  const line=(ok?correctLines:wrongLines)[Math.floor(Math.random()*(ok?correctLines.length:wrongLines.length))];
  $('feedback').className='feedback '+(ok?'good':'bad');
  $('feedback').innerHTML=`<b>${line}</b><br><br><b>Correct answer:</b> ${escapeHTML(Q.c[Q.a])}<br><b>Why the correct answer wins the wand duel:</b> ${escapeHTML(Q.why)}<br>${ok?'':`<b>Why your answer got turned into a frog:</b> ${wrongWhy(Q,idx)}<br>`}<b>Forensic verification status:</b> ${escapeHTML(Q.verified)}<br><b>Lecture slide source used:</b> ${escapeHTML(Q.auditSource || Q.src)}`;
  $('feedback').classList.remove('hidden'); $('nextBtn').classList.remove('hidden'); updateHUD();
}
function next(){i++; if(i>=order.length)finish(); else render();}
async function finish(){
  $('quiz').classList.add('hidden'); $('finish').classList.remove('hidden'); $('meterFill').style.width='100%'; $('bossHealthFill').style.width='0%';
  const pct=Math.round(score/questions.length*100);
  let verdict=pct>=90?'Supreme Archwizard of Occlusion 🧙‍♀️✨':pct>=80?'Certified Molar Mage 🔮🦷':pct>=70?'Apprentice with Dangerous Potential 🪄':'The goblins recommend a lecture reread 📚💀';
  $('finalText').innerHTML=`${escapeHTML(player)}, you scored <b>${score}/${questions.length}</b> (${pct}%).<br><b>${verdict}</b>`;
  $('trophy').textContent=pct>=80?'🏆✨🦷🪄':'📚🧌💀'; wandBurst(pct>=70,true); sound(pct>=70);
  await submitScore(player,score,questions.length,pct); loadScores();
}
async function submitScore(name,score,total,percent){
  const payload={name,score,total,percent};
  try{
    const r=await fetch('/.netlify/functions/scoreboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!r.ok) throw new Error('Netlify function unavailable');
    $('scoreboardStatus').textContent='✅ Score saved to the shared Netlify leaderboard.';
  }catch(e){
    let local=JSON.parse(localStorage.getItem('localScores')||'[]'); local.push({...payload,date:new Date().toISOString()});
    local.sort((a,b)=>b.percent-a.percent||b.score-a.score||new Date(a.date)-new Date(b.date)); localStorage.setItem('localScores',JSON.stringify(local.slice(0,100)));
    $('scoreboardStatus').textContent='⚠️ Shared scoreboard not reachable. Your score was saved on this browser only. If this is already on Netlify, open /.netlify/functions/scoreboard — 404 means the function did not deploy; 500 means the function/storage failed.';
  }
}
async function loadScores(){
  let scores=[], shared=false;
  try{const r=await fetch('/.netlify/functions/scoreboard',{cache:'no-store'}); if(!r.ok)throw new Error('no shared scores'); const data=await r.json(); scores=data.scores||[]; shared=true;}catch(e){scores=JSON.parse(localStorage.getItem('localScores')||'[]');}
  $('scoreboardStatus').textContent=shared?'🌍 Shared Netlify leaderboard is connected. Rankings are visible to everyone using the deployed link.':'💻 Shared leaderboard is NOT connected. Drag-and-drop/manual ZIP deploy often does not build Netlify Functions. Deploy through Git or Netlify CLI, then test /.netlify/functions/scoreboard.';
  if(!scores.length){$('scoreboard').innerHTML='<p>No scores yet. Be the first wizard menace. 🧙‍♂️</p>';return;}
  $('scoreboard').innerHTML=scores.slice(0,20).map((s,n)=>`<div class="scoreRow"><span class="rank">#${n+1}</span><span>${escapeHTML(s.name)}</span><span>${Number(s.percent)||0}%</span><span>${Number(s.score)||0}/${Number(s.total)||0}</span><span>${s.date?new Date(s.date).toLocaleDateString():''}</span></div>`).join('');
}
function auditStats(){const caution=questions.filter(q=>q.verified==='Verified with caution').length; $('auditStats').innerHTML=`<div class="auditBox"><b>${questions.length}</b> unique questions loaded<br><b>${questions.length-caution}</b> lecture-verified directly<br><b>${caution}</b> verified with caution because wording/images/TQ recall required extra care<br><b>0</b> intentional duplicates</div>`;}
function startGame(){
  const name=$('playerName').value.trim();
  if(!name){$('nameWarning').classList.remove('hidden');$('playerName').classList.add('shakeInput');sound(false);if(navigator.vibrate)navigator.vibrate([120,60,120]);setTimeout(()=>$('playerName').classList.remove('shakeInput'),500);return;}
  player=name; $('nameWarning').classList.add('hidden'); $('start').classList.add('hidden'); $('finish').classList.add('hidden'); $('quiz').classList.remove('hidden');
  i=0; score=0; streak=0; totalAnswered=0; achievement(`🧙 Welcome, ${player}! Duel begins.`); render();
}
$('startBtn').onclick=startGame;
$('playerName').addEventListener('keydown',e=>{if(e.key==='Enter')startGame();});
$('shuffleBtn').onclick=()=>{shuffle();$('shuffleBtn').textContent='Shuffled! Chaos activated 🎲';achievement('🎲 Chaos deck shuffled. May the molars forgive you.');};
$('soundBtn').onclick=()=>{soundOn=!soundOn;$('soundBtn').textContent=soundOn?'Sound: ON 🔊':'Sound: OFF 🔇';};
$('nextBtn').onclick=next; $('restartBtn').onclick=()=>{$('finish').classList.add('hidden');$('start').classList.remove('hidden');};
loadScores(); auditStats(); setInterval(()=>wandBurst(true,false),9000);
