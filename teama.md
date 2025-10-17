# Team A - Task Breakdown
## Frontend, Backend, Storage, AI Lead

> **Responsibilities:** Web Application, API Services, File Storage, AI Integration

---

## 📋 Overview

**Team A Scope:**
- ✅ Frontend (React + Vite + TailwindCSS)
- ✅ Backend API (Node.js + Fastify + PostgreSQL)
- ✅ Storage Integration (Arweave/IPFS)
- ✅ AI Services (OpenAI, ASI Agents API)

**Total Estimated Hours:** 45-50 hours
**Timeline:** 4 weeks

---

## 🎯 Week 1: Foundation & Setup (12-15 hours)

### Frontend Setup (6-8 hours)

#### Day 1-2: Project Initialization
- [ ] **Initialize React + Vite project**
  ```bash
  npm create vite@latest frontend -- --template react-ts
  cd frontend
  npm install
  ```

- [ ] **Install Core Dependencies**
  ```bash
  npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui \
    @solana/wallet-adapter-wallets @solana/web3.js @coral-xyz/anchor \
    tailwindcss postcss autoprefixer zustand react-router-dom \
    lucide-react recharts
  ```

- [ ] **Configure TailwindCSS**
  ```bash
  npx tailwindcss init -p
  ```
  - Update `tailwind.config.js` with custom theme colors (Solana green #14F195)
  - Set up HeadlessUI for modals and dropdowns

- [ ] **Project Structure Setup**
  ```
  frontend/src/
  ├── components/
  │   ├── layout/       # Header, Footer, Sidebar
  │   ├── wallet/       # WalletConnect button
  │   ├── editor/       # Manuscript editor
  │   ├── dashboard/    # Author/Reader dashboards
  │   └── ui/           # Reusable UI components
  ├── pages/
  │   ├── Home.tsx
  │   ├── AuthorDashboard.tsx
  │   ├── ReaderBrowse.tsx
  │   ├── ProjectView.tsx
  │   └── EditorPage.tsx
  ├── lib/
  │   ├── api.ts        # Backend API client
  │   ├── solana.ts     # Solana utilities (Team B provides)
  │   └── types.ts      # TypeScript interfaces
  ├── hooks/
  │   ├── useWallet.ts
  │   ├── useProject.ts
  │   └── useChapter.ts
  └── store/
      └── appStore.ts   # Zustand global state
  ```

#### Day 3: Wallet Integration
- [ ] **Set up Solana Wallet Adapter**
  ```typescript
  // src/components/wallet/WalletProvider.tsx
  import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
  import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
  import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
  import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

  export function SolanaWalletProvider({ children }) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = 'https://api.devnet.solana.com';

    const wallets = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter()
    ];

    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }
  ```

- [ ] **Create WalletConnect Button Component**
  ```typescript
  // src/components/wallet/WalletButton.tsx
  import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

  export function WalletButton() {
    return <WalletMultiButton />;
  }
  ```

- [ ] **Test wallet connection** (Phantom/Solflare)

---

### Backend Setup (6-7 hours)

#### Day 1-2: API Foundation
- [ ] **Initialize Fastify Project**
  ```bash
  mkdir backend
  cd backend
  npm init -y
  npm install fastify @fastify/cors @fastify/jwt @fastify/websocket \
    prisma @prisma/client dotenv ioredis bullmq
  npm install -D typescript @types/node ts-node
  ```

- [ ] **Create Project Structure**
  ```
  backend/src/
  ├── routes/
  │   ├── auth.ts       # Wallet authentication
  │   ├── projects.ts   # Project CRUD
  │   ├── chapters.ts   # Chapter CRUD
  │   └── admin.ts      # Metrics dashboard
  ├── services/
  │   ├── solana.ts     # Solana RPC (Team B integration)
  │   ├── storage.ts    # Arweave uploads (Team A)
  │   ├── ai.ts         # OpenAI services (Team A)
  │   └── encryption.ts # Client-side encryption helpers
  ├── lib/
  │   ├── logger.ts
  │   └── redis.ts
  ├── prisma/
  │   └── schema.prisma
  └── server.ts
  ```

#### Day 2-3: Database Setup
- [ ] **Create Prisma Schema**
  ```prisma
  // prisma/schema.prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  model User {
    id           String    @id @default(cuid())
    walletAddr   String    @unique
    username     String?
    createdAt    DateTime  @default(now())
    projects     Project[] @relation("Author")
    collaborations Collaborator[]
  }

  model Project {
    id            String   @id @default(cuid())
    title         String
    description   String?
    authorId      String
    authorWallet  String
    contractAddr  String   @unique
    visibility    String   @default("private") // public, private, paid
    price         Float?   // in SOL
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt

    author        User     @relation("Author", fields: [authorId], references: [id])
    chapters      Chapter[]
    collaborators Collaborator[]
  }

  model Chapter {
    id            String   @id @default(cuid())
    projectId     String
    title         String
    encryptedUri  String   // Arweave/IPFS hash
    contentHash   String   // SHA-256 for integrity
    version       Int
    authorWallet  String
    createdAt     DateTime @default(now())

    project       Project  @relation(fields: [projectId], references: [id])
  }

  model Collaborator {
    id            String   @id @default(cuid())
    projectId     String
    userId        String
    walletAddr    String
    role          String   // author, editor, reviewer
    revenueShare  Float    // percentage (0-100)
    reputation    Int      @default(0)
    createdAt     DateTime @default(now())

    project       Project  @relation(fields: [projectId], references: [id])
    user          User     @relation(fields: [userId], references: [id])
  }

  model TransactionMetrics {
    id         String   @id @default(cuid())
    signature  String   @unique
    priority   String
    duration   Int
    rpcUsed    String
    timestamp  DateTime @default(now())
  }
  ```

- [ ] **Run Migrations**
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```

- [ ] **Set up PostgreSQL** (local or Railway.app)

#### Day 3: Authentication
- [ ] **Implement Wallet Signature Verification**
  ```typescript
  // src/routes/auth.ts
  import { FastifyRequest, FastifyReply } from 'fastify';
  import { PublicKey } from '@solana/web3.js';
  import nacl from 'tweetnacl';
  import bs58 from 'bs58';

  export async function authRoutes(app) {
    app.post('/api/auth/verify', async (req: FastifyRequest, reply: FastifyReply) => {
      const { wallet, signature, message } = req.body as any;

      // Verify signature
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = new PublicKey(wallet).toBytes();

      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!verified) {
        return reply.code(401).send({ error: 'Invalid signature' });
      }

      // Create or get user
      const user = await prisma.user.upsert({
        where: { walletAddr: wallet },
        create: { walletAddr: wallet },
        update: {}
      });

      // Generate JWT
      const token = app.jwt.sign({ userId: user.id, wallet });

      return { token, user };
    });
  }
  ```

---

## 🎯 Week 2: Core Features (15-18 hours)

### Frontend Core (8-10 hours)

#### Day 1-2: UI Components Library
- [ ] **Create Reusable Components**
  ```typescript
  // src/components/ui/Button.tsx
  export function Button({ children, variant = 'primary', ...props }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition";
    const variants = {
      primary: "bg-green-500 hover:bg-green-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      danger: "bg-red-500 hover:bg-red-600 text-white"
    };

    return (
      <button className={`${baseStyles} ${variants[variant]}`} {...props}>
        {children}
      </button>
    );
  }
  ```

- [ ] **Components to Build:**
  - `Card.tsx` - Project/chapter cards
  - `Input.tsx` - Form inputs
  - `Modal.tsx` - Modals for forms
  - `Toast.tsx` - Notifications
  - `Loading.tsx` - Loading spinners
  - `Badge.tsx` - Status badges

#### Day 3-4: Author Dashboard
- [ ] **Create Author Dashboard Page**
  ```typescript
  // src/pages/AuthorDashboard.tsx
  import { useWallet } from '@solana/wallet-adapter-react';
  import { useEffect, useState } from 'react';
  import { api } from '../lib/api';

  export function AuthorDashboard() {
    const { publicKey } = useWallet();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
      if (publicKey) {
        loadProjects();
      }
    }, [publicKey]);

    async function loadProjects() {
      const data = await api.get('/api/projects/my-projects');
      setProjects(data);
    }

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Projects</h1>
        <button onClick={() => setShowCreateModal(true)}>
          + New Project
        </button>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Create Project Modal**
  - Form: title, description, visibility, price
  - Calls backend API + Team B's smart contract
  - Shows loading state during transaction

#### Day 5: Editor Integration
- [ ] **Install Lexical Editor**
  ```bash
  npm install lexical @lexical/react @lexical/markdown
  ```

- [ ] **Create Editor Component**
  ```typescript
  // src/components/editor/ManuscriptEditor.tsx
  import { LexicalComposer } from '@lexical/react/LexicalComposer';
  import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
  import { ContentEditable } from '@lexical/react/LexicalContentEditable';
  import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

  export function ManuscriptEditor({ chapterId, onSave }) {
    const initialConfig = {
      namespace: 'CryptInkEditor',
      theme: {
        // Custom theme
      },
      onError: (error) => console.error(error)
    };

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-content" />}
          placeholder={<div>Start writing your chapter...</div>}
        />
        <HistoryPlugin />
        <AutoSavePlugin chapterId={chapterId} onSave={onSave} />
      </LexicalComposer>
    );
  }
  ```

- [ ] **Add Auto-Save Feature**
  - Save draft every 30 seconds to backend
  - Show "Saving..." indicator

---

### Backend API Endpoints (7-8 hours)

#### Day 1-2: Project Endpoints
- [ ] **GET /api/projects** - List all public projects
  ```typescript
  app.get('/api/projects', async (req, reply) => {
    const projects = await prisma.project.findMany({
      where: { visibility: 'public' },
      include: {
        author: { select: { walletAddr: true, username: true } },
        _count: { select: { chapters: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return projects;
  });
  ```

- [ ] **GET /api/projects/:id** - Get project details
- [ ] **POST /api/projects** - Create new project (requires auth)
  ```typescript
  app.post('/api/projects', {
    onRequest: [app.authenticate]
  }, async (req, reply) => {
    const { title, description, visibility, price } = req.body as any;
    const userId = req.user.userId;

    // Create project in database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        visibility,
        price,
        authorId: userId,
        authorWallet: req.user.wallet,
        contractAddr: 'pending' // Team B will update after on-chain creation
      }
    });

    // Trigger Team B's smart contract creation
    // This is handled by Team B's service

    return project;
  });
  ```

- [ ] **PUT /api/projects/:id** - Update project
- [ ] **DELETE /api/projects/:id** - Delete project

#### Day 3-4: Chapter Endpoints
- [ ] **GET /api/projects/:id/chapters** - List chapters
- [ ] **POST /api/projects/:id/chapters** - Create chapter
  ```typescript
  app.post('/api/projects/:projectId/chapters', {
    onRequest: [app.authenticate]
  }, async (req, reply) => {
    const { projectId } = req.params as any;
    const { title, content } = req.body as any;

    // 1. Encrypt content (client-side, but backend coordinates)
    // 2. Upload to Arweave (Team A responsibility)
    const encryptedUri = await uploadToArweave(content);

    // 3. Calculate content hash
    const contentHash = calculateHash(content);

    // 4. Save to database
    const chapter = await prisma.chapter.create({
      data: {
        projectId,
        title,
        encryptedUri,
        contentHash,
        version: 1,
        authorWallet: req.user.wallet
      }
    });

    // 5. Team B creates on-chain record

    return chapter;
  });
  ```

- [ ] **GET /api/chapters/:id/content** - Get chapter content (decrypted)
- [ ] **PUT /api/chapters/:id** - Update chapter

#### Day 5: User/Admin Endpoints
- [ ] **GET /api/users/me** - Get current user profile
- [ ] **PUT /api/users/me** - Update profile
- [ ] **GET /api/admin/metrics** - Transaction metrics (for monitoring)

---

## 🎯 Week 3: Storage & AI (10-12 hours)

### Storage Integration (5-6 hours)

#### Day 1-2: Arweave Setup
- [ ] **Install Arweave SDK**
  ```bash
  npm install arweave
  ```

- [ ] **Create Storage Service**
  ```typescript
  // backend/src/services/storage.ts
  import Arweave from 'arweave';

  export class StorageService {
    private arweave: Arweave;

    constructor() {
      this.arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      });
    }

    async uploadEncryptedChapter(
      encryptedContent: Buffer,
      metadata: {
        projectId: string;
        chapterId: string;
        version: number;
      }
    ): Promise<string> {
      // Create Arweave transaction
      const transaction = await this.arweave.createTransaction({
        data: encryptedContent
      });

      // Add tags
      transaction.addTag('Content-Type', 'application/octet-stream');
      transaction.addTag('App-Name', 'CryptInk');
      transaction.addTag('Project-ID', metadata.projectId);
      transaction.addTag('Chapter-ID', metadata.chapterId);
      transaction.addTag('Version', metadata.version.toString());

      // Sign and post
      await this.arweave.transactions.sign(transaction);
      await this.arweave.transactions.post(transaction);

      // Return Arweave URI
      return `ar://${transaction.id}`;
    }

    async downloadEncryptedChapter(arweaveUri: string): Promise<Buffer> {
      const txId = arweaveUri.replace('ar://', '');
      const data = await this.arweave.transactions.getData(txId, {
        decode: true,
        string: false
      });

      return Buffer.from(data as Uint8Array);
    }
  }

  export const storageService = new StorageService();
  ```

#### Day 3: Frontend Upload UI
- [ ] **Create Upload Component**
  ```typescript
  // src/components/editor/UploadProgress.tsx
  export function UploadProgress({ file, onComplete }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('encrypting'); // encrypting, uploading, complete

    useEffect(() => {
      uploadFile();
    }, []);

    async function uploadFile() {
      // 1. Encrypt (Team B provides encryption function)
      setStatus('encrypting');
      const encrypted = await encryptContent(file);
      setProgress(30);

      // 2. Upload to Arweave
      setStatus('uploading');
      const uri = await api.post('/api/storage/upload', { content: encrypted });
      setProgress(100);

      setStatus('complete');
      onComplete(uri);
    }

    return (
      <div className="upload-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <p>{status === 'encrypting' ? 'Encrypting...' : 'Uploading to Arweave...'}</p>
      </div>
    );
  }
  ```

---

### AI Services Integration (5-6 hours)

#### Day 1-2: OpenAI Co-Writing Assistant
- [ ] **Install OpenAI SDK**
  ```bash
  npm install openai
  ```

- [ ] **Create AI Service**
  ```typescript
  // backend/src/services/ai.ts
  import OpenAI from 'openai';

  export class AIService {
    private openai: OpenAI;

    constructor() {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    async getSuggestions(
      context: string,
      userInput: string
    ): Promise<string[]> {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful writing assistant for authors. Provide concise, creative suggestions.'
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nUser is writing: ${userInput}\n\nProvide 3 different ways to continue this sentence.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      return completion.choices.map(c => c.message.content || '');
    }

    async checkGrammar(text: string): Promise<{ corrections: Array<{ original: string; suggestion: string; reason: string }> }> {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a grammar and style checker. Return corrections in JSON format.'
          },
          {
            role: 'user',
            content: `Check this text for grammar and style issues:\n\n${text}`
          }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    }

    async detectPlagiarism(text: string): Promise<{ originalityScore: number; matches: any[] }> {
      // 1. Generate embeddings
      const embedding = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });

      // 2. Search vector database (Pinecone - would need setup)
      // For now, return mock data
      return {
        originalityScore: 95,
        matches: []
      };
    }
  }

  export const aiService = new AIService();
  ```

#### Day 2: AI API Endpoints
- [ ] **POST /api/ai/suggestions** - Get writing suggestions
  ```typescript
  app.post('/api/ai/suggestions', {
    onRequest: [app.authenticate]
  }, async (req, reply) => {
    const { context, userInput } = req.body as any;
    const suggestions = await aiService.getSuggestions(context, userInput);
    return { suggestions };
  });
  ```

- [ ] **POST /api/ai/grammar-check** - Check grammar
- [ ] **POST /api/ai/plagiarism-check** - Check plagiarism

#### Day 3: Frontend AI Integration
- [ ] **Create AI Suggestion Component**
  ```typescript
  // src/components/editor/AISuggestions.tsx
  export function AISuggestions({ selectedText, onAccept }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getSuggestions() {
      setLoading(true);
      const response = await api.post('/api/ai/suggestions', {
        context: 'previous paragraph context...',
        userInput: selectedText
      });
      setSuggestions(response.suggestions);
      setLoading(false);
    }

    return (
      <div className="ai-suggestions">
        <button onClick={getSuggestions}>Get AI Suggestions</button>
        {loading && <div>Loading...</div>}
        <ul>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => onAccept(s)}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  ```

#### Day 4: ASI Agent API Integration
- [ ] **Create ASI Agent Client**
  ```typescript
  // backend/src/services/asi-agents.ts
  export class ASIAgentService {
    async getReputationScore(walletAddr: string): Promise<number> {
      // Call Team B's ASI agent endpoint
      const response = await fetch(`${process.env.ASI_AGENT_URL}/reputation/${walletAddr}`);
      const data = await response.json();
      return data.score;
    }

    async notifyContribution(walletAddr: string, projectId: string, type: 'pr_merged' | 'review_submitted') {
      // Webhook to ASI agent
      await fetch(`${process.env.ASI_AGENT_URL}/webhook/contribution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddr, projectId, type })
      });
    }
  }

  export const asiAgentService = new ASIAgentService();
  ```

- [ ] **Display Reputation Scores in UI**
  ```typescript
  // src/components/AuthorCard.tsx
  export function AuthorCard({ walletAddr }) {
    const [reputation, setReputation] = useState(0);

    useEffect(() => {
      api.get(`/api/users/${walletAddr}/reputation`).then(setReputation);
    }, [walletAddr]);

    return (
      <div className="author-card">
        <p>Reputation: {reputation}/1000</p>
        <div className="reputation-bar" style={{ width: `${reputation / 10}%` }} />
      </div>
    );
  }
  ```

---

## 🎯 Week 4: Polish & Integration (8-10 hours)

### Frontend Polish (4-5 hours)

#### Day 1: Reader Browse Page
- [ ] **Create Browse Page**
  ```typescript
  // src/pages/ReaderBrowse.tsx
  export function ReaderBrowse() {
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({ genre: 'all', price: 'all' });

    useEffect(() => {
      loadProjects();
    }, [filters]);

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Discover Books</h1>

        <Filters onChange={setFilters} />

        <div className="grid grid-cols-4 gap-4 mt-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onPurchase={() => handlePurchase(project.id)}
            />
          ))}
        </div>
      </div>
    );
  }
  ```

#### Day 2: Purchase Flow
- [ ] **Create Purchase Modal**
  - Show project details
  - Display price in SOL/USDC
  - Connect to Team B's smart contract for payment
  - Show transaction progress
  - Redirect to reading page after success

#### Day 3: Royalty Dashboard
- [ ] **Create Royalty Dashboard with Charts**
  ```typescript
  // src/pages/RoyaltyDashboard.tsx
  import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

  export function RoyaltyDashboard() {
    const [earnings, setEarnings] = useState([]);

    return (
      <div>
        <h1>Your Earnings</h1>
        <LineChart width={800} height={400} data={earnings}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#14F195" />
        </LineChart>
      </div>
    );
  }
  ```

---

### Backend Polish (2-3 hours)

#### Day 1: WebSocket for Real-time Collaboration
- [ ] **Set up WebSocket Server**
  ```typescript
  // backend/src/server.ts
  import fastifyWebSocket from '@fastify/websocket';

  app.register(fastifyWebSocket);

  app.get('/ws/editor/:chapterId', { websocket: true }, (connection, req) => {
    const { chapterId } = req.params as any;

    connection.socket.on('message', (message) => {
      // Broadcast to other collaborators
      broadcastToChapter(chapterId, message);
    });
  });
  ```

#### Day 2: Caching with Redis
- [ ] **Implement Redis Caching**
  ```typescript
  // backend/src/lib/redis.ts
  import Redis from 'ioredis';

  export const redis = new Redis(process.env.REDIS_URL);

  export async function cacheGet(key: string) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  export async function cacheSet(key: string, value: any, ttl = 300) {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
  ```

- [ ] **Cache Project List**
  ```typescript
  app.get('/api/projects', async (req, reply) => {
    const cached = await cacheGet('projects:public');
    if (cached) return cached;

    const projects = await prisma.project.findMany({...});
    await cacheSet('projects:public', projects, 60); // Cache for 1 min
    return projects;
  });
  ```

---

### Testing (2 hours)

#### Day 1: API Tests
- [ ] **Install Testing Libraries**
  ```bash
  npm install -D vitest supertest
  ```

- [ ] **Write API Tests**
  ```typescript
  // backend/src/routes/__tests__/projects.test.ts
  import { build } from '../../server';
  import { describe, it, expect, beforeAll, afterAll } from 'vitest';

  describe('Projects API', () => {
    let app;

    beforeAll(async () => {
      app = await build();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should list public projects', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/projects'
      });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    });

    it('should create project with valid auth', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/projects',
        headers: {
          authorization: 'Bearer valid-token'
        },
        payload: {
          title: 'Test Book',
          description: 'A test book',
          visibility: 'public'
        }
      });

      expect(response.statusCode).toBe(201);
    });
  });
  ```

#### Day 2: Frontend Tests
- [ ] **Component Tests**
  ```typescript
  // frontend/src/components/__tests__/ProjectCard.test.tsx
  import { render, screen } from '@testing-library/react';
  import { ProjectCard } from '../ProjectCard';

  describe('ProjectCard', () => {
    it('displays project title', () => {
      render(<ProjectCard project={{ title: 'Test Book', author: { walletAddr: '123' } }} />);
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });
  ```

---

## 🤝 Collaboration Points with Team B

### Critical Handoffs

#### 1. **Smart Contract Integration** (Week 2)
**What Team A Needs:**
- Smart contract program IDs (deployed to devnet)
- IDL files for TypeScript types
- Example transactions for:
  - Creating a project
  - Publishing a chapter
  - Purchasing access

**Team B Provides:**
```typescript
// shared/solana-config.ts
export const PROGRAM_IDS = {
  PROJECT_MANAGER: 'B9x...',
  ACCESS_CONTROL: 'C3y...',
  ROYALTY_SPLITTER: 'D4z...'
};

// Example usage function
export async function createProjectOnChain(title: string, metadataUri: string) {
  // Team B implements this
}
```

#### 2. **Encryption Integration** (Week 3)
**What Team A Needs:**
- Client-side encryption functions
- Arcium SDK integration examples
- Decryption flow for authorized users

**Team B Provides:**
```typescript
// shared/encryption.ts
export async function encryptContent(content: string): Promise<{ encrypted: Buffer; keyId: string }>;
export async function decryptContent(encrypted: Buffer, keyId: string): Promise<string>;
```

#### 3. **Transaction Monitoring** (Week 3-4)
**What Team A Needs:**
- Transaction status polling
- Sanctum RPC integration for sending transactions

**Team B Provides:**
```typescript
// shared/sanctum-client.ts
export async function sendTransaction(tx: Transaction, priority: Priority): Promise<string>;
```

---

## 📊 Success Metrics

### Week 1 Checklist
- [ ] Frontend project initialized with wallet connection working
- [ ] Backend API running with authentication
- [ ] Database schema created and migrated
- [ ] Basic UI components built

### Week 2 Checklist
- [ ] Author can create a project (UI + API)
- [ ] Editor integration functional
- [ ] Chapter creation working (without on-chain part)
- [ ] API endpoints for projects/chapters complete

### Week 3 Checklist
- [ ] Arweave upload functional
- [ ] AI suggestions working in editor
- [ ] ASI reputation scores displayed
- [ ] Reader browse page complete

### Week 4 Checklist
- [ ] Purchase flow complete (UI side)
- [ ] Royalty dashboard with charts
- [ ] Real-time collaboration (basic)
- [ ] All API tests passing
- [ ] Frontend deployed to Vercel

---

## 🛠️ Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Thunder Client (API testing)

### Environment Variables
```bash
# Backend .env
DATABASE_URL="postgresql://user:pass@localhost:5432/cryptink"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="sk-..."
ARWEAVE_WALLET_KEY="path/to/wallet.json"
ASI_AGENT_URL="http://localhost:5001"

# Frontend .env
VITE_API_URL="http://localhost:3000"
VITE_SOLANA_NETWORK="devnet"
```

---

## 📚 Resources

### Documentation
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Fastify Documentation](https://www.fastify.io/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Lexical Editor](https://lexical.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Arweave Docs](https://docs.arweave.org/)

### Tutorials
- [Building with Solana Wallet Adapter](https://solanacookbook.com/references/wallet-adapter.html)
- [Fastify + Prisma Tutorial](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

---

## ⚠️ Common Pitfalls

### Issue 1: CORS Errors
**Solution:** Configure CORS in Fastify
```typescript
app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
});
```

### Issue 2: Wallet Connection Not Persisting
**Solution:** Use `autoConnect` in WalletProvider

### Issue 3: Large File Uploads Failing
**Solution:** Increase Fastify body limit
```typescript
app.register(fastifyMultipart, {
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});
```

---

**Questions for Team B?** Create issues in shared repo with label `team-a-blocked`
