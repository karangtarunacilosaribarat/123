
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

(function(){
  const nav = document.querySelector('.nav-actions');
  if(!nav) return;
  const btnLogin = document.createElement('a'); btnLogin.href='login.html'; btnLogin.className='btn ghost'; btnLogin.textContent='Login';
  const btnReg = document.createElement('a'); btnReg.href='register.html'; btnReg.className='btn'; btnReg.textContent='Daftar';
  const avatar = document.createElement('img'); avatar.style.cssText='width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.3);cursor:pointer;display:none';
  avatar.id='avatarNav';
  nav.appendChild(btnLogin); nav.appendChild(btnReg); nav.appendChild(avatar);

  onAuthStateChanged(auth, async (u)=>{
    if(!u){
      btnLogin.style.display=''; btnReg.style.display=''; avatar.style.display='none';
      return;
    }
    btnLogin.style.display='none'; btnReg.style.display='none'; avatar.style.display='inline-block';
    try{
      const s = await getDoc(doc(db,'users',u.uid));
      const photo = (s.exists()?s.data().photoURL:null) || u.photoURL || 'assets/logo.svg';
      avatar.src = photo; avatar.title = (s.data()?.name || u.email || '');
    }catch{ avatar.src='assets/logo.svg'; }
  });
  avatar.addEventListener('click', ()=> location.href='dashboard.html#me');
})();
