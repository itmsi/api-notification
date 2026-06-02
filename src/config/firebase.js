/**
 * Firebase Admin SDK Initialization
 *
 * Menggunakan environment variables untuk konfigurasi.
 * Tidak ada credentials yang di-hardcode.
 */

const admin = require('firebase-admin')

let firebaseApp = null

/**
 * Initialize Firebase Admin SDK
 * @returns {admin.app.App} Firebase app instance
 */
const initFirebase = () => {
  if (firebaseApp) {
    return firebaseApp
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase configuration is incomplete. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env'
    )
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      // Replace literal \n with actual newlines (needed when set via env)
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  })

  console.log(`[Firebase] Initialized for project: ${projectId}`)
  return firebaseApp
}

/**
 * Get Firebase Messaging instance
 * @returns {admin.messaging.Messaging}
 */
const getMessaging = () => {
  initFirebase()
  return admin.messaging()
}

/**
 * Check if Firebase is properly initialized
 * @returns {{ ok: boolean, projectId: string|null }}
 */
const checkFirebaseHealth = () => {
  try {
    initFirebase()
    return {
      ok: true,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    }
  }
}

module.exports = {
  initFirebase,
  getMessaging,
  checkFirebaseHealth,
}
