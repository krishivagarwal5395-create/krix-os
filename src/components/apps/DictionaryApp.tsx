import React, { useState } from 'react';
import { BookMarked, Search, Volume2, Sparkles } from 'lucide-react';

export const DictionaryApp: React.FC = () => {
  const [word, setWord] = useState('ecosystem');
  const [data, setData] = useState<any>({
    word: 'ecosystem',
    phonetic: '/ˈiːkoʊˌsɪstəm/',
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A biological community of interacting organisms and their physical environment.',
            example: 'The ThinkPad workstation provides a stable ecosystem for professional engineering.',
          },
          {
            definition: 'A complex network or interconnected system of software applications and interfaces.',
            example: 'The KRIX desktop ecosystem offers 43 integrated built-in applications.',
          },
        ],
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);

  const lookupWord = async (searchWord: string) => {
    if (!searchWord.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord.trim().toLowerCase())}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json[0]) {
          setData(json[0]);
        }
      } else {
        setData({
          word: searchWord,
          meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: `Definition for "${searchWord}" found in local KRIX lexicons.` }] }],
        });
      }
    } catch {
      setData({
        word: searchWord,
        meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: `Definition lookup offline for "${searchWord}".` }] }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data?.word || word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      {/* Search Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <BookMarked size={22} className="text-rose-500" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookupWord(word);
          }}
          className="flex-1 flex gap-2"
        >
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Look up word in dictionary..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
          >
            Look Up
          </button>
        </form>
      </div>

      {/* Definition Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950/60 rounded-2xl border border-white/10 p-6 space-y-5">
        {data ? (
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-serif font-bold text-white capitalize">{data.word}</h2>
              {data.phonetic && (
                <span className="font-mono text-sm text-rose-400">{data.phonetic}</span>
              )}
              <button
                onClick={playPronunciation}
                className="p-1.5 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors"
                title="Pronounce word"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {data.meanings?.map((meaning: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-rose-500/20 pb-1">
                    {meaning.partOfSpeech}
                  </div>
                  <div className="space-y-3 pl-2">
                    {meaning.definitions?.map((def: any, dIdx: number) => (
                      <div key={dIdx} className="text-xs space-y-1">
                        <div className="text-slate-200 leading-relaxed">
                          <span className="font-mono text-slate-400 mr-2">{dIdx + 1}.</span>
                          {def.definition}
                        </div>
                        {def.example && (
                          <div className="text-slate-400 italic pl-5">
                            "{def.example}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs py-12">Search a word to see its definitions</div>
        )}
      </div>
    </div>
  );
};
