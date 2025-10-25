
// Firebase Functions: verify reCAPTCHA v3
import functions from 'firebase-functions';
import fetch from 'node-fetch';

export const verifyRecaptcha = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  try {
    const token = (req.body && (req.body.token || req.body['g-recaptcha-response'])) || '';
    if (!token) return res.status(400).json({ success:false, score:0, error: 'missing-token' });
    const secret = process.env.RECAPTCHA_SECRET_KEY || functions.config().recaptcha?.secret || '';
    if (!secret) return res.status(500).json({ success:false, error:'missing-server-secret' });
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, error: String(e) });
  }
});
