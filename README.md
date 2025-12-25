# Support Intelligence Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3+-green.svg)](https://langchain.com/)

An AI-powered support ticket analysis agent that identifies patterns, recurring issues, knowledge gaps, and provides actionable insights. Built with LangChain, MCP integrations, and Next.js 15.

## Problem Statement

Support teams face significant challenges:

- **Pattern Blindness**: Recurring issues go unnoticed across thousands of tickets
- **Knowledge Gaps**: Documentation doesn't cover real user problems
- **Slow Resolution**: Agents spend time on issues that have been solved before
- **Missing Insights**: Valuable customer feedback is lost in ticket volume

## Solution

Support Intelligence Agent provides AI-powered ticket analysis:

1. **Pattern Detection**: Identifies recurring issues and clusters similar tickets
2. **Trend Analysis**: Tracks issue frequency over time, spots emerging problems
3. **Auto-Categorization**: Automatically tags and categorizes incoming tickets
4. **Knowledge Gap Detection**: Identifies topics missing from documentation
5. **Resolution Suggestions**: Recommends solutions based on past resolutions
6. **Sentiment Analysis**: Tracks customer satisfaction trends

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 15 Frontend                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Dashboard │  │ Tickets  │  │ Patterns │  │ Knowledge Gaps   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────────────────┐
│                     FastAPI Backend                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   LangChain Agent Core                       ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  ││
│  │  │Pattern      │  │Category     │  │Resolution           │  ││
│  │  │Detector     │  │Classifier   │  │Suggester            │  ││
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    MCP Integrations                          ││
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────────────┐ ││
│  │  │Zendesk │  │Intercom│  │  Slack │  │  Database          │ ││
│  │  │  MCP   │  │  MCP   │  │   MCP  │  │    MCP             │ ││
│  │  └────────┘  └────────┘  └────────┘  └────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend
- **Python 3.11+** - Modern Python with type hints
- **FastAPI** - High-performance async API framework
- **LangChain 0.3+** - Agent orchestration, chains, tools, memory
- **ChromaDB** - Vector storage for semantic ticket search
- **Pydantic** - Data validation and settings management

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Query** - Server state management

### MCP Integrations
- **Database MCP** - PostgreSQL/SQLite ticket storage
- **Zendesk MCP** - Zendesk ticket sync
- **Intercom MCP** - Intercom conversation sync
- **Slack MCP** - Team notifications and alerts

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker (optional)

### 1. Clone the repository
```bash
git clone https://github.com/VaibhavJeet/support-intelligence-agent.git
cd support-intelligence-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## Configuration

### LLM Configuration

```env
# OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here

# Or use Ollama for local
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### MCP Integrations

```yaml
# config/mcp.yaml
integrations:
  database:
    enabled: true
    provider: sqlite

  zendesk:
    enabled: false
    subdomain: ${ZENDESK_SUBDOMAIN}
    api_token: ${ZENDESK_API_TOKEN}

  slack:
    enabled: false
    bot_token: ${SLACK_BOT_TOKEN}
```

## Features

### Pattern Detection
- Clusters similar tickets using semantic similarity
- Identifies recurring issues by topic
- Tracks pattern frequency and trends

### Auto-Categorization
- Automatically assigns categories to tickets
- Suggests priority levels
- Extracts product/feature mentions

### Knowledge Gap Analysis
- Identifies undocumented issues
- Suggests FAQ entries
- Recommends documentation updates

### Analytics Dashboard
- Ticket volume trends
- Category distribution
- Resolution time metrics
- Customer sentiment trends

## API Reference

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets` | List tickets |
| GET | `/api/tickets/{id}` | Get ticket details |
| POST | `/api/tickets/{id}/analyze` | Analyze single ticket |

### Patterns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patterns` | Get detected patterns |
| POST | `/api/patterns/detect` | Run pattern detection |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/trends` | Get trend data |
| GET | `/api/analytics/categories` | Category distribution |
| GET | `/api/analytics/knowledge-gaps` | Knowledge gap report |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.
