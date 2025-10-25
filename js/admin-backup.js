
import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function dumpCollection(name){
  const ss = await getDocs(collection(db,name));
  return ss.docs.map(d=> ({ id:d.id, ...d.data() }));
}

document.getElementById('btn-backup')?.addEventListener('click', async ()=>{
  const names = ['berita','kegiatan','umkm','kas','dokumen','profil'];
  const data = {};
  for(const n of names){ data[n] = await dumpCollection(n); }
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'backup-karteji.json'; a.click();
});

document.getElementById('btn-restore')?.addEventListener('click', async ()=>{
  const input = document.getElementById('restore-file');
  if(!input || !input.files || !input.files[0]) return alert('Pilih file JSON dulu.');
  const txt = await input.files[0].text();
  const data = JSON.parse(txt);
  const names = Object.keys(data||{});
  for(const col of names){
    for(const item of data[col]){
      const id = item.id || undefined;
      const copy = { ...item }; delete copy.id;
      if(id) await setDoc(doc(db,col,id), copy, {merge:true});
    }
  }
  alert('Restore selesai.');
});
