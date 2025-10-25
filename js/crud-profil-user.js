
import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';
import { enhanceHeaderAvatar } from './app-auth.js';

enhanceHeaderAvatar();

const form = document.getElementById('form-me');
const imgPrev = document.getElementById('me-photo-preview');
const fileInput = document.getElementById('me-photo');
const roleBadge = document.getElementById('me-role');

onAuthStateChanged(auth, async (u)=>{
  if(!u) return;
  try{
    const s = await getDoc(doc(db,'users', u.uid));
    const d = s.exists()? s.data() : {};
    form.name.value = d.name || u.displayName || '';
    form.email.value = d.email || u.email || '';
    form.wa.value = d.wa || '';
    roleBadge.textContent = 'Role: ' + (d.role || 'anggota');
    imgPrev.src = d.photoURL || u.photoURL || 'assets/logo.svg';
  }catch(e){ console.error(e); }
});

fileInput?.addEventListener('change', ()=>{
  const f = fileInput.files?.[0]; if(!f) return;
  const url = URL.createObjectURL(f); imgPrev.src = url;
});

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const u = auth.currentUser; if(!u) return;
  let photoURL = null;
  if(fileInput && fileInput.files && fileInput.files[0]){
    const r = ref(storage, `profile_photos/${u.uid}.jpg`);
    await uploadBytes(r, fileInput.files[0]);
    photoURL = await getDownloadURL(r);
  }
  const payload = { name: form.name.value, email: form.email.value, wa: form.wa.value };
  if(photoURL) payload.photoURL = photoURL;
  await setDoc(doc(db,'users', u.uid), payload, { merge:true });
  showToast('Profil disimpan!', 'success');
});
