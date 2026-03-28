// netlify/functions/telegram.js
//
// Эта функция запускается на сервере Netlify.
// Токен бота берётся из переменных окружения — в браузере он НИКОГДА не виден.
//
// Rate limiting: не более 10 запросов в минуту с одного IP.

const RATE_MAP = {}; // { ip: [timestamps] }
const RATE_LIMIT = 10;
const RATE_WIN   = 60 * 1000; // 1 минута

function isRateLimited(ip) {
  const now = Date.now();
  if (!RATE_MAP[ip]) RATE_MAP[ip] = [];
  RATE_MAP[ip] = RATE_MAP[ip].filter(t => now - t < RATE_WIN);
  if (RATE_MAP[ip].length >= RATE_LIMIT) return true;
  RATE_MAP[ip].push(now);
  return false;
}

exports.handler = async (event) => {
  // Разрешаем только POST
  if (event.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Берём IP из заголовков Netlify
  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown';

  // Проверяем rate limit по IP на уровне сервера
  if (isRateLimited(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too Many Requests' }) };
  }

  // Читаем токен и chat_id из переменных окружения Netlify
  const TGT = process.env.TG_TOKEN;
  const TGC = process.env.TG_CHAT_ID;

  if (!TGT || !TGC) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Bot not configured' }) };
  }

  const contentType = event.headers['content-type'] || '';

  try {
    // ── Текстовое сообщение ──
    if (contentType.includes('application/json')) {
      const { text } = JSON.parse(event.body);
      if (!text) return { statusCode: 400, body: 'Missing text' };

      const res = await fetch(`https://api.telegram.org/bot${TGT}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TGC, text, parse_mode: 'HTML' }),
      });

      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    }

    // ── Фото (скриншот оплаты) ──
    if (contentType.includes('multipart/form-data')) {
      // Netlify передаёт multipart как base64 в event.body
      // Используем node-fetch + FormData через буфер
      const { parse } = await import('lambda-multipart-parser');
      const result = await parse(event);

      const photoFile = result.files?.find(f => f.fieldname === 'photo');
      const caption   = result.caption || '';

      if (!photoFile) return { statusCode: 400, body: 'Missing photo' };

      const fd = new FormData();
      fd.append('chat_id', TGC);
      fd.append('caption', caption);
      fd.append('photo', new Blob([photoFile.content], { type: photoFile.contentType }), 'pay.jpg');

      const res = await fetch(`https://api.telegram.org/bot${TGT}/sendPhoto`, {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    }

    return { statusCode: 400, body: 'Unsupported Content-Type' };

  } catch (err) {
    console.error('Telegram function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
