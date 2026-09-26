import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Calendar, 
  Search, 
  Filter, 
  ExternalLink, 
  Newspaper, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

// Dados de simulação de jogos com canais oficiais de transmissão do Brasil
const MOCK_JOGOS = [
  {
    id: 1,
    campeonato: 'Brasileirão Série A',
    mandante: 'Flamengo',
    visitante: 'Palmeiras',
    escudoMandante: '🔴🖤',
    escudoVisitante: '🟢⚪',
    horario: '16:00',
    data: 'Hoje',
    aoVivo: true,
    placar: '1 - 0 (32 min)',
    canais: ['Globo', 'Premiere'],
    destaque: true,
    estadio: 'Maracanã, Rio de Janeiro',
    rodada: 'Rodada 24'
  },
  {
    id: 2,
    campeonato: 'Brasileirão Série A',
    mandante: 'Corinthians',
    visitante: 'São Paulo',
    escudoMandante: '⚪⚫',
    escudoVisitante: '🔴⚪⚫',
    horario: '18:30',
    data: 'Hoje',
    aoVivo: false,
    canais: ['CazéTV', 'Premiere'],
    destaque: true,
    estadio: 'Neo Química Arena, São Paulo',
    rodada: 'Rodada 24'
  },
  {
    id: 3,
    campeonato: 'Copa Libertadores',
    mandante: 'River Plate',
    visitante: 'Fluminense',
    escudoMandante: '⚪🔴⚪',
    escudoVisitante: '🟢🔴⚪',
    horario: '21:30',
    data: 'Hoje',
    aoVivo: false,
    canais: ['ESPN', 'Disney+'],
    destaque: false,
    estadio: 'Mônumental de Nuñez, Buenos Aires',
    rodada: 'Quartas de Final'
  },
  {
    id: 4,
    campeonato: 'Brasileirão Série A',
    mandante: 'Grêmio',
    visitante: 'Internacional',
    escudoMandante: '🔵⚪⚫',
    escudoVisitante: '🔴⚪',
    horario: '16:00',
    data: 'Amanhã',
    aoVivo: false,
    canais: ['Globo', 'SporTV', 'Premiere'],
    destaque: true,
    estadio: 'Arena do Grêmio, Porto Alegre',
    rodada: 'Rodada 24'
  },
  {
    id: 5,
    campeonato: 'UEFA Champions League',
    mandante: 'Real Madrid',
    visitante: 'Manchester City',
    escudoMandante: '⚪👑',
    escudoVisitante: '🩵⚪',
    horario: '17:00',
    data: 'Amanhã',
    aoVivo: false,
    canais: ['TNT Sports', 'Max'],
    destaque: true,
    estadio: 'Santiago Bernabéu, Madrid',
    rodada: 'Fase de Liga'
  },
  {
    id: 6,
    campeonato: 'Copa do Brasil',
    mandante: 'Bahia',
    visitante: 'Atlético-MG',
    escudoMandante: '🔵🔴⚪',
    escudoVisitante: '⚪⚫',
    horario: '20:00',
    data: 'Fim de Semana',
    aoVivo: false,
    canais: ['Prime Video'],
    destaque: false,
    estadio: 'Arena Fonte Nova, Salvador',
    rodada: 'Semifinal'
  },
  {
    id: 7,
    campeonato: 'Brasileirão Série B',
    mandante: 'Santos',
    visitante: 'Sport',
    escudoMandante: '⚪🖤',
    escudoVisitante: '🔴⚫',
    horario: '16:00',
    data: 'Fim de Semana',
    aoVivo: false,
    canais: ['Band', 'Premiere', 'GOAT'],
    destaque: false,
    estadio: 'Vila Belmiro, Santos',
    rodada: 'Rodada 28'
  }
];

// Notícias simuladas dos times agregadas via IA
const MOCK_NOTICIAS = [
  {
    id: 101,
    time: 'Flamengo',
    titulo: 'Flamengo confirma escalação principal para o clássico de hoje',
    fonte: 'GE (Globo Esporte)',
    tempo: 'Há 25 minutos',
    resumo: 'A comissão técnica confirmou o retorno dos titulares que estavam no departamento médico. A expectativa é de casa cheia no Maracanã com mais de 55 mil ingressos vendidos.',
    link: 'https://ge.globo.com'
  },
  {
    id: 102,
    time: 'Corinthians',
    titulo: 'Majestoso na Arena: Tite testa nova formação tática no meio-campo',
    fonte: 'UOL Esporte',
    tempo: 'Há 1 hora',
    resumo: 'O treinador promoveu ajustes defensivos e apostará na velocidade das pontas para tentar furar o bloqueio tricolor na partida desta noite.',
    link: 'https://uol.com.br/esporte'
  },
  {
    id: 103,
    time: 'Palmeiras',
    titulo: 'Abel Ferreira prepara estratégia especial para jogo fora de casa',
    fonte: 'ESPN Brasil',
    tempo: 'Há 2 horas',
    resumo: 'Com foco na liderança, o verdão encerrou a preparação na academia de futebol antes de viajar. Jogadores demonstraram confiança em coletiva.',
    link: 'https://espn.com.br'
  }
];

const CANAIS_DISPONIVEIS = ['Todos', 'Globo', 'SporTV', 'ESPN', 'CazéTV', 'Premiere', 'Prime Video', 'Disney+', 'Max'];

export default function App() {
  const [filtroData, setFiltroData] = useState('Hoje');
  const [canalSelecionado, setCanalSelecionado] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [noticiaExpandida, setNoticiaExpandida] = useState(null);
  const [somenteAoVivo, setSomenteAoVivo] = useState(false);

  const jogosFiltrados = useMemo(() => {
    return MOCK_JOGOS.filter((jogo) => {
      // Filtro por Data
      const bateData = jogo.data === filtroData;
      
      // Filtro por Ao Vivo
      const bateAoVivo = somenteAoVivo ? jogo.aoVivo : true;

      // Filtro por Canal
      const bateCanal =
        canalSelecionado === 'Todos' || jogo.canais.includes(canalSelecionado);

      // Filtro por Busca (Time ou Campeonato)
      const termo = busca.toLowerCase().trim();
      const bateBusca =
        !termo ||
        jogo.mandante.toLowerCase().includes(termo) ||
        jogo.visitante.toLowerCase().includes(termo) ||
        jogo.campeonato.toLowerCase().includes(termo);

      return bateData && bateAoVivo && bateCanal && bateBusca;
    });
  }, [filtroData, canalSelecionado, busca, somenteAoVivo]);

  const alternarNoticia = (id) => {
    setNoticiaExpandida(noticiaExpandida === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* HEADER FIXO DE ALTO IMPACTO VISUAL */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 shadow-xl">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 text-emerald-400 shadow-inner">
              <Tv className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Onde tem <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]">Jogo?</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Guia Definitivo de Transmissão
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Ao Vivo & Hoje
            </span>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (MOBILE FIRST MAX-W-XL) */}
      <main className="max-w-xl mx-auto px-4 py-5 space-y-6">

        {/* 1. SELETOR DE DATAS */}
        <section className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-md flex gap-1">
          {['Hoje', 'Amanhã', 'Fim de Semana'].map((dia) => {
            const ativo = filtroData === dia;
            return (
              <button
                key={dia}
                onClick={() => setFiltroData(dia)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  ativo
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${ativo ? 'text-white' : 'text-slate-400'}`} />
                {dia}
              </button>
            );
          })}
        </section>

        {/* 2. CAMPO DE BUSCA E FILTROS RÁPIDOS */}
        <section className="space-y-3">
          {/* Input de Busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por time ou campeonato (ex: Flamengo, Libertadores)..."
              className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-md"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Carrossel de Canais */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <div className="flex items-center gap-1 text-slate-400 text-xs pl-1 font-semibold whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> Canal:
            </div>
            {CANAIS_DISPONIVEIS.map((canal) => {
              const selecionado = canalSelecionado === canal;
              return (
                <button
                  key={canal}
                  onClick={() => setCanalSelecionado(canal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                    selecionado
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {canal}
                </button>
              );
            })}
          </div>

          {/* Alternador Ao Vivo Apenas */}
          <div className="flex items-center justify-between px-1 pt-1 text-xs">
            <button
              onClick={() => setSomenteAoVivo(!somenteAoVivo)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all ${
                somenteAoVivo
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${somenteAoVivo ? 'text-red-400 animate-bounce' : ''}`} />
              Apenas jogos Acontecendo Agora
            </button>

            <span className="text-slate-500 font-mono text-[11px]">
              {jogosFiltrados.length} {jogosFiltrados.length === 1 ? 'jogo' : 'jogos'}
            </span>
          </div>
        </section>

        {/* 3. LISTAGEM DE JOGOS */}
        <section className="space-y-4">
          {jogosFiltrados.length > 0 ? (
            jogosFiltrados.map((jogo) => (
              <div
                key={jogo.id}
                className={`group relative bg-slate-900/90 rounded-2xl p-4 border transition-all duration-200 hover:border-slate-700 shadow-lg ${
                  jogo.destaque
                    ? 'border-emerald-500/40 shadow-emerald-950/20'
                    : 'border-slate-800/80'
                }`}
              >
                {/* Destaque Tag */}
                {jogo.destaque && (
                  <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-slate-950" /> Jogo da Rodada
                  </div>
                )}

                {/* Nome do Campeonato & Rodada */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-emerald-400 tracking-wide uppercase flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    {jogo.campeonato}
                  </span>
                  <span className="text-slate-400 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded">
                    {jogo.rodada}
                  </span>
                </div>

                {/* Confronto dos Times */}
                <div className="flex items-center justify-between my-3 py-2 bg-slate-950/50 rounded-xl px-3 border border-slate-800/40">
                  {/* Mandante */}
                  <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row items-center gap-2">
                    <span className="text-2xl" role="img" aria-label="Escudo">
                      {jogo.escudoMandante}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-100">
                      {jogo.mandante}
                    </span>
                  </div>

                  {/* Placar ou Horário Central */}
                  <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700/80 text-center mx-2 flex-shrink-0">
                    {jogo.aoVivo ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-red-400 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> AO VIVO
                        </span>
                        <span className="font-mono font-black text-sm text-emerald-400">
                          {jogo.placar}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-black text-base text-emerald-400">
                          {jogo.horario}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Horário de Brasília</span>
                      </div>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="flex-1 text-center sm:text-right flex flex-col sm:flex-row-reverse items-center gap-2">
                    <span className="text-2xl" role="img" aria-label="Escudo">
                      {jogo.escudoVisitante}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-100">
                      {jogo.visitante}
                    </span>
                  </div>
                </div>

                {/* Estádio */}
                <div className="text-[11px] text-slate-400 text-center mb-3">
                  📍 {jogo.estadio}
                </div>

                {/* Onde Assistir (Transmissão) */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-emerald-400" />
                    Onde assistir ao vivo:
                  </span>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {jogo.canais.map((canal) => (
                      <span
                        key={canal}
                        className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-md border border-slate-700/80 shadow-sm transition-colors"
                      >
                        {canal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Estado Sem Resultados */
            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-200">Nenhum jogo encontrado</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Não encontramos partidas para a data ou canal selecionado com o termo "{busca}".
              </p>
              <button
                onClick={() => {
                  setBusca('');
                  setCanalSelecionado('Todos');
                  setSomenteAoVivo(false);
                }}
                className="text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-xl transition-all border border-emerald-500/30"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </section>

        {/* 4. AGREGADOR DE NOTÍCIAS AUTOMÁTICO */}
        <section className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
                  Últimas dos Times
                  <span className="text-[10px] font-normal bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    IA Agregador
                  </span>
                </h2>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" /> Atualizado há 10m
            </span>
          </div>

          <div className="space-y-2.5">
            {MOCK_NOTICIAS.map((noticia) => {
              const expandida = noticiaExpandida === noticia.id;
              return (
                <div
                  key={noticia.id}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {noticia.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {noticia.tempo} • {noticia.fonte}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-200 leading-snug">
                    {noticia.titulo}
                  </h3>

                  {expandida && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                      <p>{noticia.resumo}</p>
                      <a
                        href={noticia.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                      >
                        Ler matéria completa na fonte <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => alternarNoticia(noticia.id)}
                    className="mt-2 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
                  >
                    {expandida ? (
                      <>
                        Recolher resumo <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Ver resumo automático da matéria <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* RODAPÉ E INFORMAÇÕES DE DIREITOS */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 mt-10 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">Onde tem Jogo? © 2026</p>
        <p>Agregador de transmissões esportivas e guia de programação no Brasil.</p>
      </footer>
    </div>
  );
}
