import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getDatabase, ref, get, set, update, remove, onValue, runTransaction } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
import { PLAYERS } from './players.js';
const PLAYER_LIST = PLAYERS.map(p => Array.isArray(p) ? {name:p[0],country:p[1]} : p);const AUCTION_TRACKS = [
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
function setRoom(code,host){resetListeners();roomCode=code;isHost=host;roomState=null;members={};try{sessionStorage.setItem('cricketAuctionRoomCode',code)}catch{}listenRoom();$('codeDisplay').textContent=code;$('gameCode').textContent=code;page('lobby')}function roomPath(part=''){return `rooms/${roomCode}${part?'/'+part:''}`}
function listenRoom(){
  unsub.push(onValue(ref(db,roomPath('members')),snap=>{members=snap.val()||{};drawLobby();drawGame();},err=>say('message','Could not read room members: '+err.message,true)));
  unsub.push(onValue(ref(db,roomPath('state')),snap=>{roomState=snap.val();if(!roomState)return;if(isHost&&roomState.status==='auction'&&allTeamsComplete(roomState)){runTransaction(ref(db,roomPath('state')),s=>s&&s.status==='auction'&&allTeamsComplete(s)?{...s,status:'complete',currentIndex:s.order?.length||0,currentBid:0,highBidder:null,passed:{}}:undefined,{applyLocally:false}).catch(e=>say('gameMessage',friendly(e),true))}drawLobby();drawGame();if(roomState.status==='auction'||roomState.status==='complete')page('game');else page('lobby');if(isHost&&roomState.status==='auction')get(ref(db,roomPath('actions'))).then(x=>processActions(x.val()||{})).catch(e=>say('gameMessage',friendly(e),true));},err=>say('message','Could not read room: '+err.message,true)));
  if(isHost)unsub.push(onValue(ref(db,roomPath('actions')),snap=>{applying=applying.then(()=>processActions(snap.val()||{})).catch(err=>say('gameMessage','Could not process a bid: '+err.message,true));}));
}
async function ensureAuth(){if(!appReady)throw new Error('Firebase setup is not complete. Follow the setup steps in README.txt.');if(!auth){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getDatabase(app)}if(auth.currentUser){uid=auth.currentUser.uid;return}await new Promise((resolve,reject)=>{const off=onAuthStateChanged(auth,u=>{off();if(u){uid=u.uid;resolve()}else signInAnonymously(auth).then(c=>{uid=c.user.uid;resolve()}).catch(reject)},reject)});}
async function restoreRoom(){let code='';try{code=cleanCode(sessionStorage.getItem('cricketAuctionRoomCode'))}catch{}if(code.length!==6)return;try{const snap = await get(ref(db,'rooms/'+code));
const room = snap.val();if(!room||!room.members?.[uid]){sessionStorage.removeItem('cricketAuctionRoomCode');return}setRoom(code,room.hostUid===uid);showConnection('Live',true)}catch(e){showConnection('Reconnecting',false)}}async function createRoom(){try{await ensureAuth();const name=$('hostName').value.trim(),team=$('hostTeam').value.trim();if(!name||!team)return say('message','Enter your name and team name.',true);let code='';for(let i=0;i<8;i++){const tryCode=randCode(),exists=await get(ref(db,'roomIndex/'+tryCode));if(!exists.exists()){code=tryCode;break}}if(!code)throw new Error('Could not reserve a room code. Try again.');const initial={hostUid:uid,status:'lobby',budget:8000,bidStep:50,order:[],currentIndex:0,currentBid:0,highBidder:null,passed:{},sold:{},skipped:{},teams:{[uid]:{uid,name,team,budget:8000,roster:[]}},processed:{},openedAt:Date.now()};const seed={hostUid:uid,members:{[uid]:{name,team}},state:initial};await set(ref(db,'rooms/'+code),seed);try{await set(ref(db,'roomIndex/'+code),uid)}catch(e){await remove(ref(db,'rooms/'+code));throw e}setRoom(code,true);showConnection('Connected',true)}catch(e){say('message',friendly(e),true)}}
async function joinRoom(){try{await ensureAuth();const code=cleanCode($('roomCodeInput').value),name=$('joinName').value.trim(),team=$('joinTeam').value.trim();if(code.length!==6||!name||!team)return say('message','Enter the 6-character room code, your name, and team name.',true);const roomSnap=await get(ref(db,'rooms/'+code)),room=roomSnap.val();if(!room)throw new Error('Room code not found. Check the code and try again.');const memberRef=ref(db,'rooms/'+code+'/members/'+uid),existing=await get(memberRef);if(!existing.exists()){const rosterSnap=await get(ref(db,'rooms/'+code+'/members'));if(Object.keys(rosterSnap.val()||{}).length>=8)throw new Error('This room already has eight players.');const result=await runTransaction(memberRef,cur=>cur===null?{name,team}:undefined,{applyLocally:false});if(!result.committed){const current=await get(memberRef);if(!current.exists())throw new Error('This room is full, closed, or the auction has already started.')}}setRoom(code,room.hostUid===uid);showConnection('Connected',true)}catch(e){say('message',friendly(e),true)}}function friendly(e){const m=e?.message||String(e);if(m.includes('permission_denied')||m.toLowerCase().includes('permission'))return 'Firebase blocked this action. Check that Anonymous sign-in is enabled and database.rules.json has been published.';if(m.toLowerCase().includes('network'))return 'Could not reach the live game service. Check your internet connection.';return m}
function drawLobby(){if(!roomCode)return;const entries=Object.entries(members),started=roomState?.status==='auction'||roomState?.status==='complete';$('lobbyPlayers').innerHTML=entries.map(([id,p],i)=>`<div class="team"><div><b>${escapeHtml(p.team)}</b><small>${id===roomState?.hostUid?' · Host':''}</small></div><span class="grow">${escapeHtml(p.name)}</span><span class="pill">Joined</span></div>`).join('')||'<p class="help">Waiting for players…</p>';$('startAuction').style.display=isHost?'inline-block':'none';$('startAuction').textContent=started?(roomState?.status==='complete'?'View results':'Open auction'):'Start auction';$('startAuction').disabled=!isHost||(!started&&(entries.length<2||entries.length>8||roomState?.status!=='lobby'));$('leaveLobby').textContent=isHost?'Close room':'Leave room';if(roomState?.status==='lobby')say('lobbyMessage',`${entries.length} of 8 players joined. ${entries.length<2?'Need at least one more player.':'Ready to start.'}`)}
async function startAuction(){try{if(roomState?.status==='auction'||roomState?.status==='complete'){drawGame();page('game');return}const teams={};for(const[id,m]of Object.entries(members))teams[id]={uid:id,name:m.name,team:m.team,budget:8000,roster:[]};const order=PLAYER_LIST.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}say('lobbyMessage','Starting auction…');const result=await runTransaction(ref(db,roomPath('state')),s=>{if(!s||s.status!=='lobby'||Object.keys(teams).length<2||Object.keys(teams).length>8)return;const musicOrder=shuffledTrackIds();return {...s,status:'auction',teams,order,currentIndex:0,currentBid:0,highBidder:null,passed:{},sold:{},skipped:{},processed:{},musicOrder,musicIndex:0,musicTrack:musicOrder[0],startedAt:Date.now()}},{applyLocally:false});if(!result.committed){const latest=await get(ref(db,roomPath('state')));roomState=latest.val();if(roomState?.status==='auction'||roomState?.status==='complete'){drawGame();page('game');return}drawLobby();say('lobbyMessage','Could not start. Confirm 2–8 players are joined, then try again.',true);return}roomState=result.snapshot.val();drawLobby();drawGame();page('game')}catch(e){say('lobbyMessage',friendly(e),true)}}function rosterCount(team){return Array.isArray(team?.roster)?team.roster.length:0}
function allTeamsComplete(s){const ids=Object.keys(s?.teams||{});return ids.length>0&&ids.every(id=>rosterCount(s.teams[id])>=11)}
function nextPlayer(s){if(allTeamsComplete(s)){s.status='complete';s.currentIndex=s.order.length;s.currentBid=0;s.highBidder=null;s.passed={};return s}s.currentIndex+=1;s.currentBid=0;s.highBidder=null;s.passed=Object.fromEntries(Object.entries(s.teams||{}).filter(([,team])=>rosterCount(team)>=11).map(([id])=>[id,true]));if(s.currentIndex>=s.order.length)s.status='complete';return s}
function finishPlayer(s, skip) {
  const playerId = s.order[s.currentIndex],
        buyer = s.highBidder;

  if (skip || buyer === null) {
    s.skipped[playerId] = true;
  } else {
    const t = s.teams[buyer];

    if (
      !t ||
      t.budget < s.currentBid ||
      (Array.isArray(t.roster) ? t.roster.length : 0) >= 11
    ) {
      s.skipped[playerId] = true;
    } else {

      if (!Array.isArray(t.roster)) t.roster = [];

      t.budget -= s.currentBid;

      t.roster.push({
        playerId,
        name: PLAYER_LIST[playerId].name,
        price: s.currentBid
      });

      s.lastSale = {
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
  const teamIds = Object.keys(s.teams || {});if(allTeamsComplete(s)){s.status='complete';s.currentIndex=s.order.length;s.currentBid=0;s.highBidder=null;s.passed={};return s}for(const id of teamIds)if(rosterCount(s.teams[id])>=11)s.passed[id]=true;const activeIds=teamIds.filter(id=>rosterCount(s.teams[id])<11);const done=activeIds.every(id=>id===s.highBidder||s.passed?.[id]);if(done)return finishPlayer(s,s.highBidder===null);return s}
async function processActions(actions){if(!isHost||!roomState||roomState.status!=='auction')return;for(const[id,a]of Object.entries(actions).sort((x,y)=>(x[1]?.createdAt||0)-(y[1]?.createdAt||0))){if(!a?.nonce||roomState.processed?.[id]===a.nonce)continue;const current=roomState;const result=await runTransaction(ref(db,roomPath('state')),s=>{if(!s||s.status!=='auction'||s.processed?.[id]===a.nonce)return;const updated={...s,teams:{...s.teams},passed:{...(s.passed||{})},processed:{...(s.processed||{})},sold:{...(s.sold||{})},skipped:{...(s.skipped||{})}};const team=updated.teams[id];updated.processed[id]=a.nonce;if(!team)return updated;const amount=updated.currentBid?updated.currentBid+updated.bidStep:updated.bidStep;
if (a.type === 'bid' && id !== updated.highBidder && !updated.passed[id]) {
  const currentRoster = Array.isArray(team.roster) ? team.roster : [];
  const rosterCount = currentRoster.length;

  if (rosterCount < 11 && team.budget >= amount) {
    // Automatically enforce that they leave 50 lakh for every other player needed
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
if(a.type==='pass'&&id!==updated.highBidder){updated.passed[id]=true;return resolveIfDone(updated)}return updated;},{applyLocally:false});if(result.committed)roomState=result.snapshot.val();}drawGame()}
async function sendAction(type){if(!roomCode||!roomState||roomState.status!=='auction')return toast('Auction is not running yet.',true);const my=roomState.teams?.[uid];if(!my)return toast('Your team is not in this room.',true);const nonce=uid+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);try{await set(ref(db,roomPath('actions/'+uid)),{type,nonce,createdAt:Date.now()});say('gameMessage',type==='bid'?'Bid sent. Waiting for the room to update.':'Pass sent. Waiting for the room to update.')}catch(e){say('gameMessage',friendly(e),true)}}
async function advanceAuctionMusic(){if(!isHost||roomState?.status!=='auction')return;const expected=roomState.musicTrack||auctionMusic.dataset.track;const result=await runTransaction(ref(db,roomPath('state')),s=>{if(!s||s.status!=='auction'||(s.musicTrack&&s.musicTrack!==expected))return;let order=Array.isArray(s.musicOrder)&&s.musicOrder.length?s.musicOrder.slice():[];let index=Number.isInteger(s.musicIndex)?s.musicIndex+1:0;if(!order.length){order=shuffledTrackIds(expected);index=0}else if(index>=order.length){order=shuffledTrackIds(order[order.length-1]);index=0}return {...s,musicOrder:order,musicIndex:index,musicTrack:order[index]}},{applyLocally:false});if(!result.committed)throw new Error('Could not advance the shared music playlist.')}

 async function undoLastSale(){
   
   try{
    await runTransaction(
      ref(db, roomPath('state')),
      s => {

        if(!s || !s.lastSale) return;

        const sale = s.lastSale;
        const team = s.teams?.[sale.uid];

        if(!team) return s;

        const idx = (team.roster || [])
          .findIndex(p => p.playerId === sale.playerId);

        if(idx >= 0){
          team.roster.splice(idx,1);
        }

        team.budget += sale.price;

        delete s.sold[sale.playerId];

        s.currentIndex =
          Math.max(0, s.currentIndex - 1);

        s.status = 'auction';
        s.currentBid = 0;
        s.highBidder = null;
        s.passed = {};

        delete s.lastSale;

        return s;
      },
      {applyLocally:false}
    );

    toast('Last sale undone');
  }
  catch(e){
    say('gameMessage', friendly(e), true);
  }
}
async function hostClose(skipOnly=false){
  if(!isHost)return;

  try{const result=await runTransaction(ref(db,roomPath('state')),s=>{if(!s||s.status!=='auction')return;if(skipOnly&&s.currentBid>0)return;const next={...s,teams:{...s.teams},passed:{...(s.passed||{})},sold:{...(s.sold||{})},skipped:{...(s.skipped||{})}};return finishPlayer(next,skipOnly||next.highBidder===null)},{applyLocally:false});if(!result.committed&&skipOnly)toast('Skip is only available when no one has bid.',true)}catch(e){say('gameMessage',friendly(e),true)}}
function playerPosition(id,s=roomState){return s?.order?.indexOf(id)??-1}
function playerStatus(id,s=roomState){if(s?.sold?.[id])return'sold';if(s?.skipped?.[id]||playerPosition(id,s)<(s?.currentIndex??0))return'passed';return'remaining'}
function drawGame(){if(!roomState||!roomCode)return;const s=roomState,teams=s.teams||{},p=currentPlayer(s);const sharedTrack=AUCTION_TRACKS.find(t=>t.id===s.musicTrack)||AUCTION_TRACKS[0];if(auctionMusic.dataset.track!==sharedTrack.id){const resume=resumeAuctionMusic||!auctionMusic.paused;resumeAuctionMusic=false;auctionMusic.pause();auctionMusic.src='./'+sharedTrack.file;auctionMusic.dataset.track=sharedTrack.id;auctionMusic.load();$('musicTrackName').textContent='Now playing: '+sharedTrack.label;if(resume)auctionMusic.play().catch(()=>$('musicState').textContent='Tap Play to continue on this phone')}if(s.status!=='auction')auctionMusic.pause();$('teamSummary').innerHTML=Object.entries(teams).map(([id,t])=>`<div class="team"><div><b>${escapeHtml(t.team)}</b><small>${id===uid?' · You':''} · ${t.roster?.length||0}/11</small></div><b class="lime">${cash(t.budget||0)}</b></div>`).join('');const opts=Object.entries(teams).map(([id,t])=>`<option value="${id}" ${id===uid?'selected':''}>${id===uid?'Your team: ':''}${escapeHtml(t.team)}</option>`).join('');$('teamSelect').innerHTML=opts;$('viewTeam').innerHTML=opts;$('myTeamAction').innerHTML=opts;$('myTeamAction').value=uid;
const selected=teams[$('teamSelect').value||uid];$('selectedRoster').innerHTML=selected?.roster?.length?selected.roster.map(x=>`<div class="entry"><b class="grow">${escapeHtml(x.name)}</b><b class="lime">${cash(x.price)}</b></div>`).join(''):'<p class="help">No players bought yet.</p>';
if(!p){$('currentProfile').innerHTML=`<div class="eyebrow">${s.status==='complete'?'AUCTION COMPLETE':'Waiting for auction to start'}</div><h2>${s.status==='complete'?'Auction complete':'Players will appear here'}</h2>`;$('auctionCount').textContent=s.status==='complete'?'Complete':Object.keys(teams).length+' teams joined';$('currentPrice').textContent='—';$('currentLeader').textContent='';$('bidButton').disabled=true;$('passButton').disabled=true;$('skipButton').disabled=true;$('sellButton').disabled=true;return}
const pid=s.order[s.currentIndex],soldCount=Object.keys(s.sold||{}).length+Object.keys(s.skipped||{}).length;$('auctionCount').textContent=(soldCount+1)+' / '+PLAYER_LIST.length+' offered';$('turnState').textContent=(teams[uid]?.roster?.length||0)>=11?'Team complete':s.passed?.[uid]?'You passed this player':s.highBidder===uid?'You are leading':'Bidding open';$('currentProfile').innerHTML=`<img class="player-photo" src="${escapeHtml(p.photo||'')}" alt="${escapeHtml(p.name)}" loading="eager"><div class="flag">${flags[p.country]||'🏏'}</div><h2>${escapeHtml(p.name)}</h2><span class="role-tag">${escapeHtml(p.role||'Batsman')}</span><div>${escapeHtml(p.country)} · International career</div><div class="stats"><div class="stat"><b>${Number(p.matches||0).toLocaleString()}</b><small>Matches</small></div><div class="stat"><b>${Number(p.runs||0).toLocaleString()}</b><small>Runs</small></div><div class="stat"><b>${Number(p.wickets||0).toLocaleString()}</b><small>Wickets</small></div><div class="stat"><b>${Number(p.hundreds||0).toLocaleString()}</b><small>100s</small></div></div><a class="source-link" href="${escapeHtml(p.source||'#')}" target="_blank" rel="noopener">Stats & photo: Cricbuzz</a>`;
const amount=s.currentBid?s.currentBid+s.bidStep:s.bidStep;$('currentPrice').textContent=s.currentBid?cash(s.currentBid):'₹50 lakh';$('currentLeader').textContent=s.highBidder?`${escapeHtml(teams[s.highBidder]?.team||'A team')} is leading`:'Opening bid · ₹50 lakh';const mine = teams[uid], myRoster = Array.isArray(mine?.roster) ? mine.roster : [];
const teamComplete = myRoster.length >= 11;

// Automatically calculate reserve requirement
const playersNeeded = 11 - myRoster.length;
const futureBudget = (mine?.budget || 0) - amount;
const remainingSlotsAfterThisBid = Math.max(0, playersNeeded - 1);
const reservedNeeded = remainingSlotsAfterThisBid * 50; // 50 lakh per remaining slot
const hasEnoughWithReserve = futureBudget >= reservedNeeded;

const canAct = !!mine && s.status === 'auction' && !teamComplete && !s.passed?.[uid] && s.highBidder !== uid;

$('bidButton').textContent = 'Bid ' + cash(amount);
// Automatically disable if team is full, doesn't have enough money, or breaks the reserve rule
$('bidButton').disabled = !canAct || (mine?.budget || 0) < amount || teamComplete || !hasEnoughWithReserve;$('passButton').disabled=!canAct;$('skipButton').disabled=!isHost||s.currentBid>0;$('sellButton').disabled=!isHost;$('skipButton').style.display=isHost?'inline-block':'none';$('sellButton').style.display=isHost?'inline-block':'none';$('undoButton').style.display=isHost?'inline-block':'none';
$('gameMessage').textContent=teamComplete?'Your team has 11 players. Bidding and passing are disabled.':isHost?'You are the host. Keep this page open to process player bids.':'Bids update live for everyone in this room.';
drawBattingOrder();
}
function drawBattingOrder(){

  const team = roomState?.teams?.[uid];

  if(!team) return;

  const roster = team.roster || [];

  $('battingOrder').innerHTML =
    roster.map((p,i)=>`
      <div class="entry">
        <span class="grow">${i + 1}. ${escapeHtml(p.name)}</span>

        <button onclick="movePlayerUp(${i})">⬆</button>

        <button onclick="movePlayerDown(${i})">⬇</button>
      </div>
    `).join('');
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
function renderPlayers(){if(!roomState)return;const q=$('playerSearch').value.trim().toLowerCase(),filter=$('playerFilter').value;const entries=PLAYER_LIST.map((p,id)=>({p,id,status:playerStatus(id)})).filter(x=>(x.p.name+' '+x.p.country).toLowerCase().includes(q)&&(filter==='all'||x.status===filter));$('playersList').innerHTML=entries.map(({p,id,status})=>`<div class="entry"><div class="avatar"><img src="${escapeHtml(p.photo||'')}" alt="" loading="lazy">${flags[p.country]||'🏏'}</div><div class="grow"><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.country)} · ${Number(p.matches||0).toLocaleString()} matches · ${Number(p.runs||0).toLocaleString()} runs · ${Number(p.wickets||0).toLocaleString()} wkts · ${Number(p.hundreds||0)} 100s</small><span class="role-tag">${escapeHtml(p.role||'Batsman')}</span></div><span class="pill">${status==='sold'?'Sold · '+cash(roomState.sold[id].price):status==='passed'?'Passed':'Remaining'}</span></div>`).join('')||'<p class="help">No players match this filter.</p>';const tid=$('viewTeam').value||uid,t=roomState.teams?.[tid];$('teamRoster').innerHTML=t?.roster?.length?t.roster.map(x=>`<div class="entry"><b class="grow">${escapeHtml(x.name)}</b><b class="lime">${cash(x.price)}</b></div>`).join(''):'<p class="help">No purchases yet.</p>'}
function resetToHome(){resetListeners();try{sessionStorage.removeItem('cricketAuctionRoomCode')}catch{}roomCode='';roomState=null;members={};page('home')}
async function leaveRoom(){if(!roomCode)return resetToHome();try{if(isHost){await remove(ref(db,roomPath()));await remove(ref(db,'roomIndex/'+roomCode))}else if(roomState?.status==='lobby')await remove(ref(db,roomPath('members/'+uid)));}catch(e){console.warn(e)}resetToHome()}

$('createRoom').onclick=createRoom;$('joinRoom').onclick=joinRoom;$('startAuction').onclick=startAuction;$('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText(roomCode);toast('Room code copied.')}catch{toast('Room code: '+roomCode)}};$('leaveLobby').onclick=leaveRoom;$('leaveGame').onclick=leaveRoom;$('bidButton').onclick=()=>sendAction('bid');$('passButton').onclick=()=>sendAction('pass');$('skipButton').onclick=()=>hostClose(true);$('sellButton').onclick=()=>hostClose(false);$('undoButton').onclick=undoLastSale;$('teamSelect').onchange=drawGame;$('playersTeams').onclick=()=>{$('playersModal').classList.add('open');renderPlayers()};$('closeModal').onclick=()=>$('playersModal').classList.remove('open');$('playersTab').onclick=()=>{$('playersPane').style.display='block';$('teamsPane').style.display='none';renderPlayers()};$('teamsTab').onclick=()=>{$('playersPane').style.display='none';$('teamsPane').style.display='block';renderPlayers()};$('playerSearch').oninput=renderPlayers;$('playerFilter').onchange=renderPlayers;$('viewTeam').onchange=renderPlayers;

let resumeAuctionMusic=false; const auctionMusic=$('auctionMusic'); auctionMusic.volume=.25; $('musicVolume').oninput=e=>auctionMusic.volume=Number(e.target.value)/100; $('musicToggle').onclick=async()=>{if(!auctionMusic.paused){auctionMusic.pause();return}try{await auctionMusic.play()}catch{$('musicState').textContent='Could not play the selected track';toast('Could not play this track. Check your connection and tap Play again.',true)}}; auctionMusic.onplay=()=>{$('musicToggle').textContent='❚❚ Pause music';$('musicState').textContent='Playing on this phone'}; auctionMusic.onpause=()=>{$('musicToggle').textContent='▶ Play music';if($('musicState').textContent==='Playing on this phone')$('musicState').textContent='Paused on this phone'}; auctionMusic.onerror=()=>{$('musicState').textContent='Could not load this song'}; auctionMusic.onended=()=>{resumeAuctionMusic=true;if(isHost)advanceAuctionMusic().catch(e=>say('gameMessage',friendly(e),true))};
if(appReady){ensureAuth().then(async()=>{showConnection('Guest ready',true);await restoreRoom()}).catch(e=>{showConnection('Offline',false);say('message',friendly(e),true)})}else{showConnection('Setup needed',false);say('message','The live app needs a Firebase project. Follow README.txt to connect its database before you can create or join rooms.',true)}



