import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Newspaper, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarNoticias() {
    setLoading(true);
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNoticias(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    carregarNoticias();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Portal de Notícias Esportivas
          </h1>
        </div>
        <button
          onClick={carregarNoticias}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        {loading && noticias.length === 0 ? (
          <p className="col-span-2 text-center text-slate-400 py-12">A carregar notícias...</p>
        ) : noticias.length === 0 ? (
          <p className="col-span-2 text-center text-slate-400 py-12">Nenhuma notícia encontrada ainda.</p>
        ) : (
          noticias.map((item) => (
            <article key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
                  <span className="bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/50">
                    {item.categoria || 'Geral'}
                  </span>
                  {item.liga && <span className="text-slate-400">• {item.liga}</span>}
                </div>
                <h2 className="text-xl font-bold mb-3 text-slate-50 leading-snug">{item.titulo}</h2>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed whitespace-pre-line">{item.conteudo}</p>
              </div>

              <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </span>
                <a
                  href={item.url_fonte}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  Fonte original ({item.portal_fonte}) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
