import React, { useState } from 'react';
import { Tv, Calendar, Search, Newspaper, Trophy, Sparkles, Filter, X } from 'lucide-react';

// Escudos Vetoriais Aperfeiçoados (SVG de alta fidelidade)
const Badges = {
  flamengo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M10 12C10 12 50 2 90 12V52C90 75 50 95 50 95C50 95 10 75 10 52V12Z" fill="#C3281E"/>
      <path d="M10 24H90M10 36H90M10 48H90M10 60H85M18 72H82M30 84H70" stroke="#111111" strokeWidth="6"/>
      <rect x="12" y="12" width="38" height="36" fill="#111111"/>
      <path d="M22 18H38V22H27V26H36V30H27V42H22V18Z" fill="#FFFFFF"/>
      <path d="M32 26H44V30H37V34H43V38H37V42H32V26Z" fill="#FFFFFF"/>
      <path d="M10 12C10 12 50 2 90 12V52C90 75 50 95 50 95C50 95 10 75 10 52V12Z" stroke="#111111" strokeWidth="3"/>
    </svg>
  ),
  palmeiras: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="46" fill="#006437"/>
      <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="35" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M32 32H54C63 32 63 46 54 46H42V68H32V32ZM42 40H52C54 40 54 38 52 38H42V40Z" fill="#FFFFFF"/>
      <polygon points="63,35 66,43 74,43 68,48 70,56 63,51 56,56 58,48 52,43 60,43" fill="#FFFFFF"/>
    </svg>
  ),
  corinthians: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      {/* Remos e Âncora */}
      <path d="M20 20L80 80M80 20L20 80" stroke="#C3281E" strokeWidth="5" strokeLinecap="round"/>
      <path d="M50 10V30M35 20H65" stroke="#C3281E" strokeWidth="4"/>
      {/* Escudo Central */}
      <circle cx="50" cy="52" r="38" fill="#FFFFFF" stroke="#111111" strokeWidth="4"/>
      <circle cx="50" cy="52" r="30" fill="#111111"/>
      <circle cx="50" cy="52" r="28" fill="#FFFFFF"/>
      <path d="M22 45C30 40 70 40 78 45" stroke="#111111" strokeWidth="2.5"/>
      <path d="M22 59C30 64 70 64 78 59" stroke="#111111" strokeWidth="2.5"/>
      <text x="50" y="56" textAnchor="middle" fontSize="13" fontWeight="900" fill="#111111" fontFamily="sans-serif">S C C P</text>
      <path d="M35 72C42 82 58 82 65 72" stroke="#C3281E" strokeWidth="3" fill="none"/>
    </svg>
  ),
  saopaulo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M8 18H92L50 92L8 18Z" fill="#FFFFFF" stroke="#111111" strokeWidth="4"/>
      <path d="M8 18H92V36H8V18Z" fill="#111111"/>
      <path d="M18 36L50 85L34 36H18Z" fill="#C3281E"/>
      <path d="M82 36L50 85L66 36H82Z" fill="#111111"/>
      <text x="50" y="32" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">S P F C</text>
    </svg>
  ),
  santos: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 15H88V48C88 72 50 92 50 92C50 92 12 72 12 48V15Z" fill="#FFFFFF" stroke="#111111" strokeWidth="4"/>
      <path d="M12 36L88 36" stroke="#111111" strokeWidth="3"/>
      <path d="M12 15H88V36H12V15Z" fill="#111111"/>
      <polygon points="30,20 32,25 37,25 33,28 35,33 30,30 25,33 27,28 23,25 28,25" fill="#FFB800"/>
      <text x="60" y="30" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">S.F.C.</text>
      <path d="M12 36L50 92M88 36L50 92" stroke="#111111" strokeWidth="2"/>
    </svg>
  ),
  gremio: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 22C12 22 50 10 88 22V50C88 74 50 92 50 92C50 92 12 74 12 50V22Z" fill="#0D80BF" stroke="#111111" strokeWidth="4"/>
      <path d="M12 38H88M12 52H88M12 66H88" stroke="#FFFFFF" strokeWidth="5"/>
      <path d="M12 22H88V32H12V22Z" fill="#111111"/>
      <text x="50" y="29" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">GRÊMIO</text>
      <path d="M12 22C12 22 50 10 88 22V50C88 74 50 92 50 92C50 92 12 74 12 50V22Z" stroke="#111111" strokeWidth="3"/>
    </svg>
  ),
  internacional: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="46" fill="#E30613"/>
      <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="3"/>
      <path d="M38 28H44V72H38V28ZM48 28H62V34H54V47H60V53H54V72H48V28Z" fill="#FFFFFF"/>
    </svg>
  ),
  botafogo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 12H88V50C88 74 50 94 50 94C50 94 12 74 12 50V12Z" fill="#111111" stroke="#FFFFFF" strokeWidth="5"/>
      <path d="M12 12H88V50C88 74 50 94 50 94C50 94 12 74 12 50V12Z" stroke="#111111" strokeWidth="2"/>
      <polygon points="50,25 57,42 75,42 61,53 66,70 50,59 34,70 39,53 25,42 43,42" fill="#FFFFFF"/>
    </svg>
  ),
  fluminense: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 15H88V48C88 72 50 92 50 92C50 92 12 72 12 48V15Z" fill="#8A052B" stroke="#006437" strokeWidth="6"/>
      <path d="M12 15H88V48C88 72 50 92 50 92C50 92 12 72 12 48V15Z" stroke="#FFFFFF" strokeWidth="2"/>
      <path d="M20 20C40 30 60 30 80 20M20 80C40 70 60 70 80 80" stroke="#FFFFFF" strokeWidth="3"/>
      <text x="50" y="57" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FFFFFF" fontFamily="serif">FFC</text>
    </svg>
  ),
  vasco: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 15H88V50C88 74 50 92 50 92C50 92 12 74 12 50V15Z" fill="#111111" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M22 20L78 82" stroke="#FFFFFF" strokeWidth="14"/>
      {/* Caravela */}
      <path d="M42 42H58V58H42V42Z" fill="#111111"/>
      <path d="M45 45H55V55H45V45Z" fill="#C3281E"/>
      <path d="M50 35V65M38 50H62" stroke="#C3281E" strokeWidth="3"/>
    </svg>
  ),
  cruzeiro: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="46" fill="#00539F" stroke="#FFFFFF" strokeWidth="4"/>
      {/* Cruzeiro do Sul */}
      <polygon points="50,18 53,25 60,25 55,30 57,37 50,33 43,37 45,30 40,25 47,25" fill="#FFFFFF"/>
      <polygon points="28,45 30,50 35,50 31,53 33,58 28,55 23,58 25,53 21,50 26,50" fill="#FFFFFF"/>
      <polygon points="72,45 74,50 79,50 75,53 77,58 72,55 67,58 69,53 65,50 70,50" fill="#FFFFFF"/>
      <polygon points="50,68 52,73 57,73 53,76 55,81 50,78 45,81 47,76 43,73 48,73" fill="#FFFFFF"/>
      <polygon points="58,52 59,55 62,55 60,57 61,60 58,58 55,60 56,57 54,55 57,55" fill="#FFFFFF"/>
    </svg>
  ),
  atleticomg: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 15H88V50C88 74 50 92 50 92C50 92 12 74 12 50V15Z" fill="#111111" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M28 15V84M50 15V92M72 15V84" stroke="#FFFFFF" strokeWidth="8"/>
      <rect x="25" y="25" width="50" height="20" fill="#111111" rx="3"/>
      <text x="50" y="40" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">CAM</text>
    </svg>
  ),
  bahia: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="46" fill="#0055A5" stroke="#FFFFFF" strokeWidth="4"/>
      <circle cx="50" cy="50" r="36" fill="#FFFFFF"/>
      <rect x="26" y="26" width="48" height="48" fill="#0055A5" rx="4"/>
      <rect x="26" y="38" width="48" height="12" fill="#FFFFFF"/>
      <rect x="26" y="50" width="48" height="12" fill="#E30613"/>
      <polygon points="38,30 40,34 45,34 41,37 42,41 38,39 34,41 35,37 31,34 36,34" fill="#FFFFFF"/>
    </svg>
  ),
  sport: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M12 15H88V50C88 74 50 92 50 92C50 92 12 74 12 50V15Z" fill="#D3122A" stroke="#FFB800" strokeWidth="4"/>
      <path d="M12 28H88M12 44H88M12 60H88" stroke="#111111" strokeWidth="7"/>
      <circle cx="50" cy="50" r="22" fill="#111111" stroke="#FFB800" strokeWidth="2"/>
      <text x="50" y="56" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFB800" fontFamily="sans-serif">SCR</text>
    </svg>
  )
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('todos');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const teams = [
    { id: 'flamengo', name: 'Flamengo', Icon: Badges.flamengo },
    { id: 'palmeiras', name: 'Palmeiras', Icon: Badges.palmeiras },
    { id: 'corinthians', name: 'Corinthians', Icon: Badges.corinthians },
    { id: 'saopaulo', name: 'São Paulo', Icon: Badges.saopaulo },
    { id: 'santos', name: 'Santos', Icon: Badges.santos },
    { id: 'gremio', name: 'Grêmio', Icon: Badges.gremio },
    { id: 'internacional', name: 'Internacional', Icon: Badges.internacional },
    { id: 'botafogo', name: 'Botafogo', Icon: Badges.botafogo },
    { id: 'fluminense', name: 'Fluminense', Icon: Badges.fluminense },
    { id: 'vasco', name: 'Vasco', Icon: Badges.vasco },
    { id: 'cruzeiro', name: 'Cruzeiro', Icon: Badges.cruzeiro },
    { id: 'atleticomg', name: 'Atlético-MG', Icon: Badges.atleticomg },
    { id: 'bahia', name: 'Bahia', Icon: Badges.bahia },
    { id: 'sport', name: 'Sport', Icon: Badges.sport },
  ];

  const matches = [
    {
      id: 1,
      homeTeam: teams.find(t => t.id === 'flamengo'),
      awayTeam: teams.find(t => t.id === 'palmeiras'),
      time: 'AO VIVO - 32 min',
      isLive: true,
      channels: ['Globo', 'Premiere'],
      league: 'Brasileirão Série A',
      stadium: 'Maracanã, Rio de Janeiro',
    },
    {
      id: 2,
      homeTeam: teams.find(t => t.id === 'corinthians'),
      awayTeam: teams.find(t => t.id === 'saopaulo'),
      time: '18:30',
      isLive: false,
      channels: ['CazéTV', 'Premiere'],
      league: 'Brasileirão Série A',
      stadium: 'Neo Química Arena, São Paulo',
    },
    {
      id: 3,
      homeTeam: teams.find(t => t.id === 'santos'),
      awayTeam: teams.find(t => t.id === 'sport'),
      time: '21:30',
      isLive: false,
      channels: ['Sportv', 'Premiere'],
      league: 'Brasileirão Série B',
      stadium: 'Vila Belmiro, Santos',
    }
  ];

  const newsList = [
    {
      id: 1,
      title: 'Onde assistir aos jogos de hoje na TV e Streaming',
      team: 'Geral',
      time: 'Há 10 min',
      excerpt: 'Confira a lista completa das transmissões dos jogos desta rodada com horários atualizados.'
    },
    {
      id: 2,
      title: 'Flamengo x Palmeiras: prováveis escalações e onde assistir ao vivo',
      team: 'Flamengo',
      time: 'Há 30 min',
      excerpt: 'Tudo o que você precisa saber sobre o grande confronto decisivo pelo Brasileirão.'
    },
    {
      id: 3,
      title: 'Clássico Majestoso: Corinthians e São Paulo se enfrentam hoje',
      team: 'Corinthians',
      time: 'Há 1 hora',
      excerpt: 'Análise tática, desfalques e opções de transmissão para assistir ao jogo ao vivo.'
    }
  ];

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChannel = selectedChannel === 'todos' || match.channels.includes(selectedChannel);
    
    const matchesTeamFilter = !selectedTeam || 
                              match.homeTeam.id === selectedTeam.id || 
                              match.awayTeam.id === selectedTeam.id;

    return matchesSearch && matchesChannel && matchesTeamFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedTeam(null)}>
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
              <Tv className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Onde tem Jogo? <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">AO VIVO</span>
              </h1>
              <p className="text-xs text-slate-400">Guia Definitivo de Transmissão Esportiva</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Carrossel de Clubes */}
        <section className="bg-slate-900 p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" /> Clubes em Destaque (Série A & B)
            </h2>
            {selectedTeam && (
              <button 
                onClick={() => setSelectedTeam(null)}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Limpar Filtro
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {teams.map(team => {
              const isSelected = selectedTeam?.id === team.id;
              const IconComponent = team.Icon;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(isSelected ? null : team)}
                  className={`flex flex-col items-center p-2 rounded-xl min-w-[72px] transition-all duration-200 ${
                    isSelected 
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105' 
                      : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'
                  }`}
                >
                  <IconComponent className="w-10 h-10 mb-1" />
                  <span className="text-[11px] font-medium text-slate-300 truncate max-w-[64px]">{team.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtro por Time Selecionado */}
        {selectedTeam && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <selectedTeam.Icon className="w-8 h-8" />
              <div>
                <h3 className="text-sm font-bold text-white">Exibindo conteúdos de: {selectedTeam.name}</h3>
                <p className="text-xs text-slate-400">Próximos jogos, transmissões e últimas notícias</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedTeam(null)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Campo de Busca e Filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por time, campeonato ou estádio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium pr-1">
              <Filter className="w-3.5 h-3.5" /> Canais:
            </span>
            {['todos', 'Globo', 'Sportv', 'ESPN', 'CazéTV', 'Premiere'].map(channel => (
              <button
                key={channel}
                onClick={() => setSelectedChannel(channel)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition ${
                  selectedChannel === channel 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Partidas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Partidas Encontradas
            </h2>
            <span className="text-xs text-slate-500">{filteredMatches.length} jogos</span>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">Nenhum jogo encontrado para os filtros selecionados.</p>
              <button 
                onClick={() => { setSelectedTeam(null); setSearchQuery(''); setSelectedChannel('todos'); }}
                className="mt-3 text-xs text-emerald-400 font-bold hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            filteredMatches.map(match => {
              const HomeIcon = match.homeTeam.Icon;
              const AwayIcon = match.awayTeam.Icon;
              return (
                <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> {match.league}
                    </span>
                    <span>{match.stadium}</span>
                  </div>

                  <div className="grid grid-cols-3 items-center text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <HomeIcon className="w-12 h-12" />
                      <span className="font-bold text-sm text-slate-100">{match.homeTeam.name}</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        match.isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {match.time}
                      </span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <AwayIcon className="w-12 h-12" />
                      <span className="font-bold text-sm text-slate-100">{match.awayTeam.name}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-slate-800/40">
                    <div className="flex items-center space-x-2">
                      <Tv className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-300">Onde assistir:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {match.channels.map(channel => (
                        <span key={channel} className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Guia de Notícias */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-emerald-400" /> Guia de Notícias & Transmissão
            </h2>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-3">
            {newsList.map(item => (
              <div key={item.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 hover:border-slate-700 transition cursor-pointer">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-emerald-400">{item.team}</span>
                  <span>{item.time}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-200 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
