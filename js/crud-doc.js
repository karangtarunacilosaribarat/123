
import { setupSearch, setupPagination } from './admin-utils.js';
const searchCtl = setupSearch('search-tbl-doc-admin','tbl-doc-admin');
const pagerCtl = setupPagination('pager-tbl-doc-admin','tbl-doc-admin', 10);

import { db, storage } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const tbody = document.getElementById('tbl-doc-admin');
const form = document.getElementById('form-doc');
const fileInput = document.getElementById('dok-file');
const expBtn = document.getElementById('export-dok');
const printBtn = document.getElementById('print-dok');

function tgl(s){ try{ return new Date(s).toLocaleDateString('id-ID'); } catch{ return s; } }

async function uploadFileIfAny(){
  if(!fileInput || !fileInput.files || !fileInput.files[0]) return null;
  const f = fileInput.files[0];
  const r = ref(storage, `dokumen/${Date.now()}_${f.name}`);
  await uploadBytes(r, f);
  const url = await getDownloadURL(r);
  return url;
}

async function load(){
  const ss = await getDocs(query(collection(db,'dokumen'), orderBy('date','desc')));
  const __rows = ss.docs.map(d=>{
    const r=d.data();
    const link = r.fileUrl ? `<a class="badge" target="_blank" href="${r.fileUrl}">Lihat</a>` : '';
    return `<tr>
      <td data-label="Tgl">${tgl(r.date)}</td>
      <td data-label="Nomor">${r.number||''}</td>
      <td data-label="Jenis">${r.type||''}</td>
      <td data-label="Judul">${r.title||''} ${link}</td>
      <td><button class="btn" data-edit="${d.id}">Edit</button> <button class="btn ghost" data-del="${d.id}">Hapus</button></td>
    </tr>`;
  });
searchCtl.set(__rows);
pagerCtl.set(__rows);
  tbody.querySelectorAll('[data-edit]').forEach(el=> el.addEventListener('click', ()=>{
    const d=ss.docs.find(x=>x.id===el.dataset.edit); const r=d.data();
    form.id.value=d.id; form.date.value=r.date||''; form.number.value=r.number||''; form.type.value=r.type||''; form.title.value=r.title||'';
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  tbody.querySelectorAll('[data-del]').forEach(el=> el.addEventListener('click', async ()=>{
    if(confirm('Hapus dokumen?')){ await deleteDoc(doc(db,'dokumen', el.dataset.del)); load(); }
  }));
}
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = { date: form.date.value, number: form.number.value, type: form.type.value, title: form.title.value };
  const uploaded = await uploadFileIfAny();
  if(uploaded) payload.fileUrl = uploaded;
  if(form.id.value){ await updateDoc(doc(db,'dokumen',form.id.value), payload); } else { await addDoc(collection(db,'dokumen'), payload); }
  form.reset(); form.id.value=''; if(fileInput) fileInput.value=''; load();
});

import { exportTableToCSV, printTable } from './export.js';
expBtn?.addEventListener('click', ()=> exportTableToCSV('tbl-doc-admin','dokumen.csv'));
printBtn?.addEventListener('click', ()=> printTable('tbl-doc-admin'));

load();
