# 📖 CryptInk

> **Collaborative, Secure, and Monetized Writing Platform on Solana**

[![Solana](https://img.shields.io/badge/Solana-Blockchain-14F195?logo=solana&logoColor=white)](https://solana.com)
[![Arcium](https://img.shields.io/badge/Powered%20by-Arcium-6366f1)](https://arcium.com)
[![ASI](https://img.shields.io/badge/AI-ASI%20Agents-FF6B6B)](https://fetch.ai)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Solana-Cypherpunk%20Hackathon-blueviolet)](https://solana.com/hackathon)

**CryptInk** is a decentralized collaboration platform for authors, researchers, and book writers. It combines the transparency of GitHub, the monetization of Web3, and the security of encrypted compute to enable version-controlled collaboration, automatic royalty distribution, and tokenized reader access.

---

## 🎯 Problem Statement

Traditional collaborative writing platforms suffer from critical flaws:

- **No True Ownership** – Authors risk plagiarism, unauthorized distribution, and content theft
- **Opaque Collaboration** – Co-authorship management lacks transparency and verifiable contribution tracking
- **Limited Monetization** – Writers struggle to monetize drafts, early access, or collaborative works
- **Centralized Control** – Platforms can censor, delete, or modify content without consent
- **No Fair Revenue Split** – Manual royalty distribution is error-prone and trust-dependent

---

## 💡 Solution

CryptInk leverages Solana's speed and low-cost transactions to deliver:

✅ **GitHub-like Version Control** – Track every edit transparently on-chain
✅ **Encrypted Manuscripts** – Arcium-powered confidential compute protects content
✅ **Smart Contract Royalties** – Automatic, trustless revenue distribution
✅ **Tokenized Access** – Readers pay for exclusive drafts or full publications
✅ **AI-Powered Collaboration** – ASI agents manage reputation and content quality
✅ **Decentralized Storage** – Arweave/IPFS ensures permanent, censorship-resistant archives

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CRYPTINK PLATFORM                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   FRONTEND       │        │    BACKEND       │        │  BLOCKCHAIN      │
│                  │        │                  │        │                  │
│  React + Vite    │◄──────►│  Node.js +       │◄──────►│  Solana (Anchor) │
│  Solana Wallet   │  REST  │  Fastify API     │  RPC   │  Smart Contracts │
│  UI/UX Layer     │        │  PostgreSQL DB   │        │  Programs        │
└──────────────────┘        └──────────────────┘        └──────────────────┘
         │                           │                            │
         │                           │                            │
         ▼                           ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  ENCRYPTION      │        │   AI LAYER       │        │   STORAGE        │
│                  │        │                  │        │                  │
│  Arcium MXE      │        │  OpenAI API      │        │  Arweave/IPFS    │
│  Confidential    │        │  ASI Agents      │        │  Encrypted       │
│  Compute         │        │  Fetch.ai        │        │  Manuscripts     │
└──────────────────┘        └──────────────────┘        └──────────────────┘
         │                           │                            │
         └───────────────────────────┴────────────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  SPONSOR TRACKS     │
                          │                     │
                          │  • Arcium           │
                          │  • Adevar Labs      │
                          │  • ASI Agents       │
                          │  • Sanctum Gateway  │
                          └─────────────────────┘
```

---

## 🎨 Core Features

### 👥 For Authors

#### 1. Project Creation & Management
- Create **Books**, **Research Papers**, or **Series** (like GitHub repositories)
- Invite co-authors, editors, and reviewers via Solana wallet addresses
- Set visibility rules: `Public Preview`, `Paid Access`, or `Private`
- Manage chapters as individual files with version history

#### 2. Version Control System
- Every edit creates a verifiable **commit** on-chain
- Track changes with timestamps, author signatures, and content hashes
- Rollback to previous versions with full audit trail
- Branch/fork manuscripts for experimental edits

#### 3. Smart Contract Royalties
- Define revenue split percentages for co-authors
- Automatic distribution when readers purchase access
- Support for milestone-based payments (e.g., 30% on draft, 70% on publish)
- Real-time royalty dashboard

### 🧩 For Collaborators

#### 1. Contribution System
- Submit **Pull Requests** for chapter additions or edits
- Propose changes with side-by-side diff view
- Earn co-authorship tokens when contributions are merged
- Build on-chain reputation through verified contributions

#### 2. Approval Workflow
- Authors review and approve/reject proposed changes
- Multi-signature voting for team projects
- Comment threads for feedback and discussion
- Merit-based contributor ranking

### 📚 For Readers

#### 1. Content Discovery
- Browse trending books, papers, and series
- Filter by genre, author reputation, and price
- Follow favorite authors for updates
- Social features: likes, bookmarks, reading lists

#### 2. Monetized Access
Readers pay in SOL or USDC for:
- **Sneak Peeks** – Early access to draft chapters ($0.50 - $2)
- **Full Access** – Complete manuscript when published ($5 - $50)
- **NFT Editions** – Limited signed digital copies with special perks
- **Chapter Bundles** – Purchase specific sections

#### 3. Access Control
- Purchase generates an **Access NFT** stored in wallet
- Smart contract validates NFT ownership before decryption
- Transferable access tokens (optional per author)
- Subscription models for serial content

### 🔐 Security & Encryption

#### Arcium Integration (Core Privacy Layer)
```
┌─────────────────────────────────────────────────────────────┐
│                    ARCIUM ENCRYPTION FLOW                    │
└─────────────────────────────────────────────────────────────┘

Author Writes Draft
        │
        ▼
┌───────────────────┐
│  Client-Side      │  ← Encrypt with symmetric key (AES-256)
│  Encryption       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Upload to        │  ← Store encrypted manuscript
│  Arweave/IPFS     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Arcium MXE       │  ← Symmetric key stored in confidential compute
│  (Key Management) │     Only accessible by authorized programs
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Solana Smart     │  ← Access control: who can decrypt?
│  Contract         │     NFT ownership verification
└─────────┬─────────┘
          │
Reader Pays for Access
          │
          ▼
┌───────────────────┐
│  Arcium Releases  │  ← Decryption key provided to authorized reader
│  Decryption Key   │     via confidential compute execution
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Reader Decrypts  │  ← Manuscript rendered in browser
│  & Reads          │
└───────────────────┘
```

**Key Security Features:**
- Manuscripts never exist unencrypted on public networks
- Decryption keys managed by Arcium's Multiparty Execution (MXE)
- Zero-knowledge access verification
- On-chain audit logs for all decryption events

---

## 🤖 AI & ASI Agent Integration

### AI Co-Writing Assistant (OpenAI/Anthropic)
```javascript
// Real-time writing assistance
const aiAssistant = {
  grammarCheck: true,
  styleImprovement: true,
  plotSuggestions: true,
  citationGeneration: true
};

// Every AI contribution is logged on-chain as a "non-human contributor"
// with transparent attribution
```

**Features:**
- Real-time grammar and style corrections
- Context-aware writing suggestions
- Plot hole detection for fiction
- Academic citation formatting (APA, MLA, Chicago)
- Plagiarism detection via vector embeddings

### ASI Agent Reputation System (Fetch.ai + SingularityNET)

```
┌──────────────────────────────────────────────────────────┐
│               ASI AGENT ARCHITECTURE                      │
└──────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Reputation     │     │  Quality        │     │  Plagiarism     │
│  Agent          │     │  Scoring Agent  │     │  Detection      │
│                 │     │                 │     │  Agent          │
│  Tracks:        │     │  Analyzes:      │     │  Checks:        │
│  - Merged PRs   │     │  - Readability  │     │  - Originality  │
│  - Reviews      │     │  - Structure    │     │  - Citations    │
│  - Disputes     │     │  - Engagement   │     │  - Duplication  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  On-Chain Reputation   │
                    │  Score (0-1000)        │
                    │                        │
                    │  Influences:           │
                    │  - Discovery ranking   │
                    │  - Revenue share       │
                    │  - Collaboration invite│
                    └────────────────────────┘
```

**Agent Responsibilities:**
1. **Reputation Agent** – Calculates contributor trust scores based on:
   - Number of accepted contributions
   - Quality ratings from co-authors
   - Dispute resolution history

2. **Quality Scoring Agent** – Autonomous content evaluation:
   - Readability metrics (Flesch-Kincaid, etc.)
   - Structural consistency
   - Reader engagement analytics

3. **Plagiarism Detection Agent** – Runs on manuscript submission:
   - Vector similarity search against known works
   - Citation verification
   - Originality percentage calculation

**Integration:**
```javascript
// ASI Agent endpoint (Fetch.ai)
const reputationAgent = await fetchAgent.deploy({
  name: "CryptInkReputationOracle",
  chain: "solana",
  triggers: ["pr_merged", "review_submitted", "dispute_resolved"]
});

// Agent updates on-chain reputation score
// Smart contract reads score for access control decisions
```

---

## 🛠️ Tech Stack

### Frontend
```json
{
  "framework": "React 18+",
  "bundler": "Vite 5.x",
  "language": "TypeScript",
  "styling": "TailwindCSS + HeadlessUI",
  "web3": [
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-wallets",
    "@solana/web3.js"
  ],
  "editor": "Lexical (Meta's text editor framework)",
  "charts": "Recharts (royalty dashboards)",
  "state": "Zustand (lightweight state management)"
}
```

**Key Libraries:**
- `@solana/wallet-adapter-react-ui` – Wallet connection UI
- `@coral-xyz/anchor` – Interact with Solana programs
- `lexical` – Rich text editor with version control
- `diff-match-patch` – Show edit differences
- `recharts` – Royalty and analytics visualization

### Backend
```json
{
  "runtime": "Node.js 20+",
  "framework": "Fastify 4.x",
  "language": "TypeScript",
  "database": "PostgreSQL 16",
  "orm": "Prisma",
  "cache": "Redis",
  "queue": "BullMQ (for async tasks)"
}
```

**API Responsibilities:**
- User authentication (wallet signature verification)
- Manuscript metadata storage (PostgreSQL)
- Caching decryption keys temporarily (Redis)
- Job queue for AI processing (plagiarism checks)
- WebSocket server for real-time collaboration

**Database Schema (Prisma):**
```prisma
model Project {
  id            String   @id @default(cuid())
  title         String
  authorWallet  String
  contractAddr  String   @unique
  createdAt     DateTime @default(now())
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
  createdAt     DateTime @default(now())
  project       Project  @relation(fields: [projectId], references: [id])
}

model Collaborator {
  id            String   @id @default(cuid())
  projectId     String
  walletAddr    String
  role          String   // author, editor, reviewer
  revenueShare  Float    // percentage (0-100)
  reputation    Int      @default(0)
  project       Project  @relation(fields: [projectId], references: [id])
}
```

### Blockchain (Solana)
```json
{
  "framework": "Anchor 0.30+",
  "language": "Rust",
  "cluster": "Devnet → Mainnet",
  "programs": [
    "project_manager",
    "access_control",
    "royalty_splitter"
  ]
}
```

**Smart Contract Programs:**

#### 1. Project Manager Program
```rust
// programs/project-manager/src/lib.rs
use anchor_lang::prelude::*;

#[program]
pub mod project_manager {
    pub fn create_project(
        ctx: Context<CreateProject>,
        title: String,
        metadata_uri: String,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        project.authority = ctx.accounts.author.key();
        project.title = title;
        project.metadata_uri = metadata_uri;
        project.bump = ctx.bumps.project;
        Ok(())
    }

    pub fn add_chapter(
        ctx: Context<AddChapter>,
        encrypted_uri: String,
        content_hash: [u8; 32],
    ) -> Result<()> {
        let chapter = &mut ctx.accounts.chapter;
        chapter.project = ctx.accounts.project.key();
        chapter.encrypted_uri = encrypted_uri;
        chapter.content_hash = content_hash;
        chapter.version = ctx.accounts.project.chapter_count + 1;
        chapter.author = ctx.accounts.author.key();
        chapter.timestamp = Clock::get()?.unix_timestamp;

        ctx.accounts.project.chapter_count += 1;
        Ok(())
    }
}

#[account]
pub struct Project {
    pub authority: Pubkey,
    pub title: String,
    pub metadata_uri: String,
    pub chapter_count: u32,
    pub bump: u8,
}

#[account]
pub struct Chapter {
    pub project: Pubkey,
    pub encrypted_uri: String,
    pub content_hash: [u8; 32],
    pub version: u32,
    pub author: Pubkey,
    pub timestamp: i64,
}
```

#### 2. Access Control Program
```rust
// programs/access-control/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

#[program]
pub mod access_control {
    pub fn purchase_access(
        ctx: Context<PurchaseAccess>,
        price: u64,
    ) -> Result<()> {
        // Transfer payment from reader to escrow
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.reader_token_account.to_account_info(),
                    to: ctx.accounts.escrow_account.to_account_info(),
                    authority: ctx.accounts.reader.to_account_info(),
                },
            ),
            price,
        )?;

        // Mint access NFT to reader
        let access_pass = &mut ctx.accounts.access_pass;
        access_pass.project = ctx.accounts.project.key();
        access_pass.owner = ctx.accounts.reader.key();
        access_pass.expires_at = None; // Permanent access
        access_pass.bump = ctx.bumps.access_pass;

        Ok(())
    }

    pub fn verify_access(
        ctx: Context<VerifyAccess>,
    ) -> Result<bool> {
        let access_pass = &ctx.accounts.access_pass;

        // Check if access pass exists and is valid
        if access_pass.project != ctx.accounts.project.key() {
            return Ok(false);
        }

        if let Some(expiry) = access_pass.expires_at {
            if Clock::get()?.unix_timestamp > expiry {
                return Ok(false);
            }
        }

        Ok(true)
    }
}

#[account]
pub struct AccessPass {
    pub project: Pubkey,
    pub owner: Pubkey,
    pub expires_at: Option<i64>,
    pub bump: u8,
}
```

#### 3. Royalty Splitter Program
```rust
// programs/royalty-splitter/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

#[program]
pub mod royalty_splitter {
    pub fn distribute_royalties(
        ctx: Context<DistributeRoyalties>,
        total_amount: u64,
    ) -> Result<()> {
        let config = &ctx.accounts.royalty_config;

        for (i, beneficiary) in ctx.remaining_accounts.iter().enumerate() {
            if i >= config.beneficiaries.len() {
                break;
            }

            let share = (total_amount as u128)
                .checked_mul(config.shares[i] as u128)
                .unwrap()
                .checked_div(10000) // basis points
                .unwrap() as u64;

            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.escrow_account.to_account_info(),
                        to: beneficiary.to_account_info(),
                        authority: ctx.accounts.escrow_authority.to_account_info(),
                    },
                    &[&[
                        b"escrow",
                        config.key().as_ref(),
                        &[config.escrow_bump]
                    ]]
                ),
                share,
            )?;
        }

        Ok(())
    }
}

#[account]
pub struct RoyaltyConfig {
    pub project: Pubkey,
    pub beneficiaries: Vec<Pubkey>,
    pub shares: Vec<u16>, // basis points (10000 = 100%)
    pub escrow_bump: u8,
}
```

### Storage
```json
{
  "primary": "Arweave (permanent storage)",
  "alternative": "IPFS + Pinata/Web3.Storage",
  "encryption": "AES-256-GCM (client-side)",
  "metadata": "On-chain (Solana accounts)"
}
```

**Upload Flow:**
```javascript
// Upload encrypted manuscript to Arweave
import Arweave from 'arweave';
import { encrypt } from './encryption';

async function uploadChapter(content, symmetricKey) {
  // 1. Encrypt content client-side
  const encrypted = await encrypt(content, symmetricKey);

  // 2. Upload to Arweave
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  const transaction = await arweave.createTransaction({
    data: encrypted
  });

  transaction.addTag('Content-Type', 'application/octet-stream');
  transaction.addTag('App-Name', 'CryptInk');
  transaction.addTag('Version', '1.0');

  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);

  // 3. Store symmetric key in Arcium MXE
  await arcium.storeKey(transaction.id, symmetricKey);

  // 4. Store metadata on Solana
  await program.methods
    .addChapter(transaction.id, contentHash)
    .accounts({ /* ... */ })
    .rpc();

  return transaction.id;
}
```

### Encryption (Arcium)
```json
{
  "technology": "Arcium Multiparty Execution (MXE)",
  "encryption": "AES-256-GCM (symmetric)",
  "keyManagement": "Confidential compute",
  "accessControl": "Solana smart contracts"
}
```

**Arcium Integration:**
```typescript
import { ArciumSDK } from '@arcium/sdk';

const arcium = new ArciumSDK({
  network: 'mainnet',
  apiKey: process.env.ARCIUM_API_KEY
});

// Store encryption key in confidential compute
async function storeKey(chapterId: string, key: Uint8Array) {
  return await arcium.vault.store({
    id: chapterId,
    secret: key,
    policy: {
      // Only release key if user has access NFT
      type: 'solana-nft',
      program: ACCESS_CONTROL_PROGRAM_ID,
      check: 'verify_access'
    }
  });
}

// Retrieve key for authorized user
async function getKey(chapterId: string, userWallet: string) {
  return await arcium.vault.retrieve({
    id: chapterId,
    requester: userWallet
  });
}
```

### AI Services
```json
{
  "coWriting": "OpenAI GPT-4o / Anthropic Claude 3.5",
  "plagiarism": "OpenAI Embeddings + Pinecone vector DB",
  "agents": "Fetch.ai + SingularityNET",
  "hosting": "Self-hosted microservices"
}
```

---

## 🎯 Sponsor Track Integration

### 1. Arcium (⭐⭐⭐⭐⭐ - Must Integrate)
**Role:** Core privacy layer

**Implementation:**
- All manuscripts encrypted client-side before upload
- Symmetric keys stored in Arcium's confidential compute
- Access control enforced by Solana smart contracts
- Decryption keys only released to verified NFT holders

**Code Example:**
```typescript
// Encrypt manuscript before upload
const symmetricKey = crypto.randomBytes(32);
const encrypted = await arcium.encrypt(manuscript, symmetricKey);

// Store key in Arcium MXE with access policy
await arcium.vault.store({
  id: chapterId,
  secret: symmetricKey,
  policy: {
    type: 'smart-contract',
    program: ACCESS_CONTROL_PROGRAM,
    instruction: 'verify_access'
  }
});
```

**Judging Criteria Alignment:**
- Privacy-preserving manuscript storage
- Zero-knowledge access verification
- Confidential compute for key management

---

### 2. Adevar Labs (⭐⭐⭐⭐☆ - Documentation & Audit)
**Role:** Security audit framework

**Implementation:**
- Smart contract security review documentation
- Architecture diagrams for auditors
- Threat model documentation
- Security best practices checklist

**Deliverables:**
- `docs/security-audit.md` – Comprehensive security analysis
- `docs/threat-model.md` – Attack vectors and mitigations
- `docs/architecture.md` – System design for review
- Test coverage reports (>80% for smart contracts)

**No code changes required** – Focus on documentation quality

---

### 3. ASI Agents (⭐⭐⭐⭐☆ - AI Reputation System)
**Role:** Autonomous agents for reputation and quality

**Implementation:**
- Deploy Fetch.ai agents as microservices
- Agents monitor on-chain events (PR merges, reviews)
- Calculate reputation scores algorithmically
- Update scores on-chain via Solana CPI

**Agent Architecture:**
```python
# Fetch.ai agent (Python)
from fetchai.crypto import Entity
from fetchai.ledger.api import LedgerApi

class ReputationAgent:
    def __init__(self, solana_rpc):
        self.entity = Entity()
        self.solana = solana_rpc

    async def calculate_reputation(self, author_wallet):
        # Fetch on-chain contribution data
        contributions = await self.solana.get_contributions(author_wallet)

        # Calculate score (0-1000)
        score = (
            contributions['merged_prs'] * 10 +
            contributions['positive_reviews'] * 5 -
            contributions['disputes'] * 15
        )

        # Update on-chain
        await self.solana.update_reputation(author_wallet, score)

        return score

# Deploy agent
agent = ReputationAgent(solana_rpc_url)
await agent.run()
```

**Integration Points:**
- Webhook triggers from backend on contribution events
- Agent queries Solana for historical data
- Updates reputation PDA account via CPI

---

### 4. Sanctum Gateway (⭐⭐⭐☆☆ - Transaction Reliability)
**Role:** Reliable transaction submission

**Implementation:**
- Use Sanctum RPC for critical publishing transactions
- Fallback mechanism if primary RPC fails
- Transaction confirmation monitoring

**Code Example:**
```typescript
import { Connection } from '@solana/web3.js';

const sanctumRpc = new Connection('https://gateway.sanctum.so/rpc', {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000
});

// Use for critical transactions (publishing, royalty distribution)
async function publishChapter(tx) {
  try {
    const signature = await sanctumRpc.sendTransaction(tx, {
      skipPreflight: false,
      maxRetries: 5
    });

    await sanctumRpc.confirmTransaction(signature, 'finalized');
    return signature;
  } catch (error) {
    // Fallback to Helius/Quicknode
    return await fallbackRpc.sendTransaction(tx);
  }
}
```

**Light Integration** – Used for transaction submission only

---

## 📊 User Flows

### Author Flow
```mermaid
graph TD
    A[Connect Wallet] --> B[Create New Project]
    B --> C[Set Title & Metadata]
    C --> D[Write First Chapter]
    D --> E[Encrypt Content Client-Side]
    E --> F[Upload to Arweave]
    F --> G[Store Encryption Key in Arcium]
    G --> H[Create On-Chain Chapter Record]
    H --> I{Invite Collaborators?}
    I -->|Yes| J[Add Co-Authors with Revenue %]
    I -->|No| K[Set Access Price]
    J --> K
    K --> L[Publish Project]
    L --> M[Readers Can Purchase Access]
    M --> N[Automatic Royalty Distribution]
```

### Reader Flow
```mermaid
graph TD
    A[Browse Projects] --> B[Select Book/Paper]
    B --> C[View Preview/Metadata]
    C --> D{Purchase Access?}
    D -->|Yes| E[Connect Wallet]
    D -->|No| Z[Exit]
    E --> F[Pay SOL/USDC]
    F --> G[Smart Contract Mints Access NFT]
    G --> H[Arcium Releases Decryption Key]
    H --> I[Download Encrypted Content from Arweave]
    I --> J[Decrypt Client-Side]
    J --> K[Read Manuscript]
    K --> L{Leave Review?}
    L -->|Yes| M[Submit On-Chain Review]
    L -->|No| N[Continue Reading]
```

### Collaborator Flow
```mermaid
graph TD
    A[Receive Collaboration Invite] --> B[Accept Invite]
    B --> C[Clone Project Metadata]
    C --> D[Read Encrypted Chapters via Access NFT]
    D --> E[Write New Chapter/Edit]
    E --> F[Submit Pull Request]
    F --> G[Author Reviews Changes]
    G --> H{Approve?}
    H -->|Yes| I[Merge On-Chain]
    H -->|No| J[Request Revisions]
    J --> E
    I --> K[ASI Agent Updates Reputation]
    K --> L[Revenue Share Adjusted]
    L --> M[Earn Co-Authorship Token]
```

---

## 🔒 Security Architecture

### Encryption Flow
```
┌─────────────────────────────────────────────────────────────┐
│                   END-TO-END ENCRYPTION                      │
└─────────────────────────────────────────────────────────────┘

Author's Browser                     Arcium MXE                 Arweave
─────────────────                    ─────────                  ────────
      │                                   │                         │
      │ 1. Write manuscript               │                         │
      ├──────────────────────────────────►│                         │
      │                                   │                         │
      │ 2. Generate symmetric key (AES)   │                         │
      │    Key = crypto.randomBytes(32)   │                         │
      │                                   │                         │
      │ 3. Encrypt locally                │                         │
      │    Cipher = AES-256-GCM(content)  │                         │
      │                                   │                         │
      │ 4. Upload encrypted content       │                         │
      ├───────────────────────────────────┼────────────────────────►│
      │                                   │                         │
      │ 5. Store key in Arcium            │                         │
      ├──────────────────────────────────►│                         │
      │                                   │ Store in secure enclave │
      │                                   │ with access policy      │
      │                                   │                         │
      │ 6. Create on-chain record (Solana)│                         │
      │    - Arweave hash                 │                         │
      │    - Content hash (SHA-256)       │                         │
      │    - Access price                 │                         │
      │                                   │                         │

Reader's Browser                     Arcium MXE                 Arweave
────────────────                     ─────────                  ────────
      │                                   │                         │
      │ 1. Purchase access (pay SOL)      │                         │
      │    → Mint Access NFT              │                         │
      │                                   │                         │
      │ 2. Request decryption key         │                         │
      ├──────────────────────────────────►│                         │
      │                                   │ Verify Access NFT       │
      │                                   │ via Smart Contract      │
      │                                   │                         │
      │ 3. Receive key (if authorized)    │                         │
      │◄──────────────────────────────────┤                         │
      │                                   │                         │
      │ 4. Download encrypted content     │                         │
      ├───────────────────────────────────┼────────────────────────►│
      │◄──────────────────────────────────┼─────────────────────────┤
      │                                   │                         │
      │ 5. Decrypt locally                │                         │
      │    Plain = AES-decrypt(Cipher)    │                         │
      │                                   │                         │
      │ 6. Display manuscript             │                         │
      │                                   │                         │
```

### Key Security Features
1. **Client-Side Encryption** – Content never exposed unencrypted
2. **Confidential Key Storage** – Arcium MXE protects symmetric keys
3. **Smart Contract Access Control** – On-chain verification before decryption
4. **Audit Logs** – All access attempts logged on-chain
5. **Content Integrity** – SHA-256 hashes prevent tampering

---

## 🚀 Deployment Guide

### Prerequisites
```bash
# Install dependencies
node -v  # v20+
pnpm -v  # v8+
rustc --version  # 1.75+
solana --version  # 1.18+
anchor --version  # 0.30+
```

### 1. Clone Repository
```bash
git clone https://github.com/your-username/cryptink.git
cd cryptink
```

### 2. Install Dependencies
```bash
# Frontend
cd frontend
pnpm install

# Backend
cd ../backend
pnpm install

# Solana programs
cd ../programs
pnpm install
```

### 3. Environment Configuration
```bash
# Backend (.env)
DATABASE_URL="postgresql://user:pass@localhost:5432/cryptink"
REDIS_URL="redis://localhost:6379"
SOLANA_RPC_URL="https://api.devnet.solana.com"
ARCIUM_API_KEY="your-arcium-api-key"
OPENAI_API_KEY="your-openai-api-key"
JWT_SECRET="your-secret-key"

# Frontend (.env)
VITE_SOLANA_NETWORK="devnet"
VITE_API_URL="http://localhost:3000"
VITE_PROGRAM_ID="your-program-id"
```

### 4. Database Setup
```bash
cd backend
pnpm prisma migrate dev
pnpm prisma generate
```

### 5. Build & Deploy Solana Programs
```bash
cd programs

# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Copy program IDs to frontend config
# programs/project-manager: <PROGRAM_ID_1>
# programs/access-control: <PROGRAM_ID_2>
# programs/royalty-splitter: <PROGRAM_ID_3>
```

### 6. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
pnpm dev  # http://localhost:3000

# Terminal 2: Frontend
cd frontend
pnpm dev  # http://localhost:5173

# Terminal 3: Redis (if not running)
redis-server
```

### 7. Test Smart Contracts
```bash
cd programs
anchor test
```

### 8. Production Deployment

#### Backend (Railway/Render)
```bash
# Build backend
cd backend
pnpm build

# Deploy (example: Railway)
railway up
```

#### Frontend (Vercel)
```bash
# Build frontend
cd frontend
pnpm build

# Deploy to Vercel
vercel --prod
```

#### Solana Programs (Mainnet)
```bash
# Switch to mainnet
solana config set --url mainnet-beta

# Deploy programs
anchor deploy --provider.cluster mainnet

# Verify program IDs
solana program show <PROGRAM_ID>
```

---

## 📁 Project Structure

```
cryptink/
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── editor/         # Lexical editor integration
│   │   │   ├── wallet/         # Solana wallet connection
│   │   │   └── dashboard/      # Author/reader dashboards
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/
│   │   │   ├── solana.ts       # Solana web3 utilities
│   │   │   ├── arcium.ts       # Arcium encryption SDK
│   │   │   └── api.ts          # Backend API client
│   │   ├── pages/              # Route pages
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Node.js + Fastify API
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   │   ├── projects.ts
│   │   │   ├── chapters.ts
│   │   │   └── auth.ts
│   │   ├── services/
│   │   │   ├── solana.ts       # Solana RPC interactions
│   │   │   ├── encryption.ts   # Arcium integration
│   │   │   ├── ai.ts           # OpenAI/ASI agents
│   │   │   └── storage.ts      # Arweave uploads
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── programs/                   # Solana programs (Anchor)
│   ├── project-manager/
│   │   ├── src/
│   │   │   └── lib.rs
│   │   └── Cargo.toml
│   ├── access-control/
│   │   ├── src/
│   │   │   └── lib.rs
│   │   └── Cargo.toml
│   ├── royalty-splitter/
│   │   ├── src/
│   │   │   └── lib.rs
│   │   └── Cargo.toml
│   ├── tests/
│   │   └── integration.ts
│   └── Anchor.toml
│
├── agents/                     # ASI agents (Fetch.ai)
│   ├── reputation-agent/
│   │   └── agent.py
│   ├── quality-agent/
│   │   └── agent.py
│   └── plagiarism-agent/
│       └── agent.py
│
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── security-audit.md       # Adevar Labs deliverable
│   ├── threat-model.md
│   └── api-reference.md
│
├── scripts/                    # Deployment scripts
│   ├── deploy-programs.sh
│   ├── setup-db.sh
│   └── seed-data.ts
│
└── README.md                   # This file
```

---

## 🧪 Testing Strategy

### Smart Contract Tests (Anchor)
```typescript
// programs/tests/integration.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProjectManager } from "../target/types/project_manager";

describe("CryptInk Smart Contracts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ProjectManager as Program<ProjectManager>;

  it("Creates a new project", async () => {
    const [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("project"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createProject("My First Novel", "ar://metadata-hash")
      .accounts({
        project: projectPda,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const project = await program.account.project.fetch(projectPda);
    assert.equal(project.title, "My First Novel");
  });

  it("Adds a chapter with encryption", async () => {
    // Test implementation
  });

  it("Enforces access control", async () => {
    // Test implementation
  });
});
```

### Backend API Tests (Jest)
```typescript
// backend/src/routes/__tests__/projects.test.ts
import { build } from "../../server";

describe("Projects API", () => {
  let app;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a new project", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/projects",
      headers: {
        authorization: "Bearer <test-token>",
      },
      payload: {
        title: "Test Book",
        authorWallet: "test-wallet-address",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty("id");
  });
});
```

### Frontend Tests (Vitest + Testing Library)
```typescript
// frontend/src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "../ProjectCard";

describe("ProjectCard", () => {
  it("displays project title and author", () => {
    render(
      <ProjectCard
        title="Solana Fiction"
        author="author123.sol"
        price={0.5}
      />
    );

    expect(screen.getByText("Solana Fiction")).toBeInTheDocument();
    expect(screen.getByText("by author123.sol")).toBeInTheDocument();
  });
});
```

---

## 📊 Metrics & Analytics

### On-Chain Metrics (Tracked via Solana Programs)
- Total projects created
- Total chapters published
- Total revenue generated (SOL/USDC)
- Active authors/readers/collaborators
- Royalty distributions processed

### Off-Chain Metrics (PostgreSQL + Redis)
- API request rates
- Most popular projects/authors
- Average chapter length
- Reader engagement time
- Collaboration activity (PRs submitted/merged)

### Dashboard Example (Recharts)
```typescript
// frontend/src/components/dashboard/RoyaltyChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export function RoyaltyChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="earnings" stroke="#14F195" />
    </LineChart>
  );
}
```

---

## 🛣️ Roadmap

### Phase 1: MVP (Hackathon Submission) ✅
- [x] Core smart contracts (project, access control, royalties)
- [x] Basic frontend (React + Wallet connection)
- [x] Arcium encryption integration
- [x] Arweave storage
- [x] AI co-writing assistant (OpenAI)
- [x] ASI reputation agent (basic)

### Phase 2: Post-Hackathon (Q2 2025)
- [ ] Mobile app (React Native + Expo)
- [ ] Advanced collaboration (branching, merging)
- [ ] Citation NFTs for academic papers
- [ ] Subscription models (monthly access)
- [ ] Social features (comments, likes, follows)

### Phase 3: Ecosystem Growth (Q3 2025)
- [ ] Publishing DAO (community governance)
- [ ] Grant program for authors
- [ ] Write-to-Earn token ($CINK)
- [ ] Marketplace for editors/reviewers
- [ ] Multi-language support

### Phase 4: Enterprise Features (Q4 2025)
- [ ] White-label solutions for publishers
- [ ] API for third-party integrations
- [ ] On-chain book clubs
- [ ] Live collaboration (real-time editing)
- [ ] Print-on-demand integration

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Use strict mode, avoid `any` types
- **Rust**: Follow Anchor framework conventions
- **Testing**: Maintain >80% coverage for smart contracts
- **Documentation**: Update README for new features

### Bug Reports
Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon Submission

### Built for Solana Cypherpunk Hackathon

**Team:** CryptInk
**Track:** Privacy & Security
**Submission Date:** [Your Date]

### Sponsor Track Integrations
- ✅ **Arcium**: Encrypted manuscript storage and key management
- ✅ **Adevar Labs**: Comprehensive security audit documentation
- ✅ **ASI Agents**: AI-powered reputation and quality scoring
- ✅ **Sanctum Gateway**: Reliable transaction submission

### Demo Links
- **Live Demo**: [https://cryptink.vercel.app](https://cryptink.vercel.app)
- **Video Demo**: [YouTube Link]
- **Pitch Deck**: [Google Slides Link]
- **GitHub**: [https://github.com/your-username/cryptink](https://github.com/your-username/cryptink)

### Judge Review Checklist
- [ ] Smart contracts deployed on Solana Devnet
- [ ] Arcium integration functional (encryption/decryption)
- [ ] ASI agents running (reputation updates)
- [ ] Security audit documentation complete (Adevar Labs)
- [ ] Frontend demo accessible with wallet connection
- [ ] Test coverage >80% for smart contracts
- [ ] README documentation comprehensive

---

## 📞 Contact & Support

### Team
- **Lead Developer**: [Your Name] - [@twitter](https://twitter.com/yourhandle)
- **Blockchain Dev**: [Name] - [GitHub](https://github.com/username)
- **Designer**: [Name] - [Portfolio](https://portfolio.com)

### Community
- **Discord**: [Invite Link]
- **Twitter**: [@CryptInkApp](https://twitter.com/cryptinkapp)
- **Email**: team@cryptink.io

### Resources
- **Documentation**: [https://docs.cryptink.io](https://docs.cryptink.io)
- **API Reference**: [https://api.cryptink.io/docs](https://api.cryptink.io/docs)
- **Support**: [GitHub Issues](https://github.com/your-username/cryptink/issues)

---

## 🙏 Acknowledgments

Special thanks to:
- **Solana Foundation** for hosting the Cypherpunk Hackathon
- **Arcium** for encrypted compute infrastructure
- **Fetch.ai & SingularityNET** for ASI agent technology
- **Adevar Labs** for security audit framework
- **Sanctum** for reliable RPC infrastructure
- **Arweave** for permanent storage solutions

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Live Demo | [cryptink.vercel.app](https://cryptink.vercel.app) |
| GitHub | [github.com/your-username/cryptink](https://github.com/your-username/cryptink) |
| Documentation | [docs.cryptink.io](https://docs.cryptink.io) |
| Solana Programs | [Solscan Explorer](https://solscan.io/account/YOUR_PROGRAM_ID?cluster=devnet) |
| Arcium Integration | [arcium.com/docs](https://arcium.com/docs) |
| ASI Agents | [fetch.ai/docs](https://fetch.ai/docs) |

---

<div align="center">

**Built with ❤️ for the Solana Cypherpunk Hackathon**

[Star ⭐](https://github.com/your-username/cryptink) | [Fork 🍴](https://github.com/your-username/cryptink/fork) | [Contribute 🤝](CONTRIBUTING.md)

</div>
