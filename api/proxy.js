export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url, body, service } = req.body;
  
  const token = service === 'fal' 
    ? process.env.FAL_API_KEY 
    : process.env.REPLICATE_API_TOKEN;

  const authHeader = service === 'fal'
    ? `Key ${token}`
    : `Bearer ${token}`;

  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    ...(body && { body: JSON.stringify(body) })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
