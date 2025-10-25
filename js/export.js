
export function exportTableToCSV(tbodyId, filename='export.csv'){
  const tbody = document.getElementById(tbodyId);
  if(!tbody) return alert('Tabel tidak ditemukan');
  let rows = [];
  const tr = tbody.closest('table').querySelectorAll('tr');
  tr.forEach(r=>{
    const cells = r.querySelectorAll('th,td');
    const vals = Array.from(cells).map(c=> `"${(c.innerText||'').replaceAll('"','""')}"` );
    rows.push(vals.join(','));
  });
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}
export function printTable(tbodyId){
  const table = document.getElementById(tbodyId)?.closest('table');
  if(!table) return alert('Tabel tidak ditemukan');
  const w = window.open('', '_blank');
  w.document.write('<html><head><title>Cetak</title></head><body>'+table.outerHTML+'</body></html>');
  w.document.close(); w.focus(); w.print(); w.close();
}
