import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const CONFIG_FILE = process.env.CONFIG_PATH || path.join(process.cwd(), 'config.json');

const supabaseUrlRaw = process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = supabaseUrlRaw.startsWith('http') 
  ? supabaseUrlRaw 
  : (supabaseUrlRaw ? `https://${supabaseUrlRaw}.supabase.co` : '');
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Usually we'd use service_role key on server, but anon key works if RLS allows or if it's just basic operations for now.

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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
      a: 'Para transferencias bancarias, necesitará el nombre completo del titular, número de carnet de identidad y el número de la tarjeta (MLC o CUP).'
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
  adminPassword: 'admin',
};

async function getConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('app_config').select('data').eq('id', 1).single();
      if (data && data.data) {
        return { 
          ...DEFAULT_CONFIG, 
          ...data.data, 
          rates: { ...DEFAULT_CONFIG.rates, ...(data.data.rates || {}) },
          socials: { ...DEFAULT_CONFIG.socials, ...(data.data.socials || {}) },
          deliveryMethods: { ...DEFAULT_CONFIG.deliveryMethods, ...(data.data.deliveryMethods || {}) },
          heroText: { ...DEFAULT_CONFIG.heroText, ...(data.data.heroText || {}) },
          adminPassword: data.data.adminPassword || DEFAULT_CONFIG.adminPassword 
        };
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
      const options = token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {};
      const scopedSupabase = token ? createClient(supabaseUrl, supabaseKey, options) : supabase;
      
      const { error } = await scopedSupabase
        .from('app_config')
        .upsert({ id: 1, data: updated });
      if (!error) return; // If successful, skip file write
      console.error('Error saving config to Supabase:', error);
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
  const { password } = req.body;
  const config = await getConfig();
  if (password === config.adminPassword) {
    res.json({ success: true, token: 'admin-token-secret-123' });
  } else {
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
