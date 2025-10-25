
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const roleTabs = {
  super_admin: ['tab-users','tab-berita','tab-kegiatan','tab-umkm','tab-kas','tab-doc','tab-profil','tab-me'],
  ketua: ['tab-berita','tab-kegiatan','tab-profil','tab-me'],
  wakil_ketua: ['tab-kegiatan','tab-profil','tab-me'],
  sekretaris: ['tab-doc','tab-profil','tab-me'],
  bendahara: ['tab-kas','tab-profil','tab-me'],
  humas_kreatif: ['tab-berita','tab-me'],
  koordinator_umkm: ['tab-umkm','tab-me'],
  keamanan: ['tab-kegiatan','tab-me'],
  anggota: ['tab-me']
};

export function applyRoleUI(role='anggota'){
  const allow = new Set(roleTabs[role]||roleTabs['anggota']);
  ['tab-users','tab-berita','tab-kegiatan','tab-umkm','tab-kas','tab-doc','tab-profil','tab-me'].forEach(id=>{
    const btn = document.getElementById(id+'-btn');
    if(btn){ btn.style.display = allow.has(id) ? '' : 'none'; }
  });
}

export async function enhanceHeaderAvatar(){
  const nav = document.querySelector('.nav-actions');
  if(!nav) return;
  let img = document.getElementById('avatarBtn');
  if(!img){
    img = document.createElement('img');
    img.id='avatarBtn'; img.style.width='28px'; img.style.height='28px'; img.style.borderRadius='50%'; img.style.cursor='pointer'; img.style.border='1px solid rgba(255,255,255,.3)';
    nav.appendChild(img);
  }
  onAuthStateChanged(auth, async (u)=>{
    if(!u){ img.src='assets/logo.svg'; return; }
    try{
      const s = await getDoc(doc(db,'users', u.uid));
      const role = s.exists()? (s.data().role||'anggota') : 'anggota';
      localStorage.setItem('role', role);
      applyRoleUI(role);
      const photo = (s.exists()?s.data().photoURL:null) || u.photoURL || 'assets/logo.svg';
      img.src = photo;
      img.title = (s.data()?.name||u.email||'') + (role? ` • ${role}` : '');
    }catch(e){
      console.error(e);
      img.src='assets/logo.svg';
    }
  });
  img.addEventListener('click', ()=>{
    if(location.pathname.endsWith('dashboard.html')){
      const btn = document.getElementById('tab-me-btn');
      if(btn) btn.click();
      else location.href='dashboard.html#me';
    }else{
      location.href='dashboard.html#me';
    }
  });
}


import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function bindLoginForm(){
  const form = document.getElementById('login-form');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    try{
      await signInWithEmailAndPassword(auth, email, password);
      location.href = 'dashboard.html';
    }catch(e){
      alert('Login gagal: ' + e.message);
    }
  });
}

export function bindLogout(){
  const btn = document.getElementById('logoutBtn');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    await signOut(auth);
    location.href = 'login.html';
  });
}

export function guard(){
  onAuthStateChanged(auth, (u)=>{
    if(!u) location.href='login.html';
  });
}
