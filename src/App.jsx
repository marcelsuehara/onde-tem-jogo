import React, { useState, useEffect } from 'react';
import { Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('todas');

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      // Chama a Serverless Function local ou na Vercel
      const res = await fetch('/api/matches');
      if (!res.ok) throw new Error('Falha ao carregar as partidas.');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os jogos em tempo real. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Extrai lista única de ligas/campeonatos dos jogos retornados
  const leagues = ['todas', ...Array.from(new Set(matches.map(m => m.competition?.name).filter(Boolean)))];

  // Filtra jogos por busca e competição
  const filteredMatches = matches.filter(match => {
    const homeName = match.homeTeam?.name || '';
    const awayName = match.awayTeam?.name || '';
    const leagueName = match.competition?.name || '';

    const matchesSearch = 
      homeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      awayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leagueName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLeague = selectedLeague === 'todas' || leagueName === selectedLeague;

    return matchesSearch && matchesLeague;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
              <Tv className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Onde tem Jogo? <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">API AO VIVO</span>
              </h1>
              <p className="text-xs text-slate-400">Guia Global de Partidas e Transmissões</p>
            </div>
          </div>
          <button 
            onClick={fetchMatches}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1 text-xs"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Campo de Busca e Filtros de Ligas */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por time ou campeonato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Filtros de Ligas */}
          {leagues.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <span className="text-slate-400 font-medium pr-1 whitespace-nowrap">Campeonatos:</span>
              {leagues.map(league => (
                <button
                  key={league}
                  onClick={() => setSelectedLeague(league)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition ${
                    selectedLeague === league 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status de Carregamento e Erros */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Buscando os próximos jogos no mundo inteiro...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Partidas vindas da API */}
        {!loading && !error && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Próximas Partidas ({filteredMatches.length})
              </h2>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm">Nenhum jogo encontrado para os filtros selecionados.</p>
              </div>
            ) : (
              filteredMatches.map(match => {
                const matchDate = new Date(match.utcDate);
                const timeString = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateString = matchDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' });

                return (
                  <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 hover:border-slate-700 transition">
                    {/* Informações da Competição */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> {match.competition?.name}
                      </span>
                      <span>{dateString} - {timeString}</span>
                    </div>

                    {/* Placar e Times */}
                    <div className="grid grid-cols-3 items-center text-center">
                      {/* Mandante */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img 
                            src={match.homeTeam?.crest} 
                            alt={match.homeTeam?.name} 
                            className="w-full h-full object-contain filter drop-shadow-md" 
                          />
                        </div>
                        <span className="font-bold text-sm text-slate-100">{match.homeTeam?.shortName || match.homeTeam?.name}</span>
                      </div>

                      {/* Horário ou Placar */}
                      <div className="flex flex-col items-center space-y-1">
                        {match.status === 'IN_PLAY' || match.status === 'PAUSED' ? (
                          <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            AO VIVO {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
                          </div>
                        ) : match.status === 'FINISHED' ? (
                          <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                            FIM {match.score?.fullTime?.home} - {match.score?.fullTime?.away}
                          </div>
                        ) : (
                          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                            {timeString}
                          </span>
                        )}
                      </div>

                      {/* Visitante */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img 
                            src={match.awayTeam?.crest} 
                            alt={match.awayTeam?.name} 
                            className="w-full h-full object-contain filter drop-shadow-md" 
                          />
                        </div>
                        <span className="font-bold text-sm text-slate-100">{match.awayTeam?.shortName || match.awayTeam?.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}
      </main>
    </div>
  );
}
