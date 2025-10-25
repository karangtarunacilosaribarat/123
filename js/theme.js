
(function(){
  const badge = document.getElementById('modeBadge');
  const themeBtn = document.getElementById('themeToggle');
  function applyMode(){
    const w = window.innerWidth;
    document.body.classList.remove('mobile','compact');
    if(w <= 768) document.body.classList.add('mobile');
    else if(w <= 1023) document.body.classList.add('compact');
    if(badge){
      badge.textContent = 'Mode: ' + (document.body.classList.contains('mobile') ? 'Mobile' : (document.body.classList.contains('compact') ? 'Compact' : 'Desktop'));
    }
  }
  function applyTheme(initial=false){
    const pref = initial ? (localStorage.getItem('theme')||'dark') : document.documentElement.classList.contains('light')?'dark':'light';
    if(pref==='light'){ document.documentElement.classList.add('light'); } else { document.documentElement.classList.remove('light'); }
    localStorage.setItem('theme', pref);
    if(themeBtn) themeBtn.textContent = document.documentElement.classList.contains('light') ? '🌙' : '☀️';
  }
  window.addEventListener('resize', applyMode);
  window.addEventListener('load', ()=>{ applyMode(); applyTheme(true); });
  themeBtn && themeBtn.addEventListener('click', ()=>{ applyTheme(false); });
})();
