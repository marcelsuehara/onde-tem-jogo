import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  PlayCircle,
  Radio,
  Search,
  Trophy,
  Tv,
  Users,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const API_BASE = import.meta.env.VITE_API_URL || "";

const MATCHES_ENDPOINT = `${API_BASE}/api/matches`;
const TEAMS_ENDPOINT = `${API_BASE}/api/teams`;
const NEWS_ENDPOINT = `${API_BASE}/api/news`;

const BRAZIL_TIMEZONE = "America/Sao_Paulo";

const REFRESH_INTERVAL = 5 * 60 * 1000;

/* =========================================================
   FUNÇÕES DE DATA
========================================================= */

function getBrazilDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BRAZIL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(dateString) {
  if (!dateString) return "--:--";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "--:--";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRAZIL_TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  })
    .format(date)
    .replace(".", "");
}

function getDateKey(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return getBrazilDateString(date);
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  date.setDate(date.getDate() + days);

  return getBrazilDateString(date);
}

/* =========================================================
   TEXTO / NORMALIZAÇÃO
========================================================= */

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function firstValid(...values) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
}

/* =========================================================
   ESCUDOS
========================================================= */

function getTeamLogo(team) {
  if (!team) return "";

  return firstValid(
    team.logo,
    team.crest,
    team.badge,
    team.image,
    team.emblem,
    team.logoUrl
  );
}

function getTeamName(team) {
  if (!team) return "Time";

  return firstValid(
    team.name,
    team.shortName,
    team.short_name,
    team.teamName,
    "Time"
  );
}

function getTeamId(team) {
  if (!team) return null;

  return firstValid(
    team.id,
    team.teamId,
    team.team_id
  );
}

/* =========================================================
   TRANSMISSÕES
========================================================= */

function normalizeBroadcasters(match) {
  const result = [];

  const addBroadcaster = (item) => {
    if (!item) return;

    if (typeof item === "string") {
      const name = item.trim();

      if (name && !result.some((x) => normalizeText(x.name) === normalizeText(name))) {
        result.push({
          name,
          type: "tv",
          url: null,
        });
      }

      return;
    }

    if (typeof item === "object") {
      const name = firstValid(
        item.name,
        item.provider,
        item.channel,
        item.broadcast,
        item.broadcaster,
        item.title
      );

      if (!name) return;

      const normalizedName = normalizeText(name);

      if (!result.some((x) => normalizeText(x.name) === normalizedName)) {
        result.push({
          name,
          type: firstValid(item.type, item.kind, "tv"),
          url: firstValid(item.url, item.link, item.href, null),
        });
      }
    }
  };

  /* Estrutura já normalizada */
  if (Array.isArray(match?.broadcasters)) {
    match.broadcasters.forEach(addBroadcaster);
  }

  if (Array.isArray(match?.broadcasts)) {
    match.broadcasts.forEach(addBroadcaster);
  }

  if (Array.isArray(match?.broadcast)) {
    match.broadcast.forEach(addBroadcaster);
  }

  /* API-Football / estruturas parecidas */
  if (Array.isArray(match?.fixture?.broadcasts)) {
    match.fixture.broadcasts.forEach(addBroadcaster);
  }

  if (Array.isArray(match?.fixture?.broadcast)) {
    match.fixture.broadcast.forEach(addBroadcaster);
  }

  /* Campo simples */
  addBroadcaster(match?.broadcaster);
  addBroadcaster(match?.broadcast);
  addBroadcaster(match?.channel);
  addBroadcaster(match?.tv);

  /* Algumas APIs colocam isso em media */
  if (Array.isArray(match?.media)) {
    match.media.forEach(addBroadcaster);
  }

  return result;
}

/* =========================================================
   ESTÁDIO / LOCAL
========================================================= */

function normalizeVenue(match) {
  const venue =
    match?.venue ||
    match?.fixture?.venue ||
    match?.stadium ||
    match?.location ||
    {};

  if (typeof venue === "string") {
    return {
      name: venue,
      city: "",
      country: "",
    };
  }

  return {
    name: firstValid(
      venue.name,
      venue.stadium,
      venue.venueName,
      match?.stadiumName,
      ""
    ),
    city: firstValid(
      venue.city,
      venue.location,
      venue.municipality,
      match?.city,
      ""
    ),
    country: firstValid(
      venue.country,
      match?.country,
      ""
    ),
  };
}

/* =========================================================
   STATUS
========================================================= */

function normalizeStatus(match) {
  const status =
    match?.status ||
    match?.fixture?.status ||
    {};

  if (typeof status === "string") {
    return {
      short: status,
      long: status,
    };
  }

  return {
    short: firstValid(
      status.short,
      status.code,
      match?.statusShort,
      ""
    ),
    long: firstValid(
      status.long,
      match?.statusLong,
      ""
    ),
  };
}

function isFinishedStatus(status) {
  const value = normalizeText(
    typeof status === "string"
      ? status
      : `${status?.short || ""} ${status?.long || ""}`
  );

  return [
    "ft",
    "aet",
    "pen",
    "finished",
    "finalizado",
    "encerrado",
  ].some((x) => value.includes(x));
}

function isLiveStatus(status) {
  const value = normalizeText(
    typeof status === "string"
      ? status
      : `${status?.short || ""} ${status?.long || ""}`
  );

  return [
    "live",
    "1h",
    "2h",
    "ht",
    "et",
    "p",
    "q1",
    "q2",
    "q3",
    "q4",
  ].includes(value);
}

/* =========================================================
   NORMALIZAÇÃO DA PARTIDA
========================================================= */

function normalizeMatch(raw, index = 0) {
  const homeRaw =
    raw?.homeTeam ||
    raw?.home ||
    raw?.teams?.home ||
    {};

  const awayRaw =
    raw?.awayTeam ||
    raw?.away ||
    raw?.teams?.away ||
    {};

  const leagueRaw =
    raw?.league ||
    {};

  const date = firstValid(
    raw?.date,
    raw?.matchDate,
    raw?.kickoff,
    raw?.datetime,
    raw?.fixture?.date,
    null
  );

  const venue = normalizeVenue(raw);
  const status = normalizeStatus(raw);
  const broadcasters = normalizeBroadcasters(raw);

  return {
    id: firstValid(
      raw?.id,
      raw?.matchId,
      raw?.fixture?.id,
      `match-${index}-${date || "unknown"}`
    ),

    date,

    homeTeam: {
      id: getTeamId(homeRaw),
      name: getTeamName(homeRaw),
      logo: getTeamLogo(homeRaw),
    },

    awayTeam: {
      id: getTeamId(awayRaw),
      name: getTeamName(awayRaw),
      logo: getTeamLogo(awayRaw),
    },

    league: {
      id: firstValid(
        leagueRaw?.id,
        leagueRaw?.leagueId,
        null
      ),
      name: firstValid(
        leagueRaw?.name,
        leagueRaw?.title,
        raw?.competition,
        "Competição"
      ),
      logo: firstValid(
        leagueRaw?.logo,
        leagueRaw?.crest,
        ""
      ),
      country: firstValid(
        leagueRaw?.country,
        ""
      ),
    },

    venue,

    broadcasters,

    status,

    goals: {
      home: firstValid(
        raw?.goals?.home,
        raw?.homeGoals,
        raw?.score?.home,
        null
      ),
      away: firstValid(
        raw?.goals?.away,
        raw?.awayGoals,
        raw?.score?.away,
        null
      ),
    },

    round: firstValid(
      raw?.round,
      raw?.league?.round,
      ""
    ),

    raw,
  };
}

/* =========================================================
   DADOS DEMONSTRATIVOS
   SOMENTE PARA A INTERFACE NÃO FICAR VAZIA DURANTE O
   DESENVOLVIMENTO.

   NÃO SÃO APRESENTADOS COMO JOGOS REAIS.
========================================================= */

const DEMO_MATCHES = [
  {
    id: "demo-1",
    date: `${getBrazilDateString()}T19:00:00-03:00`,
    homeTeam: {
      id: 1,
      name: "Flamengo",
      logo: "",
    },
    awayTeam: {
      id: 2,
      name: "Palmeiras",
      logo: "",
    },
    league: {
      id: 1,
      name: "Brasileirão Série A",
      logo: "",
    },
    venue: {
      name: "Maracanã",
      city: "Rio de Janeiro",
      country: "Brasil",
    },
    broadcasters: [
      {
        name: "Premiere",
        type: "tv",
        url: null,
      },
    ],
    status: {
      short: "NS",
      long: "Não iniciado",
    },
    goals: {
      home: null,
      away: null,
    },
  },
];

/* =========================================================
   COMPONENTE: LOGO
========================================================= */

function TeamLogo({
  team,
  size = "w-10 h-10",
}) {
  const [error, setError] = useState(false);

  const logo = getTeamLogo(team);
  const name = getTeamName(team);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (!logo || error) {
    return (
      <div
        className={`${size} shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500`}
        title={name}
      >
        {initials || "?"}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={`Escudo do ${name}`}
      className={`${size} shrink-0 object-contain`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

/* =========================================================
   COMPONENTE: TRANSMISSÃO
========================================================= */

function BroadcasterList({ broadcasters }) {
  if (!broadcasters?.length) {
    return (
      <span className="text-sm text-slate-400">
        Transmissão ainda não informada
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {broadcasters.map((item, index) => {
        const content = (
          <span
            key={`${item.name}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-xs font-semibold text-red-700"
          >
            {item.type === "streaming" ? (
              <PlayCircle className="w-3.5 h-3.5" />
            ) : (
              <Tv className="w-3.5 h-3.5" />
            )}

            {item.name}

            {item.url && (
              <ExternalLink className="w-3 h-3" />
            )}
          </span>
        );

        if (item.url) {
          return (
            <a
              key={`${item.name}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        }

        return content;
      })}
    </div>
  );
}

/* =========================================================
   COMPONENTE: CARD DO JOGO
========================================================= */

function MatchCard({ match }) {
  const finished = isFinishedStatus(match.status);
  const live = isLiveStatus(match.status);

  const homeScore = match.goals?.home;
  const awayScore = match.goals?.away;

  const hasScore =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition">
      {/* Cabeçalho */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {match.league.logo ? (
            <img
              src={match.league.logo}
              alt=""
              className="w-5 h-5 object-contain"
              loading="lazy"
            />
          ) : (
            <Trophy className="w-4 h-4 text-slate-500" />
          )}

          <span className="text-xs font-semibold text-slate-600 truncate">
            {match.league.name}
          </span>
        </div>

        <div className="text-xs text-slate-400 whitespace-nowrap">
          {formatDate(match.date)}
        </div>
      </div>

      <div className="p-5">
        {/* Horário / status */}
        <div className="flex justify-center mb-5">
          {live ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              AO VIVO
            </span>
          ) : finished ? (
            <span className="text-xs font-semibold text-slate-400">
              ENCERRADO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Clock3 className="w-4 h-4" />
              {formatTime(match.date)}
            </span>
          )}
        </div>

        {/* Times */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Mandante */}
          <div className="flex flex-col items-center gap-2 min-w-0">
            <TeamLogo
              team={match.homeTeam}
              size="w-14 h-14"
            />

            <span className="text-sm font-bold text-slate-800 text-center leading-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Placar */}
          <div className="text-center">
            {hasScore ? (
              <div className="text-2xl font-black text-slate-900">
                {homeScore}
                <span className="mx-1 text-slate-300">x</span>
                {awayScore}
              </div>
            ) : (
              <div className="text-lg font-bold text-slate-300">
                x
              </div>
            )}
          </div>

          {/* Visitante */}
          <div className="flex flex-col items-center gap-2 min-w-0">
            <TeamLogo
              team={match.awayTeam}
              size="w-14 h-14"
            />

            <span className="text-sm font-bold text-slate-800 text-center leading-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Estádio */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          {match.venue?.name ? (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />

              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-700">
                  {match.venue.name}
                </div>

                {match.venue.city && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    {match.venue.city}
                    {match.venue.country
                      ? ` · ${match.venue.country}`
                      : ""}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              Estádio ainda não informado
            </div>
          )}
        </div>

        {/* Onde assistir */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-red-500" />

            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Onde assistir
            </span>
          </div>

          <BroadcasterList
            broadcasters={match.broadcasters}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE: TIME DO TOPO
========================================================= */

function TeamQuickButton({
  team,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex flex-col items-center gap-2 px-3 py-2 rounded-xl transition ${
        selected
          ? "bg-slate-900 text-white"
          : "hover:bg-slate-100 text-slate-700"
      }`}
    >
      <TeamLogo
        team={team}
        size="w-9 h-9"
      />

      <span className="text-[11px] font-semibold whitespace-nowrap max-w-[80px] truncate">
        {team.name}
      </span>
    </button>
  );
}

/* =========================================================
   COMPONENTE: FILTROS DE DATA
========================================================= */

function DateFilter({
  value,
  onChange,
}) {
  const today = getBrazilDateString();
  const tomorrow = addDays(today, 1);

  const options = [
    {
      id: "today",
      label: "Hoje",
      date: today,
    },
    {
      id: "tomorrow",
      label: "Amanhã",
      date: tomorrow,
    },
    {
      id: "all",
      label: "Todos",
      date: null,
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
            value === option.id
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activeTab, setActiveTab] = useState("games");

  const [matches, setMatches] = useState([]);

  const [teams, setTeams] = useState([]);

  const [selectedDate, setSelectedDate] = useState("today");

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [selectedLeague, setSelectedLeague] = useState("all");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [usingDemoData, setUsingDemoData] = useState(false);

  const [lastUpdate, setLastUpdate] = useState(null);

  /* =======================================================
     CARREGAR JOGOS
  ======================================================= */

  const loadMatches = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          MATCHES_ENDPOINT,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro HTTP ${response.status}`
          );
        }

        const data = await response.json();

        /*
          Aceita várias estruturas:

          [
            {...},
            {...}
          ]

          ou

          {
            matches: [...]
          }

          ou

          {
            response: [...]
          }
        */

        const rawMatches =
          Array.isArray(data)
            ? data
            : Array.isArray(data.matches)
            ? data.matches
            : Array.isArray(data.response)
            ? data.response
            : Array.isArray(data.data)
            ? data.data
            : [];

        const normalized = rawMatches
          .map(normalizeMatch)
          .filter((match) => match.date);

        setMatches(normalized);
        setUsingDemoData(false);
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);

        /*
          NÃO escondemos o erro.
          Porém deixamos um jogo demonstrativo para
          permitir visualizar a interface durante o
          desenvolvimento.
        */

        setError(
          "Não foi possível carregar os jogos pela API."
        );

        setMatches(
          DEMO_MATCHES.map(normalizeMatch)
        );

        setUsingDemoData(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =======================================================
     CARREGAR TIMES
  ======================================================= */

  const loadTeams = useCallback(async () => {
    try {
      const response = await fetch(
        TEAMS_ENDPOINT,
        {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const rawTeams =
        Array.isArray(data)
          ? data
          : Array.isArray(data.teams)
          ? data.teams
          : Array.isArray(data.response)
          ? data.response
          : Array.isArray(data.data)
          ? data.data
          : [];

      const normalizedTeams = rawTeams
        .map((team) => ({
          id: firstValid(
            team?.id,
            team?.teamId,
            team?.team?.id,
            null
          ),

          name: firstValid(
            team?.name,
            team?.team?.name,
            team?.shortName,
            "Time"
          ),

          logo: firstValid(
            team?.logo,
            team?.crest,
            team?.badge,
            team?.team?.logo,
            team?.team?.crest,
            ""
          ),
        }))
        .filter((team) => team.name);

      setTeams(normalizedTeams);
    } catch (err) {
      console.warn(
        "Endpoint /api/teams não disponível.",
        err
      );

      /*
        Se a API de times não existir, montamos a lista
        a partir dos próprios jogos.

        Isso evita escudos incorretos inseridos manualmente.
      */
    }
  }, []);

  /* =======================================================
     PRIMEIRO CARREGAMENTO
  ======================================================= */

  useEffect(() => {
    loadMatches();
    loadTeams();
  }, [loadMatches, loadTeams]);

  /* =======================================================
     ATUALIZAÇÃO AUTOMÁTICA
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      loadMatches(true);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadMatches]);

  /* =======================================================
     TIMES DO TOPO
  ======================================================= */

  const topTeams = useMemo(() => {
    /*
      Primeiro usa /api/teams.

      Se o endpoint não estiver disponível,
      usa os times encontrados nos próprios jogos.
    */

    if (teams.length > 0) {
      return teams;
    }

    const map = new Map();

    matches.forEach((match) => {
      [match.homeTeam, match.awayTeam].forEach((team) => {
        if (!team?.name) return;

        const key =
          team.id ||
          normalizeText(team.name);

        if (!map.has(key)) {
          map.set(key, team);
        }
      });
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "pt-BR"
        )
    );
  }, [teams, matches]);

  /* =======================================================
     LIGAS
  ======================================================= */

  const leagues = useMemo(() => {
    const map = new Map();

    matches.forEach((match) => {
      if (!match.league?.name) return;

      const key = normalizeText(
        match.league.name
      );

      if (!map.has(key)) {
        map.set(key, match.league.name);
      }
    });

    return [
      "all",
      ...Array.from(map.values()),
    ];
  }, [matches]);

  /* =======================================================
     FILTROS
  ======================================================= */

  const filteredMatches = useMemo(() => {
    const today = getBrazilDateString();
    const tomorrow = addDays(today, 1);

    let result = [...matches];

    if (selectedDate === "today") {
      result = result.filter(
        (match) =>
          getDateKey(match.date) === today
      );
    }

    if (selectedDate === "tomorrow") {
      result = result.filter(
        (match) =>
          getDateKey(match.date) === tomorrow
      );
    }

    if (selectedTeam) {
      const teamSearch = normalizeText(
        selectedTeam.name
      );

      result = result.filter((match) => {
        const home =
          normalizeText(match.homeTeam.name);

        const away =
          normalizeText(match.awayTeam.name);

        return (
          home === teamSearch ||
          away === teamSearch ||
          String(match.homeTeam.id) ===
            String(selectedTeam.id) ||
          String(match.awayTeam.id) ===
            String(selectedTeam.id)
        );
      });
    }

    if (selectedLeague !== "all") {
      result = result.filter(
        (match) =>
          normalizeText(match.league.name) ===
          normalizeText(selectedLeague)
      );
    }

    if (search.trim()) {
      const query =
        normalizeText(search);

      result = result.filter((match) => {
        const values = [
          match.homeTeam.name,
          match.awayTeam.name,
          match.league.name,
          match.venue?.name,
          match.venue?.city,
          ...match.broadcasters.map(
            (item) => item.name
          ),
        ];

        return values.some((value) =>
          normalizeText(value).includes(query)
        );
      });
    }

    result.sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );

    return result;
  }, [
    matches,
    selectedDate,
    selectedTeam,
    selectedLeague,
    search,
  ]);

  /* =======================================================
     AGRUPAR POR DATA
  ======================================================= */

  const groupedMatches = useMemo(() => {
    const groups = new Map();

    filteredMatches.forEach((match) => {
      const key = getDateKey(match.date);

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key).push(match);
    });

    return Array.from(groups.entries());
  }, [filteredMatches]);

  /* =======================================================
     LIMPAR FILTROS
  ======================================================= */

  function clearFilters() {
    setSelectedTeam(null);
    setSelectedLeague("all");
    setSearch("");
    setSelectedDate("today");
  }

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "games",
      label: "Jogos",
      icon: CalendarDays,
    },
    {
      id: "watch",
      label: "Onde assistir",
      icon: Tv,
    },
    {
      id: "table",
      label: "Tabela",
      icon: Trophy,
    },
    {
      id: "scorers",
      label: "Artilharia",
      icon: Users,
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="font-black text-lg leading-none">
                  Onde Tem Jogo?
                </h1>

                <p className="text-[11px] text-slate-400 mt-1">
                  Futebol e onde assistir
                </p>
              </div>
            </div>

            {/* Atualizar */}
            <button
              onClick={() => loadMatches(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-600 disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}

              <span className="hidden sm:inline">
                Atualizar
              </span>
            </button>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Aviso de dados demonstrativos */}
        {usingDemoData && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

            <div>
              <div className="font-bold text-sm text-amber-800">
                API não respondeu
              </div>

              <div className="text-xs text-amber-700 mt-1">
                O jogo exibido abaixo é apenas
                demonstrativo. Os dados reais devem
                vir do endpoint{" "}
                <strong>/api/matches</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && !usingDemoData && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>
              <div className="font-bold text-sm text-red-800">
                Não foi possível atualizar os jogos
              </div>

              <div className="text-xs text-red-700 mt-1">
                {error}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ABA JOGOS
        ================================================= */}

        {activeTab === "games" && (
          <>
            {/* Hero */}
            <section className="mb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-1">
                    FUTEBOL NO BRASIL
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                    Onde tem jogo hoje?
                  </h2>

                  <p className="text-slate-500 mt-2 max-w-2xl">
                    Veja os jogos do dia, horário,
                    estádio e onde assistir.
                  </p>
                </div>

                {lastUpdate && (
                  <div className="text-xs text-slate-400">
                    Atualizado às{" "}
                    {new Intl.DateTimeFormat(
                      "pt-BR",
                      {
                        timeZone:
                          BRAZIL_TIMEZONE,
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ).format(lastUpdate)}
                  </div>
                )}
              </div>
            </section>

            {/* Times */}
            {topTeams.length > 0 && (
              <section className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-700">
                    Times
                  </h3>

                  {selectedTeam && (
                    <button
                      onClick={() =>
                        setSelectedTeam(null)
                      }
                      className="text-xs text-red-600 font-semibold"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-2 overflow-x-auto">
                  <div className="flex gap-1 min-w-max">
                    {topTeams.map((team) => (
                      <TeamQuickButton
                        key={
                          team.id ||
                          team.name
                        }
                        team={team}
                        selected={
                          selectedTeam?.id ===
                            team.id ||
                          (
                            selectedTeam &&
                            normalizeText(
                              selectedTeam.name
                            ) ===
                              normalizeText(
                                team.name
                              )
                          )
                        }
                        onClick={() =>
                          setSelectedTeam(
                            selectedTeam &&
                            (
                              selectedTeam.id ===
                                team.id ||
                              normalizeText(
                                selectedTeam.name
                              ) ===
                                normalizeText(
                                  team.name
                                )
                            )
                              ? null
                              : team
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Filtros */}
            <section className="mb-6">
              <div className="flex flex-col lg:flex-row gap-3">
                <DateFilter
                  value={selectedDate}
                  onChange={setSelectedDate}
                />

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Buscar time, estádio, competição ou transmissão..."
                    className="w-full h-10 pl-10 pr-10 rounded-full border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-slate-200 text-sm"
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Ligas */}
              {leagues.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {leagues.map((league) => (
                    <button
                      key={league}
                      onClick={() =>
                        setSelectedLeague(league)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                        selectedLeague === league
                          ? "bg-slate-800 text-white"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {league === "all"
                        ? "Todas as competições"
                        : league}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Estado carregando */}
            {loading && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />

                <p className="text-sm">
                  Carregando jogos...
                </p>
              </div>
            )}

            {/* Sem jogos */}
            {!loading &&
              groupedMatches.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center">
                  <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <h3 className="font-bold text-slate-700">
                    Nenhum jogo encontrado
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Tente mudar a data ou remover
                    algum filtro.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}

            {/* Jogos */}
            {!loading &&
              groupedMatches.map(
                ([date, dayMatches]) => (
                  <section
                    key={date}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px bg-slate-200 flex-1" />

                      <h3 className="text-sm font-bold text-slate-500 uppercase">
                        {date ===
                        getBrazilDateString()
                          ? "Hoje"
                          : formatDate(
                              dayMatches[0].date
                            )}
                      </h3>

                      <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {dayMatches.map(
                        (match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                          />
                        )
                      )}
                    </div>
                  </section>
                )
              )}
          </>
        )}

        {/* =================================================
            ABA ONDE ASSISTIR
        ================================================= */}

        {activeTab === "watch" && (
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-red-600 mb-1">
                TRANSMISSÕES
              </p>

              <h2 className="text-3xl font-black">
                Onde assistir aos jogos
              </h2>

              <p className="text-slate-500 mt-2">
                Filtre pelos canais e plataformas
                disponíveis para cada partida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches
                .filter(
                  (match) =>
                    match.broadcasters?.length
                )
                .sort(
                  (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
                )
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                  />
                ))}
            </div>

            {matches.filter(
              (match) =>
                match.broadcasters?.length
            ).length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
                <Tv className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                <h3 className="font-bold">
                  Nenhuma transmissão informada
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  A API ainda não retornou os
                  dados de transmissão.
                </p>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            ABA TABELA
        ================================================= */}

        {activeTab === "table" && (
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-red-600 mb-1">
                CLASSIFICAÇÃO
              </p>

              <h2 className="text-3xl font-black">
                Tabela do campeonato
              </h2>

              <p className="text-slate-500 mt-2">
                A tabela deve ser alimentada pela API
                para permanecer atualizada.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <h3 className="font-bold text-slate-700">
                Tabela dinâmica
              </h3>

              <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                Conecte o endpoint de classificação
                da API para que posições, pontos,
                vitórias, saldo e demais estatísticas
                sejam atualizados automaticamente.
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            ABA ARTILHARIA
        ================================================= */}

        {activeTab === "scorers" && (
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-red-600 mb-1">
                ARTILHARIA
              </p>

              <h2 className="text-3xl font-black">
                Artilheiros
              </h2>

              <p className="text-slate-500 mt-2">
                Os dados devem vir da API para evitar
                informações desatualizadas.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <h3 className="font-bold text-slate-700">
                Artilharia dinâmica
              </h3>

              <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                Conecte o endpoint de artilharia da
                API para carregar jogadores e gols
                automaticamente.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-black">
                Onde Tem Jogo?
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Jogos de futebol e onde assistir.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Horários exibidos no fuso de Brasília.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
