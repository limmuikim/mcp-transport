/**
 * LTA DataMall BusArrival v3 API Proxy Endpoint
 *
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
 * Header: AccountKey: <LTA_ACCOUNT_KEY>
 *
 * Query Parameters:
 * - BusStopCode: Required 5-digit bus stop code (e.g. 04121, 01112)
 * - ServiceNo: Optional bus service number (e.g. 7, 147)
 *
 * Compatible with Vercel Serverless Functions and Express server.
 */

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract query parameters (case-insensitive fallback)
  const query = req.query || {};
  const busStopCode = query.BusStopCode || query.busStopCode || query.stop || query.code;
  const serviceNo = query.ServiceNo || query.serviceNo || query.service || query.bus;

  // Validation: BusStopCode is required
  if (!busStopCode) {
    return res.status(400).json({
      error: "BusStopCode is required.",
      usage: "GET /api/busArrival?BusStopCode=04121 or /api/busArrival?BusStopCode=04121&ServiceNo=7",
      example: "/api/busArrival?BusStopCode=04121",
    });
  }

  // Check for AccountKey from environment or incoming header
  const accountKey =
    process.env.LTA_ACCOUNT_KEY ||
    process.env.ACCOUNT_KEY ||
    req.headers['accountkey'] ||
    req.headers['account-key'];

  // If LTA_ACCOUNT_KEY is configured, fetch live data from LTA DataMall v3
  if (accountKey) {
    try {
      let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(
        busStopCode
      )}`;

      if (serviceNo) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
      }

      const ltaResponse = await fetch(ltaUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey,
          accept: 'application/json',
        },
      });

      if (!ltaResponse.ok) {
        const errorText = await ltaResponse.text();
        return res.status(ltaResponse.status).json({
          error: `LTA DataMall API responded with status ${ltaResponse.status}`,
          details: errorText,
          busStopCode,
          serviceNo: serviceNo || null,
        });
      }

      const data = await ltaResponse.json();

      // Set cache headers: DataMall refreshes every 20 seconds
      res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=10');

      return res.status(200).json({
        source: 'LTA_DATAMALL_V3_LIVE',
        BusStopCode: data.BusStopCode || busStopCode,
        Services: data.Services || [],
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('LTA DataMall fetch error:', err);
      return res.status(502).json({
        error: 'Failed to communicate with LTA DataMall gateway',
        message: err.message,
        busStopCode,
        serviceNo: serviceNo || null,
      });
    }
  }

  // Fallback when LTA_ACCOUNT_KEY is not yet configured in environment variables
  // Generates structured DataMall v3 response schema for immediate developer testing
  return res.status(200).json({
    source: 'SIMULATED_PREVIEW_FALLBACK',
    warning:
      'LTA_ACCOUNT_KEY is not configured yet in environment variables. Add LTA_ACCOUNT_KEY in Vercel to activate live SGPS telemetry.',
    BusStopCode: busStopCode,
    Services: [
      {
        ServiceNo: serviceNo || '147',
        Operator: 'SBST',
        NextBus: {
          OriginCode: '64009',
          DestinationCode: '17009',
          EstimatedArrival: new Date(Date.now() + 2 * 60 * 1000 + 15 * 1000).toISOString(),
          Latitude: '1.2995',
          Longitude: '103.8558',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD',
        },
        NextBus2: {
          OriginCode: '64009',
          DestinationCode: '17009',
          EstimatedArrival: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
          Latitude: '1.3050',
          Longitude: '103.8590',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD',
        },
        NextBus3: {
          OriginCode: '64009',
          DestinationCode: '17009',
          EstimatedArrival: new Date(Date.now() + 16 * 60 * 1000).toISOString(),
          Latitude: '1.3120',
          Longitude: '103.8640',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'SD',
        },
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
