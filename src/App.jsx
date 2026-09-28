import React, { useState, useEffect } from 'react';
import { 
  Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle, Newspaper, 
  ExternalLink, MapPin, Shield, UserCheck, ListOrdered, Info, 
  X, PlayCircle, Flame, Filter, ChevronRight
} from 'lucide-react';

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

// Tabelas de Classificação Completas com Status de Zonas e Barras Coloridas
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
    { pos: 9, name: "Vasco da Gama", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10278.png", pts: 35, pj: 26, v: 10, e: 5, d: 11, sg: -6, status: "sulamericana" },
    { pos: 10, name: "Atlético Mineiro", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10273.png", pts: 36, pj: 25, v: 9, e: 9, d: 7, sg: -1, status: "sulamericana" },
    { pos: 17, name: "Corinthians", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png", pts: 28, pj: 27, v: 6, e: 10, d: 11, sg: -8, status: "z4" },
    { pos: 18, name: "Fluminense", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10274.png", pts: 27, pj: 26, v: 7, e: 6, d: 13, sg: -9, status: "z4" }
  ],
  "Brasileirão Feminino": [
    { pos: 1, name: "Corinthians (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png", pts: 40, pj: 15, v: 13, e: 1, d: 1, sg: 32, status: "libertadores" },
    { pos: 2, name: "Palmeiras (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png", pts: 34, pj: 15, v: 11, e: 1, d: 3, sg: 21, status: "libertadores" },
    { pos: 3, name: "Ferroviária (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/652034.png", pts: 32, pj: 15, v: 9, e: 5, d: 1, sg: 14, status: "libertadores" },
    { pos: 4, name: "São Paulo (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png", pts: 30, pj: 15, v: 9, e: 3, d: 3, sg: 18, status: "libertadores" },
    { pos: 5, name: "Internacional (Fem)", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8632.png", pts: 23, pj: 15, v: 6, e: 5, d: 4, sg: 4, status: "normal" }
  ],
  "Brasileirão Série B": [
    { pos: 1, name: "Novorizontino", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/652033.png", pts: 51, pj: 28, v: 15, e: 6, d: 7, sg: 11, status: "libertadores" },
    { pos: 2, name: "Santos", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10276.png", pts: 50, pj: 28, v: 14, e: 8, d: 6, sg: 21, status: "libertadores" },
    { pos: 3, name: "Sport", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10279.png", pts: 46, pj: 27, v: 13, e: 7, d: 7, sg: 10, status: "libertadores" },
    { pos: 4, name: "Vila Nova", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9780.png", pts: 45, pj: 28, v: 13, e: 6, d: 9, sg: 3, status: "libertadores" },
    { pos: 17, name: "Ituano", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10285.png", pts: 28, pj: 28, v: 8, e: 4, d: 16, sg: -14, status: "z4" }
  ],
  "Premier League (Inglaterra)": [
    { pos: 1, name: "Manchester City", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8456.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 8, status: "libertadores" },
    { pos: 2, name: "Liverpool", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8650.png", pts: 12, pj: 5, v: 4, e: 0, d: 1, sg: 9, status: "libertadores" },
    { pos: 3, name: "Aston Villa", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10252.png", pts: 12, pj: 5, v: 4, e: 0, d: 1, sg: 3, status: "libertadores" },
    { pos: 4, name: "Arsenal", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9825.png", pts: 11, pj: 5, v: 3, e: 2, d: 0, sg: 5, status: "libertadores" },
    { pos: 5, name: "Chelsea", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8455.png", pts: 10, pj: 5, v: 3, e: 1, d: 1, sg: 6, status: "sulamericana" }
  ],
  "Liga Portugal": [
    { pos: 1, name: "Sporting CP", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9768.png", pts: 18, pj: 6, v: 6, e: 0, d: 0, sg: 17, status: "libertadores" },
    { pos: 2, name: "FC Porto", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9773.png", pts: 15, pj: 6, v: 5, e: 0, d: 1, sg: 12, status: "libertadores" },
    { pos: 3, name: "SL Benfica", crest: "https://images.fotmob.com/image_resources/logo/teamlogo/9772.png", pts: 13, pj: 5, v: 4, e: 1, d: 0, sg: 8, status: "pre-libertadores" }
  ]
};

// Dados de Artilharia das Ligas
const TOP_SCORERS = [
  { rank: 1, name: "Pedro", team: "Flamengo", goals: 11, games: 21, crest: "https://images.fotmob.com/image_resources/logo/teamlogo/5926.png", league: "Brasileirão" },
  { rank: 2, name: "Estêvão", team: "Palmeiras", goals: 9, games: 22, crest: "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png", league: "Brasileirão" },
  { rank: 3, name: "Luiz Henrique", team: "Botafogo", goals: 8, games: 24, crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8517.png", league: "Brasileirão" },
  { rank: 4, name: "Erling Haaland", team: "Manchester City", goals: 10, games: 5, crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8456.png", league: "Premier League" },
  { rank: 5, name: "Robert Lewandowski", team: "Barcelona", goals: 7, games: 7, crest: "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png", league: "La Liga" }
];

// Guia do Onde Assistir (Streaming & Canais de TV)
const STREAMING_GUIDE = [
  { name: "Premiere", type: "Pay-Per-View", details: "Todos os jogos do Brasileirão Séries A e B ao vivo.", badge: "Nacional" },
  { name: "CazéTV (YouTube / Prime)", type: "Gratuito / Streaming", details: "Transmite partidas do Brasileirão, Liga Europeia e torneios femininos.", badge: "Ao Vivo" },
  { name: "SporTV", type: "TV Fechada", details: "Transmite principais jogos da Série A, Série B, Copa do Brasil e Feminino.", badge: "Canais Globo" },
  { name: "TV Globo", type: "TV Aberta", details: "Partidas selecionadas das quartas e domingos às 16h.", badge: "Gratuito" },
  { name: "Disney+ / ESPN", type: "Streaming & TV Fechada", details: "Premier League, La Liga, Serie A Italiana e Copa Libertadores.", badge: "Internacional" },
  { name: "Max (HBO Max)", type: "Streaming", details: "Transmissão exclusiva da UEFA Champions League e Paulistão.", badge: "Champions" }
];

// Partidas Extras (Amanhã, Hoje, Próximos Dias)
const TODAY_DATE = new Date().toISOString().split('T')[0];
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

// Banco de Notícias Automatizadas por Clube com Conteúdo Interno Completo
const NEWS_BY_TEAM = {
  "Destaques": [
    { 
      id: 101, 
      team: "Geral", 
      title: "Guia completo de transmissões: Onde assistir aos jogos da rodada no futebol brasileiro", 
      summary: "Confira horários e canais de TV fechada, aberta e streaming dos confrontos desta semana.", 
      date: "28/09/2026", 
      content: "O futebol brasileiro entra em uma de suas semanas mais decisivas na temporada de 2026. Com duelos fundamentais no Brasileirão Série A, Série B e nos campeonatos femininos, o torcedor precisa ficar atento às opções de transmissão.\n\nA TV Globo transmitirá os jogos selecionados das noites de quarta-feira e tardes de domingo. Nos canais fechados, a SporTV e a ESPN lideram a grade de programação, enquanto o Premiere assegura 100% dos confrontos das Séries A e B no Pay-Per-View.\n\nPara quem prefere o streaming, plataformas como CazéTV, Max e Disney+ oferecem transmissões em alta definição com narrações exclusivas e análises de pré-jogo."
    },
    { 
      id: 102, 
      team: "Seleção Brasileira", 
      title: "Brasil x Austrália: Horários, prováveis escalações e onde assistir ao vivo", 
      summary: "Seleção entra em campo nesta segunda em preparação para os próximos desafios internacionais.", 
      date: "28/09/2026", 
      content: "A Seleção Brasileira masculina volta a campo nesta segunda-feira para enfrentar a Austrália em partida amistosa preparatória.\n\nO técnico da Seleção testará novas opções no setor de meio-campo e ataque, dando rodagem a jovens destaques do futebol nacional e europeu. A partida terá início às 18:30 (horário de Brasília) e contará com transmissão ao vivo na TV Globo e no SporTV."
    },
    { 
      id: 103, 
      team: "Feminino", 
      title: "Derby no Brasileirão Feminino mobiliza Corinthians e Palmeiras em fase decisiva", 
      summary: "Clássico paulista agita a reta final do campeonato nacional com cobertura completa de TV.", 
      date: "27/09/2026", 
      content: "As equipes femininas de Corinthians e Palmeiras se preparam para mais um Derby épico pelo Brasileirão Feminino.\n\nCom as duas equipes no topo da tabela e com vaga garantida nas fases finais, a partida vale a liderança isolada e o favoritismo para o título nacional. O jogo terá transmissão do SporTV e da TV Brasil."
    }
  ],
  "Flamengo": [
    { 
      id: 201, 
      team: "Flamengo", 
      title: "Flamengo intensifica treinos táticos no Ninho do Urubu visando o próximo duelo", 
      summary: "Comandante ajusta o posicionamento ofensivo e busca manter o time no topo da tabela do Brasileirão.", 
      date: "28/09/2026", 
      content: "O elenco do Flamengo realizou mais uma sessão intensa de treinos no Ninho do Urubu sob o comando da comissão técnica. O foco do trabalho esteve na rápida transição ofensiva e no aprimoramento das finalizações.\n\nCom o apoio da torcida no Maracanã no próximo compromisso, a equipe busca somar três pontos para se manter firme na disputa do título do Brasileirão 2026."
    }
  ],
  "Palmeiras": [
    { 
      id: 301, 
      team: "Palmeiras", 
      title: "Palmeiras foca em bola parada no Allianz Parque para manter sequência positiva", 
      summary: "Equipe alviverde finaliza preparação com atenção especial aos detalhes defensivos e táticos.", 
      date: "28/09/2026", 
      content: "Na Academia de Futebol, o Palmeiras realizou ajustes decisivos nas jogadas ensaiadas de bola parada antes do próximo confronto pelo campeonato.\n\nA equipe alviverde vive grande momento na temporada e busca manter o aproveitamento elevado jogando no Allianz Parque."
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('todas');
  const [selectedStandingLeague, setSelectedStandingLeague] = useState('Brasileirão Série A');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState(null);
  const [selectedNewsTeam, setSelectedNewsTeam] = useState('Destaques');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dateFilter, setDateFilter] = useState('todos');

  const fetchMatches = async () => {
    setLoading(true);
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

    // Filtro rápido por Data
    const matchDateStr = new Date(match.utcDate).toISOString().split('T')[0];
    let matchesDate = true;
    if (dateFilter === 'hoje') matchesDate = matchDateStr === TODAY_DATE;

    return matchesSearch && matchesLeague && matchesTeamFilter && matchesDate;
  });

  const newsList = NEWS_BY_TEAM[selectedNewsTeam] || NEWS_BY_TEAM["Destaques"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header com Navegação */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
              <Tv className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Onde tem Jogo? <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">AO VIVO</span>
              </h1>
              <p className="text-xs text-slate-400">Guia de Transmissões, Tabelas, Notícias e Artilharia</p>
            </div>
          </div>

          {/* Abas de Navegação Principal */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'matches' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Jogos
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'standings' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" /> Tabela
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'guide' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Onde Assistir
            </button>
            <button
              onClick={() => setActiveTab('scorers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'scorers' 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Artilharia
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Carrossel de Times em Destaque */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Times em Destaque (Filtrar Conteúdo)
            </span>
            {(selectedTeamFilter || selectedNewsTeam !== 'Destaques') && (
              <button 
                onClick={() => {
                  setSelectedTeamFilter(null);
                  setSelectedNewsTeam('Destaques');
                  setSearchQuery('');
                }}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Limpar filtros
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
                    setSelectedNewsTeam('Destaques');
                    setSearchQuery('');
                  } else {
                    setSelectedTeamFilter(team.name);
                    setSelectedNewsTeam(team.name);
                    setSearchQuery(team.name);
                  }
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[85px] transition ${
                  selectedTeamFilter === team.name || selectedNewsTeam === team.name
                    ? 'bg-emerald-500/20 border-emerald-500 scale-105 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center mb-1">
                  <img src={team.crest} alt={team.name} className="max-w-full max-h-full object-contain filter drop-shadow" />
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
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por time, categoria (Feminino, Sub-20), estádio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Filtro Rápido por Data */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button 
                    onClick={() => setDateFilter('todos')} 
                    className={`px-3 py-1.5 rounded-lg transition ${dateFilter === 'todos' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setDateFilter('hoje')} 
                    className={`px-3 py-1.5 rounded-lg transition ${dateFilter === 'hoje' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Hoje
                  </button>
                </div>
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

                        {/* Localização e Transmissão */}
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

                        {/* Aviso sobre os requisitos de streaming */}
                        <div className="pt-2 border-t border-slate-800/20 flex items-center gap-1.5 text-[11px] text-slate-400 italic">
                          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>Os requisitos de acesso podem variar de acordo com o serviço de streaming.</span>
                        </div>

                      </div>
                    );
                  })
                )}
              </section>
            )}
          </div>
        )}

        {/* ABA 2: TABELA DE CLASSIFICAÇÃO COM BARRAS LATERAIS */}
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
                      let borderStyle = 'border-l-4 border-l-transparent';
                      let posBadgeStyle = 'bg-slate-800 text-slate-300';

                      if (team.status === 'libertadores') {
                        borderStyle = 'border-l-4 border-l-emerald-500 bg-emerald-500/10';
                        posBadgeStyle = 'bg-emerald-500 text-slate-950 font-black';
                      } else if (team.status === 'pre-libertadores') {
                        borderStyle = 'border-l-4 border-l-blue-500 bg-blue-500/10';
                        posBadgeStyle = 'bg-blue-500 text-white font-bold';
                      } else if (team.status === 'sulamericana') {
                        borderStyle = 'border-l-4 border-l-amber-500 bg-amber-500/10';
                        posBadgeStyle = 'bg-amber-500 text-slate-950 font-bold';
                      } else if (team.status === 'z4') {
                        borderStyle = 'border-l-4 border-l-red-500 bg-red-500/10';
                        posBadgeStyle = 'bg-red-500 text-white font-bold';
                      }

                      return (
                        <tr key={team.name} className={`hover:bg-slate-800/50 transition ${borderStyle}`}>
                          <td className="p-3 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${posBadgeStyle}`}>
                              {team.pos}
                            </span>
                          </td>
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

              {/* Legenda Explicativa de Cores */}
              <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-300">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Libertadores / Champions / G4</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500"></span> Pré-Libertadores / Qualificação</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500"></span> Sul-Americana / Liga Europa</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500"></span> Rebaixamento (Z4)</span>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: GUIA DE ONDE ASSISTIR */}
        {activeTab === 'guide' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" /> Onde Assistir: Plataformas & Canais Principais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STREAMING_GUIDE.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-emerald-400 text-sm">{item.name}</h3>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-semibold">{item.badge}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{item.type}</p>
                  <p className="text-xs text-slate-400">{item.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 4: TOP ARTILHARIA */}
        {activeTab === 'scorers' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" /> Principais Artilheiros da Temporada
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center">#</th>
                    <th className="p-3">Jogador</th>
                    <th className="p-3">Clube / Liga</th>
                    <th className="p-3 text-center">Gols</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {TOP_SCORERS.map(s => (
                    <tr key={s.rank} className="hover:bg-slate-800/40">
                      <td className="p-3 text-center font-bold text-slate-400">{s.rank}</td>
                      <td className="p-3 font-bold text-slate-100">{s.name}</td>
                      <td className="p-3 flex items-center gap-2">
                        <img src={s.crest} alt={s.team} className="w-4 h-4 object-contain" />
                        <span>{s.team} <span className="text-[10px] text-slate-500">({s.league})</span></span>
                      </td>
                      <td className="p-3 text-center font-black text-emerald-400 text-sm">{s.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Seção Dinâmica de Notícias com Leitura Interna Completa */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" /> NOTÍCIAS & GUIAS POR CLUBE ({selectedNewsTeam})
            </h2>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              {['Destaques', ...BRASIL_TEAMS.map(t => t.name)].map(tName => (
                <button
                  key={tName}
                  onClick={() => setSelectedNewsTeam(tName)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                    selectedNewsTeam === tName 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsList.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedArticle(item)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">{item.team}</span>
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
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Modal de Leitura de Notícia Completa (Ideais para Exibir Anúncios do AdSense) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-xs font-bold">
                {selectedArticle.team}
              </span>
              <h2 className="text-xl font-black text-white leading-snug pt-1">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-slate-400">Publicado em {selectedArticle.date} • Onde Tem Jogo</p>
            </div>

            <hr className="border-slate-800" />

            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-400 transition"
              >
                Fechar Notícia
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
