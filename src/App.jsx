import React, { useState, useEffect } from 'react';
import { Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle, Newspaper, ExternalLink, ChevronRight } from 'lucide-react';

// Notícias e Resumos Fictícios / Editáveis para AdSense
const initialNews = [
  {
    id: 1,
    title: "São Paulo x Santos: Onde assistir ao vivo, horário e prováveis escalações",
    summary: "Clássico San-São movimenta o Brasileirão neste fim de semana. Confira todos os detalhes da transmissão e o momento das equipes.",
    category: "Brasileirão",
    date: "27/09/2026",
    url: "https://ge.globo.com"
  },
  {
    id: 2,
    title: "Atlético-MG x Bragantino: Tudo sobre o confronto na Arena MRV",
    summary: "Galo busca se aproximar dos líderes em casa, enquanto o Massa Bruta quer surpreender fora. Veja onde assistir.",
    category: "Brasileirão",
    date: "27/09/2026",
    url: "https://espn.com.br"
  },
  {
    id: 3,
    title: "Guia de Transmissões da Semana: Onde assistir aos jogos europeus e nacionais",
    summary: "Saiba quais canais de TV fechada, aberta e serviços de streaming vão transmitir as principais partidas nos próximos dias.",
    category: "Guia de TV",
    date: "26/09/2026",
    url: "https://uol.com.br/esporte"
  }
];

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('todas');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/matches');
      if (!res.ok) throw new Error('Falha ao carregar as partidas.');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os jogos em tempo real.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Extrai times únicos para o carrossel do topo
  const teamsMap = new Map();
  matches.forEach(m => {
    if (m.homeTeam?.id && m.homeTeam?.crest) teamsMap.set(m.homeTeam.name, { name: m.homeTeam.name, crest: m.homeTeam.crest });
    if (m.awayTeam?.id && m.awayTeam?.crest) teamsMap.set(m.awayTeam.name, { name: m.awayTeam.name, crest: m.awayTeam.crest });
  });
  const uniqueTeams = Array.from(teamsMap.values());

  // Extrai lista única de ligas
  const leagues = ['todas', ...Array.from(new Set(matches.map(m => m.competition?.name).filter(Boolean)))];

  // Filtra jogos
  const filteredMatches = matches.filter(match => {
    const homeName = match.homeTeam?.name || '';
    const awayName = match.awayTeam?.name || '';
    const leagueName = match.competition?.name || '';

    const matchesSearch = 
      homeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      awayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leagueName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLeague = selectedLeague === 'todas' || leagueName === selectedLeague;
    const matchesTeamFilter = !selectedTeamFilter || homeName === selectedTeamFilter || awayName === selectedTeamFilter;

    return matchesSearch && matchesLeague && matchesTeamFilter;
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
                Onde tem Jogo? <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">AO VIVO</span>
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

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Carrossel dos Escudos dos Times */}
        {uniqueTeams.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Filtrar por Time:</span>
              {selectedTeamFilter && (
                <button 
                  onClick={() => setSelectedTeamFilter(null)}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Limpar filtro ({selectedTeamFilter})
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {uniqueTeams.map(team => (
                <button
                  key={team.name}
                  onClick={() => setSelectedTeamFilter(selectedTeamFilter === team.name ? null : team.name)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center min-w-[70px] transition ${
                    selectedTeamFilter === team.name 
                      ? 'bg-emerald-500/20 border-emerald-500 scale-105' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={team.crest} alt={team.name} className="w-8 h-8 object-contain mb-1" />
                  <span className="text-[10px] text-slate-300 truncate max-w-[60px]">{team.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Status de Carregamento e Erro */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Buscando as próximas partidas na API...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Partidas */}
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
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> {match.competition?.name}
                      </span>
                      <span>{dateString} - {timeString}</span>
                    </div>

                    <div className="grid grid-cols-3 items-center text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img src={match.homeTeam?.crest} alt={match.homeTeam?.name} className="w-full h-full object-contain filter drop-shadow-md" />
                        </div>
                        <span className="font-bold text-sm text-slate-100">{match.homeTeam?.shortName || match.homeTeam?.name}</span>
                      </div>

                      <div className="flex flex-col items-center space-y-1">
                        {match.status === 'IN_PLAY' || match.status === 'PAUSED' ? (
                          <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            AO VIVO {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
                          </div>
                        ) : (
                          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                            {timeString}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img src={match.awayTeam?.crest} alt={match.awayTeam?.name} className="w-full h-full object-contain filter drop-shadow-md" />
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

        {/* Seção de Notícias e Matérias para AdSense */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" /> ÚLTIMAS NOTÍCIAS & GUIAS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initialNews.map(item => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Ler matéria completa</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
