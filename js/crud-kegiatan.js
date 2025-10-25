
import { setupSearch, setupPagination } from './admin-utils.js';
const searchCtl = setupSearch('search-tbl-kegiatan','tbl-kegiatan');
const pagerCtl = setupPagination('pager-tbl-kegiatan','tbl-kegiatan', 10);

import { db } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.getElementById('tbl-kegiatan');
const form = document.getElementById('form-kegiatan');
const expBtn = document.getElementById('export-kegiatan');
const printBtn = document.getElementById('print-kegiatan');

function tgl(s){ try{ return new Date(s).toLocaleDateString('id-ID'); } catch{ return s; } }

async function load(){
  const ss = await getDocs(query(collection(db,'kegiatan'), orderBy('date','desc')));
  const __rows = ss.docs.map(d=>{
    const k=d.data();
    return `<tr>
      <td data-label="Tgl">${tgl(k.date)}</td>
      <td data-label="Judul">${k.title||''}</td>
      <td data-label="Lokasi">${k.location||''}</td>
      <td><button class="btn" data-edit="${d.id}">Edit</button> <button class="btn ghost" data-del="${d.id}">Hapus</button></td>
    </tr>`;
  });
searchCtl.set(__rows);
pagerCtl.set(__rows);
  tbody.querySelectorAll('[data-edit]').forEach(el=> el.addEventListener('click', ()=>{
    const d=ss.docs.find(x=>x.id===el.dataset.edit); const k=d.data();
    form.id.value=d.id; form.date.value=k.date||''; form.title.value=k.title||''; form.location.value=k.location||''; form.desc.value=k.desc||'';
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  tbody.querySelectorAll('[data-del]').forEach(el=> el.addEventListener('click', async ()=>{
    if(confirm('Hapus kegiatan?')){ await deleteDoc(doc(db,'kegiatan', el.dataset.del)); load(); }
  }));
}
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = { date: form.date.value, title: form.title.value, location: form.location.value, desc: form.desc.value };
  if(form.id.value){ await updateDoc(doc(db,'kegiatan',form.id.value), payload); } else { await addDoc(collection(db,'kegiatan'), payload); }
  form.reset(); form.id.value=''; load();
});

import { exportTableToCSV, printTable } from './export.js';
expBtn?.addEventListener('click', ()=> exportTableToCSV('tbl-kegiatan','kegiatan.csv'));
printBtn?.addEventListener('click', ()=> printTable('tbl-kegiatan'));

load();
