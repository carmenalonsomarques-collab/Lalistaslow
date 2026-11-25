// Recibe una consulta desde /consulta y la manda por email a Carmen con las fotos adjuntas.
// La lectora recibe una confirmación. Usa la misma clave de Resend que send-email.js.

const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendEmail(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || 'Error al enviar email');
  return data;
}

const wrapper = inner => `
  <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #FBF8F3; color: #1A1612;">
    <p style="font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6B635D; margin: 0 0 24px;">La Lista Slow · El consultorio</p>
    ${inner}
    <p style="font-size: 0.8rem; color: #6B635D; border-top: 1px solid #F2EDE4; padding-top: 24px; margin-top: 40px;">
      La Lista Slow · <a href="https://lalistaslow.com" style="color: #B24D3D; text-decoration: none;">lalistaslow.com</a>
    </p>
  </div>`;

const box = (label, value) => `
  <div style="background: #fff; border: 1px solid #F2EDE4; padding: 18px 20px; margin-bottom: 12px;">
    <p style="font-size: 0.75rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #6B635D; margin: 0 0 6px;">${label}</p>
    <p style="font-size: 1rem; color: #1A1612; margin: 0; white-space: pre-wrap;">${value}</p>
  </div>`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tipo, ocasion, mensaje, nombre, email, fotos, publicar } = req.body || {};

  if (!nombre || !email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Faltan datos' });
  const fotosOk = Array.isArray(fotos) ? fotos : [];
  if (fotosOk.length > 3 || (!fotosOk.length && tipo !== 'Evento')) return res.status(400).json({ error: 'Fotos no válidas' });

  const attachments = [];
  for (let i = 0; i < fotosOk.length; i++) {
    const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(fotosOk[i] || '');
    if (!m || m[2].length > 2_000_000) return res.status(400).json({ error: 'Fotos no válidas' });
    attachments.push({ filename: `consulta-${i + 1}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`, content: m[2] });
  }

  const n = esc(String(nombre).slice(0, 80));
  const t = esc(String(tipo || 'Ropa').slice(0, 20));
  const o = esc(String(ocasion || '').slice(0, 40));
  const msg = esc(String(mensaje || '').slice(0, 800)) || '—';

  try {
    // A Carmen: con fotos adjuntas. Al darle a "Responder", le escribe directamente a la lectora.
    await sendEmail({
      from: 'La Lista Slow <hola@lalistaslow.com>',
      to: ['lalistaslow@gmail.com'],
      reply_to: email,
      subject: `Consultorio · ${t} · ${o} · ${n}${publicar ? ' · se puede contar' : ''}`,
      ...(attachments.length ? { attachments } : {}),
      html: wrapper(`
        <h1 style="font-size: 1.6rem; font-weight: 500; letter-spacing: -0.03em; margin: 0 0 24px;">Nueva consulta de ${n}</h1>
        ${box('Qué es', t)}
        ${box('Para cuándo', o)}
        ${box('Lo que cuenta', msg)}
        ${box('¿Se puede contar en la newsletter?', publicar ? 'Sí, sin su nombre' : 'No')}
        ${box('Email', esc(email))}
        <p style="font-size: 0.9rem; color: #6B635D; margin-top: 20px;">${attachments.length ? `${attachments.length} foto${attachments.length > 1 ? 's' : ''} adjunta${attachments.length > 1 ? 's' : ''}.` : 'Sin fotos.'} Dale a responder para escribirle.</p>`)
    });

    // A la lectora: confirmación corta.
    await sendEmail({
      from: 'La Lista Slow <hola@lalistaslow.com>',
      to: [email],
      reply_to: 'lalistaslow@gmail.com',
      subject: 'Recibido. Te escribo en un par de días.',
      html: wrapper(`
        <h1 style="font-size: 1.6rem; font-weight: 500; letter-spacing: -0.03em; margin: 0 0 16px;">Recibido, ${n}.</h1>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 12px;">Tengo tu consulta. Te escribo en un par de días con tus ideas.</p>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 24px;">Si se te olvidó contarme algo, responde a este email.</p>
        <p style="font-family: Georgia, serif; font-style: italic; color: #B24D3D; font-size: 1.4rem; margin: 0;">Carmen</p>`)
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
