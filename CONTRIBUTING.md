# Contributing to Support Intelligence Agent

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up development environment

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Frontend
```bash
cd frontend
npm install
```

## Making Changes

- Create a feature branch: `feature/your-feature`
- Follow conventional commits
- Write tests for new functionality
- Update documentation as needed

## Adding New MCP Integrations

1. Create integration in `backend/app/mcp/`
2. Extend `BaseMCPIntegration`
3. Add configuration in `config/mcp.yaml`
4. Document in README

## Pull Request Process

1. Ensure tests pass
2. Update documentation
3. Request review from maintainers