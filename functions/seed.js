const admin = require('firebase-admin');
admin.initializeApp({
  projectId: 'tembo-page-prod-25'
});
const db = admin.firestore();

async function run() {
  await db.collection('beta_keys').doc('beta-tester-2026').set({
    assignedTo: 'max',
    active: true,
    createdAt: new Date().toISOString()
  });
  console.log('Done');
}
run();
