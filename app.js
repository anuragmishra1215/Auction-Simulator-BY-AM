import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getDatabase, ref, get, set, update, remove, onValue, runTransaction, push } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
import { PLAYERS } from './players.js';

const PLAYER_LIST = PLAYERS.map(p => Array.isArray(p) ? {name:p[0],country:p[1]} : p);

const PLAYER_RATINGS = {
  "Virat Kohli":      {rating:99,captaincy:92},
  "MS Dhoni":         {rating:97,captaincy:99},
  "Sachin Tendulkar": {rating:99,captaincy:90},
  "Rohit Sharma":     {rating:98,captaincy:98},
  "Suresh Raina":     {rating:89,captaincy:84},
  "KL Rahul":         {rating:92,captaincy:86},
  "Shubman Gill":     {rating:93,captaincy:85},
  "Ishan Kishan":     {rating:83,captaincy:70},
  "Rajat Patidar":    {rating:78,captaincy:65},
  "Abhishek Sharma":  {rating:84,captaincy:72},
  "Jasprit Bumrah":   {rating:98,captaincy:80},
  "Cheteshwar Pujara":{rating:88,captaincy:75},
  "Hardik Pandya":    {rating:93,captaincy:88},
  "Ravindra Jadeja":  {rating:96,captaincy:82},
  "R Ashwin":         {rating:96,captaincy:88},
  "Kuldeep Yadav":    {rating:88,captaincy:70},
  "Bhuvneshwar Kumar":{rating:88,captaincy:78},
  "Ishant Sharma":    {rating:85,captaincy:68},
  "Umesh Yadav":      {rating:82,captaincy:65},
  "Yuvraj Singh":     {rating:95,captaincy:80},
  "Rishabh Pant":     {rating:92,captaincy:88},
  "Shreyas Iyer":     {rating:91,captaincy:92},
  "Sanju Samson":     {rating:90,captaincy:84},
  "Arshdeep Singh":   {rating:87,captaincy:70},
  "Mohammed Siraj":   {rating:88,captaincy:72},
  "Yuzvendra Chahal": {rating:89,captaincy:70},
  "Manish Pandey":    {rating:82,captaincy:72},
  "Gautam Gambhir":   {rating:90,captaincy:93},
  "Zaheer Khan":      {rating:89,captaincy:80},
  "Harbhajan Singh":  {rating:90,captaincy:84},

  "AB de Villiers":   {rating:99,captaincy:85},
  "Hashim Amla":      {rating:96,captaincy:88},
  "Faf du Plessis":   {rating:93,captaincy:92},
  "Kagiso Rabada":    {rating:94,captaincy:75},
  "Imran Tahir":      {rating:89,captaincy:68},
  "Quinton de Kock":  {rating:92,captaincy:82},
  "David Miller":     {rating:88,captaincy:75},
  "Heinrich Klaasen": {rating:92,captaincy:78},
  "Chris Morris":     {rating:82,captaincy:68},
  "Marco Jansen":     {rating:87,captaincy:72},
  "JP Duminy":        {rating:89,captaincy:82},

  "Brendon McCullum": {rating:93,captaincy:90},
  "Martin Guptill":   {rating:88,captaincy:74},
  "Tom Latham":       {rating:88,captaincy:88},
  "Trent Boult":      {rating:93,captaincy:78},
  "Matt Henry":       {rating:84,captaincy:68},
  "Tim Southee":      {rating:92,captaincy:82},
  "Mitchell Santner": {rating:88,captaincy:84},
  "Devon Conway":     {rating:91,captaincy:75},
  "Daryl Mitchell":   {rating:91,captaincy:80},
  "Kane Williamson":  {rating:98,captaincy:95},

  "Jos Buttler":      {rating:96,captaincy:84},
  "Jason Roy":        {rating:88,captaincy:70},
  "Dawid Malan":      {rating:84,captaincy:72},
  "Jofra Archer":     {rating:86,captaincy:68},
  "Ben Stokes":       {rating:97,captaincy:92},
  "Jonny Bairstow":   {rating:92,captaincy:78},
  "Moeen Ali":        {rating:91,captaincy:84},
  "Sam Curran":       {rating:88,captaincy:80},
  "Eoin Morgan":      {rating:89,captaincy:96},
  "Will Jacks":       {rating:82,captaincy:68},

  "Shakib Al Hasan":  {rating:97,captaincy:94},
  "Mushfiqur Rahim":  {rating:91,captaincy:86},
  "Mahmudullah":      {rating:88,captaincy:88},

  "Lasith Malinga":   {rating:96,captaincy:84},
  "Dushmantha Chameera":{rating:83,captaincy:68},
  "Kumar Sangakkara": {rating:98,captaincy:90},
  "Mahela Jayawardene":{rating:97,captaincy:92},

  "Babar Azam":       {rating:97,captaincy:93},
  "Mohammad Rizwan":  {rating:92,captaincy:88},
  "Shaheen Afridi":   {rating:94,captaincy:82},
  "Mohammad Amir":    {rating:86,captaincy:75},
  "Haris Rauf":       {rating:87,captaincy:70},
  "Hasan Ali":        {rating:86,captaincy:72},

  "Chris Gayle":      {rating:97,captaincy:82},
  "Darren Sammy":     {rating:84,captaincy:96},
  "Jason Holder":     {rating:91,captaincy:88},
  "Dwayne Bravo":     {rating:89,captaincy:82},
  "Sunil Narine":     {rating:92,captaincy:74},
  "Andre Russell":    {rating:93,captaincy:75},
  "Kieron Pollard":   {rating:88,captaincy:88},
  "Lendl Simmons":    {rating:82,captaincy:68},

  "David Warner":     {rating:97,captaincy:90},
  "Travis Head":      {rating:90,captaincy:78},
  "Pat Cummins":      {rating:96,captaincy:96},
  "Mitchell Starc":   {rating:97,captaincy:84},
  "Josh Hazlewood":   {rating:92,captaincy:76},
  "Matthew Wade":     {rating:82,captaincy:75},
  "Glenn Maxwell":    {rating:95,captaincy:80},
  "Aaron Finch":      {rating:88,captaincy:90},
  "Steve Smith":      {rating:98,captaincy:95},
  "Marcus Stoinis":   {rating:85,captaincy:72},
  "Chris Lynn":       {rating:76,captaincy:60},
  "Jake Fraser-McGurk":{rating:75,captaincy:60},
  "James Faulkner":   {rating:82,captaincy:68},

  "Lungi Ngidi":      {rating:84,captaincy:68},
  "Tristan Stubbs":   {rating:83,captaincy:65},
  "Rilee Rossouw":    {rating:82,captaincy:66},
  "Harshit Rana":     {rating:75,captaincy:60},
  "Shikhar Dhawan":   {rating:90,captaincy:88}
};

const AUCTION_TRACKS = [
  {id:'icc-world-cup-2015',file:'icc-world-cup-2015.mp3',label:'ICC World Cup 2015 Theme'}, {id:'waka-waka',file:'waka-waka.mp3',label:'Waka Waka'},
  {id:'orange-army',file:'orange-army.mp3',label:'Go Go Orange Army'}, {id:'india-ka-tyohaar',file:'india-ka-tyohaar.mp3',label:'India Ka Tyohaar'},
  {id:'veer-jawano-ka',file:'veer-jawano-ka.mp3',label:'Ye Khel Hai Veer Jawano Ka'}, {id:'csk-theme',file:'csk-theme.mp3',label:'CSK Theme Music'},
  {id:'kkr-hai-taiyaar',file:'kkr-hai-taiyaar.mp3',label:'KKR Hai Taiyaar'}, {id:'rcb-anthem',file:'rcb-anthem.mp3',label:'RCB Anthem'},
  {id:'mumbai-indians',file:'mumbai-indians.mp3',label:'Mumbai Indians Theme'}, {id:'ipl-stadium-song',file:'ipl-stadium-song.mp3',label:'New IPL Stadium Song'}
];

function shuffledTrackIds(avoidFirst=null){const ids=AUCTION_TRACKS.map(t=>t.id);for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]]}if(avoidFirst&&ids.length>1&&ids[0]===avoidFirst){const j=1+Math.floor(Math.random()*(ids.length-1));[ids[0],ids[j]]=[ids[j],ids[0]]}return ids}

const $ = (id) => document.getElementById(id);
const flags = {India:'🇮🇳','South Africa':'🇿🇦','New Zealand':'🇳🇿',England:'🏴',Bangladesh:'🇧🇩','Sri Lanka':'🇱🇰',Pakistan:'🇵🇰','West Indies':'🏏',Australia:'🇦🇺'};
const appReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('YOUR_') && firebaseConfig.databaseURL;
let auth, db, uid = '', roomCode = '', isHost = false, roomState = null, members = {}, selectedPlayerTab = 'players', applying = Promise.resolve(), unsub = [];
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function toast(msg, error=false){const el=$('toast');el.textContent=msg;el.style.background=error?'#ff8f8f':'var(--lime)';el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3200)}
function say(id,msg,error=false){$(id).textContent=msg;$(id).className=error?'statusline error':'statusline'}
function page(id){document.querySelectorAll('.screen').forEach(e=>e.classList.remove('on'));$(id).classList.add('on')}
function cleanCode(s){return (s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)}
function randCode(){let s='';for(let i=0;i<6;i++)s+=alphabet[Math.floor(Math.random()*alphabet.length)];return s}
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}
function cash(lakh){if(lakh<100)return '₹'+(lakh/100).toFixed(2).replace(/0$/,'')+' crore';return '₹'+(lakh/100).toFixed(Number.isInteger(lakh/100)?0:2)+' crore'}
function currentPlayer(s=roomState){if(!s||!s.order||s.currentIndex>=s.order.length)return null;return PLAYER_LIST[s.order[s.currentIndex]]||null}
function showConnection(text,ok){$('connection').textContent=text;$('connection').style.color=ok?'var(--lime)':'var(--amber)'}
function resetListeners(){unsub.forEach(fn=>fn());unsub=[]}
function setRoom(code,host){resetListeners();roomCode=code;isHost=host;roomState=null;members={};try{sessionStorage.setItem('cricketAuctionRoomCode',code)}catch{}listenRoom();$('codeDisplay').textContent=code;$('gameCode').textContent=code;page('lobby')}
function roomPath(part=''){return `rooms/${roomCode}${part?'/'+part:''}`}

// --- Reliable Animation Trigger System ---
let lastProcessedEventId = null;

function checkAndTriggerSaleAnimation(s) {
  if (!s) return;

  // Check latest event marker from state
  const activeEvent = s.lastSale || s.lastUnsold;
  if (!activeEvent || activeEvent.eventId === lastProcessedEventId) return;

  lastProcessedEventId = activeEvent.eventId;

  if (activeEvent.type === 'sold') {
    const teamName = s.teams[activeEvent.uid]?.team || 'Team';
    triggerSoldSaleAnimation(activeEvent.playerName, teamName, cash(activeEvent.price));
  } else if (activeEvent.type === 'unsold') {
    triggerUnsoldAnimation(activeEvent.playerName);
  }
}

function triggerSoldSaleAnimation(playerName, teamName, finalPriceStr) {
  const overlay = document.getElementById('celebrationOverlay');
  const content = document.getElementById('soldAnnouncementContent');
  if (!overlay || !content) return;

  content.style.color = 'var(--lime)';
  content.innerHTML = `SOLD TO ${teamName.toUpperCase()}!<br><span style="font-size: 0.5em; color: #fff;">${playerName} · ${finalPriceStr}</span>`;
  overlay.classList.add('active');
  animateCardToTarget('currentProfile', 'selectedRoster');

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 2200);
}

function triggerUnsoldAnimation(playerName) {
  const overlay = document.getElementById('celebrationOverlay');
  const content = document.getElementById('soldAnnouncementContent');
  if (!overlay || !content) return;

  content.style.color = '#FF4444';
  content.innerHTML = `UNSOLD<br><span style="font-size: 0.5em; color: #aaa;">${playerName} goes abegging</span>`;
  overlay.classList.add('active');

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 1800);
}

function animateCardToTarget(sourceId, targetId) {
  const sourceEl = document.getElementById(sourceId);
  const targetEl = document.getElementById(targetId);
  if (!sourceEl || !targetEl) return;

  const startRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'flying-card';
  flyer.style.left = `${startRect.left}px`;
  flyer.style.top = `${startRect.top}px`;
  flyer.innerHTML = sourceEl.innerHTML;
  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    flyer.style.left = `${targetRect.left + (targetRect.width / 3)}px`;
    flyer.style.top = `${targetRect.top + 20}px`;
    flyer.style.transform = 'scale(0.15)';
    flyer.style.opacity = '0.2';
  });

  setTimeout(() => {
    flyer.remove();
  }, 850);
}

function listenRoom(){
  unsub.push(onValue(ref(db, `rooms/${roomCode}/chat`), snap => {
    const msgs = snap.val() || {};
    const container = $('chatMessages');
    
    const entries = Object.values(msgs).sort((a, b) => a.timestamp - b.timestamp);
    
    if (entries.length === 0) {
      container.innerHTML = '<p class="help" style="margin: auto;">No messages yet. Say hello!</p>';
      return;
    }

    container.innerHTML = entries.map(m => `
      <div style="word-break: break-word;">
        <b style="color: var(--lime);">${escapeHtml(m.sender)}:</b> ${escapeHtml(m.text)}
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }, err => console.error(err)));

  unsub.push(onValue(ref(db,roomPath('members')),snap=>{members=snap.val()||{};drawLobby();drawGame();},err=>say('message','Could not read room members: '+err.message,true)));
  
  unsub.push(onValue(ref(db,roomPath('state')),snap=>{
    roomState=snap.val();
    if(!roomState)return;
    checkAndTriggerSaleAnimation(roomState);
    if(isHost&&roomState.status==='auction'&&allTeamsComplete(roomState)){runTransaction(ref(db,roomPath('state')),s=>s&&s.status==='auction'&&allTeamsComplete(s)?{...s,status:'complete',currentIndex:s.order?.length||0,currentBid:0,highBidder:null,passed:{}}:undefined,{applyLocally:false}).catch(e=>say('gameMessage',friendly(e),true))}
    drawLobby();
    drawGame();
    if(roomState.status==='auction'||roomState.status==='complete')page('game');else page('lobby');
    if(isHost&&roomState.status==='auction')get(ref(db,roomPath('actions'))).then(x=>processActions(x.val()||{})).catch(e=>say('gameMessage',friendly(e),true));
  },err=>say('message','Could not read room: '+err.message,true)));

  if(isHost)unsub.push(onValue(ref(db,roomPath('actions')),snap=>{applying=applying.then(()=>processActions(snap.val()||{})).catch(err=>say('gameMessage','Could not process a bid: '+err.message,true));}));
}

async function ensureAuth(){if(!appReady)throw new Error('Firebase setup is not complete. Follow the setup steps in README.txt.');if(!auth){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getDatabase(app)}if(auth.currentUser){uid=auth.currentUser.uid;return}await new Promise((resolve,reject)=>{const off=onAuthStateChanged(auth,u=>{off();if(u){uid=u.uid;resolve()}else signInAnonymously(auth).then(c=>{uid=c.user.uid;resolve()}).catch(reject)},reject)});}
async function restoreRoom(){let code='';try{code=cleanCode(sessionStorage.getItem('cricketAuctionRoomCode'))}catch{}if(code.length!==6)return;try{const snap = await get(ref(db,'rooms/'+code));const room = snap.val();if(!room||!room.members?.[uid]){sessionStorage.removeItem('cricketAuctionRoomCode');return}setRoom(code,room.hostUid===uid);showConnection('Live',true)}catch(e){showConnection('Reconnecting',false)}}

async function createRoom(){try{await ensureAuth();const name=$('hostName').value.trim(),team=$('hostTeam').value.trim();if(!name||!team)return say('message','Enter your name and team name.',true);let code='';for(let i=0;i<8;i++){const tryCode=randCode(),exists=await get(ref(db,'roomIndex/'+tryCode));if(!exists.exists()){code=tryCode;break}}if(!code)throw new Error('Could not reserve a room code. Try again.');const initial={hostUid:uid,status:'lobby',budget:8000,bidStep:50,order:[],currentIndex:0,currentBid:0,highBidder:null,passed:{},sold:{},skipped:{},teams:{[uid]:{uid,name,team,budget:8000,roster:[]}},processed:{},openedAt:Date.now()};const seed={hostUid:uid,members:{[uid]:{name,team}},state:initial};await set(ref(db,'rooms/'+code),seed);try{await set(ref(db,'roomIndex/'+code),uid)}catch(e){await remove(ref(db,'rooms/'+code));throw e}setRoom(code,true);showConnection('Connected',true)}catch(e){say('message',friendly(e),true)}}

async function joinRoom(){try{await ensureAuth();const code=cleanCode($('roomCodeInput').value),name=$('joinName').value.trim(),team=$('joinTeam').value.trim();if(code.length!==6||!name||!team)return say('message','Enter the 6-character room code, your name, and team name.',true);const roomSnap=await get(ref(db,'rooms/'+code)),room=roomSnap.val();if(!room)throw new Error('Room code not found. Check the code and try again.');const memberRef=ref(db,'rooms/'+code+'/members/'+uid),existing=await get(memberRef);if(!existing.exists()){const rosterSnap=await get(ref(db,'rooms/'+code+'/members'));if(Object.keys(rosterSnap.val()||{}).length>=8)throw new Error('This room already has eight players.');const result=await runTransaction(memberRef,cur=>cur===null?{name,team}:undefined,{applyLocally:false});if(!result.committed){const current=await get(memberRef);if(!current.exists())throw new Error('This room is full, closed, or the auction has already started.')}}setRoom(code,room.hostUid===uid);showConnection('Connected',true)}catch(e){say('message',friendly(e),true)}}

function friendly(e){const m=e?.message||String(e);if(m.includes('permission_denied')||m.toLowerCase().includes('permission'))return 'Firebase blocked this action. Check that Anonymous sign-in is enabled and database.rules.json has been published.';if(m.toLowerCase().includes('network'))return 'Could not reach the live game service. Check your internet connection.';return m}
function drawLobby(){if(!roomCode)return;const entries=Object.entries(members),started=roomState?.status==='auction'||roomState?.status==='complete';$('lobbyPlayers').innerHTML=entries.map(([id,p],i)=>`<div class="team"><div><b>${escapeHtml(p.team)}</b><small>${id===roomState?.hostUid?' · Host':''}</small></div><span class="grow">${escapeHtml(p.name)}</span><span class="pill">Joined</span></div>`).join('')||'<p class="help">Waiting for players…</p>';$('startAuction').style.display=isHost?'inline-block':'none';$('startAuction').textContent=started?(roomState?.status==='complete'?'View results':'Open auction'):'Start auction';$('startAuction').disabled=!isHost||(!started&&(entries.length<2||entries.length>8||roomState?.status!=='lobby'));$('leaveLobby').textContent=isHost?'Close room':'Leave room';if(roomState?.status==='lobby')say('lobbyMessage',`${entries.length} of 8 players joined. ${entries.length<2?'Need at least one more player.':'Ready to start.'}`)}

async function startAuction(){try{if(roomState?.status==='auction'||roomState?.status==='complete'){drawGame();page('game');return}const teams={};for(const[id,m]of Object.entries(members))teams[id]={uid:id,name:m.name,team:m.team,budget:8000,roster:[]};const order=PLAYER_LIST.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}say('lobbyMessage','Starting auction…');const result=await runTransaction(ref(db,roomPath('state')),s=>{if(!s||s.status!=='lobby'||Object.keys(teams).length<2||Object.keys(teams).length>8)return;const musicOrder=shuffledTrackIds();return {...s,status:'auction',teams,order,currentIndex:0,currentBid:0,highBidder:null,passed:{},sold:{},skipped:{},processed:{},musicOrder,musicIndex:0,musicTrack:musicOrder[0],startedAt:Date.now()}},{applyLocally:false});if(!result.committed){const latest=await get(ref(db,roomPath('state')));roomState=latest.val();if(roomState?.status==='auction'||roomState?.status==='complete'){drawGame();page('game');return}drawLobby();say('lobbyMessage','Could not start. Confirm 2–8 players are joined, then try again.',true);return}roomState=result.snapshot.val();drawLobby();drawGame();page('game')}catch(e){say('lobbyMessage',friendly(e),true)}}

async function sendChatMessage() {
  const input = $('chatInput');
  const text = input.value.trim();
  if(!text || !roomCode) return;

  const myMember = members[uid] || { name: 'Player', team: 'Team' };
  const senderName = `${myMember.team} (${myMember.name})`;

  try {
    const chatRef = ref(db, `rooms/${roomCode}/chat`);
    const newMsgRef = push(chatRef);
    await set(newMsgRef, {
      sender: senderName,
      text: text,
      timestamp: Date.now()
    });
    input.value = '';
  } catch(e) {
    toast('Could not send message.', true);
  }
}
function rosterCount(team){return Array.isArray(team?.roster)?team.roster.length:0}
function allTeamsComplete(s){const ids=Object.keys(s?.teams||{});return ids.length>0&&ids.every(id=>rosterCount(s.teams[id])>=11)}

function fillIncompleteTeams(s){
  const available = [];
  Object.keys(s.skipped || {}).forEach(id=>{
    available.push(Number(id));
  });

  for(const team of Object.values(s.teams || {})){
    while((team.roster?.length || 0) < 11 && available.length){
      const randomIndex = Math.floor(Math.random() * available.length);
      const playerId = available.splice(randomIndex,1)[0];
      if(!Array.isArray(team.roster)){
        team.roster = [];
      }
      team.roster.push({
        playerId,
        name: PLAYER_LIST[playerId].name,
        price: 0,
        autoFilled: true
      });
    }
  }
  return s;
}

function nextPlayer(s){
  if(allTeamsComplete(s)){
    s.status='complete';
    s.currentIndex=s.order.length;
    s.currentBid=0;
    s.highBidder=null;
    s.passed={};
    return s;
  }
  s.currentIndex+=1;
  s.currentBid=0;
  s.highBidder=null;
  s.passed=Object.fromEntries(Object.entries(s.teams||{}).filter(([,team])=>rosterCount(team)>=11).map(([id])=>[id,true]));
  if(s.currentIndex>=s.order.length){
    fillIncompleteTeams(s);
    s.status='complete';
  }
  return s;
}

function finishPlayer(s, skip) {
  const playerId = s.order[s.currentIndex], buyer = s.highBidder;
  if (skip || buyer === null) {
    s.skipped[playerId] = true;
    s.lastUnsold = {
      eventId: 'unsold-' + playerId + '-' + Date.now(),
      type: 'unsold',
      playerId,
      playerName: PLAYER_LIST[playerId].name
    };
    delete s.lastSale;
  } else {
    const t = s.teams[buyer];
    if (!t || t.budget < s.currentBid || (Array.isArray(t.roster) ? t.roster.length : 0) >= 11) {
      s.skipped[playerId] = true;
      s.lastUnsold = {
        eventId: 'unsold-' + playerId + '-' + Date.now(),
        type: 'unsold',
        playerId,
        playerName: PLAYER_LIST[playerId].name
      };
      delete s.lastSale;
    } else {
      if (!Array.isArray(t.roster)) t.roster = [];
      t.budget -= s.currentBid;
      t.roster.push({
        playerId,
        name: PLAYER_LIST[playerId].name,
        price: s.currentBid
      });
      delete s.lastUnsold;
      s.lastSale = {
        eventId: 'sale-' + playerId + '-' + Date.now(),
        type: 'sold',
        playerId,
        uid: buyer,
        price: s.currentBid,
        playerName: PLAYER_LIST[playerId].name
      };
      s.sold[playerId] = {
        uid: buyer,
        price: s.currentBid
      };
    }
  }
  return nextPlayer(s);
}

function resolveIfDone(s){
  const teamIds = Object.keys(s.teams || {});
  if(allTeamsComplete(s)){s.status='complete';s.currentIndex=s.order.length;s.currentBid=0;s.highBidder=null;s.passed={};return s}
  for(const id of teamIds)if(rosterCount(s.teams[id])>=11)s.passed[id]=true;
  const activeIds=teamIds.filter(id=>rosterCount(s.teams[id])<11);
  const done=activeIds.every(id=>id===s.highBidder||s.passed?.[id]);
  if(done)return finishPlayer(s,s.highBidder===null);
  return s;
}

async function processActions(actions){
  if(!isHost||!roomState||roomState.status!=='auction')return;
  for(const[id,a]of Object.entries(actions).sort((x,y)=>(x[1]?.createdAt||0)-(y[1]?.createdAt||0))){
    if(!a?.nonce||roomState.processed?.[id]===a.nonce)continue;
    const result=await runTransaction(ref(db,roomPath('state')),s=>{
      if(!s||s.status!=='auction'||s.processed?.[id]===a.nonce)return;
      const updated={...s,teams:{...s.teams},passed:{...(s.passed||{})},processed:{...(s.processed||{})},sold:{...(s.sold||{})},skipped:{...(s.skipped||{})}};
      const team=updated.teams[id];
      updated.processed[id]=a.nonce;
      if(!team)return updated;
      const amount=updated.currentBid?updated.currentBid+updated.bidStep:updated.bidStep;
      
      if (a.type === 'bid' && id !== updated.highBidder && !updated.passed[id]) {
        const currentRoster = Array.isArray(team.roster) ? team.roster : [];
        const rosterCount = currentRoster.length;
        if (rosterCount < 11 && team.budget >= amount) {
          const playersNeeded = 11 - rosterCount;
          const futureBudget = team.budget - amount;
          const remainingSlotsAfterThisBid = Math.max(0, playersNeeded - 1);
          const reservedNeeded = remainingSlotsAfterThisBid * 50;
          if (futureBudget >= reservedNeeded) {
            updated.currentBid = amount;
            updated.highBidder = id;
            return resolveIfDone(updated);
          }
        }
      }
      if(a.type==='pass'&&id!==updated.highBidder){
        updated.passed[id]=true;
        return resolveIfDone(updated);
      }
      return updated;
    },{applyLocally:false});
    if(result.committed)roomState=result.snapshot.val();
  }
  drawGame();
}

async function sendAction(type){
  if(!roomCode||!roomState||roomState.status!=='auction')return toast('Auction is not running yet.',true);
  const my=roomState.teams?.[uid];
  if(!my)return toast('Your team is not in this room.',true);
  const nonce=uid+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  try{
    await set(ref(db,roomPath('actions/'+uid)),{type,nonce,createdAt:Date.now()});
    say('gameMessage',type==='bid'?'Bid sent. Waiting for update.':'Pass sent. Waiting for update.');
  }catch(e){say('gameMessage',friendly(e),true)}
}

async function advanceAuctionMusic(){
  if(!isHost||roomState?.status!=='auction')return;
  const expected=roomState.musicTrack||auctionMusic.dataset.track;
  await runTransaction(ref(db,roomPath('state')),s=>{
    if(!s||s.status!=='auction'||(s.musicTrack&&s.musicTrack!==expected))return;
    let order=Array.isArray(s.musicOrder)&&s.musicOrder.length?s.musicOrder.slice():[];
    let index=Number.isInteger(s.musicIndex)?s.musicIndex+1:0;
    if(!order.length){order=shuffledTrackIds(expected);index=0}
    else if(index>=order.length){order=shuffledTrackIds(order[order.length-1]);index=0}
    return {...s,musicOrder:order,musicIndex:index,musicTrack:order[index]}
  },{applyLocally:false});
}

async function undoLastSale(){
  try{
    await runTransaction(ref(db, roomPath('state')), s => {
      if(!s || !s.lastSale) return;
      const sale = s.lastSale;
      const team = s.teams?.[sale.uid];
      if(!team) return s;
      const idx = (team.roster || []).findIndex(p => p.playerId === sale.playerId);
      if(idx >= 0){ team.roster.splice(idx,1); }
      team.budget += sale.price;
      delete s.sold[sale.playerId];
      s.currentIndex = Math.max(0, s.currentIndex - 1);
      s.status = 'auction';
      s.currentBid = 0;
      s.highBidder = null;
      s.passed = {};
      delete s.lastSale;
      return s;
    },{applyLocally:false});
    toast('Last sale undone');
  }catch(e){say('gameMessage', friendly(e), true)}
}

async function hostClose(skipOnly=false){
  if(!isHost)return;
  try{
    const result=await runTransaction(ref(db,roomPath('state')),s=>{
      if(!s||s.status!=='auction')return;
      if(skipOnly&&s.currentBid>0)return;
      const next={...s,teams:{...s.teams},passed:{...(s.passed||{})},sold:{...(s.sold||{})},skipped:{...(s.skipped||{})}};
      return finishPlayer(next,skipOnly||next.highBidder===null)
    },{applyLocally:false});
    if(!result.committed&&skipOnly)toast('Skip is only available when no one has bid.',true);
  }catch(e){say('gameMessage',friendly(e),true)}
}

function playerPosition(id,s=roomState){return s?.order?.indexOf(id)??-1}
function playerStatus(id,s=roomState){if(s?.sold?.[id])return'sold';if(s?.skipped?.[id]||playerPosition(id,s)<(s?.currentIndex??0))return'passed';return'remaining'}

function drawGame(){
  if(!roomState||!roomCode)return;

  if (roomState.status === 'complete') {
    drawPostAuctionResults();
    return;
  }

  const s=roomState, teams=s.teams||{}, p=currentPlayer(s);
  const sharedTrack=AUCTION_TRACKS.find(t=>t.id===s.musicTrack)||AUCTION_TRACKS[0];
  
  if(auctionMusic.dataset.track!==sharedTrack.id){
    const resume=resumeAuctionMusic||!auctionMusic.paused;
    resumeAuctionMusic=false;
    auctionMusic.pause();
    auctionMusic.src='./'+sharedTrack.file;
    auctionMusic.dataset.track=sharedTrack.id;
    auctionMusic.load();
    $('musicTrackName').textContent='Now playing: '+sharedTrack.label;
    if(resume)auctionMusic.play().catch(()=>$('musicState').textContent='Tap Play to continue')
  }
  
  if(s.status!=='auction')auctionMusic.pause();
  
  $('teamSummary').innerHTML=Object.entries(teams).map(([id,t])=>`<div class="team"><div><b>${escapeHtml(t.team)}</b><small>${id===uid?' · You':''} · ${t.roster?.length||0}/11</small></div><b class="lime">${cash(t.budget||0)}</b></div>`).join('');
  
  const opts=Object.entries(teams).map(([id,t])=>`<option value="${id}" ${id===uid?'selected':''}>${id===uid?'Your team: ':''}${escapeHtml(t.team)}</option>`).join('');
  $('teamSelect').innerHTML=opts;
  $('viewTeam').innerHTML=opts;
  $('myTeamAction').innerHTML=opts;
  $('myTeamAction').value=uid;

  const selected=teams[$('teamSelect'].value||uid];
  $('selectedRoster').innerHTML=selected?.roster?.length?selected.roster.map(x=>`<div class="entry"><b class="grow">${escapeHtml(x.name)}</b><b class="lime">${cash(x.price)}</b></div>`).join(''):'<p class="help">No players bought yet.</p>';

  if(!p){
    $('currentProfile').innerHTML=`<div class="eyebrow">${s.status==='complete'?'AUCTION COMPLETE':'Waiting for auction to start'}</div><h2>${s.status==='complete'?'Auction complete':'Players will appear here'}</h2>`;
    $('auctionCount').textContent=s.status==='complete'?'Complete':Object.keys(teams).length+' teams joined';
    $('currentPrice').textContent='—';
    $('currentLeader').textContent='';
    $('bidButton').disabled=true;$('passButton').disabled=true;$('skipButton').disabled=true;$('sellButton').disabled=true;
    return;
  }

  const pid=s.order[s.currentIndex], soldCount=Object.keys(s.sold||{}).length+Object.keys(s.skipped||{}).length;
  $('auctionCount').textContent=(soldCount+1)+' / '+PLAYER_LIST.length+' offered';
  $('turnState').textContent=(teams[uid]?.roster?.length||0)>=11?'Team complete':s.passed?.[uid]?'You passed this player':s.highBidder===uid?'You are leading':'Bidding open';
  
  $('currentProfile').innerHTML=`<img class="player-photo" src="${escapeHtml(p.photo||'')}" alt="${escapeHtml(p.name)}" loading="eager"><div class="flag">${flags[p.country]||'🏏'}</div><h2>${escapeHtml(p.name)}</h2><span class="role-tag">${escapeHtml(p.role||'Batsman')}</span><div>${escapeHtml(p.country)} · International career</div><div class="stats"><div class="stat"><b>${Number(p.matches||0).toLocaleString()}</b><small>Matches</small></div><div class="stat"><b>${Number(p.runs||0).toLocaleString()}</b><small>Runs</small></div><div class="stat"><b>${Number(p.wickets||0).toLocaleString()}</b><small>Wickets</small></div><div class="stat"><b>${Number(p.hundreds||0).toLocaleString()}</b><small>100s</small></div></div><a class="source-link" href="${escapeHtml(p.source||'#')}" target="_blank" rel="noopener">Stats & photo: Cricbuzz</a>`;

  const amount=s.currentBid?s.currentBid+s.bidStep:s.bidStep;
  $('currentPrice').textContent=s.currentBid?cash(s.currentBid):'₹50 lakh';
  $('currentLeader').textContent=s.highBidder?`${escapeHtml(teams[s.highBidder]?.team||'A team')} is leading`:'Opening bid · ₹50 lakh';

  const mine = teams[uid], myRoster = Array.isArray(mine?.roster) ? mine.roster : [];
  const teamComplete = myRoster.length >= 11;

  const playersNeeded = 11 - myRoster.length;
  const futureBudget = (mine?.budget || 0) - amount;
  const remainingSlotsAfterThisBid = Math.max(0, playersNeeded - 1);
  const reservedNeeded = remainingSlotsAfterThisBid * 50;
  const hasEnoughWithReserve = futureBudget >= reservedNeeded;

  const canAct = !!mine && s.status === 'auction' && !teamComplete && !s.passed?.[uid] && s.highBidder !== uid;

  $('bidButton').style.display = 'inline-block';
  $('passButton').style.display = 'inline-block';
  $('bidButton').textContent = 'Bid ' + cash(amount);
  $('bidButton').disabled = !canAct || (mine?.budget || 0) < amount || teamComplete || !hasEnoughWithReserve;
  $('passButton').disabled=!canAct;
  $('skipButton').disabled=!isHost||s.currentBid>0;
  $('sellButton').disabled=!isHost;
  $('skipButton').style.display=isHost?'inline-block':'none';
  $('sellButton').style.display=isHost?'inline-block':'none';
  $('undoButton').style.display=isHost?'inline-block':'none';

  $('gameMessage').textContent=teamComplete?'Your team has 11 players. Bidding disabled.':isHost?'You are the host.':'Bids update live.';
  drawBattingOrder();
  drawAwards();
}

function drawBattingOrder(){
  const team = roomState?.teams?.[uid];
  if(!team) return;
  const roster = team.roster || [];
  const placeholders = ['Opening Batter','Opening Batter','Top Order','Middle Order','Middle Order','Finisher','Finisher','Bowler','Bowler','Bowler','Bowler'];

  $('battingOrder').innerHTML = Array.from({length:11}, (_,i) => {
    const player = roster[i];
    return `
      <div class="entry">
        <div class="grow">
          ${player ? `<b>${escapeHtml(player.name)}</b>` : `<span style="opacity:.45">${placeholders[i]}</span>`}
        </div>
        <button onclick="movePlayerUp(${i})">⬆</button>
        <button onclick="movePlayerDown(${i})">⬇</button>
      </div>
    `;
  }).join('');
}

window.movePlayerUp = function(i){
  const r = roomState.teams[uid].roster;
  if(i === 0) return;
  [r[i-1], r[i]] = [r[i], r[i-1]];
  drawBattingOrder();
};

window.movePlayerDown = function(i){
  const r = roomState.teams[uid].roster;
  if(i >= r.length - 1) return;
  [r[i], r[i+1]] = [r[i+1], r[i]];
  drawBattingOrder();
};

function drawAwards(){
  if(!roomState) return;
  const sold = roomState.sold || {}, teams = roomState.teams || {};
  let mostExpensive = null, bargain = null;

  Object.entries(sold).forEach(([pid,data])=>{
    const player = PLAYER_LIST[pid];
    if(!player) return;
    const item = { name: player.name, price: data.price };
    if(!mostExpensive || item.price > mostExpensive.price) mostExpensive = item;
    if(!bargain || item.price < bargain.price) bargain = item;
  });

  let highestPurseTeam = '', highestPurse = -1;
  Object.values(teams).forEach(t=>{
    if((t.budget||0) > highestPurse){ highestPurse = t.budget||0; highestPurseTeam = t.team; }
  });

  let fastestTeam = '', fastestCount = -1;
  Object.values(teams).forEach(t=>{
    const count = t.roster?.length || 0;
    if(count > fastestCount){ fastestCount = count; fastestTeam = t.team; }
  });

  $('awardsPanel').innerHTML = `
    <div class="entry">🏆 Most Expensive<br><b>${mostExpensive?.name || '-'}</b> (${mostExpensive ? cash(mostExpensive.price) : '-'})</div>
    <div class="entry">💎 Best Bargain<br><b>${bargain?.name || '-'}</b> (${bargain ? cash(bargain.price) : '-'})</div>
    <div class="entry">💰 Highest Purse<br><b>${highestPurseTeam || '-'}</b> (${highestPurse >= 0 ? cash(highestPurse) : '-'})</div>
    <div class="entry">⚡ Fastest Team<br><b>${fastestTeam || '-'}</b> (${fastestCount}/11)</div>
  `;
}

function calculateTeamScores(teams, playerRatings) {
  const scores = {};
  Object.entries(teams).forEach(([uid, team]) => {
    const roster = team.roster || [];
    let totalPlayerRating = 0;
    
    roster.forEach(p => {
      const stats = playerRatings[p.name] || { rating: 80, captaincy: 70 };
      totalPlayerRating += stats.rating;
    });

    const budgetBonus = Math.floor((team.budget || 0) / 50);
    let captainBonus = 0, viceCaptainBonus = 0;

    if (roster.length > 0) {
      const capStats = playerRatings[roster[0].name] || { rating: 80, captaincy: 70 };
      captainBonus = capStats.captaincy;
    }

    if (roster.length > 1) {
      const vcStats = playerRatings[roster[1].name] || { rating: 80, captaincy: 70 };
      viceCaptainBonus = Math.round(vcStats.captaincy / 2);
    }

    const totalScore = totalPlayerRating + budgetBonus + captainBonus + viceCaptainBonus;

    scores[uid] = { teamName: team.team, playerName: team.name, totalScore, roster };
  });
  return scores;
}

function getLeaderboardRankings(scores) {
  const sortedTeams = Object.entries(scores).sort((a, b) => b[1].totalScore - a[1].totalScore);
  const leaderboard = [];
  let currentRank = 1;

  sortedTeams.forEach(([uid, data], index) => {
    if (index > 0 && data.totalScore === sortedTeams[index - 1][1].totalScore) {
      leaderboard.push({ rank: leaderboard[index - 1].rank, uid, ...data, isJointWinner: true });
    } else {
      leaderboard.push({ rank: currentRank, uid, ...data, isJointWinner: false });
    }
    currentRank++;
  });
  return leaderboard;
}

function getBestBargain(scores, playerRatings) {
  let bestBargains = [];
  let maxRatio = -1;

  Object.entries(scores).forEach(([uid, data]) => {
    data.roster.forEach(player => {
      const stats = playerRatings[player.name] || { rating: 80 };
      const pricePaid = Math.max(player.price, 50);
      const ratio = stats.rating / pricePaid;

      if (ratio > maxRatio) {
        maxRatio = ratio;
        bestBargains = [{ player: player.name, teamName: data.teamName, rating: stats.rating, price: pricePaid }];
      } else if (Math.abs(ratio - maxRatio) < 0.0001) {
        bestBargains.push({ player: player.name, teamName: data.teamName, rating: stats.rating, price: pricePaid });
      }
    });
  });
  return bestBargains;
}

function drawPostAuctionResults() {
  if (roomState?.status !== 'complete') return;

  const scores = calculateTeamScores(roomState.teams, PLAYER_RATINGS);
  const leaderboard = getLeaderboardRankings(scores);
  const bestBargains = getBestBargain(scores, PLAYER_RATINGS);

  let html = `
    <div class="post-auction-container" style="padding: 20px; background: var(--card-bg); border-radius: 12px; margin-top: 10px; text-align: left;">
      <h2>🏆 Final Leaderboard & Awards</h2>
      <p class="help">The auction is complete! Final standings include player strength, captaincy bonuses, and remaining budget.</p>
      
      <div class="leaderboard-list" style="margin-top: 15px;">
        <h3>Leaderboard</h3>
  `;

  leaderboard.forEach(entry => {
    html += `
      <div class="entry" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
        <div>
          <b>#${entry.rank} ${escapeHtml(entry.teamName)}</b> 
          <small>(${escapeHtml(entry.playerName)})</small>
          ${entry.isJointWinner ? '<span class="pill" style="background:var(--amber); color:#000; margin-left:6px;">Joint Winner</span>' : ''}
        </div>
        <div>
          <b class="lime" style="font-size: 1.2rem;">${entry.totalScore} pts</b>
        </div>
      </div>
    `;
  });

  html += `
      <div class="awards-section" style="margin-top: 25px;">
        <h3>⭐ Best Bargain Award (Rating / Price)</h3>
  `;

  if (bestBargains.length === 1) {
    const b = bestBargains[0];
    html += `<p><b>${escapeHtml(b.player)}</b> bought by <b>${escapeHtml(b.teamName)}</b> for ${cash(b.price)} (Rating: ${b.rating})</p>`;
  } else if (bestBargains.length > 1) {
    html += `<p><b>Joint Best Bargains (Matching Value):</b></p><ul style="margin-top: 5px; padding-left: 20px;">`;
    bestBargains.forEach(b => {
      html += `<li><b>${escapeHtml(b.player)}</b> (${escapeHtml(b.teamName)}) — ${cash(b.price)} for rating ${b.rating}</li>`;
    });
    html += `</ul>`;
  } else {
    html += `<p class="help">No bargain data available.</p>`;
  }

  html += `</div></div>`;

  $('currentProfile').innerHTML = html;
  $('bidButton').style.display = 'none';
  $('passButton').style.display = 'none';
  $('skipButton').style.display = 'none';
  $('sellButton').style.display = 'none';
  $('undoButton').style.display = 'none';
}

function renderPlayers(){
  if(!roomState)return;
  const q=$('playerSearch').value.trim().toLowerCase(), filter=$('playerFilter').value;
  const entries=PLAYER_LIST.map((p,id)=>({p,id,status:playerStatus(id)})).filter(x=>(x.p.name+' '+x.p.country).toLowerCase().includes(q)&&(filter==='all'||x.status===filter));
  $('playersList').innerHTML=entries.map(({p,id,status})=>`<div class="entry"><div class="avatar"><img src="${escapeHtml(p.photo||'')}" alt="" loading="lazy">${flags[p.country]||'🏏'}</div><div class="grow"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.country)} · ${Number(p.matches||0).toLocaleString()} matches</small><span class="role-tag">${escapeHtml(p.role||'Batsman')}</span></div><span class="pill">${status==='sold'?'Sold · '+cash(roomState.sold[id].price):status==='passed'?'Passed':'Remaining'}</span></div>`).join('')||'<p class="help">No players match this filter.</p>';
}

function resetToHome(){resetListeners();try{sessionStorage.removeItem('cricketAuctionRoomCode')}catch{}roomCode='';roomState=null;members={};page('home')}
async function leaveRoom(){if(!roomCode)return resetToHome();try{if(isHost){await remove(ref(db,roomPath()));await remove(ref(db,'roomIndex/'+roomCode))}else if(roomState?.status==='lobby')await remove(ref(db,roomPath('members/'+uid)));}catch(e){console.warn(e)}resetToHome()}

$('createRoom').onclick=createRoom;
$('joinRoom').onclick=joinRoom;
$('startAuction').onclick=startAuction;
$('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText(roomCode);toast('Room code copied.')}catch{toast('Room code: '+roomCode)}};
$('leaveLobby').onclick=leaveRoom;
$('leaveGame').onclick=leaveRoom;
$('bidButton').onclick=()=>sendAction('bid');
$('passButton').onclick=()=>sendAction('pass');
$('skipButton').onclick=()=>hostClose(true);
$('sellButton').onclick=()=>hostClose(false);
$('undoButton').onclick=undoLastSale;
$('teamSelect').onchange=drawGame;
$('playersTeams').onclick=()=>{$('playersModal').classList.add('open');renderPlayers()};
$('closeModal').onclick=()=>$('playersModal').classList.remove('open');
$('playersTab').onclick=()=>{$('playersPane').style.display='block';$('teamsPane').style.display='none';renderPlayers()};
$('teamsTab').onclick=()=>{$('playersPane').style.display='none';$('teamsPane').style.display='block';renderPlayers()};
$('playerSearch').oninput=renderPlayers;
$('playerFilter').onchange=renderPlayers;
$('viewTeam').onchange=renderPlayers;

let resumeAuctionMusic=false; 
const auctionMusic=$('auctionMusic'); 
auctionMusic.volume=.25; 
$('musicVolume').oninput=e=>auctionMusic.volume=Number(e.target.value)/100; 
$('musicToggle').onclick=async()=>{if(!auctionMusic.paused){auctionMusic.pause();return}try{await auctionMusic.play()}catch{$('musicState').textContent='Could not play track';toast('Check connection and tap Play',true)}}; 
auctionMusic.onplay=()=>{$('musicToggle').textContent='❚❚ Pause music';$('musicState').textContent='Playing'}; 
auctionMusic.onpause=()=>{$('musicToggle').textContent='▶ Play music'}; 
auctionMusic.onerror=()=>{$('musicState').textContent='Could not load song'}; 
auctionMusic.onended=()=>{resumeAuctionMusic=true;if(isHost)advanceAuctionMusic().catch(e=>say('gameMessage',friendly(e),true))};

if(appReady){
  ensureAuth().then(async()=>{showConnection('Guest ready',true);await restoreRoom()}).catch(e=>{showConnection('Offline',false);say('message',friendly(e),true)})
}else{
  showConnection('Setup needed',false);
  say('message','The live app needs a Firebase project. Follow README.txt.',true)
}
$('sendChatBtn').onclick = sendChatMessage;
$('chatInput').onkeydown = (e) => {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
};
