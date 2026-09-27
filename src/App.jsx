import React, { useState, useEffect } from 'react';
import { Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle, Newspaper, ExternalLink, MapPin, Shield, UserCheck, ListOrdered } from 'lucide-react';

// Escudos Padronizados
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
  { id: 12, name: "Cruzeiro", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9782.png", state: "MG", stadium: "Mineirão" }
];

// Tabelas de Classificação Completas (incluindo Brasileirão Feminino)
const STANDINGS_DATA = {
  "Brasileirão Série A": [
    { pos: 1, name: "Botafogo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8517.png", pts: 56, pj: 27, v: 17, e: 5, d: 5, sg: 22, status: "libertadores" },
    { pos: 2, name: "Palmeiras", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png", pts: 53, pj: 27, v: 16, e: 5, d: 6, sg: 20, status: "libertadores" },
    { pos: 3, name: "Fortaleza", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8287.png", pts: 52, pj: 27, v: 15, e: 7, d: 5, sg: 14, status: "libertadores" },
    { pos: 4, name: "Flamengo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/5926.png", pts: 48, pj: 26, v: 14, e: 6, d: 6, sg: 16, status: "libertadores" },
    { pos: 5, name: "São Paulo", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png", pts: 44, pj: 27, v: 13, e: 5, d: 9, sg: 8, status: "pre-libertadores" },
    { pos: 6, name: "Bahia", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10281.png", pts: 42, pj: 27, v: 12, e: 6, d: 9, sg: 7, status: "pre-libertadores" },
    { pos: 7, name: "Cruzeiro", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9782.png", pts: 42, pj: 27, v: 12, e: 6, d: 9, sg: 5, status: "sulamericana" },
    { pos: 8, name: "Internacional", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8632.png", pts: 41, pj: 25, v: 11, e: 8, d: 6, sg: 9, status: "sulamericana" },
    { pos: 17, name: "Corinthians", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png", pts: 28, pj: 27, v: 6, e: 10, d: 11, sg: -8, status: "z4" },
    { pos: 18, name: "Fluminense", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10274.png", pts: 27, pj: 26, v: 7, e: 6, d: 13, sg: -9, status: "z4" }
  ],
  "Brasileirão Feminino": [
    { pos: 1, name: "Corinthians (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png", pts: 40, pj: 15, v: 13, e: 1, d: 1, sg: 32, status: "g4" },
    { pos: 2, name: "Palmeiras (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png", pts: 34, pj: 15, v: 11, e: 1, d: 3, sg: 21, status: "g4" },
    { pos: 3, name: "Ferroviária (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/652034.png", pts: 32, pj: 15, v: 9, e: 5, d: 1, sg: 14, status: "g4" },
    { pos: 4, name: "São Paulo (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png", pts: 30, pj: 15, v: 9, e: 3, d: 3, sg: 18, status: "g4" },
    { pos: 5, name: "Internacional (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8632.png", pts: 23, pj: 15, v: 6, e: 5, d: 4, sg: 4, status: "normal" }
  ],
  "Brasileirão Série B": [
    { pos: 1, name: "Novorizontino", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/652033.png", pts: 51, pj: 28, v: 15, e: 6, d: 7, sg: 11, status: "g4" },
    { pos: 2, name: "Santos", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10276.png", pts: 50, pj: 28, v: 14, e: 8, d: 6, sg: 21, status: "g4" },
    { pos: 3, name: "Sport", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10279.png", pts: 46, pj: 27, v: 13, e: 7, d: 7, sg: 10, status: "g4" },
    { pos: 4, name: "Vila Nova", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9780.png", pts: 45, pj: 28, v: 13, e: 6, d: 9, sg: 3, status: "g4" }
  ],
  "Premier League (Inglaterra)": [
    { pos: 1, name: "Manchester City", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8456.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 8, status: "champions" },
    { pos: 2, name: "Liverpool", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8650.png", pts: 12, pj: 5, v: 4, e: 0, d: 1, sg: 9, status: "champions" },
    { pos: 3, name: "Aston Villa", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10252.png", pts: 12, pj: 5, v: 4, e: 0, d: 1, sg: 3, status: "champions" },
    { pos: 4, name: "Arsenal", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9825.png", pts: 11, pj: 5, v: 3, e: 2, d: 0, sg: 5, status: "champions" }
  ],
  "Liga Portugal": [
    { pos: 1, name: "Sporting CP", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9768.png", pts: 18, pj: 6, v: 6, e: 0, d: 0, sg: 17, status: "champions" },
    { pos: 2, name: "FC Porto", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9773.png", pts: 15, pj: 6, v: 5, e: 0, d: 1, sg: 12, status: "champions" },
    { pos: 3, name: "SL Benfica", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9772.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 8, status: "pre-libertadores" }
  ],
  "Ligue 1 (França)": [
    { pos: 1, name: "Paris Saint-Germain", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9847.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 13, status: "champions" },
    { pos: 2, name: "Marseille", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8586.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 9, status: "champions" },
    { pos: 3, name: "Monaco", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9829.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 8, status: "champions" }
  ],
  "La Liga (Espanha)": [
    { pos: 1, name: "Barcelona", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png", pts: 21, pj: 7, v: 7, e: 0, d: 0, sg: 18, status: "champions" },
    { pos: 2, name: "Real Madrid", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8633.png", pts: 17, pj: 7, v: 5, e: 2, d: 0, sg: 11, status: "champions" }
  ],
  "Bundesliga (Alemanha)": [
    { pos: 1, name: "Bayern de Munique", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9823.png", pts: 12, pj: 4, v: 4, e: 0, d: 0, sg: 11, status: "champions" },
    { pos: 2, name: "Bayer Leverkusen", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8178.png", pts: 9, pj: 4, v: 3, e: 0, d: 1, sg: 4, status: "champions" }
  ]
};

// Partidas incluindo Futebol Feminino, Série B e Seleções
const EXTRA_MATCHES = [
  {
    id: 9001,
    utcDate: new Date("2026-09-28T18:30:00Z").toISOString(),
    status: "TIMED",
    stage: "Amistoso Internacional",
    categoryTag: "Masculino • Seleção Principal",
    competition: { name: "Jogos de Seleções" },
    homeTeam: { name: "Brasil", shortName: "Brasil", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8256.png" },
    awayTeam: { name: "Austrália", shortName: "Austrália", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8282.png" },
    venue: "Estádio Nacional",
    broadcaster: "TV Globo / SporTV"
  },
  {
    id: 9002,
    utcDate: new Date("2026-09-28T21:00:00Z").toISOString(),
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
    id: 9003,
    utcDate: new Date("2026-09-29T19:00:00Z").toISOString(),
    status: "TIMED",
    stage: "Reta Final",
    categoryTag: "Feminino • Profissional",
    competition: { name: "Brasileirão Feminino" },
    homeTeam: { name: "Corinthians (Fem)", shortName: "Corinthians Fem", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png" },
    awayTeam: { name: "Palmeiras (Fem)", shortName: "Palmeiras Fem", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png" },
    venue: "Neo Química Arena",
    broadcaster: "SporTV / TV Brasil"
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
    title: "Brasil x Austrália: Confira o horário e onde assistir ao amistoso da Seleção",
    summary: "Seleção Brasileira entra em campo nesta segunda-feira. Veja todas as novidades do elenco.",
    category: "Seleção Brasileira",
    date: "27/09/2026",
    url: "https://ge.globo.com/futebol/selecao-brasileira/"
  },
  {
    id: 3,
    title: "Brasileirão Feminino e Séries A e B em destaque nos canais de esporte",
    summary: "Confira horários e canais de TV de todas as partidas da semana no futebol nacional e internacional.",
    category: "Feminino & Guias de TV",
    date: "26/09/2026",
    url: "https://uol.com.br/esporte"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('todas');
  const [selectedStandingLeague, setSelectedStandingLeague] = useState('Brasileirão Série A');
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
      {/* Header com Navegação */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
              <Tv className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Onde tem Jogo? <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">AO VIVO</span>
              </h1>
              <p className="text-xs text-slate-400">Guia de Partidas, Tabelas, Feminino e Transmissões</p>
            </div>
          </div>

          {/* Abas de Navegação Principal */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'matches' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Próximos Jogos
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'standings' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" /> Classificação
            </button>
          </div>
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
                    setActiveTab('matches');
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

        {/* ABA 1: PRÓXIMOS JOGOS */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por time, categoria (ex: Feminino, Sub-20), estádio..."
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

            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-400">Buscando as próximas partidas...</p>
              </div>
            )}

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
          </div>
        )}

        {/* ABA 2: TABELA DE CLASSIFICAÇÃO */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
              {Object.keys(STANDINGS_DATA).map(league => (
                <button
                  key={league}
                  onClick={() => setSelectedStandingLeague(league)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition ${
                    selectedStandingLeague === league 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> {selectedStandingLeague}
                </h3>
                <span className="text-xs text-slate-400">Classificação Atualizada</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">Pos</th>
                      <th className="p-3">Clube</th>
                      <th className="p-3 text-center">PTS</th>
                      <th className="p-3 text-center">PJ</th>
                      <th className="p-3 text-center">V</th>
                      <th className="p-3 text-center">E</th>
                      <th className="p-3 text-center">D</th>
                      <th className="p-3 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {STANDINGS_DATA[selectedStandingLeague]?.map(team => {
                      let statusBg = '';
                      if (team.status === 'libertadores' || team.status === 'champions' || team.status === 'g4') statusBg = 'border-l-4 border-l-emerald-500 bg-emerald-500/5';
                      if (team.status === 'pre-libertadores') statusBg = 'border-l-4 border-l-blue-500 bg-blue-500/5';
                      if (team.status === 'sulamericana') statusBg = 'border-l-4 border-l-amber-500 bg-amber-500/5';
                      if (team.status === 'z4') statusBg = 'border-l-4 border-l-red-500 bg-red-500/5';

                      return (
                        <tr key={team.name} className={`hover:bg-slate-800/40 transition ${statusBg}`}>
                          <td className="p-3 text-center font-bold text-slate-200">{team.pos}</td>
                          <td className="p-3 flex items-center gap-2.5 font-bold text-slate-100">
                            <img src={team.crest} alt={team.name} className="w-5 h-5 object-contain" />
                            <span>{team.name}</span>
                          </td>
                          <td className="p-3 text-center font-extrabold text-emerald-400 text-sm">{team.pts}</td>
                          <td className="p-3 text-center">{team.pj}</td>
                          <td className="p-3 text-center">{team.v}</td>
                          <td className="p-3 text-center">{team.e}</td>
                          <td className="p-3 text-center">{team.d}</td>
                          <td className="p-3 text-center">{team.sg > 0 ? `+${team.sg}` : team.sg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legenda */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Libertadores / Champions / G4</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Pré-Libertadores</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sul-Americana</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Rebaixamento (Z4)</span>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Notícias */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" /> ÚLTIMAS NOTÍCIAS & GUIAS DE TV
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
