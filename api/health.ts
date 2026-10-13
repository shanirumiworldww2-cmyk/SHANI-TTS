export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    engine: 'TOOL BY SHANI - Neural Edge TTS Studio',
    version: '2.5.0',
    timestamp: new Date().toISOString(),
  }));
}
