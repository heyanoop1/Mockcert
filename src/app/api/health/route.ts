export async function GET() {
  return Response.json({
    ok: true,
    status: 'healthy',
    name: 'MockCert',
    timestamp: new Date().toISOString(),
  });
}
