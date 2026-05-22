export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { emailNovios, nombreRegalo, nombreInvitado, nombrePareja } = req.body;

    if (!emailNovios || !nombreRegalo || !nombreInvitado) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'La Lista Slow <hola@lalistaslow.com>',
                to: [emailNovios],
                cc: ['lalistaslow@gmail.com'],
                subject: `${nombreInvitado} ha comprado ${nombreRegalo}`,
                html: `
                    <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #FBF8F3; color: #1A1612;">
                        <p style="font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6B635D; margin-bottom: 24px;">La Lista Slow</p>
                        <h1 style="font-size: 1.6rem; font-weight: 500; letter-spacing: -0.03em; margin-bottom: 8px;">Un regalo menos en la lista.</h1>
                        <p style="font-size: 0.95rem; color: #6B635D; margin-bottom: 40px;">Lista de ${nombrePareja}</p>
                        <div style="background: #fff; border: 1px solid #F2EDE4; padding: 24px; margin-bottom: 32px;">
                            <p style="font-size: 0.8rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #6B635D; margin-bottom: 8px;">Regalo</p>
                            <p style="font-size: 1rem; font-weight: 500; color: #1A1612; margin-bottom: 0;">${nombreRegalo}</p>
                        </div>
                        <div style="background: #fff; border: 1px solid #F2EDE4; padding: 24px; margin-bottom: 32px;">
                            <p style="font-size: 0.8rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #6B635D; margin-bottom: 8px;">Comprado por</p>
                            <p style="font-size: 1rem; font-weight: 500; color: #B24D3D; margin-bottom: 0;">${nombreInvitado}</p>
                        </div>
                        <p style="font-size: 0.8rem; color: #6B635D; border-top: 1px solid #F2EDE4; padding-top: 24px; margin-top: 40px;">
                            La Lista Slow · <a href="https://lalistaslow.com" style="color: #B24D3D; text-decoration: none;">lalistaslow.com</a>
                        </p>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.message || 'Error al enviar email' });
        }

        return res.status(200).json({ ok: true });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
