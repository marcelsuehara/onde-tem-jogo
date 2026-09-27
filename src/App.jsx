import React, { useState } from 'react';
import { Tv, Calendar, Search, Newspaper, Trophy, Sparkles, Filter, X } from 'lucide-react';

// Escudos Vetoriais embutidos diretamente no React (Sem requisições externas!)
const Badges = {
  flamengo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M10 15C10 15 50 5 90 15V55C90 75 50 95 50 95C50 95 10 75 10 55V15Z" fill="#C3281E" stroke="#111111" strokeWidth="4"/>
      <path d="M10 27H90M10 42H90M10 57H85M18 72H82" stroke="#111111" strokeWidth="7"/>
      <rect x="15" y="15" width="30" height="30" fill="#111111"/>
      <path d="M22 20H38V24H27V28H36V32H27V40H22V20Z" fill="#FFFFFF"/>
    </svg>
  ),
  palmeiras: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="45" fill="#006437" stroke="#FFFFFF" strokeWidth="4"/>
      <circle cx="50" cy="50" r="35" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2"/>
      <path d="M35 35H55C62 35 62 48 55 48H43V65H35V35ZM43 42H52C55 42 55 41 52 41H43V42Z" fill="#FFFFFF"/>
    </svg>
  ),
  corinthians: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="45" fill="#111111" stroke="#C3281E" strokeWidth="4"/>
      <path d="M50 15L60 30H40L50 15Z" fill="#C3281E"/>
      <circle cx="50" cy="52" r="28" fill="#FFFFFF" stroke="#111111" strokeWidth="3"/>
      <path d="M30 42C30 42 50 36 70 42M30 62C30 62 50 68 70 62" stroke="#111111" strokeWidth="3"/>
      <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="900" fill="#111111" fontFamily="sans-serif">SCCP</text>
    </svg>
  ),
  saopaulo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M10 20H90L50 90L10 20Z" fill="#FFFFFF" stroke="#111111" strokeWidth="4"/>
      <path d="M10 20H90V35H10V20Z" fill="#111111"/>
      <path d="M20 35L50 82L35 35H20Z" fill="#C3281E"/>
      <path d="M80 35L50 82L65 35H80Z" fill="#111111"/>
      <text x="50" y="32" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">SPFC</text>
    </svg>
  ),
  santos: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 70 50 90 50 90C50 90 15 70 15 50V15Z" fill="#FFFFFF" stroke="#111111" strokeWidth="4"/>
      <path d="M15 15L85 45M15 45L85 15" stroke="#111111" strokeWidth="2"/>
      <path d="M15 15H85V32H15V15Z" fill="#111111"/>
      <text x="50" y="27" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">S.F.C.</text>
    </svg>
  ),
  gremio: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 20C15 20 50 10 85 20V50C85 72 50 90 50 90C50 90 15 72 15 50V20Z" fill="#0D80BF" stroke="#111111" strokeWidth="4"/>
      <path d="M15 35H85M15 50H85M15 65H85" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M15 20H85V30H15V20Z" fill="#111111"/>
      <text x="50" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">GRÊMIO</text>
    </svg>
  ),
  internacional: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="45" fill="#E30613" stroke="#FFFFFF" strokeWidth="4"/>
      <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeWidth="2"/>
      <text x="50" y="56" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">SCI</text>
    </svg>
  ),
  botafogo: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 72 50 92 50 92C50 92 15 72 15 50V15Z" fill="#111111" stroke="#FFFFFF" strokeWidth="4"/>
      <polygon points="50,25 57,40 73,40 60,50 65,65 50,55 35,65 40,50 27,40 43,40" fill="#FFFFFF"/>
    </svg>
  ),
  fluminense: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 72 50 90 50 90C50 90 15 72 15 50V15Z" fill="#8A052B" stroke="#006437" strokeWidth="5"/>
      <path d="M20 20L80 80M80 20L20 80" stroke="#FFFFFF" strokeWidth="3"/>
      <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">FFC</text>
    </svg>
  ),
  vasco: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 72 50 90 50 90C50 90 15 72 15 50V15Z" fill="#111111" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M20 20L80 80" stroke="#FFFFFF" strokeWidth="12"/>
      <path d="M45 40H55V60H45V40ZM35 48H65V52H35V48Z" fill="#C3281E"/>
    </svg>
  ),
  cruzeiro: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="45" fill="#00539F" stroke="#FFFFFF" strokeWidth="4"/>
      <polygon points="50,20 53,27 60,27 55,32 57,39 50,35 43,39 45,32 40,27 47,27" fill="#FFFFFF"/>
      <polygon points="30,45 32,50 37,50 33,53 35,58 30,55 25,58 27,53 23,50 28,50" fill="#FFFFFF"/>
      <polygon points="70,45 72,50 77,50 73,53 75,58 70,55 65,58 67,53 63,50 68,50" fill="#FFFFFF"/>
      <polygon points="50,65 52,70 57,70 53,73 55,78 50,75 45,78 47,73 43,70 48,70" fill="#FFFFFF"/>
    </svg>
  ),
  atleticomg: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 72 50 90 50 90C50 90 15 72 15 50V15Z" fill="#111111" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M30 15V83M50 15V90M70 15V83" stroke="#FFFFFF" strokeWidth="7"/>
      <text x="50" y="40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#111111" backgroundColor="#FFF">CAM</text>
    </svg>
  ),
  bahia: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <circle cx="50" cy="50" r="45" fill="#0055A5" stroke="#FFFFFF" strokeWidth="4"/>
      <rect x="25" y="25" width="50" height="50" fill="#FFFFFF" rx="5"/>
      <path d="M35 35H65V45H35V35ZM35 55H65V65H35V55Z" fill="#E30613"/>
    </svg>
  ),
  sport: (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className || "w-10 h-10"}>
      <path d="M15 15H85V50C85 72 50 90 50 90C50 90 15 72 15 50V15Z" fill="#D3122A" stroke="#FFB800" strokeWidth="4"/>
      <path d="M15 27H85M15 42H85M15 57H85" stroke="#111111" strokeWidth="6"/>
      <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FFB800" fontFamily="sans-serif">SCR</text>
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
