
import { setupSearch, setupPagination } from './admin-utils.js';
const searchCtl = setupSearch('search-tbl-umkm','tbl-umkm');
const pagerCtl = setupPagination('pager-tbl-umkm','tbl-umkm', 10);

import { db } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.getElementById('tbl-umkm');
const form = document.getElementById('form-umkm');
const expBtn = document.getElementById('export-umkm');
const printBtn = document.getElementById('print-umkm');

async function load(){
  const ss = await getDocs(query(collection(db,'umkm'), orderBy('name','asc')));
  const __rows = ss.docs.map(d=>{
    const u = d.data();
    return `<tr>
      <td data-label="Nama">${u.name||''}</td>
      <td data-label="Kategori">${u.category||''}</td>
      <td data-label="Pemilik">${u.owner||''}</td>
      <td data-label="Telepon">${u.phone||''}</td>
      <td><button class="btn" data-edit="${d.id}">Edit</button> <button class="btn ghost" data-del="${d.id}">Hapus</button></td>
    </tr>`;
  });
searchCtl.set(__rows);
pagerCtl.set(__rows);
  tbody.querySelectorAll('[data-edit]').forEach(el=> el.addEventListener('click', ()=>{
    const d=ss.docs.find(x=>x.id===el.dataset.edit); const u=d.data();
    form.id.value=d.id; form.name.value=u.name||''; form.owner.value=u.owner||''; form.phone.value=u.phone||''; form.category.value=u.category||''; form.address.value=u.address||''; form.desc.value=u.desc||'';
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  tbody.querySelectorAll('[data-del]').forEach(el=> el.addEventListener('click', async ()=>{
    if(confirm('Hapus UMKM?')){ await deleteDoc(doc(db,'umkm', el.dataset.del)); load(); }
  }));
}
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = { name: form.name.value, owner: form.owner.value, phone: form.phone.value, category: form.category.value, address: form.address.value, desc: form.desc.value };
  if(form.id.value){ await updateDoc(doc(db,'umkm',form.id.value), payload); } else { await addDoc(collection(db,'umkm'), payload); }
  form.reset(); form.id.value=''; load();
});

import { exportTableToCSV, printTable } from './export.js';
expBtn?.addEventListener('click', ()=> exportTableToCSV('tbl-umkm','umkm.csv'));
printBtn?.addEventListener('click', ()=> printTable('tbl-umkm'));

load();
