
import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.getElementById('tbl-users');
const search = document.getElementById('user-search');
const roleSel = document.getElementById('user-role-select');
const applyBtn = document.getElementById('user-apply-role');
let cache = [];

async function load(){
  const ss = await getDocs(collection(db,'users'));
  cache = ss.docs.map(d=> ({ id:d.id, ...(d.data()) }));
  render(cache);
}
function row(u){
  const nm = u.name || u.displayName || '';
  return `<tr>
    <td data-label="Email">${u.email||u.uid||u.id}</td>
    <td data-label="Nama">${nm}</td>
    <td data-label="Role">${u.role||'anggota'}</td>
    <td><button class="btn" data-id="${u.id}">Pilih</button></td>
  </tr>`;
}
function render(list){
  tbody.innerHTML = list.map(row).join('') || '<tr><td colspan="10">Belum ada data.</td></tr>';
  tbody.querySelectorAll('button[data-id]').forEach(b=> b.addEventListener('click', ()=>{
    const u = cache.find(x=> x.id===b.dataset.id);
    if(!u) return;
    roleSel.value = u.role || 'anggota';
    roleSel.dataset.uid = u.id;
  }));
}
search?.addEventListener('input', ()=>{
  const q = (search.value||'').toLowerCase();
  render(cache.filter(u=> (u.email||'').toLowerCase().includes(q) || (u.name||'').toLowerCase().includes(q)));
});
applyBtn?.addEventListener('click', async ()=>{
  const uid = roleSel.dataset.uid;
  const role = roleSel.value;
  if(!uid) return alert('Pilih pengguna dulu dari tabel.');
  await setDoc(doc(db,'users', uid), { role }, { merge:true });
  alert('Role diperbarui.'); load();
});
load();
