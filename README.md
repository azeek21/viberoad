# VibeRoad

VibeRoad is a client-side React experience that conjures bespoke learning roadmaps. Feed it any skill or discipline you want to master and it calls an AI mentor (via [OpenRouter](https://openrouter.ai)) to return a precise, phase-based plan that feels like a futuristic study coach.


## ✨ Features

- **Futuristic interface** inspired by modern AI chat surfaces with aurora lighting and soft glassmorphism.
- **Shadcn-style components** built with Tailwind CSS for buttons, cards, and inputs.
- **AI roadmap generation** through OpenRouter with a crafted system prompt to demand structured guidance.
- **Offline fallback** roadmap so the UI still shines even without an API key.
- **Markdown rendering** with GitHub-flavoured support for clean, scannable plans.

## 🚀 Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# create a production build
npm run build
```

> **Note**: If you cannot reach npm from your network, try setting an alternative registry, e.g. `npm config set registry https://registry.npmmirror.com`.

## 🔑 Configure your AI key

1. Create a free account at [OpenRouter](https://openrouter.ai) and grab an API key (their free tiers cover light usage).
2. Duplicate `.env.example` to `.env.local` and add your key:

   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and set:

   ```ini
   VITE_OPENROUTER_API_KEY=sk-your-openrouter-key
   ```

The client sends requests directly to OpenRouter. For production deployments, consider routing calls through a lightweight proxy so you can keep keys private and rotate models centrally.

## 🛠️ Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) for fast, modern SPA DX.
- [Tailwind CSS](https://tailwindcss.com/) and [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) for styling.
- Shadcn-inspired component primitives (Button, Card, Input, Textarea) built locally.
- [React Markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm) for plan rendering.

## 📁 Project structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── public/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── aurora.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   └── ai.ts
│   ├── main.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 📦 Environment variables

Copy `.env.example` to `.env.local` and fill in the following variable:

| Variable | Description |
|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | API key for OpenRouter used to request roadmaps. |

## 🧪 Testing

The project relies on manual QA and visual inspection. Run `npm run build` to ensure the TypeScript build succeeds.

## 📝 License

MIT
