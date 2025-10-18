const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openrouter/cinematika-7b';

export interface RoadmapRequest {
  goal: string;
  background?: string;
  constraints?: string;
}

export interface RoadmapResult {
  planMarkdown: string;
  usedModel: string;
  latencyMs: number;
  isFallback: boolean;
}

const systemPrompt = `You are VibeRoad, a legendary mentor that designs precise learning roadmaps.
Your job is to craft a concise, motivating plan that takes someone from beginner to confident mastery.
Respond in GitHub Flavored Markdown with the following structure:

# Mastery Roadmap for <skill>
- **Time Horizon**: realistic best estimate.
- **Success Snapshot**: 1-2 bullet summary of what mastery looks like.

## Guiding Principles
- 3-5 short, energetic rules the learner should remember.

## Phase 1 — <name> (<duration>)
- **Focus**: short summary
- **Milestones**: bullet list of measurable checkpoints.
- **Practice Ritual**: bullet list of key habits.

## Phase 2 — ...
(repeat for 3-5 phases total, progressing from foundations to mastery)

## Resources
- Curate 4-6 high quality resources with one-sentence why it matters.

Keep the tone confident and inspiring but specific. Avoid generic advice.
Do not include code fences around the response.`;

export async function createRoadmap(request: RoadmapRequest, apiKey?: string): Promise<RoadmapResult> {
  const started = performance.now();
  const key = apiKey ?? import.meta.env.VITE_OPENROUTER_API_KEY;

  const userPrompt = `Skill or focus: ${request.goal}\nBackground: ${request.background || 'no prior experience shared'}\nConstraints: ${request.constraints || 'none mentioned'}\n\nReturn the roadmap described in the system message.`;

  if (!key) {
    return createFallbackRoadmap(request, 'missing-api-key');
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
        'X-Title': 'VibeRoad'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: 1100
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenRouter error', response.status, detail);
      return createFallbackRoadmap(request, `http-error-${response.status}`);
    }

    const payload = await response.json();
    const content: string | undefined = payload?.choices?.[0]?.message?.content;

    if (!content) {
      return createFallbackRoadmap(request, 'no-content');
    }

    return {
      planMarkdown: content.trim(),
      usedModel: payload?.model ?? DEFAULT_MODEL,
      latencyMs: performance.now() - started,
      isFallback: false
    };
  } catch (error) {
    console.error('Failed to reach OpenRouter', error);
    return createFallbackRoadmap(request, 'network-error');
  }
}

function createFallbackRoadmap(request: RoadmapRequest, reason: string): RoadmapResult {
  const goal = request.goal.trim();
  const title = goal ? goal[0].toUpperCase() + goal.slice(1) : 'Your Chosen Skill';

  const fallbackPlan = `# Mastery Roadmap for ${title}
- **Time Horizon**: 3-6 months of consistent, focused effort.
- **Success Snapshot**:
  - You can teach the fundamentals with confidence.
  - You have delivered a polished capstone that proves your capabilities.

## Guiding Principles
- Practice beats passive consumption — build something every week.
- Tight feedback loops: journal what is working and what is unclear.
- Embrace public sharing to keep momentum high.

## Phase 1 — Foundations Ignition (Weeks 1-4)
- **Focus**: Understand the vocabulary, mindset, and baseline techniques.
- **Milestones**:
  - Finish two curated primers and take notes.
  - Build a tiny project that exercises the fundamentals.
- **Practice Ritual**:
  - 30 minutes of deliberate drills on weekdays.
  - Weekly reflection to lock in what clicked.

## Phase 2 — Systems Builder (Weeks 5-8)
- **Focus**: Combine fundamentals into end-to-end workflows.
- **Milestones**:
  - Ship a project that solves a personal problem.
  - Gather feedback from a mentor or community.
- **Practice Ritual**:
  - Alternate between building and critique days.
  - Keep a "question backlog" and research answers.

## Phase 3 — Mastery Lab (Weeks 9-12)
- **Focus**: Stretch into advanced techniques and polish.
- **Milestones**:
  - Deliver a capstone with real-world constraints.
  - Document lessons learned and next steps.
- **Practice Ritual**:
  - Teach others via blog, stream, or meetup.
  - Simulate real deadlines to sharpen execution.

## Resources
- [Roadmap.sh](https://roadmap.sh) — Opinionated learning paths.
- [Building a Second Brain](https://www.buildingasecondbrain.com/) — Systems for retaining knowledge.
- [Interintellect salons](https://interintellect.com/) — Access to peer-led deep dives.
- [Your local community](https://www.meetup.com/) — Accountability and feedback.

> _Offline mode:_ This plan was generated locally because the live AI service was unavailable (${reason}). Set \`VITE_OPENROUTER_API_KEY\` to unlock tailored guidance.`;

  return {
    planMarkdown: fallbackPlan,
    usedModel: `fallback-${reason}`,
    latencyMs: 0,
    isFallback: true
  };
}
