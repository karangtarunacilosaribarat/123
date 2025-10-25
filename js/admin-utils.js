
export function setupSearch(inputId, tableBodyId){
  const inp = document.getElementById(inputId);
  const tb = document.getElementById(tableBodyId);
  if(!inp || !tb) return ()=>{};
  let data = [];
  function render(rows){ tb.innerHTML = rows.map(r=> r).join('') || '<tr><td colspan="10">Tidak ada data.</td></tr>'; }
  function set(newData){ data = newData.slice(); render(data); }
  inp.addEventListener('input', ()=>{
    const q = (inp.value||'').toLowerCase();
    const filtered = data.filter(html=> html.toLowerCase().includes(q));
    render(filtered);
  });
  return { set, render };
}

export function setupPagination(pagerId, tableBodyId, pageSize = 10){
  const wrap = document.getElementById(pagerId);
  const tb = document.getElementById(tableBodyId);
  if(!wrap || !tb) return ()=>{};
  wrap.innerHTML = `<div class="pagination" style="display:flex;gap:8px;justify-content:flex-end;margin:8px 0">
    <button class="btn ghost" id="${pagerId}-prev">←</button>
    <span class="badge" id="${pagerId}-info">Halaman 1</span>
    <button class="btn ghost" id="${pagerId}-next">→</button>
  </div>`;
  const prev = document.getElementById(`${pagerId}-prev`);
  const next = document.getElementById(`${pagerId}-next`);
  const info = document.getElementById(`${pagerId}-info`);

  let rows = [];
  let page = 1;

  function render(){
    const start = (page-1)*pageSize;
    const chunk = rows.slice(start, start+pageSize);
    tb.innerHTML = chunk.join('') || '<tr><td colspan="10">Tidak ada data.</td></tr>';
    info.textContent = `Halaman ${page} / ${Math.max(1, Math.ceil(rows.length/pageSize))}`;
    prev.disabled = (page<=1);
    next.disabled = (page>=Math.ceil(rows.length/pageSize));
  }
  function set(newRows){
    rows = newRows.slice();
    page = 1;
    render();
  }
  prev.addEventListener('click', ()=>{ if(page>1){ page--; render(); } });
  next.addEventListener('click', ()=>{ if(page<Math.ceil(rows.length/pageSize)){ page++; render(); } });
  return { set, render };
}
