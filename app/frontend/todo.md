# Abqarino - Creative AI Tools Expansion

## Design Guidelines
- **Style**: Modern glassmorphism with gradient accents, dark/light mode
- **Color Palette**: Indigo (#6366F1), Purple (#8B5CF6), Pink (#EC4899), Amber (#F59E0B), Emerald (#10B981)
- **Typography**: System fonts, bold headings with gradient text
- **Cards**: Glassmorphic with blur, hover animations, gradient borders

## Images to Generate
1. **hero-excuses.jpg** - Funny cartoon character making excuses, colorful whimsical style
2. **hero-personality.jpg** - Abstract brain with colorful neural connections, modern digital art
3. **hero-creative-tools.jpg** - Creative tools collage with paintbrush, clock, speech bubble, cooking pot
4. **newspaper-vintage-texture.jpg** - Old yellowed newspaper texture, aged paper with stains

## Files to Create/Update (8 files max)

1. **src/lib/i18n.ts** - Add translations for all 6 new features
2. **src/lib/ai-service.ts** - Add AI functions for all 6 features + newspaper image generation
3. **src/App.tsx** - Add routes for new pages
4. **src/pages/Index.tsx** - Update homepage with 8 feature cards in a grid
5. **src/pages/TimeMachine.tsx** - Redesign as classic old newspaper with AI images
6. **src/pages/Excuses.tsx** - Smart excuse generator
7. **src/pages/PersonalityAnalyzer.tsx** - Writing personality analyzer
8. **src/pages/CreativeTools.tsx** - Combined page with 4 tools as tabs:
   - Style Time Travel (convert text to historical writing styles)
   - Emotion Translator (rewrite messages in different tones)
   - What-If Simulator (alternate history scenarios)
   - Fridge Recipe Generator (recipes from available ingredients)

## Development Tasks
1. Generate images
2. Update i18n.ts with all new translations
3. Update ai-service.ts with new AI functions
4. Update App.tsx with new routes
5. Create Excuses.tsx page
6. Create PersonalityAnalyzer.tsx page
7. Create CreativeTools.tsx page (4 tools in tabs)
8. Update Index.tsx homepage with all 8 cards
9. Update TimeMachine.tsx with classic newspaper design + AI images
10. Lint & build
11. CheckUI