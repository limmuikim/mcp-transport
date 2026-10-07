/**
 * Health check endpoint to monitor API gateway status and LTA DataMall connectivity readiness.
 * Compatible with Vercel Serverless Functions and Express server.
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY);

  const healthData = {
    status: 'ok',
    message: 'LTA Transit API Gateway is operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    ltaDataMall: {
      accountKeyConfigured: hasLtaKey,
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      status: hasLtaKey ? 'READY_LIVE_FEED' : 'PENDING_LTA_ACCOUNT_KEY',
    },
    registeredEndpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'Monitors health status and LTA DataMall configuration',
      },
      {
        path: '/api/busArrival',
        method: 'GET',
        description: 'Queries LTA DataMall BusArrival v3 endpoint by BusStopCode and optional ServiceNo',
        parameters: {
          BusStopCode: 'Required 5-digit bus stop code (e.g. 04121, 01112)',
          ServiceNo: 'Optional bus service number (e.g. 7, 147)',
        },
      },
    ],
    environment: process.env.VERCEL ? 'vercel' : (process.env.NODE_ENV || 'development'),
  };

  return res.status(200).json(healthData);
}
