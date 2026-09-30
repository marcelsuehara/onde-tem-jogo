import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Clock3,
  Trophy,
  CalendarDays,
  Newspaper,
  ChevronRight,
  MapPin,
  Tv,
  Users,
  BarChart3,
  X,
  Loader2,
  AlertCircle,
  Globe2,
  Radio,
  Star,
} from "lucide-react";

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = import.meta.env.VITE_API_URL || "";

const ENDPOINTS = {
  news: `${API_BASE}/api/news`,
  matches: `${API_BASE}/api/matches`,
  competitions: `${API_BASE}/api/competitions`,
  teams: `${API_BASE}/api/teams`,
  standings: `${API_BASE}/api/standings`,
  scorers: `${API_BASE}/api/scorers`,
};

/* =========================================================
   CONSTANTES
========================================================= */

const BRAZIL_TIMEZONE = "America/Sao_Paulo";

const CATEGORY_LIST = [
  "Todos",
  "Brasil",
  "Inglaterra",
  "Espanha",
  "Itália",
  "França",
  "Portugal",
  "Alemanha",
  "Holanda",
  "Bélgica",
  "Argentina",
  "Estados Unidos",
  "Seleções",
  "Feminino",
  "Base",
  "Copas",
];

/* =========================================================
   FUNÇÕES
========================================================= */

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  const diff =
    Date.now() - date.getTime();

  const minutes =
    Math.floor(diff / 60000);

  if (minutes < 1) return "agora";

  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `há ${hours} h`;
  }

  const days =
    Math.floor(hours / 24);

  return `há ${days} d`;
}

function getLogo(item) {
  if (!item) return "";

  return (
    item.logo ||
    item.crest ||
    item.badge ||
    item.image ||
    item.emblem ||
    ""
  );
}

function getName(item) {
  if (!item) return "";

  return (
    item.name ||
    item.title ||
    item.shortName ||
    ""
  );
}

/* =========================================================
   COMPONENTE DE ESCUDO
========================================================= */

function Badge({
  item,
  size = "w-10 h-10",
}) {
  const [error, setError] = useState(false);

  const logo = getLogo(item);
  const name = getName(item);

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "?";

  if (!logo || error) {
    return (
      <div
        className={`${size} rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className={`${size} object-contain shrink-0`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

/* =========================================================
   COMPONENTE: NOTÍCIA
========================================================= */

function NewsCard({
  article,
  featured = false,
}) {
  return (
    <article
      className={`bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {article.image && (
        <div
          className={
            featured
              ? "h-64 overflow-hidden"
              : "h-44 overflow-hidden"
          }
        >
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {article.competition && (
            <span className="text-xs font-bold text-red-600">
              {article.competition.name}
            </span>
          )}

          {article.category && (
            <>
              <span className="text-slate-300">
                •
              </span>

              <span className="text-xs text-slate-400">
                {article.category}
              </span>
            </>
          )}
        </div>

        <h3
          className={`font-black leading-tight ${
            featured
              ? "text-2xl"
              : "text-lg"
          }`}
        >
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-sm text-slate-500 mt-3 line-clamp-3">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="w-3.5 h-3.5" />

            {formatRelativeDate(
              article.publishedAt
            )}

            {article.source && (
              <>
                <span>•</span>
                <span>{article.source}</span>
              </>
            )}
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COMPONENTE: JOGO
========================================================= */

function MatchCard({ match }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-bold text-slate-500 truncate">
          {match.competition?.name ||
            "Competição"}
        </span>

        <span className="text-xs font-bold text-slate-700">
          {formatTime(match.date)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center text-center gap-2">
          <Badge
            item={match.homeTeam}
            size="w-12 h-12"
          />

          <span className="text-sm font-bold">
            {match.homeTeam?.name}
          </span>
        </div>

        <div className="font-black text-slate-300">
          x
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <Badge
            item={match.awayTeam}
            size="w-12 h-12"
          />

          <span className="text-sm font-bold">
            {match.awayTeam?.name}
          </span>
        </div>
      </div>

      {match.venue?.name && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5" />

          {match.venue.name}

          {match.venue.city &&
            ` · ${match.venue.city}`}
        </div>
      )}

      {match.broadcasters?.length > 0 && (
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
          <Tv className="w-3.5 h-3.5" />

          <span>
            {match.broadcasters
              .map((x) => x.name)
              .join(" · ")}
          </span>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   COMPONENTE: COMPETIÇÃO
========================================================= */

function CompetitionCard({
  competition,
}) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition">
      <div className="flex items-center gap-3">
        <Badge
          item={competition}
          size="w-12 h-12"
        />

        <div className="min-w-0">
          <h3 className="font-bold truncate">
            {competition.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {competition.country ||
              "Internacional"}
          </p>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [news, setNews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [competitions, setCompetitions] =
    useState([]);

  const [activeCategory, setActiveCategory] =
    useState("Todos");

  const [search, setSearch] = useState("");

  const [activeSection, setActiveSection] =
    useState("home");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastUpdate, setLastUpdate] =
    useState(null);

  /* =======================================================
     CARREGAR DADOS
  ======================================================= */

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return response.json();
  }

  async function loadEverything(
    isRefresh = false
  ) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        newsData,
        matchesData,
        competitionsData,
      ] = await Promise.all([
        fetchJson(ENDPOINTS.news),
        fetchJson(ENDPOINTS.matches),
        fetchJson(
          ENDPOINTS.competitions
        ),
      ]);

      const newsArray =
        Array.isArray(newsData)
          ? newsData
          : newsData.news ||
            newsData.articles ||
            newsData.data ||
            [];

      const matchesArray =
        Array.isArray(matchesData)
          ? matchesData
          : matchesData.matches ||
            matchesData.data ||
            [];

      const competitionsArray =
        Array.isArray(competitionsData)
          ? competitionsData
          : competitionsData.competitions ||
            competitionsData.data ||
            [];

      setNews(newsArray);
      setMatches(matchesArray);
      setCompetitions(
        competitionsArray
      );

      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);

      setError(
        "Não foi possível atualizar os dados."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEverything();

    /*
      Atualização automática a cada 60 minutos.
    */
    const interval = setInterval(
      () => {
        loadEverything(true);
      },
      60 * 60 * 1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     FILTRO DE NOTÍCIAS
  ======================================================= */

  const filteredNews = useMemo(() => {
    let result = [...news];

    if (activeCategory !== "Todos") {
      result = result.filter(
        (article) => {
          const text = normalizeText(
            `${article.category || ""} ${
              article.country || ""
            } ${
              article.competition?.name ||
              ""
            } ${article.title || ""}`
          );

          return text.includes(
            normalizeText(
              activeCategory
            )
          );
        }
      );
    }

    if (search.trim()) {
      const query =
        normalizeText(search);

      result = result.filter(
        (article) => {
          const text =
            `${article.title || ""} ${
              article.summary || ""
            } ${
              article.team?.name || ""
            } ${
              article.competition?.name ||
              ""
            }`;

          return normalizeText(
            text
          ).includes(query);
        }
      );
    }

    result.sort(
      (a, b) =>
        new Date(
          b.publishedAt
        ) -
        new Date(
          a.publishedAt
        )
    );

    return result;
  }, [
    news,
    activeCategory,
    search,
  ]);

  const featuredNews =
    filteredNews[0];

  const secondaryNews =
    filteredNews.slice(1);

  /* =======================================================
     JOGOS
  ======================================================= */

  const todayMatches =
    useMemo(() => {
      const today =
        new Date()
          .toLocaleDateString(
            "en-CA",
            {
              timeZone:
                BRAZIL_TIMEZONE,
            }
          );

      return matches
        .filter((match) => {
          if (!match.date)
            return false;

          const date =
            new Date(match.date)
              .toLocaleDateString(
                "en-CA",
                {
                  timeZone:
                    BRAZIL_TIMEZONE,
                }
              );

          return date === today;
        })
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );
    }, [matches]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() =>
                setActiveSection("home")
              }
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>

              <div className="hidden sm:block text-left">
                <div className="font-black text-lg leading-none">
                  Onde Tem Jogo?
                </div>

                <div className="text-[10px] text-slate-400 mt-1">
                  Futebol sem perder nenhuma notícia
                </div>
              </div>
            </button>

            {/* Busca */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Buscar time, jogador ou campeonato..."
                className="w-full h-10 pl-10 pr-10 rounded-full bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 outline-none text-sm"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Atualizar */}
            <button
              onClick={() =>
                loadEverything(true)
              }
              disabled={refreshing}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
              title="Atualizar"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Categorias */}
          <div className="flex gap-1 overflow-x-auto">
            {CATEGORY_LIST.map(
              (category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${
                    activeCategory ===
                    category
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Erro */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>
              <div className="font-bold text-sm text-red-800">
                Erro ao atualizar
              </div>

              <p className="text-xs text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            HERO
        ================================================= */}

        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-600 text-sm font-black mb-2">
                <Radio className="w-4 h-4" />
                FUTEBOL AGORA
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                As principais notícias
                do futebol
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl">
                Notícias, jogos, resultados,
                classificação e artilharia dos
                principais campeonatos do mundo.
              </p>
            </div>

            {lastUpdate && (
              <div className="text-xs text-slate-400">
                Atualizado em{" "}
                {formatDateTime(
                  lastUpdate
                )}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            NOTÍCIAS
        ================================================= */}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-red-600" />

              <h2 className="text-xl font-black">
                Últimas notícias
              </h2>
            </div>

            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : filteredNews.length ===
            0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
              <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <h3 className="font-bold">
                Nenhuma notícia encontrada
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {featuredNews && (
                <NewsCard
                  article={
                    featuredNews
                  }
                  featured
                />
              )}

              {secondaryNews
                .slice(0, 4)
                .map((article) => (
                  <NewsCard
                    key={
                      article.id ||
                      article.url
                    }
                    article={
                      article
                    }
                  />
                ))}
            </div>
          )}
        </section>

        {/* =================================================
            JOGOS DE HOJE
        ================================================= */}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-600" />

              <h2 className="text-xl font-black">
                Jogos de hoje
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {todayMatches.length} jogos
            </span>
          </div>

          {todayMatches.length ===
          0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center">
              <CalendarDays className="w-9 h-9 text-slate-300 mx-auto mb-3" />

              <p className="text-sm text-slate-400">
                Nenhum jogo encontrado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {todayMatches
                .slice(0, 6)
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                  />
                ))}
            </div>
          )}
        </section>

        {/* =================================================
            COMPETIÇÕES
        ================================================= */}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-600" />

              <h2 className="text-xl font-black">
                Principais competições
              </h2>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {competitions
              .slice(0, 12)
              .map(
                (competition) => (
                  <CompetitionCard
                    key={
                      competition.id ||
                      competition.name
                    }
                    competition={
                      competition
                    }
                  />
                )
              )}
          </div>
        </section>

        {/* =================================================
            ATALHOS
        ================================================= */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 transition">
            <BarChart3 className="w-6 h-6 text-red-600 mb-4" />

            <h3 className="font-black">
              Classificação
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Veja a tabela atualizada dos
              principais campeonatos.
            </p>
          </button>

          <button className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 transition">
            <Users className="w-6 h-6 text-red-600 mb-4" />

            <h3 className="font-black">
              Artilharia
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Confira quem está marcando mais
              gols.
            </p>
          </button>

          <button className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 transition">
            <Globe2 className="w-6 h-6 text-red-600 mb-4" />

            <h3 className="font-black">
              Futebol mundial
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Brasil, Europa, América do Sul e
              principais competições internacionais.
            </p>
          </button>
        </section>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="mt-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <div className="font-black">
                Onde Tem Jogo?
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Notícias e informações sobre
                futebol.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Conteúdo atualizado automaticamente.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
