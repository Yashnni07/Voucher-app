const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not set.' });
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    const data = await response.json();
    console.log('Gemini API response:', data);
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, Gemini could not answer.';
    res.json({ reply, raw: data });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API request failed.' });
  }
});

module.exports = router;
