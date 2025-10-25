
import { setupSearch, setupPagination } from './admin-utils.js';
const searchCtl = setupSearch('search-tbl-kas-admin','tbl-kas-admin');
const pagerCtl = setupPagination('pager-tbl-kas-admin','tbl-kas-admin', 10);

import { db } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tbody = document.getElementById('tbl-kas-admin');
const form = document.getElementById('form-kas');
const expBtn = document.getElementById('export-kas');
const printBtn = document.getElementById('print-kas');

function tgl(s){ try{ return new Date(s).toLocaleDateString('id-ID'); } catch{ return s; } }
function num(n){ try{ return Number(n||0); } catch{ return 0; } }

async function load(){
  const ss = await getDocs(query(collection(db,'kas'), orderBy('date','desc')));
  const __rows = ss.docs.map(d=>{
    const k = d.data();
    return `<tr>
      <td data-label="Tgl">${tgl(k.date)}</td>
      <td data-label="Keterangan">${k.desc||''}</td>
      <td data-label="Kategori">${k.category||''}</td>
      <td data-label="Jenis">${k.type||''}</td>
      <td data-label="Nominal">${num(k.amount)}</td>
      <td><button class="btn" data-edit="${d.id}">Edit</button> <button class="btn ghost" data-del="${d.id}">Hapus</button></td>
    </tr>`;
  });
searchCtl.set(__rows);
pagerCtl.set(__rows);
  tbody.querySelectorAll('[data-edit]').forEach(el=> el.addEventListener('click', ()=>{
    const d=ss.docs.find(x=>x.id===el.dataset.edit); const k=d.data();
    form.id.value=d.id; form.date.value=k.date||''; form.desc.value=k.desc||''; form.category.value=k.category||''; form.type.value=k.type||''; form.amount.value=k.amount||0;
    window.scrollTo({top:0,behavior:'smooth'});
  }));
  tbody.querySelectorAll('[data-del]').forEach(el=> el.addEventListener('click', async ()=>{
    if(confirm('Hapus transaksi?')){ await deleteDoc(doc(db,'kas', el.dataset.del)); load(); }
  }));
}
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = { date: form.date.value, desc: form.desc.value, category: form.category.value, type: form.type.value, amount: num(form.amount.value) };
  if(form.id.value){ await updateDoc(doc(db,'kas',form.id.value), payload); } else { await addDoc(collection(db,'kas'), payload); }
  form.reset(); form.id.value=''; load();
});

import { exportTableToCSV, printTable } from './export.js';
expBtn?.addEventListener('click', ()=> exportTableToCSV('tbl-kas-admin','kas.csv'));
printBtn?.addEventListener('click', ()=> printTable('tbl-kas-admin'));

load();
