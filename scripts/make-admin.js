// Script para asignar rol de admin a un usuario
// Ejecutar con: node scripts/make-admin.js <email>

import admin from 'firebase-admin';

// Configurar Firebase Admin usando variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function makeAdmin(email) {
  try {
    console.log(`Buscando usuario con email: ${email}`);

    // Buscar usuario por email
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      console.log(`❌ No se encontró usuario con email: ${email}`);
      console.log('Usuarios registrados:');
      const allUsers = await usersRef.get();
      allUsers.forEach(doc => {
        console.log(`- ${doc.data().email} (${doc.data().role || 'user'})`);
      });
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Actualizar el rol a admin
    await userDoc.ref.update({
      role: 'admin'
    });

    console.log(`✅ Usuario ${email} ahora es admin`);
    console.log(`UID: ${userDoc.id}`);
    console.log(`Nombre: ${userData.displayName || 'Sin nombre'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

// Obtener email desde argumentos de línea de comandos
const email = process.argv[2];
if (!email) {
  console.log('Uso: node scripts/make-admin.js <email>');
  console.log('Ejemplo: node scripts/make-admin.js admin@example.com');
  process.exit(1);
}

makeAdmin(email);