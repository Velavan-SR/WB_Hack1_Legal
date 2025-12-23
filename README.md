# 🛡️ AI Legal Clause Analyzer

> **Winter Bootcamp Gen AI Hackathon Project**  
> Protecting consumers from hidden legal traps in Terms & Conditions

## 🎯 Problem Statement

95% of users click "Accept" on Terms & Conditions without reading them. This tool acts as a **digital lawyer**, scanning fine print for anti-consumer clauses, data-sharing risks, and hidden costs—translating legal jargon into plain English.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                  (Next.js 15 + Tailwind CSS)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  URL Input   │  │ Text Paste   │  │ PDF Upload   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                ┌────────────▼────────────┐
                │   API ROUTES (Next.js)  │
                │  /api/analyze-text      │
                │  /api/analyze-url       │
                │  /api/clause-search     │
                └────────┬────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
┌─────────▼─────────┐         ┌────────▼─────────┐
│   TEXT PARSER     │         │   RAG PIPELINE   │
│  (Cheerio, PDF)   │         │   (LangChain.js) │
│                   │         │                  │
│  • Web Scraping   │         │  • Prompt Chains │
│  • PDF Extraction │         │  • Embeddings    │
│  • Clean Text     │         │  • Vector Search │
└─────────┬─────────┘         └────────┬─────────┘
          │                            │
          └────────────┬───────────────┘
                       │
          ┌────────────▼─────────────┐
          │   CLAUSE CLASSIFIER      │
          │   (GPT-4 + Prompts)      │
          │                          │
          │  • Red Flag Detection    │
          │  • Risk Scoring          │
          │  • Plain English Trans.  │
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐
          │   MONGODB ATLAS          │
          │   (Vector Search)        │
          │                          │
          │  • Store Clause Vectors  │
          │  • Semantic Search       │
          │  • Query History         │
          └──────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### **AI/ML Stack**
- **LangChain.js**: RAG pipeline & prompt chaining
- **OpenAI GPT-4**: Clause analysis & translation
- **MongoDB Atlas Vector Search**: Semantic clause retrieval
- **Vercel AI SDK**: Streaming responses

### **DevOps & Observability**
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline
- **LangSmith**: LLM tracing & monitoring
- **Vercel/Render**: Deployment platforms

---

## 🚀 Core Features

### 1. **Red-Flag Detection System**
```typescript
Risk Levels:
🔴 RED FLAGS (High Risk)
   - Data selling to third parties
   - Forced arbitration clauses
   - Auto-renewal with no cancellation
   - Unilateral changes without notice

🟡 YELLOW FLAGS (Medium Risk)
   - Vague data retention policies
   - Limited liability clauses
   - Non-refundable payment terms

🟢 GREEN FLAGS (Standard)
   - Clear cancellation process
   - GDPR/CCPA compliance
   - Transparent data usage
```

### 2. **Plain English Translation**
- **Before**: "The company reserves the right to monetize aggregated user behavioral data for commercial purposes."
- **After**: "🔴 They will sell your browsing habits to advertisers."

### 3. **Clause Search**
Ask questions like:
- "How do I cancel my subscription?"
- "Can they share my data?"
- "What happens if I miss a payment?"

The AI finds the exact clause and explains it.

### 4. **Alternative Clause Suggestions** (Bonus)
For business owners: See how unfair clauses *should* have been written.

---

## 📂 Project Structure

```
ai-legal-clause-analyzer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── analyze/        # Text/URL analysis
│   │   │   └── search/         # Clause search
│   │   ├── page.tsx            # Landing page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ClauseAnalyzer.tsx  # Main analyzer UI
│   │   ├── RiskReport.tsx      # Red/Yellow/Green display
│   │   └── ClauseSearch.tsx    # Search interface
│   ├── lib/                    # Core logic
│   │   ├── langchain/          # LangChain pipelines
│   │   │   ├── prompts.ts      # Classification prompts
│   │   │   ├── embeddings.ts   # Vector generation
│   │   │   └── rag.ts          # RAG chain
│   │   ├── parsers/            # Text extraction
│   │   │   ├── urlParser.ts    # Web scraping
│   │   │   └── pdfParser.ts    # PDF extraction
│   │   └── mongodb.ts          # Vector DB client
│   └── types/                  # TypeScript definitions
├── docker/                     # Dockerfiles
├── .github/                    # CI/CD workflows
└── docs/                       # Architecture diagrams
```

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd WB_Hack1_Legal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📅 Development Roadmap

### **Day 1: Architecture** ✅
- [x] Hour 1: Project scaffolding + documentation
- [x] Hour 2: PDF/text parsing setup + data models
- [x] Hour 3: MongoDB Atlas Vector DB integration
- [x] Hour 4: REST API endpoints (analyze, search, health checks)

### **Day 2: AI Logic** 🚀
- [X] Hour 5: LangChain prompt templates for clause classification
- [X] Hour 6: Red/Yellow/Green flag detection logic
- [ ] Hour 7: RAG pipeline for clause search + "Plain English" translation
- [ ] Hour 8: Function calling for specific queries

### **Day 3: Deployment**
- [ ] Hour 9: Next.js UI with Tailwind
- [ ] Hour 10: Risk report display
- [ ] Hour 11: Docker containerization
- [ ] Hour 12: Final polish + deployment

---

## 🧪 Usage Example

```typescript
// Input: Terms & Conditions URL
const result = await analyzeTerms({
  source: "https://example.com/terms",
  type: "url"
});

// Output:
{
  redFlags: [
    {
      clause: "Section 7.3: Data Monetization",
      risk: "Your browsing data will be sold to advertisers",
      severity: "HIGH"
    }
  ],
  yellowFlags: [...],
  greenFlags: [...]
}
```

---

## 📊 LangSmith Observability

Track:
- Average token usage per analysis
- Clause classification accuracy
- API response latency
- Cost per request

---

## 🤝 Contributing

This is a hackathon project. Commits are tracked hourly for attendance verification.

---

## 📜 License

MIT License - Built for Winter Bootcamp Gen AI Hackathon 2025

---

**⚡ Hour 1 Status**: Foundation Complete ✅  
**Next Up**: Text parsing & data models (Hour 2)