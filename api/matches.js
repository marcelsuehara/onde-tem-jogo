export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY = process.env.FOOTBALL_DATA_API_KEY || '4827a3a6a7534851896e6b4e27f5b905';

  try {
    // Busca partidas agendadas
    const response = await fetch('https://api.football-data.org/v4/matches?dateFrom=2026-09-20&dateTo=2026-10-10', {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    // Retorna lista vazia tratada para não quebrar a tela
    return res.status(200).json({ matches: [] });
  }
}
