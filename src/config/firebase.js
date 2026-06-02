/**
 * Firebase Admin SDK Initialization
 *
 * Menggunakan environment variables untuk konfigurasi.
 * Tidak ada credentials yang di-hardcode.
 *
 * FIREBASE_PRIVATE_KEY di file .env dapat disimpan dalam 3 format:
 *
 *  1. Tanpa quotes, \n literal (paling umum):
 *     FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
 *
 *  2. Dengan double quotes (dotenv v16 auto-parse \n → newline):
 *     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
 *
 *  3. JSON-escaped (saat copy dari service account JSON langsung):
 *     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"
 *
 * Fungsi normalizePrivateKey() menangani semua kasus di atas.
 */

const admin = require('firebase-admin')

let firebaseApp = null

/**
 * Normalize FIREBASE_PRIVATE_KEY dari berbagai format .env ke format
 * yang dibutuhkan Firebase Admin SDK (actual newline characters '\n').
 *
 * @param {string} key - Raw value dari process.env.FIREBASE_PRIVATE_KEY
 * @returns {string} Private key dengan actual newline characters
 */
const normalizePrivateKey = (key) => {
  if (!key) return key

  let normalized = key.trim()

  // Hapus surrounding quotes jika ada (bisa terjadi jika user copy-paste dengan quotes)
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1)
  }

  // Handle double-escaped: \\n → actual newline
  // Terjadi jika user copy dari JSON file tanpa konversi (JSON stringify format)
  normalized = normalized.replace(/\\\\n/g, '\n')

  // Handle single-escaped: \n literal → actual newline
  // Terjadi untuk format tanpa quotes di .env
  // Hanya lakukan jika belum ada newline asli (supaya tidak double-replace)
  if (!normalized.includes('\n')) {
    normalized = normalized.replace(/\\n/g, '\n')
  }

  return normalized
}

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
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      'Firebase configuration is incomplete. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env'
    )
  }

  const privateKey = normalizePrivateKey(rawPrivateKey)

  // Validasi format key setelah normalisasi
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'FIREBASE_PRIVATE_KEY format tidak valid. Pastikan key dimulai dengan -----BEGIN PRIVATE KEY-----'
    )
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
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
  normalizePrivateKey, // exported for unit testing
}
