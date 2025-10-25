
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
