
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

function paginate(arr, page=1, per=10){ const s=(page-1)*per; return arr.slice(s, s+per); }
function numberOfPages(arr, per=10){ return Math.max(1, Math.ceil(arr.length/per)); }
function setPager(el, total, page, onChange){
  el.innerHTML = `<div style="display:flex;gap:8px;justify-content:flex-end;margin:8px 0">
    <button class="btn ghost" id="pg-prev">←</button>
    <span class="badge">Hal ${page}/${total}</span>
    <button class="btn ghost" id="pg-next">→</button>
  </div>`;
  el.querySelector('#pg-prev').disabled = page<=1;
  el.querySelector('#pg-next').disabled = page>=total;
  el.querySelector('#pg-prev').onclick = ()=> onChange(page-1);
  el.querySelector('#pg-next').onclick = ()=> onChange(page+1);
}

export async function initBerita(){
  const tbody = document.getElementById('tbl-berita'); if(!tbody) return;
  const q = query(collection(db,'berita'), orderBy('date','desc'));
  const ss = await getDocs(q);
  let rows = ss.docs.map(d=> ({id:d.id, ...d.data()}));
  const inp = document.getElementById('q'); const from = document.getElementById('from'); const to = document.getElementById('to');
  const pager = document.getElementById('pager'); let page=1;
  function render(){
    let data = rows.filter(r=> (inp.value? (r.title||'').toLowerCase().includes(inp.value.toLowerCase()) : true));
    if(from.value) data = data.filter(r=> (r.date||'') >= from.value);
    if(to.value) data = data.filter(r=> (r.date||'') <= to.value);
    const total = numberOfPages(data, 10); page = Math.min(page,total);
    const chunk = paginate(data, page, 10);
    tbody.innerHTML = chunk.map(r=> `<tr>
      <td data-label="Tgl">${r.date||''}</td>
      <td data-label="Judul"><a class="link" href="berita.html?id=${r.id}">${r.title||''}</a></td>
      <td data-label="Kategori">${r.category||''}</td>
    </tr>`).join('') || '<tr><td colspan="3">Tidak ada data.</td></tr>';
    setPager(pager, total, page, (p)=>{ page=p; render(); });
  }
  [inp,from,to].forEach(el=> el && el.addEventListener('input', ()=>{ page=1; render(); }));
  render();
}

export async function initKegiatan(){
  const tbody = document.getElementById('tbl-kegiatan'); if(!tbody) return;
  const qy = query(collection(db,'kegiatan'), orderBy('date','desc'));
  const ss = await getDocs(qy);
  let rows = ss.docs.map(d=> ({id:d.id, ...d.data()}));
  const inp = document.getElementById('q'); const from = document.getElementById('from'); const to = document.getElementById('to');
  const pager = document.getElementById('pager'); let page=1;
  function render(){
    let data = rows.filter(r=> (inp.value? (r.title||'').toLowerCase().includes(inp.value.toLowerCase()) : true));
    if(from.value) data = data.filter(r=> (r.date||'') >= from.value);
    if(to.value) data = data.filter(r=> (r.date||'') <= to.value);
    const total = numberOfPages(data, 10); page = Math.min(page,total);
    const chunk = paginate(data, page, 10);
    tbody.innerHTML = chunk.map(r=> `<tr>
      <td data-label="Tgl">${r.date||''}</td>
      <td data-label="Judul"><a class="link" href="kegiatan.html?id=${r.id}">${r.title||''}</a></td>
      <td data-label="Lokasi">${r.location||''}</td>
    </tr>`).join('') || '<tr><td colspan="3">Tidak ada data.</td></tr>';
    setPager(pager, total, page, (p)=>{ page=p; render(); });
  }
  [inp,from,to].forEach(el=> el && el.addEventListener('input', ()=>{ page=1; render(); }));
  render();
}

export async function initUMKM(){
  const tbody = document.getElementById('tbl-umkm'); if(!tbody) return;
  const qy = query(collection(db,'umkm'), orderBy('name','asc'));
  const ss = await getDocs(qy);
  let rows = ss.docs.map(d=> ({id:d.id, ...d.data()}));
  const inp = document.getElementById('q'); const cat = document.getElementById('cat');
  const pager = document.getElementById('pager'); let page=1;
  // build category options
  const cats = Array.from(new Set(rows.map(r=> r.category||'').filter(Boolean))).sort();
  cat.innerHTML = '<option value="">Semua Kategori</option>' + cats.map(c=> `<option>${c}</option>`).join('');
  function render(){
    let data = rows.filter(r=> (inp.value? (r.name||'').toLowerCase().includes(inp.value.toLowerCase()) : true));
    if(cat.value) data = data.filter(r=> (r.category||'') === cat.value);
    const total = numberOfPages(data, 10); page = Math.min(page,total);
    const chunk = paginate(data, page, 10);
    tbody.innerHTML = chunk.map(r=> `<tr>
      <td data-label="Nama"><a class="link" href="umkm-detail.html?id=${r.id}">${r.name||''}</a></td>
      <td data-label="Kategori">${r.category||''}</td>
      <td data-label="Telepon">${r.phone||''}</td>
    </tr>`).join('') || '<tr><td colspan="3">Tidak ada data.</td></tr>';
    setPager(pager, total, page, (p)=>{ page=p; render(); });
  }
  [inp,cat].forEach(el=> el && el.addEventListener('input', ()=>{ page=1; render(); }));
  render();
}

export async function initDokumen(){
  const tbody = document.getElementById('tbl-doc'); if(!tbody) return;
  const qy = query(collection(db,'dokumen'), orderBy('date','desc'));
  const ss = await getDocs(qy);
  let rows = ss.docs.map(d=> ({id:d.id, ...d.data()}));
  const inp = document.getElementById('q'); const jenis = document.getElementById('jenis');
  const pager = document.getElementById('pager'); let page=1;
  const types = Array.from(new Set(rows.map(r=> r.type||'').filter(Boolean))).sort();
  jenis.innerHTML = '<option value="">Semua Jenis</option>' + types.map(t=> `<option>${t}</option>`).join('');
  function render(){
    let data = rows.filter(r=> (inp.value? (r.title||'').toLowerCase().includes(inp.value.toLowerCase()) : true));
    if(jenis.value) data = data.filter(r=> (r.type||'')===jenis.value);
    const total = numberOfPages(data, 10); page = Math.min(page,total);
    const chunk = paginate(data, page, 10);
    tbody.innerHTML = chunk.map(r=> `<tr>
      <td data-label="Tgl">${r.date||''}</td>
      <td data-label="Nomor">${r.number||''}</td>
      <td data-label="Jenis">${r.type||''}</td>
      <td data-label="Judul"><a class="link" href="dokumen-detail.html?id=${r.id}">${r.title||''}</a></td>
    </tr>`).join('') || '<tr><td colspan="4">Tidak ada data.</td></tr>';
    setPager(pager, total, page, (p)=>{ page=p; render(); });
  }
  [inp,jenis].forEach(el=> el && el.addEventListener('input', ()=>{ page=1; render(); }));
  render();
}
