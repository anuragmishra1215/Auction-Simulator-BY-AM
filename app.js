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

// --- Automatic Sale Celebration & Flying Animation Trigger ---
let lastProcessedIndex = -1;
function checkAndTriggerSaleAnimation(s) {
  if (!s || !s.lastSale) return;
  const currentSaleKey = s.currentIndex + '-' + s.lastSale.playerId + '-' + s.lastSale.price;
  if (lastProcessedIndex !== currentSaleKey) {
    lastProcessedIndex = currentSaleKey;
    const teamName = s.teams[s.lastSale.uid]?.team || 'Team';
    triggerSoldSaleAnimation(s.lastSale.playerName, teamName, cash(s.lastSale.price));
  }
}

function triggerSoldSaleAnimation(playerName, teamName, finalPriceStr) {
  const overlay = document.getElementById('celebrationOverlay');
  const content = document.getElementById('soldAnnouncementContent');
  if (!overlay || !content) return;
