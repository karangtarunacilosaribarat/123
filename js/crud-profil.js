
import { db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('form-profil');

async function load(){
  const s = await getDoc(doc(db,'profil','main'));
  if(s.exists()){
    const p=s.data();
    form.name.value=p.name||''; form.tagline.value=p.tagline||''; form.about.value=p.about||''; form.wa.value=p.wa||''; form.address.value=p.address||'';
  }
}
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  await setDoc(doc(db,'profil','main'), {
    name: form.name.value, tagline: form.tagline.value, about: form.about.value, wa: form.wa.value, address: form.address.value
  }, {merge:true});
  alert('Profil disimpan.');
});
load();
