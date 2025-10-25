
import { auth, db, ts } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { collection, getDocs, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const form = document.getElementById('register-form');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // reCAPTCHA v3 (client-only placeholder)
    let token = null;
    if(window.grecaptcha){
      token = await window.grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // determine role: first user becomes super_admin
    const usersSnap = await getDocs(collection(db, 'users'));
    const first = usersSnap.empty;
    const role = first ? 'super_admin' : 'anggota';

    await setDoc(doc(db,'users', cred.user.uid), {
      uid: cred.user.uid, name, email, role, createdAt: ts()
    }, { merge:true });

    showToast('Registrasi berhasil! Mengarahkan ke dashboard...', 'success');
    setTimeout(()=> location.href = 'dashboard.html', 700);
  }catch(err){
    console.error(err);
    showToast('Gagal daftar: ' + (err?.message||'unknown'), 'error');
  }
});
