import React, { useState, useEffect } from 'react';
import { Tv, Calendar, Search, Trophy, RefreshCw, AlertCircle, Newspaper, ExternalLink, MapPin, Shield, UserCheck, ListOrdered, Info } from 'lucide-react';

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

// Tabelas de Classificação Completas
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

// Banco de Notícias Organizado por Clube (3 Notícias para cada time)
const NEWS_BY_TEAM = {
  "Destaques": [
    { id: 101, team: "Geral", title: "Guia completo de transmissões: Onde assistir aos jogos da rodada no futebol brasileiro", summary: "Confira horários e canais de TV fechada, aberta e streaming dos confrontos desta semana.", date: "28/09/2026", url: "https://ge.globo.com" },
    { id: 102, team: "Seleção Brasileira", title: "Brasil x Austrália: Horários, prováveis escalações e onde assistir ao vivo", summary: "Seleção entra em campo nesta segunda em preparação para os próximos desafios internacionais.", date: "28/09/2026", url: "https://ge.globo.com/futebol/selecao-brasileira/" },
    { id: 103, team: "Feminino", title: "Derby no Brasileirão Feminino mobiliza Corinthians e Palmeiras em fase decisiva", summary: "Clássico paulista agita a reta final do campeonato nacional com cobertura completa de TV.", date: "27/09/2026", url: "https://ge.globo.com/futebol/futebol-feminino/" }
  ],
  "Flamengo": [
    { id: 201, team: "Flamengo", title: "Flamengo intensifica treinos táticos no Ninho do Urubu visando o próximo duelo", summary: "Comandante ajusta o posicionamento ofensivo e busca manter o time no topo da tabela do Brasileirão.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/flamengo/" },
    { id: 202, team: "Flamengo", title: "Ingressos para o próximo confronto do Flamengo no Maracanã já estão à venda", summary: "Sócio-torcedores têm prioridade no resgate das entradas. Estádio promete casa cheia.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/flamengo/" },
    { id: 203, team: "Flamengo", title: "Departamento Médico do Flamengo atualiza situação dos atletas lesionados", summary: "Transição física avança e atacante pode retornar antes do prazo previsto no Ninho.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/flamengo/" }
  ],
  "Palmeiras": [
    { id: 301, team: "Palmeiras", title: "Palmeiras foca em bola parada no Allianz Parque para manter sequência positiva", summary: "Equipe alviverde finaliza preparação com atenção especial aos detalhes defensivos e táticos.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/palmeiras/" },
    { id: 302, team: "Palmeiras", title: "Destaque da base do Palmeiras assina renovação de contrato de longa duração", summary: "Jovem promessa firma novo vínculo com cláusula rescisória protegida contra o futebol europeu.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/palmeiras/" },
    { id: 303, team: "Palmeiras", title: "Palmeiras Feminino projeta clássico decisivo e convoca torcida nas redes", summary: "Elenco feminino encerra preparação para o Derby decisivo do Brasileirão da categoria.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/palmeiras/" }
  ],
  "São Paulo": [
    { id: 401, team: "São Paulo", title: "São Paulo ajusta escalação no MorrumBIS visando subir no G-4 do Brasileirão", summary: "Técnico testa opções no meio-campo para dar maior fluidez ao setor de criação tricolor.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/sao-paulo/" },
    { id: 402, team: "São Paulo", title: "MorrumBIS registra grande procura de ingressos para a próxima rodada", summary: "Torcida são-paulina prepara recepção especial para empurrar a equipe em casa.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/sao-paulo/" },
    { id: 403, team: "São Paulo", title: "Lateral do São Paulo destaca apoio da torcida e projeta sequência de vitórias", summary: "Em entrevista coletiva, atleta frisa a importância de somar pontos na reta final da temporada.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/sao-paulo/" }
  ],
  "Corinthians": [
    { id: 501, team: "Corinthians", title: "Corinthians treina forte na Neo Química Arena com foco na recuperação na tabela", summary: "Elenco alvinegro trabalha jogadas ensaiadas e busca entrosamento para os próximos desafios.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/corinthians/" },
    { id: 502, team: "Corinthians", title: "Fiel Torcida esgota setor nobre da Neo Química Arena para o próximo jogo", summary: "Apoio incondicional das arquibancadas é a aposta do Timão para buscar o resultado positivo.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/corinthians/" },
    { id: 503, team: "Corinthians", title: "Corinthians Feminino define estratégia para o clássico no futebol feminino", summary: "Brabas do Timão buscam confirmar o favoritismo e manter a liderança da competição.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/corinthians/" }
  ],
  "Santos": [
    { id: 601, team: "Santos", title: "Santos finaliza apronto na Vila Belmiro para confronto direto na Série B", summary: "Peixe busca três pontos fundamentais para consolidar o acesso de volta à elite nacional.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/santos/" },
    { id: 602, team: "Santos", title: "Meninos da Vila ganham espaço nos treinos e agradam comissão técnica", summary: "Jovens talentos da base santista são testados no time principal visando a sequência de partidas.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/santos/" },
    { id: 603, team: "Santos", title: "Vila Belmiro terá casa cheia para apoiar o Santos na noite desta segunda", summary: "Todos os ingressos colocados à venda para os torcedores santistas foram esgotados.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/santos/" }
  ],
  "Vasco da Gama": [
    { id: 701, team: "Vasco da Gama", title: "Vasco intensifica preparação em São Januário com portões fechados", summary: "Comissão técnica testa novas formações táticas para surpreender o adversário na rodada.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/vasco/" },
    { id: 702, team: "Vasco da Gama", title: "Caldeirão de São Januário se prepara para mais uma grande festa da torcida", summary: "Vascainos organizam recepção ao ônibus da delegação na chegada ao estádio.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/vasco/" },
    { id: 703, team: "Vasco da Gama", title: "Meia do Vasco comemora evolução física e se coloca à disposição do treinador", summary: "Atleta recuperado de contusão treina sem limitações com o restante do grupo no CT.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/vasco/" }
  ],
  "Botafogo": [
    { id: 801, team: "Botafogo", title: "Líder Botafogo treina no Nilton Santos com foco em manter a vantagem", summary: "Glorioso trabalha forte no gramado sintético buscando manter a consistência no campeonato.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/botafogo/" },
    { id: 802, team: "Botafogo", title: "Torcida do Botafogo prepara mosaico especial para o próximo compromisso", summary: "Festa no Estádio Nilton Santos promete motivar o time na luta pelos objetivos da temporada.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/botafogo/" },
    { id: 803, team: "Botafogo", title: "Atacante do Botafogo se destaca em estatísticas de finalização no Brasileirão", summary: "Números comprovam a eficiência do setor ofensivo alvinegro nas últimas rodadas.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/botafogo/" }
  ],
  "Fluminense": [
    { id: 901, team: "Fluminense", title: "Fluminense faz ajustes no CT Carlos Castilho antes de decisão no Maracanã", summary: "Tricolor das Laranjeiras busca reabilitação para subir posições na tabela de classificação.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/fluminense/" },
    { id: 902, team: "Fluminense", title: "Xodó da torcida tricolor treina em separado e passa por reavaliação médica", summary: "Equipe médica acompanha evolução do atleta para definir presença na relação de relacionados.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/fluminense/" },
    { id: 903, team: "Fluminense", title: "Fluminense convoca torcedores para apoiar o time no próximo jogo em casa", summary: "Check-in de sócios está aberto com alta adesão para a partida no Maracanã.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/fluminense/" }
  ],
  "Grêmio": [
    { id: 1001, team: "Grêmio", title: "Grêmio trabalha transição defensiva no CT Luiz Carvalho visando o próximo jogo", summary: "Técnico gremista orienta posicionamento e cobra atenção nos minutos iniciais da partida.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/gremio/" },
    { id: 1002, team: "Grêmio", title: "Arena do Grêmio projeta grande público para apoiar a equipe tricolor gaúcha", summary: "Mobilização da torcida gremista promete forte atmosfera no estádio em Porto Alegre.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/gremio/" },
    { id: 1003, team: "Grêmio", title: "Goleiro do Grêmio celebra boa fase e destaca união do elenco tricolor", summary: "Em entrevista, camisa 1 ressalta o empenho coletivo para alcançar os objetivos da equipe.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/gremio/" }
  ],
  "Internacional": [
    { id: 1101, team: "Internacional", title: "Internacional finaliza treinos no CT Parque Gigante com novidades na equipe", summary: "Colorado busca manter a solidez tática no Beira-Rio para garantir pontos preciosos.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/internacional/" },
    { id: 1102, team: "Internacional", title: "Sócio-torcedor do Inter lota setores do Beira-Rio para o confronto do fim de semana", summary: "Mobilização vermelha promete transformar o estádio em um verdadeiro caldeirão.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/internacional/" },
    { id: 1103, team: "Internacional", title: "Atacante do Inter destaca entrosamento do setor ofensivo em fase positiva", summary: "Com grande aproveitamento recente, jogador valoriza o empenho do grupo nos treinos.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/internacional/" }
  ],
  "Atlético Mineiro": [
    { id: 1201, team: "Atlético Mineiro", title: "Atlético-MG se prepara na Arena MRV para mais um grande desafio no ano", summary: "Galo trabalha jogadas ofensivas de velocidade para pressionar o adversário desde o início.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/atletico-mg/" },
    { id: 1202, team: "Atlético Mineiro", title: "Massa Atleticana esgota carga de ingressos na Arena MRV para a próxima rodada", summary: "Torcida alvinegra prepara grande festa com sinalizadores e bandeirões no estádio.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/atletico-mg/" },
    { id: 1203, team: "Atlético Mineiro", title: "Meia do Galo comemora retorno e projeta sequência titular na equipe", summary: "Jogador recuperado de lesão treina sem restrições com a comissão técnica mineira.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/atletico-mg/" }
  ],
  "Cruzeiro": [
    { id: 1301, team: "Cruzeiro", title: "Cruzeiro realiza treino tático na Toca da Raposa com foco em triangulações", summary: "Comissão técnica ajusta últimos detalhes da equipe que entrará em campo no Mineirão.", date: "28/09/2026", url: "https://ge.globo.com/futebol/times/cruzeiro/" },
    { id: 1302, team: "Cruzeiro", title: "Nação Azul promete lotar o Mineirão para apoiar a Raposa no campeonato", summary: "Venda de ingressos atinge marca expressiva e confirma o entusiasmo do torcedor cruzeirense.", date: "27/09/2026", url: "https://ge.globo.com/futebol/times/cruzeiro/" },
    { id: 1303, team: "Cruzeiro", title: "Zagueiro do Cruzeiro ressalta importância da solidez defensiva nos jogos em casa", summary: "Defensor valoriza o trabalho coletivo e projeta partida segura perante a torcida.", date: "26/09/2026", url: "https://ge.globo.com/futebol/times/cruzeiro/" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('todas');
  const [selectedStandingLeague, setSelectedStandingLeague] = useState('Brasileirão Série A');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState(null);
  const [selectedNewsTeam, setSelectedNewsTeam] = useState('Destaques');

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

  const newsList = NEWS_BY_TEAM[selectedNewsTeam] || NEWS_BY_TEAM["Destaques"];

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
              <p className="text-xs text-slate-400">Guia de Partidas, Tabelas, Notícias e Transmissões</p>
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
              <Shield className="w-4 h-4 text-emerald-400" /> Times em Destaque (Filtrar Jogos & Notícias)
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

        {/* Seção Dinâmica de Notícias com Filtro por Time */}
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
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition group"
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
                  <span>Ler matéria no ge</span>
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
