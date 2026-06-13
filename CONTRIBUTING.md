# Contributing to JellyOS

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be excellent to each other. We're all here to build something great.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/jelly-chain/JellyOS.git
cd JellyOS

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
npm run format
```

## Project Structure

```
src/
├── api/           # Extension API types
├── blockchain/    # Chain-specific utilities
├── core/          # Core engine (ConfigLoader, TaskDispatcher, etc.)
├── feeds/         # Live data feed managers
├── runner/        # Agent loop and model client
├── session/       # Session management
├── tools/         # AI-callable tools
├── tui/           # Terminal UI components
└── test/          # Test suites
```

## Adding New Skills

Skills must follow this structure:
```
skills/
└── my-skill/
    ├── index.ts          # Main implementation
    ├── factory.ts        # Factory function
    ├── SKILL.md          # Documentation with YAML frontmatter
    └── types/
        └── SkillTypes.ts # Type definitions
```

### Skill Template

```typescript
// SKILL.md frontmatter
---
name: my-skill
description: What this skill does
author: Your Name
version: 1.0.0
category: trading
---

# My Skill

Detailed documentation...
```

## Pull Request Process

1. Fork and create a feature branch
2. Make your changes with tests
3. Ensure `npm run lint` passes
4. Submit PR with description of changes

## Security

Never commit:
- API keys
- Private keys
- `.env` files (use `.env.example` as template)

Report security vulnerabilities to security@jellyos.com