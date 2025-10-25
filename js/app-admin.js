
import { guard } from './app-auth.js';
guard();

const map = {
  'tab-berita': ()=> import('./crud-berita.js'),
  'tab-kegiatan': ()=> import('./crud-kegiatan.js'),
  'tab-umkm': ()=> import('./crud-umkm.js'),
  'tab-kas': ()=> import('./crud-kas.js'),
  'tab-doc': ()=> import('./crud-doc.js'),
  'tab-profil': ()=> import('./crud-profil.js'),
};
const loaded = new Set();

function showTab(id){
  ['tab-berita','tab-kegiatan','tab-umkm','tab-kas','tab-doc','tab-profil','tab-users'].forEach(x=>{
    const el=document.getElementById(x);
    const btn=document.getElementById(x+'-btn');
    if(el){ el.style.display = (x===id)?'block':'none'; el.classList.toggle('active', x===id); }
    if(btn){ btn.classList.toggle('active', x===id); }
  });
  if(map[id] && !loaded.has(id)){
    map[id]().then(()=> loaded.add(id)).catch(err=> alert('Gagal memuat modul: '+err.message));
  }
}

['tab-users','tab-berita','tab-kegiatan','tab-umkm','tab-kas','tab-doc','tab-profil'].forEach(x=>{
  document.getElementById(x+'-btn')?.addEventListener('click', ()=> showTab(x));
});

// show first visible tab by default
const first = ['tab-users','tab-berita','tab-kegiatan','tab-umkm','tab-kas','tab-doc','tab-profil']
  .map(x=>document.getElementById(x+'-btn'))
  .find(b=> b && getComputedStyle(b).display!=='none');
if(first){ showTab(first.id.replace('-btn','')); }
