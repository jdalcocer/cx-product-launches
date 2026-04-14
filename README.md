# Workshop Landing Page Template

A full-screen presentation deck with **38 animated slides** built with Next.js, React, and Tailwind CSS. Designed for workshops, talks, and internal presentations.

## Features

- Full-screen slide navigation (click zones + keyboard arrows/space)
- 38 pre-built slides with smooth transitions (280ms cubic-bezier)
- Staggered animations and entrance effects
- Progress bar and slide counter
- Responsive design
- Dark and light slide backgrounds
- Video embedding support
- Built with Next.js 16, React 19, Tailwind CSS 4

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Project Structure

```
workshop-landing-template/
├── app/
│   ├── page.tsx              # Entry point (renders SlideDeck)
│   ├── layout.tsx            # Root layout with fonts & metadata
│   └── globals.css           # Tailwind config, CSS variables, animations
│
├── components/
│   └── presentation/
│       └── slide-deck.tsx    # Core component with all 38 slides
│
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
│
├── public/                   # Static assets (images, videos, icons)
│
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── components.json           # Shadcn/ui configuration
└── .gitignore
```

## Navigation

- **Click right 15%** of the screen to go forward
- **Click left 15%** of the screen to go back
- **Arrow keys** (Left/Right, Up/Down) to navigate
- **Space** to advance

## Customization

### Editing slides

All slides are defined in `components/presentation/slide-deck.tsx`. The `SLIDES` array at the bottom of the file controls slide order, and each slide is a React component defined above it.

### Adding a new slide

1. Create a new component function (e.g., `function MySlide({ active }: { active: boolean })`)
2. Add it to the `SLIDES` array with a background theme (`"white"`, `"light"`, or `"dark"`)

### Changing branding

- Update colors in `app/globals.css` (CSS custom properties under `:root`)
- Replace logos/images in the `public/` folder and update references in `slide-deck.tsx`
- Update metadata in `app/layout.tsx`

### Animations

Custom animations are defined in `app/globals.css` using `@keyframes`. The `An` component in `slide-deck.tsx` provides a reusable animation wrapper with configurable direction and delay.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | Framework |
| React | 19.2.4 | UI Library |
| Tailwind CSS | 4.2.0 | Styling |
| TypeScript | 5.7.3 | Type safety |
| Lucide React | 0.564.0 | Icons |

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Compatible with Vercel, Netlify, or any Node.js hosting platform.

## License

Internal use. Modify and adapt for your own workshops and presentations.
