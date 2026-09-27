export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY = process.env.FOOTBALL_DATA_API_KEY || '4827a3a6a7534851896e6b4e27f5b905';

  try {
    // Pega a data de hoje no formato YYYY-MM-DD
    const today = new Date();
    const dateFrom = today.toISOString().split('T')[0];
    
    // Pega a data de daqui a 10 dias
    const nextDays = new Date();
    nextDays.setDate(today.getDate() + 10);
    const dateTo = nextDays.toISOString().split('T')[0];

    // Faz a busca dinâmica dos próximos jogos
    const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      // Se não houver jogos no intervalo, faz um fallback para os jogos em andamento/recentes
      const fallbackResponse = await fetch('https://api.football-data.org/v4/matches', {
        headers: { 'X-Auth-Token': API_KEY },
      });
      const fallbackData = await fallbackResponse.json();
      return res.status(200).json(fallbackData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: error.message });
  }
}
