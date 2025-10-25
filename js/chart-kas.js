
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function countCol(name){
  const ss = await getDocs(collection(db, name));
  return ss.size;
}
async function getKasSeries(){
  const ss = await getDocs(collection(db,'kas'));
  const byMonth = {};
  ss.forEach(d=>{
    const r=d.data(); const dt = new Date(r.date||Date.now());
    const k = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
    const val = Number(r.amount||0) * (String(r.type).toLowerCase()==='pengeluaran' ? -1 : 1);
    byMonth[k] = (byMonth[k]||0) + val;
  });
  const keys = Object.keys(byMonth).sort();
  let saldo = 0; const labels=[]; const data=[];
  keys.forEach(k=>{ saldo += byMonth[k]; labels.push(k); data.push(saldo); });
  return {labels, data, saldo};
}

async function boot(){
  try{
    const [b,k,u,d] = await Promise.all([countCol('berita'), countCol('kegiatan'), countCol('umkm'), countCol('dokumen')]);
    document.getElementById('ov-berita-val').textContent = b;
    document.getElementById('ov-kegiatan-val').textContent = k;
    document.getElementById('ov-umkm-val').textContent = u;
    document.getElementById('ov-dok-val').textContent = d;

    const {labels, data, saldo} = await getKasSeries();
    document.getElementById('ov-saldo-val').textContent = new Intl.NumberFormat('id-ID').format(data.length?data[data.length-1]:0);

    const ctx = document.getElementById('chartKas').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Saldo Kas', data, tension: .3, fill: false }] },
      options: { plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}}, y:{grid:{color:'rgba(255,255,255,.08)'}}} }
    });
  }catch(e){ console.error(e); }
}
boot();
