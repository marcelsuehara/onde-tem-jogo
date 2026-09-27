import React, { useState } from 'react';
import { Tv, Calendar, Search, Newspaper, Trophy, Sparkles, Filter, X } from 'lucide-react';

// Escudos Oficiais em SVG (Alta Qualidade) via CDN
const TEAMS_DATA = [
  { id: 'flamengo', name: 'Flamengo', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/flamengo.svg' },
  { id: 'palmeiras', name: 'Palmeiras', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/palmeiras.svg' },
  { id: 'corinthians', name: 'Corinthians', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/corinthians.svg' },
  { id: 'saopaulo', name: 'São Paulo', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/sao-paulo.svg' },
  { id: 'santos', name: 'Santos', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/santos.svg' },
  { id: 'gremio', name: 'Grêmio', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/gremio.svg' },
  { id: 'internacional', name: 'Internacional', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/internacional.svg' },
  { id: 'botafogo', name: 'Botafogo', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/botafogo.svg' },
  { id: 'fluminense', name: 'Fluminense', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/fluminense.svg' },
  { id: 'vasco', name: 'Vasco', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/vasco.svg' },
  { id: 'cruzeiro', name: 'Cruzeiro', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/cruzeiro.svg' },
  { id: 'atleticomg', name: 'Atlético-MG', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/atletico-mg.svg' },
  { id: 'bahia', name: 'Bahia', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/bahia.svg' },
  { id: 'sport', name: 'Sport', logo: 'https://raw.githubusercontent.com/muralha-fc/escudos-futebol-brasileiro/main/sport.svg' },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('todos');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const matches = [
    {
      id: 1,
      homeTeam: TEAMS_DATA.find(t => t.id === 'flamengo'),
      awayTeam: TEAMS_DATA.find(t => t.id === 'palmeiras'),
      time: 'AO VIVO - 32 min',
      isLive: true,
      channels: ['Globo', 'Premiere'],
      league: 'Brasileirão Série A',
      stadium: 'Maracanã, Rio de Janeiro',
    },
    {
      id: 2,
      homeTeam: TEAMS_DATA.find(t => t.id === 'corinthians'),
      awayTeam: TEAMS_DATA.find(t => t.id === 'saopaulo'),
      time: '18:30',
      isLive: false,
      channels: ['CazéTV', 'Premiere'],
      league: 'Brasileirão Série A',
      stadium: 'Neo Química Arena, São Paulo',
    },
    {
      id: 3,
      homeTeam: TEAMS_DATA.find(t => t.id === 'santos'),
      awayTeam: TEAMS_DATA.find(t => t.id === 'sport'),
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
            {TEAMS_DATA.map(team => {
              const isSelected = selectedTeam?.id === team.id;
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
                  <div className="w-10 h-10 flex items-center justify-center mb-1">
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-full h-full object-contain filter drop-shadow" 
                    />
                  </div>
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
              <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-8 h-8 object-contain" />
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
            filteredMatches.map(match => (
              <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {match.league}
                  </span>
                  <span>{match.stadium}</span>
                </div>

                <div className="grid grid-cols-3 items-center text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
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
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
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
            ))
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
