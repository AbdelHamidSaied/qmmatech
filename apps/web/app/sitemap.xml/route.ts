export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>http://localhost:3000/</loc></url>\n</urlset>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}