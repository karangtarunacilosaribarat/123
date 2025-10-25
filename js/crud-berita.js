
import { setupSearch, setupPagination } from './admin-utils.js';
const searchCtl = setupSearch('search-tbl-berita-admin','tbl-berita-admin');
const pagerCtl = setupPagination('pager-tbl-berita-admin','tbl-berita-admin', 10);

import { db, storage } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const tbody = document.getElementById('tbl-berita-admin');
const form = document.getElementById('form-berita');
const fileInput = document.getElementById('berita-image-file');
const expBtn = document.getElementById('export-berita');
const printBtn = document.getElementById('print-berita');

function tgl(s){ try{ return new Date(s).toLocaleDateString('id-ID'); } catch{ return s; } }

async function uploadImageIfAny(idHint){
  if(!fileInput || !fileInput.files || !fileInput.files[0]) return null;
  const f = fileInput.files[0];
  const r = ref(storage, `berita/${Date.now()}_${f.name}`);
  await uploadBytes(r, f);
  const url = await getDownloadURL(r);
  return url;
}

async function load(){
  const ss = await getDocs(query(collection(db,'berita'), orderBy('date','desc')));
  const __rows = ss.docs.map(d=>{
    const b = d.data();
    return `<tr>
      <td data-label="Tgl">${tgl(b.date)}</td>
      <td data-label="Judul">${b.title||''}</td>
      <td data-label="Kategori">${b.category||''}</td>
      <td><button class="btn" data-edit="${d.id}">Edit</button> <button class="btn ghost" data-del="${d.id}">Hapus</button></td>
    </tr>`;
  });
searchCtl.set(__rows);
pagerCtl.set(__rows);

  tbody.querySelectorAll('[data-edit]').forEach(el=> el.addEventListener('click', ()=>{
    const d = ss.docs.find(x=>x.id===el.dataset.edit);
    const b = d.data();
    form.id.value = d.id; form.date.value = b.date||''; form.title.value=b.title||''; form.category.value=b.category||''; form.image.value=b.image||''; form.content.value=b.content||'';
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  tbody.querySelectorAll('[data-del]').forEach(el=> el.addEventListener('click', async ()=>{
    if(confirm('Hapus berita ini?')){ await deleteDoc(doc(db,'berita', el.dataset.del)); load(); }
  }));
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = {
    date: form.date.value, title: form.title.value, category: form.category.value,
    image: form.image.value, content: form.content.value
  };
  const uploaded = await uploadImageIfAny();
  if(uploaded) payload.image = uploaded;
  if(form.id.value){ await updateDoc(doc(db,'berita',form.id.value), payload); } else { await addDoc(collection(db,'berita'), payload); }
  form.reset(); form.id.value=''; if(fileInput) fileInput.value=''; load();
});

document.getElementById('reset-berita')?.addEventListener('click', ()=>{ form.reset(); form.id.value=''; if(fileInput) fileInput.value=''; });

// Export / Print
import { exportTableToCSV, printTable } from './export.js';
expBtn?.addEventListener('click', ()=> exportTableToCSV('tbl-berita-admin','berita.csv'));
printBtn?.addEventListener('click', ()=> printTable('tbl-berita-admin'));

load();
