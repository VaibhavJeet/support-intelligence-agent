# Contributing to Support Intelligence Agent

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/support-intelligence-agent.git
   cd support-intelligence-agent
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/VaibhavJeet/support-intelligence-agent.git
   ```

## Development Setup

### Backend (Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Frontend (Next.js)

```bash
cd frontend
npm install
```

### Environment Configuration

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Running Locally

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Making Changes

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/slack-integration`)
- `fix/` - Bug fixes (e.g., `fix/pattern-detection-accuracy`)
- `docs/` - Documentation changes
- `refactor/` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Adding New Features

### Adding a New LangChain Agent

1. Create agent in `backend/app/agents/`
2. Register in `backend/app/agents/__init__.py`
3. Add API endpoint if needed
4. Write tests in `backend/tests/agents/`

### Adding a New MCP Integration

1. Create integration in `backend/app/mcp/`
2. Add configuration in `config/mcp.yaml`
3. Register in `backend/app/mcp/__init__.py`

## Testing

### Backend

```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```

### Frontend

```bash
cd frontend
npm test
npm run test:coverage
```

### Linting

```bash
# Backend
ruff check .
ruff format .

# Frontend
npm run lint
```

## Pull Request Process

1. Update your fork from upstream
2. Create a feature branch
3. Make changes and commit
4. Push and create PR
5. Ensure all checks pass
6. Wait for review

### PR Requirements

- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] PR description explains changes

Thank you for contributing!
