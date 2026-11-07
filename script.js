// ---------- Event data (edit these!) ----------
const events = [
  {id:1,name:"CodeSprint Hackathon",tags:"coding,laptop",cat:"Tech",icon:"💻",color:"#8ecbff",date:"2026-12-12T09:00",venue:"Main Auditorium",seats:120,desc:"24 hours to build a campus-problem solution with your team.",long:"Form a team of up to 4, build a working prototype in 24 hours and pitch it to judges. Food, mentors and cash prizes included."},
  {id:2,name:"React for Beginners",tags:"programming,code",cat:"Workshop",icon:"⚛️",color:"#b8f0d0",date:"2026-12-18T14:00",venue:"Computer Lab 2",seats:40,desc:"Build your first React app from scratch, step by step.",long:"No experience needed. Bring a laptop with Node.js installed and leave with a deployed project."},
  {id:3,name:"Masterchef 3.0",tags:"cooking,chef",cat:"Cultural",icon:"🍳",color:"#ffc2dc",date:"2026-12-23T18:30",venue:"Open Air Theatre",seats:300,desc:"Food quiz, Black Box Mystery and Cook without Fire.",long:"Teams compete in three rounds: a food quiz, a Black Box Mystery ingredient challenge and a cook-without-fire round. Gates open at 6 PM."},
  {id:4,name:"Inter-College Quiz",tags:"quiz,students",cat:"Contest",icon:"🧠",color:"#ffe49a",date:"2027-01-08T11:00",venue:"Seminar Hall A",seats:60,desc:"Four rounds of tech, general knowledge and pop culture.",long:"Teams of 2 compete across four rounds. The top three teams win trophies and goodies."},
  {id:5,name:"AI & Careers Talk",tags:"robot,technology",cat:"Tech",icon:"🤖",color:"#d7c8ff",date:"2027-01-15T15:00",venue:"Conference Room",seats:80,desc:"Engineers share how to start a career in AI.",long:"A 90-minute talk and open Q&A with engineers working in AI, followed by networking."},
  {id:6,name:"Cricket Premier Cup",tags:"cricket,stadium",cat:"Sports",icon:"🏏",color:"#c5f0a4",date:"2027-01-22T08:00",venue:"College Ground",seats:16,desc:"Department teams face off in a one-day T10 tournament.",long:"Register as a team captain. Matches run all day, with the final in the evening."},
  {id:7,name:"AI Design Bootcamp",tags:"graphic,design",cat:"Workshop",icon:"🎨",color:"#ffd2b0",date:"2027-02-05T10:00",venue:"Design Studio",seats:35,desc:"Learn Figma, layout and colour basics in one day.",long:"Design a mobile app screen from scratch and get live feedback from mentors."},
  {id:8,name:"Movie Creator Content",tags:"film,camera",cat:"Actors",icon:"🎬",color:"#ffb3c7",date:"2027-02-14T17:00",venue:"Main Auditorium",seats:150,desc:"Group competition for film and content creators.",long:"Teams create and present a short piece of content. Judges score creativity, storytelling and presentation."}
];
const photos = {
  1:"hackathon.jpg", 2:"react.jpg", 3:"masterchef.jpg", 4:"quiz.jpg",
  5:"aitalk.jpg", 6:"cricket.jpg", 7:"design.jpg", 8:"movie.jpg"

};
// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const dateOf = e => new Date(e.date);
const left = e => Math.max(0, e.seats - read("passes", []).filter(p => p.eventId === e.id).length);
let cat = "All", q = "", sort = "date", favOnly = false, open = null;

function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }

// ---------- Theme ----------
function setTheme(t){ document.documentElement.dataset.theme=t; $("#themeBtn").textContent=t==="dark"?"☀️":"🌙"; localStorage.setItem("theme",t); }
setTheme(localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark":"light"));
$("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");

// ---------- Moving belt ----------
const beltText = events.map(e => `${e.icon} ${e.name}`).join("   ✦   ") + "   ✦   ";
$("#belt").textContent = beltText.repeat(4);

// ---------- Event list ----------
function renderCats(){
  $("#cats").innerHTML = ["All", ...new Set(events.map(e=>e.cat))].map(c=>`<button class="${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
}
function renderList(){
  const favs = read("favs", []);
  let list = events.filter(e => (cat==="All"||e.cat===cat) && (!favOnly||favs.includes(e.id)) &&
    (e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q.toLowerCase()));
  list.sort((a,b) => sort==="name" ? a.name.localeCompare(b.name) : sort==="seats" ? left(a)-left(b) : dateOf(a)-dateOf(b));
  $("#count").textContent = `${list.length} event${list.length===1?"":"s"} found`;
  $("#empty").hidden = list.length > 0;
  $("#list").innerHTML = list.map(e => {
    const d = dateOf(e), l = left(e);
    return `<article class="tk">
      <img class="thumb" src="${photos[e.id]}" alt="${e.name}" loading="lazy" onerror="this.onerror=null;this.src='https://loremflickr.com/600/300/${e.tags}?lock=${e.id}'">
    <div class="date"><b>${d.getDate()}</b>${d.toLocaleString("en-IN",{month:"short"})}</div>
      <div class="tk-body"><span class="chip">${e.cat}</span><h3>${e.icon} ${e.name}</h3>
        <p>${e.desc}</p><p class="meta">📍 ${e.venue} · ${d.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})} · <span class="${l<=10?"low":""}">${l?l+" seats left":"Sold out"}</span></p></div>
      <div class="tk-side"><button class="heart" data-fav="${e.id}" aria-label="Save event">${favs.includes(e.id)?"♥":"♡"}</button><button data-open="${e.id}">Details</button></div>
    </article>`; }).join("");
}
$("#cats").onclick = e => { if(e.target.dataset.c){ cat=e.target.dataset.c; renderCats(); renderList(); } };
$("#search").oninput = e => { q=e.target.value.trim(); renderList(); };
$("#sort").onchange = e => { sort=e.target.value; renderList(); };
$("#favOnly").onchange = e => { favOnly=e.target.checked; renderList(); };
$("#list").onclick = e => {
  if(e.target.dataset.open) openDrawer(+e.target.dataset.open);
  if(e.target.dataset.fav) toggleFav(+e.target.dataset.fav);
};
function toggleFav(id){
  let f = read("favs", []);
  f = f.includes(id) ? f.filter(x=>x!==id) : [...f, id];
  write("favs", f); renderList(); if(open) $("#dFav").textContent = f.includes(open.id) ? "♥ Saved" : "♡ Save";
}

// ---------- Next event + countdown ----------
function tick(){
  const n = events.filter(e=>dateOf(e)>new Date()).sort((a,b)=>dateOf(a)-dateOf(b))[0];
  if(!n){ $("#next").innerHTML="<h2>No upcoming events</h2>"; return; }
  let s = Math.floor((dateOf(n)-new Date())/1000);
  const box = [["days",86400],["hrs",3600],["min",60],["sec",1]].map(([l,v])=>{const x=Math.floor(s/v);s%=v;return `<div><b>${String(x).padStart(2,"0")}</b>${l}</div>`}).join("");
  $("#next").innerHTML = `<p>NEXT UP</p><h2>${n.icon} ${n.name}</h2><div class="clock">${box}</div><button class="go" data-open="${n.id}">Get my pass</button>`;
}
$("#next").onclick = e => { if(e.target.dataset.open) openDrawer(+e.target.dataset.open); };
tick(); setInterval(tick, 1000);

// ---------- Drawer ----------
function openDrawer(id){
  open = events.find(e=>e.id===id);
  const l = left(open);
  $("#dArt").style.background = open.color; $("#dArt").textContent = open.icon;
  $("#dCat").textContent = open.cat; $("#dTitle").textContent = open.name;
  $("#dMeta").textContent = `📅 ${dateOf(open).toLocaleString("en-IN",{dateStyle:"full",timeStyle:"short"})} · 📍 ${open.venue}`;
  $("#dDesc").textContent = open.long;
  $("#dBar").style.width = (100*(open.seats-l)/open.seats)+"%";
  $("#dSeats").textContent = l ? `${l} of ${open.seats} seats left` : "Sold out";
  $("#dFav").textContent = read("favs",[]).includes(id) ? "♥ Saved" : "♡ Save";
  $("#fEvent").innerHTML = `<option value="">Choose an event</option>` + events.map(e=>`<option value="${e.id}">${e.name}</option>`).join("");
  $("#form").reset(); $("#fEvent").value = id; clearErr();
  $("#form").hidden = false; $("#ticket").hidden = true;
  $("#form button").disabled = !l; $("#form button").textContent = l ? "Get my pass" : "Sold out";
  $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden","false"); $("#veil").hidden = false;
  history.replaceState(null,"","#event-"+id);
}
function closeDrawer(){ $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden","true"); $("#veil").hidden=true; open=null; history.replaceState(null,"","#events"); }
$("#closeBtn").onclick = closeDrawer; $("#veil").onclick = closeDrawer;
document.addEventListener("keydown", e => { if(e.key==="Escape") closeDrawer(); });
$("#dFav").onclick = () => toggleFav(open.id);
$("#dShare").onclick = () => { navigator.clipboard?.writeText(location.href).then(()=>toast("Link copied"),()=>toast("Copy failed")); };

// ---------- Validation ----------
function mark(el, msg){ el.classList.toggle("bad", !!msg); el.parentElement.querySelector("small").textContent = msg; return !msg; }
function clearErr(){ document.querySelectorAll("#form input,#form select").forEach(i=>mark(i,"")); }
function validate(){
  const n=$("#fName"), m=$("#fEmail"), p=$("#fPhone"), v=$("#fEvent");
  return [
    mark(n, /^[A-Za-z][A-Za-z .'-]{2,}$/.test(n.value.trim()) ? "" : "Enter your full name (letters only, 3 or more)."),
    mark(m, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim()) ? "" : "Enter a valid email like name@example.com."),
    mark(p, /^[6-9]\d{9}$/.test(p.value.trim()) ? "" : "Enter a 10-digit mobile number starting with 6–9."),
    mark(v, v.value ? "" : "Choose an event.")
  ].every(Boolean);
}
["fName","fEmail","fPhone","fEvent"].forEach(id => $("#"+id).addEventListener("input", validate));
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  if(!validate()) return;
  const ev = events.find(x=>x.id===+$("#fEvent").value), email = $("#fEmail").value.trim().toLowerCase();
  const all = read("passes", []);
  if(all.some(p=>p.eventId===ev.id && p.email===email)) return mark($("#fEmail"), "This email already has a pass for this event.");
  if(left(ev) < 1) return mark($("#fEvent"), "Sorry, this event is sold out.");
  const pass = {ref:"FP-"+Math.random().toString(36).slice(2,8).toUpperCase(), name:$("#fName").value.trim(), email, phone:$("#fPhone").value.trim(), eventId:ev.id};
  write("passes", [...all, pass]);
  $("#form").hidden = true; $("#ticket").hidden = false;
  $("#ticket").innerHTML = `<div class="t1"><h3>🎉 You're in, ${pass.name.split(" ")[0]}!</h3><p>${ev.icon} ${ev.name}<br>${dateOf(ev).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})} · ${ev.venue}</p></div><div class="t2">${pass.ref}</div>`;
  renderList(); renderPasses(); toast("Registration confirmed");
});

// ---------- My passes ----------
function renderPasses(){
  const all = read("passes", []);
  $("#passCount").textContent = all.length;
  $("#passList").innerHTML = all.length ? all.map(p => { const e = events.find(x=>x.id===p.eventId); return `<div class="pass"><b>${e.icon} ${e.name}</b><span class="meta">${p.name} · ${p.email}</span><span class="chip">${p.ref}</span><button data-ref="${p.ref}">Cancel pass</button></div>`; }).join("") : `<p class="meta">No passes yet. Pick an event above and grab your seat.</p>`;
}
$("#passList").onclick = e => { const r=e.target.dataset.ref; if(r){ write("passes", read("passes",[]).filter(p=>p.ref!==r)); renderPasses(); renderList(); toast("Pass cancelled"); } };

renderCats(); renderList(); renderPasses();
const m = location.hash.match(/^#event-(\d+)$/); if(m && events.some(e=>e.id===+m[1])) openDrawer(+m[1]);
