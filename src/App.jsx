import React, { useEffect, useMemo, useState } from "react";
import {
  Tv,
  Calendar,
  Search,
  Trophy,
  RefreshCw,
  AlertCircle,
  Newspaper,
  ExternalLink,
  MapPin,
  Shield,
  ListOrdered,
  Info,
  X,
  Flame,
  Star,
  ChevronRight,
  Clock,
} from "lucide-react";

/*
  ============================================================
  ONDE TEM JOGO?
  Frontend MVP

  Dados reais:
  - O frontend tenta buscar /api/matches
  - Caso a API não esteja disponível, mostra uma mensagem
    de erro em vez de inventar dados.

  IMPORTANTE:
  - Não coloque chaves privadas de APIs neste arquivo.
  - A integração com a API de futebol deve ficar no backend.
  ============================================================
*/

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */

const API_ENDPOINT = "/api/matches";

const BRAZIL_TIMEZONE = "America/Sao_Paulo";

/* ============================================================
   TIMES POPULARES
   ============================================================ */

const POPULAR_TEAMS = [
  {
    id: 8256,
    name: "Seleção Brasileira",
    shortName: "Brasil",
    state: "CBF",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/8256.png",
    stadium: "Maracanã",
  },
  {
    id: 5926,
    name: "Flamengo",
    shortName: "Flamengo",
    state: "RJ",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/5926.png",
    stadium: "Maracanã",
  },
  {
    id: 10283,
    name: "Palmeiras",
    shortName: "Palmeiras",
    state: "SP",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10283.png",
    stadium: "Allianz Parque",
  },
  {
    id: 10277,
    name: "São Paulo",
    shortName: "São Paulo",
    state: "SP",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10277.png",
    stadium: "MorumBIS",
  },
  {
    id: 10272,
    name: "Corinthians",
    shortName: "Corinthians",
    state: "SP",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10272.png",
    stadium: "Neo Química Arena",
  },
  {
    id: 10276,
    name: "Santos",
    shortName: "Santos",
    state: "SP",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10276.png",
    stadium: "Vila Belmiro",
  },
  {
    id: 10274,
    name: "Fluminense",
    shortName: "Fluminense",
    state: "RJ",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10274.png",
    stadium: "Maracanã",
  },
  {
    id: 10278,
    name: "Vasco da Gama",
    shortName: "Vasco",
    state: "RJ",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10278.png",
    stadium: "São Januário",
  },
  {
    id: 8517,
    name: "Botafogo",
    shortName: "Botafogo",
    state: "RJ",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/8517.png",
    stadium: "Nilton Santos",
  },
  {
    id: 10275,
    name: "Grêmio",
    shortName: "Grêmio",
    state: "RS",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10275.png",
    stadium: "Arena do Grêmio",
  },
  {
    id: 8632,
    name: "Internacional",
    shortName: "Inter",
    state: "RS",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/8632.png",
    stadium: "Beira-Rio",
  },
  {
    id: 10273,
    name: "Atlético Mineiro",
    shortName: "Atlético-MG",
    state: "MG",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/10273.png",
    stadium: "Arena MRV",
  },
  {
    id: 9782,
    name: "Cruzeiro",
    shortName: "Cruzeiro",
    state: "MG",
    crest:
      "https://images.fotmob.com/image_resources/logo/teamlogo/9782.png",
    stadium: "Mineirão",
  },
];

/* ============================================================
   NOTÍCIAS
   ============================================================ */

const NEWS_TEAMS = [
  "Futebol Brasileiro",
  "Flamengo",
  "Palmeiras",
  "Corinthians",
  "São Paulo",
  "Santos",
  "Fluminense",
  "Vasco da Gama",
  "Botafogo",
  "Grêmio",
  "Internacional",
  "Atlético Mineiro",
  "Cruzeiro",
];

/* ============================================================
   FUNÇÕES AUXILIARES
   ============================================================ */

function formatBrazilDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatBrazilTime(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getBrazilDateKey(date) {
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BRAZIL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getTodayBrazilKey() {
  return getBrazilDateKey(new Date());
}

function isLive(status) {
  return ["IN_PLAY", "PAUSED", "LIVE"].includes(status);
}

function getMatchStatusLabel(status) {
  if (status === "IN_PLAY" || status === "LIVE") return "AO VIVO";
  if (status === "PAUSED") return "INTERVALO";
  if (status === "FINISHED") return "ENCERRADO";
  if (status === "POSTPONED") return "ADIADO";
  if (status === "CANCELLED") return "CANCELADO";

  return null;
}

/* ============================================================
   APP
   ============================================================ */

export default function App() {
  const [activeTab, setActiveTab] = useState("matches");

  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("todas");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [dateFilter, setDateFilter] = useState("hoje");

  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("onde-tem-jogo-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [selectedNewsTeam, setSelectedNewsTeam] =
    useState("Futebol Brasileiro");

  const [rssNews, setRssNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  /* ==========================================================
     FAVORITOS
     ========================================================== */

  useEffect(() => {
    localStorage.setItem(
      "onde-tem-jogo-favorites",
      JSON.stringify(favoriteTeams)
    );
  }, [favoriteTeams]);

  function toggleFavorite(teamName) {
    setFavoriteTeams((current) => {
      if (current.includes(teamName)) {
        return current.filter((name) => name !== teamName);
      }

      return [...current, teamName];
    });
  }

  /* ==========================================================
     BUSCAR JOGOS
     ========================================================== */

  async function fetchMatches() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      const receivedMatches = Array.isArray(data)
        ? data
        : Array.isArray(data.matches)
        ? data.matches
        : [];

      setMatches(receivedMatches);
    } catch (err) {
      console.error("Erro ao buscar partidas:", err);

      setMatches([]);

      setError(
        "Não foi possível atualizar os jogos agora. Verifique a conexão com a API."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(() => {
      fetchMatches();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* ==========================================================
     NOTÍCIAS
     ========================================================== */

  async function fetchNews(team) {
    setNewsLoading(true);

    try {
      const query = encodeURIComponent(team);

      const rssUrl =
        `https://news.google.com/rss/search?q=${query}` +
        `&hl=pt-BR&gl=BR&ceid=BR:pt-BR`;

      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          rssUrl
        )}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar notícias");
      }

      const data = await response.json();

      setRssNews(Array.isArray(data.items) ? data.items.slice(0, 6) : []);
    } catch (err) {
      console.error("Erro nas notícias:", err);
      setRssNews([]);
    } finally {
      setNewsLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(selectedNewsTeam);
  }, [selectedNewsTeam]);

  /* ==========================================================
     CAMPEONATOS DISPONÍVEIS
     ========================================================== */

  const leagues = useMemo(() => {
    const names = matches
      .map((match) => match.competition?.name)
      .filter(Boolean);

    return ["todas", ...Array.from(new Set(names))];
  }, [matches]);

  /* ==========================================================
     FILTROS
     ========================================================== */

  const filteredMatches = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return matches
      .filter((match) => {
        const home = match.homeTeam?.name || "";
        const away = match.awayTeam?.name || "";
        const league = match.competition?.name || "";

        const searchableText =
          `${home} ${away} ${league} ${match.categoryTag || ""}`.toLowerCase();

        const matchesSearch =
          !search || searchableText.includes(search);

        const matchesLeague =
          selectedLeague === "todas" ||
          league === selectedLeague;

        const matchesTeam =
          !selectedTeam ||
          home.toLowerCase().includes(selectedTeam.toLowerCase()) ||
          away.toLowerCase().includes(selectedTeam.toLowerCase());

        const matchesDate =
          dateFilter === "todos" ||
          getBrazilDateKey(match.utcDate) === getTodayBrazilKey();

        return (
          matchesSearch &&
          matchesLeague &&
          matchesTeam &&
          matchesDate
        );
      })
      .sort(
        (a, b) =>
          new Date(a.utcDate).getTime() -
          new Date(b.utcDate).getTime()
      );
  }, [
    matches,
    searchQuery,
    selectedLeague,
    selectedTeam,
    dateFilter,
  ]);

  /* ==========================================================
     TIMES FAVORITOS
     ========================================================== */

  const favoriteMatches = useMemo(() => {
    if (!favoriteTeams.length) return [];

    return matches.filter((match) => {
      const home = match.homeTeam?.name || "";
      const away = match.awayTeam?.name || "";

      return favoriteTeams.some(
        (team) =>
          home.toLowerCase().includes(team.toLowerCase()) ||
          away.toLowerCase().includes(team.toLowerCase())
      );
    });
  }, [matches, favoriteTeams]);

  /* ==========================================================
     RESET
     ========================================================== */

  function resetFilters() {
    setSelectedTeam(null);
    setSelectedLeague("todas");
    setSearchQuery("");
    setDateFilter("hoje");
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <button
              onClick={() => {
                setActiveTab("matches");
                resetFilters();
              }}
              className="flex items-center gap-3 text-left"
            >
              <div className="bg-emerald-500 p-2.5 rounded-xl text-slate-950">
                <Tv className="w-6 h-6" />
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight">
                  Onde tem Jogo?
                </h1>

                <p className="text-xs text-slate-400">
                  Jogos, horários e onde assistir
                </p>
              </div>
            </button>

            <nav className="flex gap-1 overflow-x-auto">
              <NavButton
                active={activeTab === "matches"}
                onClick={() => setActiveTab("matches")}
                icon={<Calendar className="w-4 h-4" />}
              >
                Jogos
              </NavButton>

              <NavButton
                active={activeTab === "favorites"}
                onClick={() => setActiveTab("favorites")}
                icon={<Star className="w-4 h-4" />}
              >
                Meus times
              </NavButton>

              <NavButton
                active={activeTab === "guide"}
                onClick={() => setActiveTab("guide")}
                icon={<Tv className="w-4 h-4" />}
              >
                Onde assistir
              </NavButton>

              <NavButton
                active={activeTab === "news"}
                onClick={() => setActiveTab("news")}
                icon={<Newspaper className="w-4 h-4" />}
              >
                Notícias
              </NavButton>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* ====================================================
            TIMES POPULARES
            ==================================================== */}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Times populares
            </h2>

            {selectedTeam && (
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-400 hover:underline"
              >
                Limpar filtro
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {POPULAR_TEAMS.map((team) => {
              const isSelected = selectedTeam === team.name;
              const isFavorite = favoriteTeams.includes(team.name);

              return (
                <div
                  key={team.id}
                  className={`
                    relative min-w-[92px]
                    rounded-xl border
                    p-3
                    transition
                    ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    }
                  `}
                >
                  <button
                    onClick={() => {
                      setSelectedTeam(
                        isSelected ? null : team.name
                      );
                      setSearchQuery("");
                      setActiveTab("matches");
                    }}
                    className="w-full"
                  >
                    <div className="h-10 flex items-center justify-center mb-2">
                      <img
                        src={team.crest}
                        alt={team.name}
                        className="max-h-10 max-w-10 object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="text-[11px] font-bold truncate">
                      {team.shortName}
                    </div>

                    <div className="text-[9px] text-slate-500">
                      {team.state}
                    </div>
                  </button>

                  <button
                    onClick={() => toggleFavorite(team.name)}
                    className="absolute top-1.5 right-1.5"
                    title={
                      isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isFavorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            JOGOS
            ==================================================== */}

        {activeTab === "matches" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-black">
                Jogos de futebol hoje
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Veja os horários e onde assistir às partidas.
              </p>
            </div>

            {/* FILTROS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                  <input
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Buscar time ou campeonato..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setDateFilter("hoje")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      dateFilter === "hoje"
                        ? "bg-emerald-500 text-slate-950"
                        : "text-slate-400"
                    }`}
                  >
                    Hoje
                  </button>

                  <button
                    onClick={() => setDateFilter("todos")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      dateFilter === "todos"
                        ? "bg-emerald-500 text-slate-950"
                        : "text-slate-400"
                    }`}
                  >
                    Todos
                  </button>
                </div>
              </div>

              {leagues.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {leagues.map((league) => (
                    <button
                      key={league}
                      onClick={() =>
                        setSelectedLeague(league)
                      }
                      className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-bold ${
                        selectedLeague === league
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-950 border border-slate-800 text-slate-400"
                      }`}
                    >
                      {league === "todas"
                        ? "Todos"
                        : league}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ERRO */}

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />

                  <div className="flex-1">
                    <p className="font-bold text-red-300">
                      Não foi possível atualizar os jogos
                    </p>

                    <p className="text-xs text-red-200/70 mt-1">
                      {error}
                    </p>
                  </div>

                  <button
                    onClick={fetchMatches}
                    className="text-xs font-bold text-red-300 hover:underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-48 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* RESULTADOS */}

            {!loading && !error && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-300">
                    {filteredMatches.length}{" "}
                    {filteredMatches.length === 1
                      ? "partida"
                      : "partidas"}
                  </h3>

                  <button
                    onClick={fetchMatches}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Atualizar
                  </button>
                </div>

                {filteredMatches.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid gap-4">
                    {filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ====================================================
            MEUS TIMES
            ==================================================== */}

        {activeTab === "favorites" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-black">
                Meus times
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Jogos dos clubes que você marcou como favoritos.
              </p>
            </div>

            {favoriteTeams.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
                <Star className="w-8 h-8 mx-auto text-slate-600 mb-3" />

                <h3 className="font-bold">
                  Você ainda não escolheu nenhum time.
                </h3>

                <p className="text-xs text-slate-500 mt-2">
                  Clique na estrela dos times que deseja acompanhar.
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  {favoriteTeams.map((team) => (
                    <button
                      key={team}
                      onClick={() => {
                        setSelectedTeam(team);
                        setActiveTab("matches");
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      ⭐ {team}
                    </button>
                  ))}
                </div>

                {favoriteMatches.length === 0 ? (
                  <EmptyState text="Nenhum jogo encontrado para seus times favoritos." />
                ) : (
                  <div className="space-y-4">
                    {favoriteMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ====================================================
            ONDE ASSISTIR
            ==================================================== */}

        {activeTab === "guide" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-black">
                Onde assistir aos jogos
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                A informação de transmissão deve estar vinculada
                a cada partida.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <GuideCard
                name="TV Globo"
                type="TV aberta"
                description="Partidas selecionadas."
              />

              <GuideCard
                name="SporTV"
                type="TV por assinatura"
                description="Diversas competições nacionais."
              />

              <GuideCard
                name="Premiere"
                type="Pay-per-view"
                description="Jogos disponíveis conforme os direitos de transmissão."
              />

              <GuideCard
                name="CazéTV"
                type="Streaming"
                description="Partidas disponíveis conforme os direitos vigentes."
              />
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/80">
              <Info className="w-4 h-4 inline mr-2" />
              Os direitos de transmissão podem mudar. A versão
              definitiva do site deverá obter essa informação por
              fonte atualizada para cada partida.
            </div>
          </section>
        )}

        {/* ====================================================
            NOTÍCIAS
            ==================================================== */}

        {activeTab === "news" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-black">
                Últimas notícias
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Notícias relacionadas ao futebol brasileiro.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {NEWS_TEAMS.map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedNewsTeam(team)}
                  className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-bold ${
                    selectedNewsTeam === team
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-slate-400"
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>

            {newsLoading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-44 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : rssNews.length === 0 ? (
              <EmptyState text="Nenhuma notícia encontrada." />
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {rssNews.map((item, index) => (
                  <a
                    key={`${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-emerald-500/50 transition"
                  >
                    <div className="flex justify-between gap-3 text-[10px] text-slate-500">
                      <span>{selectedNewsTeam}</span>

                      <span>
                        {item.pubDate
                          ? formatBrazilDate(item.pubDate)
                          : ""}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold leading-snug group-hover:text-emerald-400">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-5 text-xs text-emerald-400 font-bold">
                      Ler notícia
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER */}

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-slate-600">
        <p>
          Onde tem Jogo? — Guia de jogos, horários e transmissões.
        </p>

        <p className="mt-2">
          As informações de transmissão devem ser confirmadas
          junto às plataformas responsáveis.
        </p>
      </footer>
    </div>
  );
}

/* ============================================================
   COMPONENTES
   ============================================================ */

function NavButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5
        whitespace-nowrap
        px-3 py-2
        rounded-lg
        text-xs font-bold
        transition
        ${
          active
            ? "bg-emerald-500 text-slate-950"
            : "text-slate-400 hover:text-white hover:bg-slate-900"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}

/* ============================================================
   CARD DE PARTIDA
   ============================================================ */

function MatchCard({ match }) {
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};

  const live = isLive(match.status);

  const statusLabel = getMatchStatusLabel(match.status);

  const homeScore =
    match.score?.fullTime?.home ??
    match.score?.home ??
    null;

  const awayScore =
    match.score?.fullTime?.away ??
    match.score?.away ??
    null;

  const broadcasts = Array.isArray(match.broadcasts)
    ? match.broadcasts
    : match.broadcaster
    ? [{ name: match.broadcaster }]
    : [];

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition">
      {/* TOPO */}

      <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            {match.competition?.name || "Futebol"}
          </span>

          {match.matchday && (
            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">
              {match.matchday}ª rodada
            </span>
          )}

          {match.categoryTag && (
            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">
              {match.categoryTag}
            </span>
          )}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          {formatBrazilDate(match.utcDate)}
        </div>
      </div>

      {/* TIMES */}

      <div className="p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <TeamSide
            team={home}
            align="right"
            score={homeScore}
          />

          <div className="text-center min-w-[70px]">
            {live ? (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {statusLabel || "AO VIVO"}
                </span>

                {homeScore !== null &&
                  awayScore !== null && (
                    <div className="text-2xl font-black">
                      {homeScore} - {awayScore}
                    </div>
                  )}
              </div>
            ) : match.status === "FINISHED" ? (
              <div>
                <div className="text-[10px] text-slate-500 mb-1">
                  ENCERRADO
                </div>

                <div className="text-2xl font-black">
                  {homeScore ?? "-"} - {awayScore ?? "-"}
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-black">
                  {formatBrazilTime(match.utcDate)}
                </div>

                <div className="text-[10px] text-slate-500 mt-1">
                  Horário de Brasília
                </div>
              </>
            )}
          </div>

          <TeamSide
            team={away}
            align="left"
            score={awayScore}
          />
        </div>
      </div>

      {/* INFORMAÇÕES */}

      <div className="border-t border-slate-800 px-4 py-3 grid md:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />

          <span>
            {match.venue || "Estádio não informado"}
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs">
          <Tv className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

          <div>
            <span className="text-slate-500 block mb-1">
              Onde assistir
            </span>

            {broadcasts.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {broadcasts.map((broadcast, index) => (
                  <span
                    key={index}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md font-bold"
                  >
                    {broadcast.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500">
                Informação não disponível
              </span>
            )}
          </div>
        </div>
      </div>

      {/* LINK PARA PÁGINA DA PARTIDA */}

      <div className="border-t border-slate-800">
        <button className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-emerald-400 transition">
          Ver detalhes da partida
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   TIME
   ============================================================ */

function TeamSide({ team, align, score }) {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-center gap-3 ${
        isRight ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      <div className={isRight ? "order-1" : "order-2"}>
        <div className="font-bold text-sm md:text-base">
          {team.shortName || team.name || "Time"}
        </div>

        {team.name && team.shortName !== team.name && (
          <div className="text-[10px] text-slate-500">
            {team.name}
          </div>
        )}
      </div>

      <div
        className={`w-12 h-12 flex items-center justify-center ${
          isRight ? "order-2" : "order-1"
        }`}
      >
        {team.crest ? (
          <img
            src={team.crest}
            alt={team.name || "Escudo"}
            className="max-w-12 max-h-12 object-contain"
            loading="lazy"
          />
        ) : (
          <Shield className="w-8 h-8 text-slate-700" />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   GUIA
   ============================================================ */

function GuideCard({ name, type, description }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-emerald-400">
            {name}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {type}
          </p>
        </div>

        <Tv className="w-5 h-5 text-slate-600" />
      </div>

      <p className="text-sm text-slate-400 mt-4">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   ESTADO VAZIO
   ============================================================ */

function EmptyState({
  text = "Nenhuma partida encontrada para os filtros selecionados.",
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
      <Calendar className="w-8 h-8 mx-auto text-slate-700 mb-3" />

      <p className="text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}
