
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function load(){
  const beritaEl = document.getElementById('berita-cards');
  const kegEl = document.getElementById('kegiatan-rows');
  const umkmEl = document.getElementById('umkm-rows');
  try{
    const br = await getDocs(query(collection(db,'berita'), orderBy('date','desc')));
    beritaEl.innerHTML = br.docs.slice(0,3).map(d=>{
      const b = d.data();
      return `<a class="card" href="berita.html?id=${d.id}" style="text-decoration:none;color:inherit">
        ${b.image?`<img src="${b.image}" style="width:100%;height:140px;object-fit:cover;border-radius:10px">`:''}
        <h3>${b.title||''}</h3>
        <div class="badge">${b.category||''}</div>
      </a>`;
    }).join('') || '<div class="card">Belum ada berita.</div>';

    const kg = await getDocs(query(collection(db,'kegiatan'), orderBy('date','asc')));
    kegEl.innerHTML = kg.docs.slice(0,3).map(d=>{
      const k=d.data();
      const t = new Date(k.date||Date.now()).toLocaleDateString('id-ID');
      return `<tr><td data-label="Tanggal">${t}</td><td data-label="Judul">${k.title||''}</td><td data-label="Lokasi">${k.location||''}</td></tr>`;
    }).join('') || '<tr><td colspan="3">Belum ada kegiatan.</td></tr>';

    const um = await getDocs(query(collection(db,'umkm'), orderBy('name','asc')));
    umkmEl.innerHTML = um.docs.slice(0,3).map(d=>{
      const u=d.data();
      return `<tr><td data-label="Nama">${u.name||''}</td><td data-label="Kategori">${u.category||''}</td><td data-label="Telepon">${u.phone||''}</td></tr>`;
    }).join('') || '<tr><td colspan="3">Belum ada UMKM.</td></tr>';
  }catch(e){
    console.error(e);
  }
}
load();
