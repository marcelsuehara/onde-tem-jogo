import React, { useState, useEffect } from 'react';
import { Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle, Newspaper, ExternalLink, MapPin, Shield, UserCheck } from 'lucide-react';

// Escudos Oficiais com URLs de CDN de alta disponibilidade (sem bloqueios CORS/Wikimedia)
const BRASIL_TEAMS = [
  { id: 1, name: "Flamengo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/5926.png", state: "RJ", stadium: "Maracanã" },
  { id: 2, name: "Palmeiras", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png", state: "SP", stadium: "Allianz Parque" },
  { id: 3, name: "São Paulo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png", state: "SP", stadium: "MorrumBIS" },
  { id: 4, name: "Corinthians", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png", state: "SP", stadium: "Neo Química Arena" },
  { id: 5, name: "Santos", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10276.png", state: "SP", stadium: "Vila Belmiro" },
  { id: 6, name: "Fluminense", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10274.png", state: "RJ", stadium: "Maracanã" },
  { id: 7, name: "Vasco da Gama", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10278.png", state: "RJ", stadium: "São Januário" },
  { id: 8, name: "Botafogo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8517.png", state: "RJ", stadium: "Nilton Santos" },
  { id: 9, name: "Grêmio", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10275.png", state: "RS", stadium: "Arena do Grêmio" },
  { id: 10, name: "Internacional", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8632.png", state: "RS", stadium: "Beira-Rio" },
  { id: 11, name: "Atlético Mineiro", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10273.png", state: "MG", stadium: "Arena MRV" },
  { id: 12, name: "Cruzeiro", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9782.png", state: "MG", stadium: "Mineirão" },
  { id: 13, name: "Bahia", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10281.png", state: "BA", stadium: "Arena Fonte Nova" },
  { id: 14, name: "Fortaleza", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8287.png", state: "CE", stadium: "Castelão" },
  { id: 15, name: "Athletico Paranaense", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10280.png", state: "PR", stadium: "Ligga Arena" },
  { id: 16, name: "Red Bull Bragantino", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10282.png", state: "SP", stadium: "Nabi Abi Chedid" }
];

// Jogos estendidos (Série B, Seleção Principal, Feminino e Base Sub-20)
const EXTRA_MATCHES = [
  {
    id: 9001,
    utcDate: new Date().toISOString(),
    status: "TIMED",
    matchday: 28,
    categoryTag: "Masculino • Profissional",
    competition: { name: "Brasileirão Série B" },
    homeTeam: { name: "Santos", shortName: "Santos", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10276.png" },
    awayTeam: { name: "Operário-PR", shortName: "Operário", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/321853.png" },
    venue: "Vila Belmiro",
    broadcaster: "Premiere / SporTV"
  },
  {
    id: 9002,
    utcDate: new Date(Date.now() + 86400000).toISOString(),
    status: "TIMED",
    stage: "Amistoso Internacional",
    categoryTag: "Masculino • Seleção Principal",
    competition: { name: "Jogos de Seleções" },
    homeTeam: { name: "Brasil", shortName: "Brasil", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8256.png" },
    awayTeam: { name: "Espanha", shortName: "Espanha", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8257.png" },
    venue: "Santiago Bernabéu",
    broadcaster: "TV Globo / SporTV"
  },
  {
    id: 9003,
    utcDate: new Date(Date.now() + 172800000).toISOString(),
    status: "TIMED",
    stage: "Fase de Grupos",
    categoryTag: "Feminino • Profissional",
    competition: { name: "Brasileirão Feminino" },
    homeTeam: { name: "Corinthians (Fem)", shortName: "Corinthians Fem", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png" },
    awayTeam: { name: "Palmeiras (Fem)", shortName: "Palmeiras Fem", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png" },
    venue: "Parque São Jorge",
    broadcaster: "SporTV / TV Brasil"
  },
  {
    id: 9004,
    utcDate: new Date(Date.now() + 259200000).toISOString(),
    status: "TIMED",
    stage: "Quartas de Final",
    categoryTag: "Masculino • Sub-20",
    competition: { name: "Copa do Brasil Sub-20" },
    homeTeam: { name: "Flamengo Sub-20", shortName: "Flamengo Sub-20", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/5926.png" },
    awayTeam: { name: "São Paulo Sub-20", shortName: "São Paulo Sub-20", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png" },
    venue: "Gávea",
    broadcaster: "SporTV"
  }
];

const initialNews = [
  {
    id: 1,
    title: "São Paulo x Santos: Onde assistir ao vivo, horário e prováveis escalações",
    summary: "Clássico San-São movimenta o futebol paulista no MorrumBIS. Confira detalhes da transmissão.",
    category: "Brasileirão",
    date: "27/09/2026",
    url: "https://ge.globo.com"
  },
  {
    id: 2,
    title: "Série B e Seleções: Guia completo de onde assistir às partidas da semana",
    summary: "Confira horários e canais dos confrontos da Série B, Seleção Brasileira e Brasileirão Feminino.",
    category: "Guia de TV",
    date: "27/09/2026",
    url: "https://ge.globo.com/futebol/brasileirao-serie-b/"
  },
  {
    id: 3,
    title: "Copa do Brasil Sub-20 e Futebol Feminino em destaque nos canais de esporte",
    summary: "Saiba onde acompanhar os talentos das categorias de base e do futebol feminino nacional.",
    category: "Base & Feminino",
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
      let apiMatches = [];
      if (res.ok) {
        const data = await res.json();
        apiMatches = (data.matches || []).map(m => ({
          ...m,
          categoryTag: "Masculino • Profissional"
        }));
      }
      setMatches([...apiMatches, ...EXTRA_MATCHES]);
    } catch (err) {
      console.error(err);
      setMatches(EXTRA_MATCHES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const leagues = ['todas', ...Array.from(new Set(matches.map(m => m.competition?.name).filter(Boolean)))];

  const filteredMatches = matches.filter(match => {
    const homeName = match.homeTeam?.name || '';
    const awayName = match.awayTeam?.name || '';
    const leagueName = match.competition?.name || '';
    const categoryTag = match.categoryTag || '';

    const matchesSearch = 
      homeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      awayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leagueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLeague = selectedLeague === 'todas' || leagueName === selectedLeague;
    const matchesTeamFilter = !selectedTeamFilter || homeName.toLowerCase().includes(selectedTeamFilter.toLowerCase()) || awayName.toLowerCase().includes(selectedTeamFilter.toLowerCase());

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
              <p className="text-xs text-slate-400">Guia de Partidas, Séries A & B, Seleções, Base e Feminino</p>
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
        
        {/* Carrossel de Times em Destaque */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Times em Destaque (Clique para filtrar)
            </span>
            {selectedTeamFilter && (
              <button 
                onClick={() => {
                  setSelectedTeamFilter(null);
                  setSearchQuery('');
                }}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Limpar filtro ({selectedTeamFilter})
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {BRASIL_TEAMS.map(team => (
              <button
                key={team.id}
                onClick={() => {
                  if (selectedTeamFilter === team.name) {
                    setSelectedTeamFilter(null);
                    setSearchQuery('');
                  } else {
                    setSelectedTeamFilter(team.name);
                    setSearchQuery(team.name);
                  }
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[85px] transition ${
                  selectedTeamFilter === team.name 
                    ? 'bg-emerald-500/20 border-emerald-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center mb-1">
                  <img src={team.crest} alt={team.name} className="max-w-full max-h-full object-contain filter drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-semibold text-slate-200 truncate max-w-[75px]">{team.name}</span>
                <span className="text-[9px] text-slate-400">{team.state}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por time, categoria (ex: Sub-20, Feminino), estádio..."
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

        {/* Status */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Buscando as próximas partidas em tempo real...</p>
          </div>
        )}

        {/* Lista de Partidas com Categoria (Feminino/Base/Masculino) */}
        {!loading && (
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

                const roundText = match.matchday 
                  ? `${match.matchday}ª Rodada` 
                  : match.stage 
                    ? match.stage.replace('_', ' ') 
                    : 'Fase Regular';

                const homeTeamName = match.homeTeam?.name || '';
                const foundTeam = BRASIL_TEAMS.find(t => homeTeamName.toLowerCase().includes(t.name.toLowerCase()));
                const venueName = match.venue || foundTeam?.stadium || 'Estádio a definir';
                const tvChannel = match.broadcaster || 'Premiere / TV Fechada';
                const categoryTag = match.categoryTag || 'Masculino • Profissional';

                return (
                  <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 hover:border-slate-700 transition">
                    
                    {/* Header: Liga, Categoria (Feminino/Sub-20/etc), Rodada, Data */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> {match.competition?.name}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> {categoryTag}
                        </span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                          {roundText}
                        </span>
                      </div>
                      <span className="font-medium text-slate-300">{dateString} - {timeString}</span>
                    </div>

                    {/* Confronto */}
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

                    {/* Rodapé: Local e Canal */}
                    <div className="pt-2 border-t border-slate-800/40 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Local: <strong className="text-slate-200">{venueName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Onde assistir: <strong className="text-emerald-400">{tvChannel}</strong></span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Seção de Notícias */}
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
