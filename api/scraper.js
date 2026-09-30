import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const { data: html } = await axios.get("https://ge.globo.com/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });

    const $ = cheerio.load(html);
    const linkNoticia = $(".feed-post-link").first().attr("href");

    if (!linkNoticia) {
      return res.status(400).json({ error: "Nenhuma notícia encontrada" });
    }

    const { data: htmlMateria } = await axios.get(linkNoticia);
    const $materia = cheerio.load(htmlMateria);
    const textoBruto = $materia(".mc-article-body, .materia-body").text().trim();

    if (!textoBruto) {
      return res.status(400).json({ error: "Conteúdo da matéria vazio" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Reescreva a matéria esportiva abaixo em português com tom jornalístico e imparcial.
        Retorne estritamente um JSON no seguinte formato:
        {
          "titulo": "Título atrativo reescrito",
          "resumo": "Resumo de 2 a 3 frases",
          "conteudo": "Texto completo reescrito com parágrafos separados por \\n\\n",
          "categoria": "Ex: Série A, Ligas Europeias, etc",
          "liga": "Nome do campeonato",
          "times": ["TimeA", "TimeB"]
        }

        Texto Original: ${textoBruto.substring(0, 4000)}`,
      config: { responseMimeType: "application/json" }
    });

    const noticia = JSON.parse(response.text);

    const { error } = await supabase.from("noticias").insert([
      {
        titulo: noticia.titulo,
        resumo: noticia.resumo,
        conteudo: noticia.conteudo,
        categoria: noticia.categoria,
        liga: noticia.liga,
        times: noticia.times,
        portal_fonte: "GE Globo",
        url_fonte: linkNoticia
      }
    ]);

    if (error) throw error;

    return res.status(200).json({ success: true, noticia });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
