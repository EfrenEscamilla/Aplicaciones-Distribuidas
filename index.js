
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

function respond(res, { success, result = null, error = null, details = null }) {
  const payload = { success, result, error };
  if (details !== null) payload.details = details;
  res.json(payload);
}

function isString(v) {
  return typeof v === 'string' || v instanceof String;
}

// Helpers
function sha256(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex');
}

function normalizeForPalindrome(s) {
  
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}


app.post('/mascaracteres', (req, res) => {
  const { a, b } = req.body || {};
  if (!isString(a) || !isString(b)) return respond(res, { success: false, error: 'Parámetros inválidos: se requieren cadenas a y b.' });
  const result = a.length >= b.length ? a : b; 
  respond(res, { success: true, result });
});


app.post('/menoscaracteres', (req, res) => {
  const { a, b } = req.body || {};
  if (!isString(a) || !isString(b)) return respond(res, { success: false, error: 'Parámetros inválidos: se requieren cadenas a y b.' });
  const result = a.length <= b.length ? a : b; // if equal, first param
  respond(res, { success: true, result });
});


app.post('/numcaracteres', (req, res) => {
  const { s } = req.body || {};
  if (!isString(s)) return respond(res, { success: false, error: 'Parámetro inválido: se requiere la cadena s.' });
  respond(res, { success: true, result: s.length });
});


app.post('/palindroma', (req, res) => {
  const { s } = req.body || {};
  if (!isString(s)) return respond(res, { success: false, error: 'Parámetro inválido: se requiere la cadena s.' });
  const normalized = normalizeForPalindrome(s);
  const reversed = normalized.split('').reverse().join('');
  const isPal = normalized.length > 0 && normalized === reversed; 
  if (normalized.length === 0) return respond(res, { success: false, error: 'La cadena no contiene caracteres alfanuméricos para evaluar.' });
  respond(res, { success: true, result: isPal });
});


app.post('/concat', (req, res) => {
  const { a, b } = req.body || {};
  if (!isString(a) || !isString(b)) return respond(res, { success: false, error: 'Parámetros inválidos: se requieren cadenas a y b.' });
  respond(res, { success: true, result: a + b });
});


app.post('/applysha256', (req, res) => {
  const { s } = req.body || {};
  if (!isString(s)) return respond(res, { success: false, error: 'Parámetro inválido: se requiere la cadena s.' });
  const hashed = sha256(s);
  respond(res, { success: true, result: { original: s, sha256: hashed } });
});


app.post('/verifysha256', (req, res) => {
  const { hashed, s } = req.body || {};
  if (!isString(hashed) || !isString(s)) return respond(res, { success: false, error: 'Parámetros inválidos: se requieren cadenas hashed y s.' });
  const computed = sha256(s);
  const matches = computed === hashed;
  respond(res, { success: true, result: matches, details: { computedSha256: computed } });
});


app.get('/', (req, res) => {
  res.json({ success: true, result: 'Servidor ejecutándose. Endpoints: /mascaracteres, /menoscaracteres, /numcaracteres, /palindroma, /concat, /applysha256, /verifysha256 (POST JSON).' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`));
