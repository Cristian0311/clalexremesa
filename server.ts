import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.APPLET_ID ? 3000 : process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CONFIG_FILE = process.env.CONFIG_PATH || path.join(process.cwd(), 'config.json');

const supabaseUrlRaw = (process.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim(); // Using service_role key if available to bypass RLS

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let externalUrl = '';

app.use((req, res, next) => {
  if (!externalUrl && req.headers.host && !req.headers.host.includes('localhost')) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    externalUrl = `${protocol}://${req.headers.host}`;
    console.log(`[Keep-Alive] URL externa capturada: ${externalUrl}`);
  }
  next();
});

// Default config
const DEFAULT_CONFIG = {
  companyName: 'Clalex Divisa',
  description: 'Empresa líder en remesas internacionales, conectando familias con seguridad, rapidez y confianza.',
  whatsapp: '51986771394',
  email: 'clalexremesa@gmail.com',
  socials: {
    facebook: 'https://facebook.com/clalexdivisas',
    instagram: 'https://instagram.com/clalexdivisas'
  },
  promoBannerActive: true,
  promoBannerText: '🎉 ¡Aprovecha la mejor tasa de envío hoy mismo!',
  rates: {
    transferCUP: 85.50,
    cashCUP: 84.00,
    cashUSD: 0.25,
    penToUsd: 0.26,
    usdCashFee: 5
  },
  deliveryMethods: {
    transferCUP: true,
    cashCUP: true,
    cashUSD: true
  },
  faqs: [
    {
      id: '1',
      q: '¿Cuánto tiempo tarda en llegar la remesa?',
      a: 'La mayoría de nuestras transferencias se completan el mismo día. Dependiendo del método de entrega en Cuba, puede tomar desde unos minutos hasta 24 horas hábiles.'
    },
    {
      id: '2',
      q: '¿Qué datos necesito de la persona en Cuba?',
      a: 'Para transferencias bancarias, necesitará el nombre completo del titular, número de carnet de identidad y el número de la tarjeta (CUP).'
    },
    {
      id: '3',
      q: '¿Hay algún límite de envío?',
      a: 'Por favor, contáctenos vía WhatsApp para conocer los límites actuales y las mejores opciones para envíos grandes.'
    },
    {
      id: '4',
      q: '¿Cómo sé que mi dinero está seguro?',
      a: 'Todo el proceso se realiza bajo estricto control y le mantenemos informado en cada paso mediante WhatsApp hasta que el destinatario confirme la recepción.'
    }
  ],
  heroText: {
    title: 'Envía remesas desde Perú a Cuba',
    subtitle: 'Conéctate con los tuyos de forma rápida, segura y confiable. Disfruta de tasas competitivas y atención personalizada en cada transacción.'
  },
  benefits: [
    {
      id: '1',
      title: 'Rapidez Garantizada',
      description: 'Procesamiento inmediato. Su dinero llega a su destino en el menor tiempo posible.'
    },
    {
      id: '2',
      title: 'Máxima Seguridad',
      description: 'Transacciones 100% seguras y soporte personalizado a través de nuestro WhatsApp oficial.'
    },
    {
      id: '3',
      title: 'La Mejor Tasa del Mercado',
      description: 'Actualizamos nuestra tasa de cambio diariamente para ofrecerle el mayor beneficio.'
    }
  ],
  schedules: 'Lunes a Sábado: 8:00 AM - 8:00 PM\nDomingos: 9:00 AM - 2:00 PM',
  promotions: '¡Envíos mayores a 1000 PEN participan en sorteos mensuales!',
  adminEmail: 'clalexremesa@gmail.com',
  adminPassword: 'clalexremesa03',
};

async function getConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('app_config').select('data').eq('id', 1).single();
      
      if (error) {
        console.error('[Supabase Debug] Error fetching from Supabase:', error);
      }
      
      if (data && data.data) {
        console.log('[Supabase Debug] ✅ Data fetched successfully from Supabase database.');
        return { 
          ...DEFAULT_CONFIG, 
          ...data.data, 
          rates: { ...DEFAULT_CONFIG.rates, ...(data.data.rates || {}) },
          socials: { ...DEFAULT_CONFIG.socials, ...(data.data.socials || {}) },
          deliveryMethods: { ...DEFAULT_CONFIG.deliveryMethods, ...(data.data.deliveryMethods || {}) },
          heroText: { ...DEFAULT_CONFIG.heroText, ...(data.data.heroText || {}) },
          adminEmail: data.data.adminEmail || DEFAULT_CONFIG.adminEmail,
          adminPassword: data.data.adminPassword || DEFAULT_CONFIG.adminPassword 
        };
      } else {
        console.warn('[Supabase Debug] ⚠️ No data found in Supabase for id=1, falling back to local file.');
      }
    } catch (e) {
      console.error('Error fetching config from Supabase', e);
    }
  }

  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    return { 
      ...DEFAULT_CONFIG, 
      ...parsedData, 
      rates: { ...DEFAULT_CONFIG.rates, ...(parsedData.rates || {}) },
      socials: { ...DEFAULT_CONFIG.socials, ...(parsedData.socials || {}) },
      deliveryMethods: { ...DEFAULT_CONFIG.deliveryMethods, ...(parsedData.deliveryMethods || {}) },
      heroText: { ...DEFAULT_CONFIG.heroText, ...(parsedData.heroText || {}) },
      adminEmail: parsedData.adminEmail || DEFAULT_CONFIG.adminEmail,
      adminPassword: parsedData.adminPassword || DEFAULT_CONFIG.adminPassword 
    };
  } catch (error) {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  }
}

async function saveConfig(newConfig: any, token?: string) {
  const current = await getConfig();
  const updated = { ...current, ...newConfig };
  
  if (supabase) {
    try {
      // Only pass token to Supabase if it's a real JWT, not the static admin token
      const isJwtToken = token && token !== 'admin-token-secret-123';
      const options = isJwtToken ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {};
      const scopedSupabase = isJwtToken ? createClient(supabaseUrl!, supabaseKey!, options) : supabase;
      
      const { error } = await scopedSupabase
        .from('app_config')
        .upsert({ id: 1, data: updated });
      if (!error) {
        console.log('✅ Configuración guardada en Supabase correctamente.');
        return; // If successful, skip file write
      }
      console.error('❌ Error guardando en Supabase:', error);
    } catch (e) {
      console.error('Exception saving to Supabase:', e);
    }
  }

  await fs.writeFile(CONFIG_FILE, JSON.stringify(updated, null, 2));
}

// API Routes
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/api/config', async (req, res) => {
  const config = await getConfig();
  // Don't send password to client
  const { adminPassword, ...clientConfig } = config;
  res.json(clientConfig);
});

app.post('/api/login', async (req, res) => {
  const email = (req.query.email || req.body.email) as string;
  const password = (req.query.password || req.body.password) as string;
  
  // Priorizar variables de entorno para autenticación administrativa
  const adminEmail = process.env.ADMIN_EMAIL || (await getConfig()).adminEmail;
  const adminPassword = process.env.ADMIN_PASSWORD || (await getConfig()).adminPassword;

  if (email === adminEmail && password === adminPassword) {
    res.json({ success: true, token: 'admin-token-secret-123' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

app.put('/api/config', async (req, res) => {
  const { token, configUpdates, newPassword } = req.body;
  
  const adminEmails = ['clalexremesa@gmail.com', 'cristianmarco2003@gmail.com'];

  let authorized = false;
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && user.email && adminEmails.includes(user.email)) {
        authorized = true;
      }
    } catch (e) {
      console.error('Error verifying Supabase token', e);
    }
  }

  // Fallback to static token
  if (!authorized && token === 'admin-token-secret-123') {
    authorized = true;
  }

  if (!authorized) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  
  const updates: any = { ...configUpdates };
  if (newPassword) updates.adminPassword = String(newPassword);

  await saveConfig(updates, token);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Auto-ping para mantener el servidor activo en Render
    // Render free instances sleep after 15 minutes. We ping every 14 minutes.
    setInterval(() => {
      const url = externalUrl ? `${externalUrl}/api/ping` : `http://localhost:${PORT}/api/ping`;
      console.log(`[Keep-Alive] Haciendo ping a ${url}...`);
      
      const req = url.startsWith('https') ? https : http;
      req.get(url, (res) => {
        console.log(`[Keep-Alive] Estado: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error(`[Keep-Alive] Error: ${err.message}`);
      });
    }, 14 * 60 * 1000); // 14 minutos
  });
}

startServer();
