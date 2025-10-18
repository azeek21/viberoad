import { FormEvent, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Loader2, RefreshCw, Sparkles } from 'lucide-react';

import { Aurora } from './components/aurora';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { createRoadmap, type RoadmapResult } from './lib/ai';

interface FormState {
  goal: string;
  background: string;
  constraints: string;
}

const starterIdeas = ['Become a full-stack TypeScript engineer', 'Master conversational Japanese', 'Learn product design from scratch', 'Prepare for data science interviews'];

type Status = 'idle' | 'loading' | 'ready' | 'error';

function App() {
  const [form, setForm] = useState<FormState>({ goal: '', background: '', constraints: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heroTitle = useMemo(() => {
    if (!form.goal) return 'Design your next evolution';
    return `Roadmap to master ${form.goal}`;
  }, [form.goal]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.goal.trim()) {
      setError('Tell the AI what you want to master first.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const result = await createRoadmap({
        goal: form.goal,
        background: form.background,
        constraints: form.constraints
      });

      setRoadmap(result);
      setStatus('ready');
    } catch (cause) {
      console.error('Roadmap generation failed', cause);
      setError('We could not craft a roadmap right now.');
      setStatus('error');
    }
  };

  const handleSuggestion = (idea: string) => {
    setForm((prev) => ({ ...prev, goal: idea }));
  };

  const handleReset = () => {
    setForm({ goal: '', background: '', constraints: '' });
    setRoadmap(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <Aurora className="z-0" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-6 text-center sm:gap-8">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" /> VibeRoad
          </span>
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold text-slate-50 sm:text-5xl sm:leading-tight">{heroTitle}</h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
              Feed VibeRoad a skill, language, or discipline you are eager to master. Our AI mentor will engineer a phase-by-phase roadmap
              with rituals, milestones, and signature resources so you can level up with intention.
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-800/50 bg-slate-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Create your roadmap brief</CardTitle>
              <CardDescription>Describe what you want to learn and any context that helps the mentor personalise your path.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-2 text-left">
                  <label className="text-xs uppercase tracking-wide text-slate-400">I want to master</label>
                  <Input
                    value={form.goal}
                    onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))}
                    placeholder="e.g. designing delightful onboarding experiences"
                    autoFocus
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs uppercase tracking-wide text-slate-400">My background (optional)</label>
                  <Textarea
                    value={form.background}
                    onChange={(event) => setForm((prev) => ({ ...prev, background: event.target.value }))}
                    placeholder="Share any experience, strengths, or gaps the roadmap should account for."
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs uppercase tracking-wide text-slate-400">Constraints or goals (optional)</label>
                  <Textarea
                    value={form.constraints}
                    onChange={(event) => setForm((prev) => ({ ...prev, constraints: event.target.value }))}
                    placeholder="Deadlines, available time each week, dream outcomes — anything that shapes your learning journey."
                    className="min-h-[90px]"
                  />
                </div>

                {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="gap-2">
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Brewing roadmap
                      </>
                    ) : (
                      <>
                        Launch roadmap
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {status !== 'idle' && (
                    <Button type="button" variant="ghost" className="gap-2" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4" /> Start over
                    </Button>
                  )}
                </div>
              </form>
              <div className="flex flex-wrap gap-2">
                {starterIdeas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => handleSuggestion(idea)}
                    className="rounded-full border border-slate-800/60 bg-slate-900/60 px-4 py-1 text-xs text-slate-300 transition hover:border-sky-400/60 hover:text-sky-200"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-4">
            <Card className="border-slate-800/40 bg-slate-900/60">
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>A custom prompt wraps your brief and streams it to OpenRouter (a generous meta-LLM gateway).</CardDescription>
              </CardHeader>
              <CardContent className="gap-4 text-sm text-slate-300">
                <div>
                  <h3 className="font-medium text-slate-200">1. Prime the mentor</h3>
                  <p>A crafted system prompt sets the tone for a precise, motivating learning journey.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200">2. Map the phases</h3>
                  <p>The AI splits your mastery path into phased missions with rituals and measurable milestones.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-200">3. Ship with confidence</h3>
                  <p>Use the resources and checkpoints to stay accountable and see progress fast.</p>
                </div>
              </CardContent>
            </Card>
            {roadmap && (
              <Card className="border-slate-800/40 bg-slate-900/50 text-xs text-slate-400">
                <CardContent className="gap-3">
                  <p>
                    Model: <span className="font-medium text-slate-200">{roadmap.usedModel}</span>
                  </p>
                  {roadmap.latencyMs > 0 && <p>Latency: {(roadmap.latencyMs / 1000).toFixed(1)}s</p>}
                  {roadmap.isFallback && <p className="text-amber-300">Offline mode: connect your OpenRouter API key to unlock realtime guidance.</p>}
                </CardContent>
              </Card>
            )}
          </aside>
        </section>

        <section className="relative">
          <Card className="border-slate-800/50 bg-slate-900/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Your mastery roadmap</CardTitle>
              <CardDescription>Generate a brief to unlock a personalised plan. We keep conversations client-side.</CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
              {status === 'idle' && (
                <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 text-sm text-slate-400">
                  <p>Submit your focus above to conjure a vivid, multi-phase learning journey. The plan will appear here.</p>
                </div>
              )}
              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/50 p-12 text-center text-slate-300">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
                  <p>Asking our mentor council for the sharpest moves...</p>
                </div>
              )}
              {status === 'ready' && roadmap && (
                <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-slate-100 prose-p:text-slate-200 prose-strong:text-slate-50 prose-ul:list-disc prose-li:marker:text-sky-300 prose-a:text-sky-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{roadmap.planMarkdown}</ReactMarkdown>
                </div>
              )}
              {status === 'error' && error && (
                <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">{error}</div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 pb-10 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>Built with React, Vite, Tailwind, and shadcn-inspired components.</p>
        <p>
          Set <code className="rounded bg-slate-800/80 px-2 py-1 text-[10px] text-slate-200">VITE_OPENROUTER_API_KEY</code> to talk to the live mentor.
        </p>
      </footer>
    </div>
  );
}

export default App;
