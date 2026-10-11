import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4Qb_xT-Q33qowX-DIXohPj6TGYETk59o",
  authDomain: "tembo-page-prod-25.firebaseapp.com",
  projectId: "tembo-page-prod-25",
  storageBucket: "tembo-page-prod-25.firebasestorage.app",
  messagingSenderId: "130718915454",
  appId: "1:130718915454:web:0fbcd5c8161185ffe0312f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function copyProfile() {
  const sourceRef = doc(db, 'creators', 'elenarust');
  const sourceSnap = await getDoc(sourceRef);
  if (!sourceSnap.exists()) {
    console.error("Source document elenarust does not exist!");
    process.exit(1);
  }

  const data = sourceSnap.data();
  console.log("Found profile data:", data);

  const targets = ['mycinetoolbox', 'aaron', 'aaronstowers', 'cinetoolbox'];
  for (const target of targets) {
    const targetRef = doc(db, 'creators', target);
    const targetSnap = await getDoc(targetRef);
    const targetData = targetSnap.exists() ? targetSnap.data() : {};
    const mergedData = {
      ...data,
      avatarUrl: targetData.avatarUrl || data.avatarUrl || null,
      customBgUrl: targetData.customBgUrl || data.customBgUrl || '',
      tier: 'pro'
    };
    await setDoc(targetRef, mergedData);
    console.log(`Successfully copied/merged profile to creators/${target}`);
  }
}

copyProfile().then(() => {
  console.log("Copy completed!");
  process.exit(0);
}).catch(err => {
  console.error("Error copying profile:", err);
  process.exit(1);
});
