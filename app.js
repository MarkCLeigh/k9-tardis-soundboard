const CHANNELS = [
  ["MASTER","All-purpose K-9 responses"],["AFFIRMATIVE","Positive responses"],["NEGATIVE","Negative responses"],["SCANNING","Radar and scanning"],["WARNING","Alerts and warnings"],["LASER","Laser sounds"],["BARK","K-9 bark"],["MISC","Other sounds"]
];
const DB_NAME="k9-tardis-audio", STORE="clips";
let db, clips=[], lastPlayed={}, lastClip=null, currentUrl=null;
const $=id=>document.getElementById(id);
const player=$("player");
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function tx(mode="readonly"){return db.transaction(STORE,mode).objectStore(STORE);}
function allClips(){return new Promise((resolve,reject)=>{const r=tx().getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function saveClip(clip){return new Promise((resolve,reject)=>{const r=tx("readwrite").add(clip);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
function deleteClip(id){return new Promise((resolve,reject)=>{const r=tx("readwrite").delete(id);r.onsuccess=resolve;r.onerror=()=>reject(r.error);});}
function channelName(key){return CHANNELS.find(c=>c[0]===key)?.[0]||key;}
function renderPads(){
  $("pads").innerHTML="";
  CHANNELS.forEach(([key,desc])=>{
    const count=clips.filter(c=>c.channel===key).length;
    const b=document.createElement("button");b.className="pad";b.dataset.channel=key;
    b.innerHTML=`<b>${key}</b><small>${count} CLIP${count===1?"":"S"} · ${desc}</small>`;
    b.addEventListener("click",()=>playChannel(key,b));$("pads").appendChild(b);
  });
}
function renderLibrary(){
  const key=$("channelSelect").value;
  const list=clips.filter(c=>c.channel===key);$("clipList").innerHTML="";
  if(!list.length){$("clipList").innerHTML='<p class="empty">No recordings in this channel yet.</p>';}
  list.forEach(c=>{const row=document.createElement("div");row.className="clip";const name=document.createElement("span");name.textContent=c.name;const del=document.createElement("button");del.textContent="×";del.setAttribute("aria-label","Delete "+c.name);del.onclick=async()=>{await deleteClip(c.id);await refresh();};row.append(name,del);$("clipList").append(row);});
  $("clipCount").textContent=`${clips.length} AUDIO FILE${clips.length===1?"":"S"} LOADED`;
}
async function refresh(){clips=await allClips();renderPads();renderLibrary();}
function playChannel(key,button){
  const choices=clips.filter(c=>c.channel===key);
  if(!choices.length){$("status").textContent=`NO ${key} RECORDINGS — IMPORT AUDIO BELOW`;return;}
  let available=choices.filter(c=>c.id!==lastPlayed[key]);
  if(!available.length)available=choices;
  const chosen=available[Math.floor(Math.random()*available.length)];
  lastPlayed[key]=chosen.id;playClip(chosen,button);
}
function playClip(clip,button){
  if(currentUrl)URL.revokeObjectURL(currentUrl);
  currentUrl=URL.createObjectURL(clip.blob);player.src=currentUrl;player.volume=Number($("volume").value)/100;
  player.play().then(()=>{$("nowPlaying").textContent=`${clip.channel} / ${clip.name}`;$("status").textContent="PLAYING THROUGH IPHONE AUDIO";document.querySelectorAll(".pad").forEach(p=>p.classList.remove("playing"));button?.classList.add("playing");lastClip=clip;}).catch(()=>{$("status").textContent="TAP AGAIN TO START AUDIO";});
}
$("player").addEventListener("ended",()=>{document.querySelectorAll(".pad").forEach(p=>p.classList.remove("playing"));$("status").textContent="AUDIO SYSTEM READY";});
$("stop").onclick=()=>{player.pause();player.currentTime=0;document.querySelectorAll(".pad").forEach(p=>p.classList.remove("playing"));$("nowPlaying").textContent="STANDBY";$("status").textContent="PLAYBACK STOPPED";};
$("replay").onclick=()=>{if(lastClip){const b=[...document.querySelectorAll(".pad")].find(p=>p.dataset.channel===lastClip.channel);playClip(lastClip,b);}};
$("volume").oninput=e=>{$("volValue").textContent=e.target.value+"%";player.volume=Number(e.target.value)/100;};
$("channelSelect").onchange=renderLibrary;
$("fileInput").onchange=async e=>{
  const files=[...e.target.files];
  const channel=$("channelSelect").value;
  for(const file of files){
    const isAudio=file.type.startsWith("audio/") || /\.(mp3|wav|m4a)$/i.test(file.name);
    if(!isAudio)continue;
    await saveClip({channel,name:file.name,blob:file,added:Date.now()});
  }
  e.target.value="";
  await refresh();
  $("status").textContent=`AUDIO ADDED TO ${channel}`;
};
CHANNELS.forEach(([key])=>{const o=document.createElement("option");o.value=key;o.textContent=key;$("channelSelect").append(o);});
(async()=>{try{db=await openDB();await refresh();$("status").textContent="AUDIO SYSTEM READY";}catch(e){$("status").textContent="LOCAL AUDIO STORAGE UNAVAILABLE";console.error(e);}})();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(console.warn);
