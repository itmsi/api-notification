/**
 * AI Assistant Socket Handler
 * 
 * Menerima chat:send dari frontend via Socket.IO, 
 * kemudian proxy ke ai-assistant-service via HTTP SSE.
 * 
 * Alur:
 *   socket (chat:send) → HTTP POST (ai-assistant-service SSE) → socket (chat:chunk/done/error)
 */

const axios = require('axios');
const jwtDecode = require('jwt-decode');

// Konfigurasi ai-assistant-service endpoint
const AI_ASSISTANT_SERVICE_URL = process.env.AI_ASSISTANT_SERVICE_URL || 'http://localhost:9587';
const AI_STREAM_ENDPOINT = `${AI_ASSISTANT_SERVICE_URL}/api/mosa/ai-assistant/chat/stream`;

/**
 * Decode JWT tanpa verifikasi (hanya baca payload)
 */
const decodeJWT = (token) => {
  try {
    const decoded = jwtDecode(token);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Register Socket.IO handlers untuk AI Assistant
 */
const registerAISocketHandlers = (io) => {
  // ─── Authentication Middleware ──────────────────────────────
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.data.user = null;
      socket.data.authToken = null;
      socket.data.isAuthenticated = false;
      console.log(`[AISocket] ${socket.id} connecting without token (anonymous)`);
      return next();
    }

    const jwtResult = decodeJWT(token);
    if (jwtResult.valid) {
      socket.data.user = jwtResult.user;
      socket.data.authToken = token;
      socket.data.isAuthenticated = true;
      console.log(`[AISocket] ${socket.id} authenticated: ${jwtResult.user.sub || jwtResult.user.userId || 'unknown'}`);
      return next();
    }

    console.warn(`[AISocket] ${socket.id} auth failed: ${jwtResult.error}`);
    return next(new Error(`Autentikasi gagal: ${jwtResult.error}`));
  });

  // ─── Connection Handler ─────────────────────────────────────
  io.on('connection', (socket) => {
    const authStatus = socket.data.isAuthenticated ? 'authenticated' : 'anonymous';
    console.log(`[AISocket] Client connected: ${socket.id} (${authStatus})`);

    let isClientConnected = true;

    socket.on('disconnect', () => {
      isClientConnected = false;
      console.log(`[AISocket] Client disconnected: ${socket.id}`);
    });

    // ─── Chat: Send ──────────────────────────────────────────
    socket.on('chat:send', async (payload) => {
      const { message, sessionId, system, userId: payloadUserId } = payload || {};
      const authToken = socket.data.authToken;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        socket.emit('chat:error', { message: 'Pesan tidak boleh kosong' });
        return;
      }

      const userId = payloadUserId || socket.data.user?.sub || socket.data.user?.userId || socket.data.user?.employee_id || 'anonymous';
      const finalSessionId = sessionId || `session_${userId}_${Date.now()}`;

      try {
        // ── Proxy ke ai-assistant-service via HTTP SSE ──
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await axios.post(AI_STREAM_ENDPOINT, {
          message,
          sessionId: finalSessionId,
          system,
          userId,
        }, {
          headers,
          responseType: 'stream',
          timeout: 120000, // 2 menit timeout untuk AI processing
        });

        const stream = response.data;
        let buffer = '';

        stream.on('data', (chunk) => {
          if (!isClientConnected) {
            stream.destroy();
            return;
          }

          buffer += chunk.toString();

          // Handle line format: "0:...\n\n", "d:...\n\n", etc.
          // SSE lines end with \n\n
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || ''; // Keep incomplete part

          for (const part of parts) {
            if (!part) continue;

            const line = part.replace(/\r$/, '');

            if (line.startsWith('0:')) {
              const raw = line.slice(2).trim();
              let text = raw;
              if (raw.startsWith('"') && raw.endsWith('"')) {
                try { text = JSON.parse(raw); } catch { text = raw.replace(/^"|"$/g, ''); }
              }
              if (text) {
                socket.emit('chat:chunk', { text: String(text) });
              }
            } else if (line.startsWith('2:')) {
              // Tool call metadata — skip, tidak perlu dikirim ke frontend
              continue;
            } else if (line.startsWith('d:')) {
              try {
                const doneData = JSON.parse(line.slice(2).trim());
                socket.emit('chat:done', {
                  finishReason: 'stop',
                  sessionId: doneData.sessionId || finalSessionId,
                });
              } catch {
                socket.emit('chat:done', {
                  finishReason: 'stop',
                  sessionId: finalSessionId,
                });
              }
            } else if (line.startsWith('3:')) {
              try {
                const errData = JSON.parse(line.slice(2).trim());
                socket.emit('chat:error', {
                  message: errData.error || errData.message || 'Stream error',
                  sessionId: finalSessionId,
                });
              } catch {
                socket.emit('chat:error', {
                  message: 'Stream error',
                  sessionId: finalSessionId,
                });
              }
            }
          }
        });

        stream.on('end', () => {
          if (isClientConnected) {
            // If no done signal was received, send done
            socket.emit('chat:done', {
              finishReason: 'stop',
              sessionId: finalSessionId,
            });
          }
        });

        stream.on('error', (err) => {
          console.error(`[AISocket] Stream error for ${finalSessionId}: ${err.message}`);
          if (isClientConnected) {
            socket.emit('chat:error', {
              message: 'Stream error from AI service',
              sessionId: finalSessionId,
            });
          }
        });

      } catch (error) {
        console.error(`[AISocket] Error proxying chat for ${finalSessionId}: ${error.message}`);

        if (isClientConnected) {
          if (error.code === 'ECONNREFUSED') {
            socket.emit('chat:error', {
              message: 'AI Assistant service sedang tidak tersedia',
              sessionId: finalSessionId,
            });
          } else if (error.response?.status === 401) {
            socket.emit('chat:error', {
              message: 'Autentikasi gagal',
              sessionId: finalSessionId,
            });
          } else {
            socket.emit('chat:error', {
              message: error.response?.data?.message || 'Gagal memproses pesan',
              sessionId: finalSessionId,
            });
          }
        }
      }
    });
  });
};

module.exports = { registerAISocketHandlers };
