const events = [
  {id:"solo-sprint",title:"Solo Sprint #01",mode:"Solo",date:"Demo schedule",time:"6:00 PM",slots:"32 slots",map:"Erangel"},
  {id:"duo-dash",title:"Duo Dash #01",mode:"Duo",date:"Demo schedule",time:"7:00 PM",slots:"24 teams",map:"Miramar"},
  {id:"squad-clash",title:"Squad Clash #01",mode:"Squad",date:"Demo schedule",time:"8:00 PM",slots:"16 teams",map:"Erangel"}
];
const $ = (id) => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let profile = load("bgmi-esports-profile", null);
let registrations = load("bgmi-esports-registrations", []);
let selectedEvent = null;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2400);
}
function renderEvents(filter = "All") {
  const shown = events.filter(e => filter === "All" || e.mode === filter);
  $("tournamentList").innerHTML = shown.map(e => {
    const joined = registrations.some(r => r.eventId === e.id);
    return `<article class="event">
      <div class="event-top"><span class="mode">${e.mode.toUpperCase()}</span><span class="free">● FREE ENTRY</span></div>
      <h3>${e.title}</h3><p>Community event · ${e.map} map</p>
      <div class="event-meta"><div><small>TIME</small><b>${e.time}</b></div><div><small>CAPACITY</small><b>${e.slots}</b></div></div>
      <button class="${joined ? "secondary" : "primary"}" data-join="${e.id}" ${joined ? "disabled" : ""}>${joined ? "Registered ✓" : "Join demo event"}</button>
    </article>`;
  }).join("");
  $("eventCount").textContent = shown.length;
}
function renderProfile() {
  if (profile) {
    $("playerName").value = profile.name || "";
    $("playerId").value = profile.playerId || "";
    $("phone").value = profile.phone || "";
    $("profileMessage").textContent = "Profile saved on this device.";
  }
}
function renderRegistrations() {
  const mine = registrations.map(r => ({...r, event: events.find(e => e.id === r.eventId)})).filter(r => r.event);
  $("myRegistrations").innerHTML = mine.length ? mine.map(r => `<div class="registration-row"><div><strong>${escapeHTML(r.event.title)}</strong><small>${r.event.mode} · ${escapeHTML(r.team || "Solo / no team name")}</small></div><span class="tag green">DEMO JOINED</span></div>`).join("") : "You haven't joined any demo event yet.";
}
$("profileForm").addEventListener("submit", e => {
  e.preventDefault();
  profile = {name:$("playerName").value.trim(),playerId:$("playerId").value.trim(),phone:$("phone").value.trim()};
  save("bgmi-esports-profile", profile);
  $("profileMessage").textContent = "Profile saved on this device.";
  toast("Player profile saved");
});
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
  renderEvents(button.dataset.filter);
}));
$("tournamentList").addEventListener("click", e => {
  const button = e.target.closest("[data-join]");
  if (!button || button.disabled) return;
  if (!profile || !profile.name || !profile.playerId) {
    toast("Join karne se pehle player profile save karein");
    $("profile").scrollIntoView({behavior:"smooth"});
    $("playerName").focus();
    return;
  }
  selectedEvent = events.find(ev => ev.id === button.dataset.join);
  $("dialogTitle").textContent = selectedEvent.title;
  $("dialogDescription").textContent = `${selectedEvent.mode} · ${selectedEvent.map} · ${selectedEvent.time} · Free demo entry`;
  $("teamName").value = "";
  $("joinDialog").showModal();
});
$("confirmJoin").addEventListener("click", e => {
  e.preventDefault();
  if (!selectedEvent || !profile) return;
  if (registrations.some(r => r.eventId === selectedEvent.id)) {
    $("joinDialog").close(); toast("Already registered for this demo event"); return;
  }
  registrations.push({eventId:selectedEvent.id,team:$("teamName").value.trim(),joinedAt:new Date().toISOString()});
  save("bgmi-esports-registrations", registrations);
  $("joinDialog").close();
  renderEvents(document.querySelector(".filter.active")?.dataset.filter || "All");
  renderRegistrations();
  toast("Demo registration saved!");
});
renderProfile(); renderEvents(); renderRegistrations();

let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); deferredPrompt = e; $("installBtn").classList.remove("hidden");
});
$("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) { toast("Browser menu se Add to Home screen chunein"); return; }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("installBtn").classList.add("hidden");
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
