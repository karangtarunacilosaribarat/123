
// toast.js - Cosmic violet glassmorphism toasts
(function(){
  const style = document.createElement('style');
  style.textContent = `.toast-wrap{position:fixed;right:14px;bottom:14px;z-index:9999;display:flex;flex-direction:column;gap:8px}
  .toast{min-width:220px;max-width:340px;background:rgba(142,45,226,.14);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(12px);
    border-radius:14px;padding:10px 12px;color:#fff;box-shadow:0 8px 30px rgba(0,0,0,.35);opacity:0;transform:translateY(6px);transition:all .25s}
  :root.light .toast{color:#222;border-color:rgba(0,0,0,.12)}
  .toast.show{opacity:1;transform:translateY(0)}
  .toast.success{background:rgba(142,45,226,.18)}
  .toast.error{background:rgba(255,64,64,.2)}
  .toast.info{background:rgba(64,128,255,.2)}`;
  document.head.appendChild(style);
  const wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap);
  window.showToast = function(msg, type='info', dur=3000){
    const d=document.createElement('div'); d.className='toast '+type; d.textContent=msg; wrap.appendChild(d);
    requestAnimationFrame(()=> d.classList.add('show'));
    setTimeout(()=>{ d.classList.remove('show'); setTimeout(()=> d.remove(), 250); }, dur);
  };
})();
