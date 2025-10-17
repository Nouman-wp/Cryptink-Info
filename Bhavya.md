# Team B - Task Breakdown
## Blockchain, Smart Contracts, Encryption, Deployment Lead

> **Responsibilities:** Solana Programs, Encryption Infrastructure, Security, Production Deployment

---

## 📋 Overview

**Team B Scope:**
- ✅ Smart Contracts (3 Anchor Programs)
- ✅ Blockchain Integration (Solana RPC, Sanctum Gateway)
- ✅ Encryption Layer (Arcium MXE)
- ✅ Deployment & Infrastructure (Devnet → Mainnet)
- ✅ Security Audit Documentation (Adevar Labs)
- ✅ ASI Agents (Fetch.ai Reputation System)

**Total Estimated Hours:** 50-55 hours
**Timeline:** 4 weeks

---

## 🎯 Week 1: Smart Contracts Foundation (15-18 hours)

### Day 1-2: Anchor Workspace Setup (4-5 hours)

#### Initialize Anchor Project
- [ ] **Install Solana CLI & Anchor**
  ```bash
  # Install Solana CLI
  sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

  # Install Anchor
  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
  avm install latest
  avm use latest
  ```

- [ ] **Create Anchor Workspace**
  ```bash
  anchor init cryptink-programs
  cd cryptink-programs
  ```

- [ ] **Configure Anchor.toml**
  ```toml
  [toolchain]

  [features]
  resolution = true
  skip-lint = false

  [programs.localnet]
  project_manager = "BPjManager11111111111111111111111111111111"
  access_control = "BPjAccess111111111111111111111111111111111"
  royalty_splitter = "BPjRoyalty1111111111111111111111111111111"

  [programs.devnet]
  project_manager = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
  access_control = "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
  royalty_splitter = "4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg"

  [registry]
  url = "https://api.apr.dev"

  [provider]
  cluster = "Devnet"
  wallet = "~/.config/solana/id.json"

  [scripts]
  test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
  ```

- [ ] **Create Program Structure**
  ```
  cryptink-programs/
  ├── programs/
  │   ├── project-manager/
  │   │   ├── src/
  │   │   │   ├── lib.rs
  │   │   │   ├── state.rs
  │   │   │   ├── instructions/
  │   │   │   │   ├── mod.rs
  │   │   │   │   ├── create_project.rs
  │   │   │   │   ├── add_chapter.rs
  │   │   │   │   └── add_collaborator.rs
  │   │   │   └── errors.rs
  │   │   └── Cargo.toml
  │   ├── access-control/
  │   │   ├── src/
  │   │   │   ├── lib.rs
  │   │   │   ├── state.rs
  │   │   │   ├── instructions/
  │   │   │   │   ├── mod.rs
  │   │   │   │   ├── purchase_access.rs
  │   │   │   │   └── verify_access.rs
  │   │   │   └── errors.rs
  │   │   └── Cargo.toml
  │   └── royalty-splitter/
  │       ├── src/
  │       │   ├── lib.rs
  │       │   ├── state.rs
  │       │   ├── instructions/
  │       │   │   ├── mod.rs
  │       │   │   ├── configure_royalties.rs
  │       │   │   └── distribute_royalties.rs
  │       │   └── errors.rs
  │       └── Cargo.toml
  ├── tests/
  │   ├── project-manager.ts
  │   ├── access-control.ts
  │   └── royalty-splitter.ts
  └── migrations/
      └── deploy.ts
  ```

---

### Day 3-5: Project Manager Program (6-8 hours)

#### State Definitions
- [ ] **Create State Structs**
  ```rust
  // programs/project-manager/src/state.rs
  use anchor_lang::prelude::*;

  #[account]
  pub struct Project {
      pub authority: Pubkey,        // Creator wallet
      pub title: String,            // Max 100 chars
      pub metadata_uri: String,     // IPFS/Arweave URI for full metadata
      pub chapter_count: u32,       // Number of chapters
      pub visibility: Visibility,   // Public, Private, Paid
      pub price: Option<u64>,       // Price in lamports (if Paid)
      pub created_at: i64,          // Unix timestamp
      pub bump: u8,                 // PDA bump
  }

  #[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
  pub enum Visibility {
      Public,
      Private,
      Paid,
  }

  #[account]
  pub struct Chapter {
      pub project: Pubkey,          // Parent project PDA
      pub encrypted_uri: String,    // Arweave URI for encrypted content
      pub content_hash: [u8; 32],   // SHA-256 hash for integrity
      pub version: u32,             // Chapter version number
      pub author: Pubkey,           // Author wallet
      pub timestamp: i64,           // When created
      pub bump: u8,
  }

  #[account]
  pub struct Collaborator {
      pub project: Pubkey,
      pub wallet: Pubkey,
      pub role: CollaboratorRole,
      pub revenue_share: u16,       // Basis points (10000 = 100%)
      pub reputation: u32,          // Reputation score (0-1000)
      pub added_at: i64,
      pub bump: u8,
  }

  #[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
  pub enum CollaboratorRole {
      Author,
      Editor,
      Reviewer,
  }
  ```

#### Instructions
- [ ] **Create Project Instruction**
  ```rust
  // programs/project-manager/src/instructions/create_project.rs
  use anchor_lang::prelude::*;
  use crate::state::*;

  #[derive(Accounts)]
  #[instruction(title: String)]
  pub struct CreateProject<'info> {
      #[account(
          init,
          payer = authority,
          space = 8 + Project::INIT_SPACE,
          seeds = [b"project", authority.key().as_ref(), title.as_bytes()],
          bump
      )]
      pub project: Account<'info, Project>,

      #[account(mut)]
      pub authority: Signer<'info>,

      pub system_program: Program<'info, System>,
  }

  pub fn create_project(
      ctx: Context<CreateProject>,
      title: String,
      metadata_uri: String,
      visibility: Visibility,
      price: Option<u64>,
  ) -> Result<()> {
      require!(title.len() <= 100, ErrorCode::TitleTooLong);
      require!(metadata_uri.len() <= 200, ErrorCode::UriTooLong);

      let project = &mut ctx.accounts.project;
      project.authority = ctx.accounts.authority.key();
      project.title = title;
      project.metadata_uri = metadata_uri;
      project.chapter_count = 0;
      project.visibility = visibility;
      project.price = price;
      project.created_at = Clock::get()?.unix_timestamp;
      project.bump = ctx.bumps.project;

      msg!("Project created: {}", project.key());

      Ok(())
  }
  ```

- [ ] **Add Chapter Instruction**
  ```rust
  // programs/project-manager/src/instructions/add_chapter.rs
  use anchor_lang::prelude::*;
  use crate::state::*;

  #[derive(Accounts)]
  pub struct AddChapter<'info> {
      #[account(
          init,
          payer = author,
          space = 8 + Chapter::INIT_SPACE,
          seeds = [
              b"chapter",
              project.key().as_ref(),
              &(project.chapter_count + 1).to_le_bytes()
          ],
          bump
      )]
      pub chapter: Account<'info, Chapter>,

      #[account(
          mut,
          seeds = [b"project", project.authority.as_ref(), project.title.as_bytes()],
          bump = project.bump,
          constraint = project.authority == author.key() @ ErrorCode::Unauthorized
      )]
      pub project: Account<'info, Project>,

      #[account(mut)]
      pub author: Signer<'info>,

      pub system_program: Program<'info, System>,
  }

  pub fn add_chapter(
      ctx: Context<AddChapter>,
      encrypted_uri: String,
      content_hash: [u8; 32],
  ) -> Result<()> {
      let chapter = &mut ctx.accounts.chapter;
      let project = &mut ctx.accounts.project;

      chapter.project = project.key();
      chapter.encrypted_uri = encrypted_uri;
      chapter.content_hash = content_hash;
      chapter.version = project.chapter_count + 1;
      chapter.author = ctx.accounts.author.key();
      chapter.timestamp = Clock::get()?.unix_timestamp;
      chapter.bump = ctx.bumps.chapter;

      project.chapter_count += 1;

      msg!("Chapter {} added to project {}", chapter.version, project.key());

      Ok(())
  }
  ```

- [ ] **Add Collaborator Instruction**
  ```rust
  // programs/project-manager/src/instructions/add_collaborator.rs
  use anchor_lang::prelude::*;
  use crate::state::*;

  #[derive(Accounts)]
  pub struct AddCollaborator<'info> {
      #[account(
          init,
          payer = authority,
          space = 8 + Collaborator::INIT_SPACE,
          seeds = [b"collaborator", project.key().as_ref(), collaborator_wallet.key().as_ref()],
          bump
      )]
      pub collaborator: Account<'info, Collaborator>,

      #[account(
          seeds = [b"project", project.authority.as_ref(), project.title.as_bytes()],
          bump = project.bump,
          constraint = project.authority == authority.key() @ ErrorCode::Unauthorized
      )]
      pub project: Account<'info, Project>,

      /// CHECK: Collaborator wallet address
      pub collaborator_wallet: AccountInfo<'info>,

      #[account(mut)]
      pub authority: Signer<'info>,

      pub system_program: Program<'info, System>,
  }

  pub fn add_collaborator(
      ctx: Context<AddCollaborator>,
      role: CollaboratorRole,
      revenue_share: u16,
  ) -> Result<()> {
      require!(revenue_share <= 10000, ErrorCode::InvalidRevenueShare);

      let collaborator = &mut ctx.accounts.collaborator;
      collaborator.project = ctx.accounts.project.key();
      collaborator.wallet = ctx.accounts.collaborator_wallet.key();
      collaborator.role = role;
      collaborator.revenue_share = revenue_share;
      collaborator.reputation = 0;
      collaborator.added_at = Clock::get()?.unix_timestamp;
      collaborator.bump = ctx.bumps.collaborator;

      Ok(())
  }
  ```

#### Error Codes
- [ ] **Define Error Codes**
  ```rust
  // programs/project-manager/src/errors.rs
  use anchor_lang::prelude::*;

  #[error_code]
  pub enum ErrorCode {
      #[msg("Title exceeds maximum length of 100 characters")]
      TitleTooLong,

      #[msg("URI exceeds maximum length of 200 characters")]
      UriTooLong,

      #[msg("Unauthorized: Only project authority can perform this action")]
      Unauthorized,

      #[msg("Revenue share must be between 0 and 10000 basis points")]
      InvalidRevenueShare,
  }
  ```

#### Main Library File
- [ ] **Wire Up Instructions**
  ```rust
  // programs/project-manager/src/lib.rs
  use anchor_lang::prelude::*;

  pub mod state;
  pub mod instructions;
  pub mod errors;

  use instructions::*;
  use state::*;

  declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

  #[program]
  pub mod project_manager {
      use super::*;

      pub fn create_project(
          ctx: Context<CreateProject>,
          title: String,
          metadata_uri: String,
          visibility: Visibility,
          price: Option<u64>,
      ) -> Result<()> {
          instructions::create_project::create_project(ctx, title, metadata_uri, visibility, price)
      }

      pub fn add_chapter(
          ctx: Context<AddChapter>,
          encrypted_uri: String,
          content_hash: [u8; 32],
      ) -> Result<()> {
          instructions::add_chapter::add_chapter(ctx, encrypted_uri, content_hash)
      }

      pub fn add_collaborator(
          ctx: Context<AddCollaborator>,
          role: CollaboratorRole,
          revenue_share: u16,
      ) -> Result<()> {
          instructions::add_collaborator::add_collaborator(ctx, role, revenue_share)
      }
  }
  ```

---

### Day 6-7: Access Control Program (5-6 hours)

#### State & Instructions
- [ ] **Access Pass NFT State**
  ```rust
  // programs/access-control/src/state.rs
  use anchor_lang::prelude::*;

  #[account]
  pub struct AccessPass {
      pub project: Pubkey,
      pub owner: Pubkey,
      pub purchased_at: i64,
      pub expires_at: Option<i64>,  // None = permanent
      pub bump: u8,
  }

  impl AccessPass {
      pub const INIT_SPACE: usize = 32 + 32 + 8 + 9 + 1;
  }
  ```

- [ ] **Purchase Access Instruction**
  ```rust
  // programs/access-control/src/instructions/purchase_access.rs
  use anchor_lang::prelude::*;
  use anchor_spl::token::{self, Token, TokenAccount, Transfer};
  use crate::state::*;

  #[derive(Accounts)]
  pub struct PurchaseAccess<'info> {
      #[account(
          init,
          payer = reader,
          space = 8 + AccessPass::INIT_SPACE,
          seeds = [b"access", project.key().as_ref(), reader.key().as_ref()],
          bump
      )]
      pub access_pass: Account<'info, AccessPass>,

      /// CHECK: Project account from project-manager program
      pub project: AccountInfo<'info>,

      #[account(mut)]
      pub reader_token_account: Account<'info, TokenAccount>,

      #[account(mut)]
      pub author_token_account: Account<'info, TokenAccount>,

      #[account(mut)]
      pub reader: Signer<'info>,

      pub token_program: Program<'info, Token>,
      pub system_program: Program<'info, System>,
  }

  pub fn purchase_access(
      ctx: Context<PurchaseAccess>,
      price: u64,
  ) -> Result<()> {
      // Transfer payment from reader to author
      let cpi_accounts = Transfer {
          from: ctx.accounts.reader_token_account.to_account_info(),
          to: ctx.accounts.author_token_account.to_account_info(),
          authority: ctx.accounts.reader.to_account_info(),
      };
      let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
      token::transfer(cpi_ctx, price)?;

      // Mint access pass
      let access_pass = &mut ctx.accounts.access_pass;
      access_pass.project = ctx.accounts.project.key();
      access_pass.owner = ctx.accounts.reader.key();
      access_pass.purchased_at = Clock::get()?.unix_timestamp;
      access_pass.expires_at = None; // Permanent access
      access_pass.bump = ctx.bumps.access_pass;

      msg!("Access granted to {} for project {}", ctx.accounts.reader.key(), ctx.accounts.project.key());

      Ok(())
  }
  ```

- [ ] **Verify Access Instruction** (Read-only)
  ```rust
  // programs/access-control/src/instructions/verify_access.rs
  use anchor_lang::prelude::*;
  use crate::state::*;

  #[derive(Accounts)]
  pub struct VerifyAccess<'info> {
      #[account(
          seeds = [b"access", project.key().as_ref(), owner.key().as_ref()],
          bump = access_pass.bump
      )]
      pub access_pass: Account<'info, AccessPass>,

      /// CHECK: Project account
      pub project: AccountInfo<'info>,

      /// CHECK: Owner wallet
      pub owner: AccountInfo<'info>,
  }

  pub fn verify_access(ctx: Context<VerifyAccess>) -> Result<bool> {
      let access_pass = &ctx.accounts.access_pass;

      // Check if expired
      if let Some(expiry) = access_pass.expires_at {
          let now = Clock::get()?.unix_timestamp;
          if now > expiry {
              return Ok(false);
          }
      }

      Ok(true)
  }
  ```

---

### Day 8: Royalty Splitter Program (4-5 hours)

- [ ] **Royalty Configuration State**
  ```rust
  // programs/royalty-splitter/src/state.rs
  use anchor_lang::prelude::*;

  #[account]
  pub struct RoyaltyConfig {
      pub project: Pubkey,
      pub beneficiaries: Vec<Pubkey>,
      pub shares: Vec<u16>,  // Basis points (10000 = 100%)
      pub escrow_bump: u8,
      pub bump: u8,
  }
  ```

- [ ] **Configure Royalties Instruction**
  ```rust
  // programs/royalty-splitter/src/instructions/configure_royalties.rs
  use anchor_lang::prelude::*;
  use crate::state::*;

  #[derive(Accounts)]
  pub struct ConfigureRoyalties<'info> {
      #[account(
          init,
          payer = authority,
          space = 8 + RoyaltyConfig::INIT_SPACE,
          seeds = [b"royalty_config", project.key().as_ref()],
          bump
      )]
      pub royalty_config: Account<'info, RoyaltyConfig>,

      /// CHECK: Project account
      pub project: AccountInfo<'info>,

      #[account(mut)]
      pub authority: Signer<'info>,

      pub system_program: Program<'info, System>,
  }

  pub fn configure_royalties(
      ctx: Context<ConfigureRoyalties>,
      beneficiaries: Vec<Pubkey>,
      shares: Vec<u16>,
  ) -> Result<()> {
      require!(beneficiaries.len() == shares.len(), ErrorCode::MismatchedLengths);
      require!(beneficiaries.len() <= 10, ErrorCode::TooManyBeneficiaries);

      let total_shares: u16 = shares.iter().sum();
      require!(total_shares == 10000, ErrorCode::InvalidTotalShares);

      let config = &mut ctx.accounts.royalty_config;
      config.project = ctx.accounts.project.key();
      config.beneficiaries = beneficiaries;
      config.shares = shares;
      config.bump = ctx.bumps.royalty_config;

      Ok(())
  }
  ```

- [ ] **Distribute Royalties Instruction**
  ```rust
  // programs/royalty-splitter/src/instructions/distribute_royalties.rs
  use anchor_lang::prelude::*;
  use anchor_spl::token::{self, Token, TokenAccount, Transfer};
  use crate::state::*;

  #[derive(Accounts)]
  pub struct DistributeRoyalties<'info> {
      #[account(
          seeds = [b"royalty_config", project.key().as_ref()],
          bump = royalty_config.bump
      )]
      pub royalty_config: Account<'info, RoyaltyConfig>,

      /// CHECK: Project account
      pub project: AccountInfo<'info>,

      #[account(mut)]
      pub escrow_account: Account<'info, TokenAccount>,

      /// CHECK: Escrow authority PDA
      #[account(
          seeds = [b"escrow", royalty_config.key().as_ref()],
          bump
      )]
      pub escrow_authority: AccountInfo<'info>,

      pub token_program: Program<'info, Token>,
  }

  pub fn distribute_royalties(
      ctx: Context<DistributeRoyalties>,
      total_amount: u64,
  ) -> Result<()> {
      let config = &ctx.accounts.royalty_config;

      // Iterate through remaining_accounts (beneficiary token accounts)
      for (i, beneficiary_account) in ctx.remaining_accounts.iter().enumerate() {
          if i >= config.beneficiaries.len() {
              break;
          }

          let share = (total_amount as u128)
              .checked_mul(config.shares[i] as u128)
              .unwrap()
              .checked_div(10000)
              .unwrap() as u64;

          // Transfer tokens
          let cpi_accounts = Transfer {
              from: ctx.accounts.escrow_account.to_account_info(),
              to: beneficiary_account.to_account_info(),
              authority: ctx.accounts.escrow_authority.to_account_info(),
          };

          let seeds = &[
              b"escrow",
              config.key().as_ref(),
              &[ctx.bumps.escrow_authority]
          ];
          let signer = &[&seeds[..]];

          let cpi_ctx = CpiContext::new_with_signer(
              ctx.accounts.token_program.to_account_info(),
              cpi_accounts,
              signer
          );

          token::transfer(cpi_ctx, share)?;

          msg!("Distributed {} tokens to beneficiary {}", share, config.beneficiaries[i]);
      }

      Ok(())
  }
  ```

---

## 🎯 Week 2: Testing & Deployment (12-15 hours)

### Day 1-2: Smart Contract Testing (6-8 hours)

#### Test Infrastructure
- [ ] **Install Test Dependencies**
  ```bash
  yarn add -D @coral-xyz/anchor @solana/web3.js chai mocha
  ```

- [ ] **Project Manager Tests**
  ```typescript
  // tests/project-manager.ts
  import * as anchor from "@coral-xyz/anchor";
  import { Program } from "@coral-xyz/anchor";
  import { ProjectManager } from "../target/types/project_manager";
  import { expect } from "chai";

  describe("Project Manager", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.ProjectManager as Program<ProjectManager>;
    const author = provider.wallet;

    it("Creates a new project", async () => {
      const title = "My First Novel";
      const metadataUri = "ar://abc123";

      const [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("project"),
          author.publicKey.toBuffer(),
          Buffer.from(title)
        ],
        program.programId
      );

      await program.methods
        .createProject(
          title,
          metadataUri,
          { public: {} },
          null
        )
        .accounts({
          project: projectPda,
          authority: author.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const project = await program.account.project.fetch(projectPda);

      expect(project.title).to.equal(title);
      expect(project.authority.toString()).to.equal(author.publicKey.toString());
      expect(project.chapterCount).to.equal(0);
    });

    it("Adds a chapter to project", async () => {
      const title = "Test Book";
      const [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), author.publicKey.toBuffer(), Buffer.from(title)],
        program.programId
      );

      // First create project
      await program.methods
        .createProject(title, "ar://metadata", { public: {} }, null)
        .accounts({ project: projectPda, authority: author.publicKey })
        .rpc();

      // Then add chapter
      const [chapterPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("chapter"), projectPda.toBuffer(), Buffer.from([1, 0, 0, 0])],
        program.programId
      );

      const encryptedUri = "ar://encrypted-chapter-1";
      const contentHash = Array(32).fill(0);

      await program.methods
        .addChapter(encryptedUri, contentHash)
        .accounts({
          chapter: chapterPda,
          project: projectPda,
          author: author.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const chapter = await program.account.chapter.fetch(chapterPda);
      expect(chapter.encryptedUri).to.equal(encryptedUri);
      expect(chapter.version).to.equal(1);

      const updatedProject = await program.account.project.fetch(projectPda);
      expect(updatedProject.chapterCount).to.equal(1);
    });

    it("Adds a collaborator with revenue share", async () => {
      const title = "Collab Book";
      const [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), author.publicKey.toBuffer(), Buffer.from(title)],
        program.programId
      );

      await program.methods
        .createProject(title, "ar://metadata", { public: {} }, null)
        .accounts({ project: projectPda, authority: author.publicKey })
        .rpc();

      const collaboratorWallet = anchor.web3.Keypair.generate();
      const [collaboratorPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collaborator"), projectPda.toBuffer(), collaboratorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .addCollaborator({ editor: {} }, 2000) // 20% share
        .accounts({
          collaborator: collaboratorPda,
          project: projectPda,
          collaboratorWallet: collaboratorWallet.publicKey,
          authority: author.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const collab = await program.account.collaborator.fetch(collaboratorPda);
      expect(collab.revenueShare).to.equal(2000);
    });
  });
  ```

- [ ] **Access Control Tests**
  ```typescript
  // tests/access-control.ts
  import * as anchor from "@coral-xyz/anchor";
  import { Program } from "@coral-xyz/anchor";
  import { AccessControl } from "../target/types/access_control";
  import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";

  describe("Access Control", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.AccessControl as Program<AccessControl>;

    it("Purchases access to a project", async () => {
      // Setup: Create token mint and accounts
      const mint = await createMint(
        provider.connection,
        provider.wallet.payer,
        provider.wallet.publicKey,
        null,
        6
      );

      const readerTokenAccount = await createAccount(
        provider.connection,
        provider.wallet.payer,
        mint,
        provider.wallet.publicKey
      );

      const authorTokenAccount = await createAccount(
        provider.connection,
        provider.wallet.payer,
        mint,
        provider.wallet.publicKey
      );

      // Mint tokens to reader
      await mintTo(
        provider.connection,
        provider.wallet.payer,
        mint,
        readerTokenAccount,
        provider.wallet.publicKey,
        1_000_000
      );

      // Purchase access
      const projectKey = anchor.web3.Keypair.generate().publicKey;
      const [accessPassPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("access"), projectKey.toBuffer(), provider.wallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .purchaseAccess(new anchor.BN(100_000))
        .accounts({
          accessPass: accessPassPda,
          project: projectKey,
          readerTokenAccount,
          authorTokenAccount,
          reader: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      const accessPass = await program.account.accessPass.fetch(accessPassPda);
      expect(accessPass.owner.toString()).to.equal(provider.wallet.publicKey.toString());
    });
  });
  ```

- [ ] **Run All Tests**
  ```bash
  anchor test
  ```

#### Test Coverage Goals
- [ ] Project creation: ✅
- [ ] Chapter addition: ✅
- [ ] Collaborator management: ✅
- [ ] Access purchase: ✅
- [ ] Access verification: ✅
- [ ] Royalty distribution: ✅
- [ ] Error handling (unauthorized access, invalid inputs): ✅

---

### Day 3-4: Deploy to Devnet (3-4 hours)

- [ ] **Configure Solana CLI for Devnet**
  ```bash
  solana config set --url devnet
  solana airdrop 2  # Get devnet SOL
  ```

- [ ] **Build Programs**
  ```bash
  anchor build
  ```

- [ ] **Deploy to Devnet**
  ```bash
  anchor deploy --provider.cluster devnet
  ```

- [ ] **Verify Deployments**
  ```bash
  solana program show <PROGRAM_ID>
  ```

- [ ] **Update Program IDs in Shared Config**
  ```typescript
  // shared/solana-config.ts
  export const PROGRAM_IDS = {
    PROJECT_MANAGER: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
    ACCESS_CONTROL: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    ROYALTY_SPLITTER: '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg'
  };

  export const SOLANA_NETWORK = 'devnet';
  export const RPC_ENDPOINT = 'https://api.devnet.solana.com';
  ```

---

### Day 5: Client Integration Utilities (3-4 hours)

- [ ] **Create TypeScript Client Helpers**
  ```typescript
  // shared/solana-client.ts
  import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
  import { ProjectManager } from './types/project_manager';
  import { Connection, PublicKey } from '@solana/web3.js';
  import { PROGRAM_IDS } from './solana-config';

  export class SolanaClient {
    private connection: Connection;
    private provider: AnchorProvider;
    private projectManagerProgram: Program<ProjectManager>;

    constructor(wallet: any, rpcEndpoint: string) {
      this.connection = new Connection(rpcEndpoint);
      this.provider = new AnchorProvider(this.connection, wallet, {});
      this.projectManagerProgram = new Program(
        ProjectManagerIDL,
        PROGRAM_IDS.PROJECT_MANAGER,
        this.provider
      );
    }

    async createProject(
      title: string,
      metadataUri: string,
      visibility: 'public' | 'private' | 'paid',
      price?: number
    ): Promise<string> {
      const [projectPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('project'),
          this.provider.wallet.publicKey.toBuffer(),
          Buffer.from(title)
        ],
        this.projectManagerProgram.programId
      );

      const visibilityEnum = { [visibility]: {} };
      const priceOption = price ? new BN(price) : null;

      const tx = await this.projectManagerProgram.methods
        .createProject(title, metadataUri, visibilityEnum, priceOption)
        .accounts({
          project: projectPda,
          authority: this.provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        })
        .rpc();

      return tx;
    }

    async addChapter(
      projectPda: PublicKey,
      encryptedUri: string,
      contentHash: number[]
    ): Promise<string> {
      const project = await this.projectManagerProgram.account.project.fetch(projectPda);

      const [chapterPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('chapter'),
          projectPda.toBuffer(),
          Buffer.from([(project.chapterCount + 1), 0, 0, 0])
        ],
        this.projectManagerProgram.programId
      );

      const tx = await this.projectManagerProgram.methods
        .addChapter(encryptedUri, contentHash)
        .accounts({
          chapter: chapterPda,
          project: projectPda,
          author: this.provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        })
        .rpc();

      return tx;
    }

    async getProject(projectPda: PublicKey) {
      return await this.projectManagerProgram.account.project.fetch(projectPda);
    }

    async getChapter(chapterPda: PublicKey) {
      return await this.projectManagerProgram.account.chapter.fetch(chapterPda);
    }
  }
  ```

- [ ] **Provide to Team A**
  - Share `solana-client.ts`
  - Share TypeScript type definitions
  - Provide example usage in documentation

---

## 🎯 Week 3: Encryption & Advanced Features (15-18 hours)

### Day 1-3: Arcium Integration (8-10 hours)

#### Arcium Setup
- [ ] **Install Arcium SDK**
  ```bash
  npm install @arcium/sdk
  ```

- [ ] **Create Encryption Service**
  ```typescript
  // backend/src/services/arcium-encryption.ts
  import { ArciumSDK } from '@arcium/sdk';
  import crypto from 'crypto';

  export class ArciumEncryptionService {
    private arcium: ArciumSDK;

    constructor() {
      this.arcium = new ArciumSDK({
        network: process.env.ARCIUM_NETWORK || 'mainnet',
        apiKey: process.env.ARCIUM_API_KEY!
      });
    }

    /**
     * Client-side encryption helper (generates key)
     */
    generateEncryptionKey(): Buffer {
      return crypto.randomBytes(32); // AES-256 key
    }

    /**
     * Store encryption key in Arcium MXE
     */
    async storeEncryptionKey(
      chapterId: string,
      encryptionKey: Buffer,
      accessControlProgramId: string,
      projectPda: string
    ): Promise<string> {
      const keyId = await this.arcium.vault.store({
        id: chapterId,
        secret: encryptionKey,
        policy: {
          type: 'solana-program',
          programId: accessControlProgramId,
          instruction: 'verify_access',
          parameters: {
            project: projectPda
          }
        }
      });

      return keyId;
    }

    /**
     * Retrieve decryption key (only if user has access NFT)
     */
    async retrieveDecryptionKey(
      chapterId: string,
      userWallet: string,
      accessPassPda: string
    ): Promise<Buffer | null> {
      try {
        const key = await this.arcium.vault.retrieve({
          id: chapterId,
          requester: userWallet,
          proof: {
            type: 'solana-account',
            accountAddress: accessPassPda
          }
        });

        return Buffer.from(key);
      } catch (error) {
        console.error('Failed to retrieve key:', error);
        return null;
      }
    }

    /**
     * Client-side encryption (AES-256-GCM)
     */
    encryptContent(content: string, key: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

      let encrypted = cipher.update(content, 'utf8');
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      const tag = cipher.getAuthTag();

      return { encrypted, iv, tag };
    }

    /**
     * Client-side decryption
     */
    decryptContent(encrypted: Buffer, key: Buffer, iv: Buffer, tag: Buffer): string {
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString('utf8');
    }
  }

  export const arciumService = new ArciumEncryptionService();
  ```

#### Encryption Flow Implementation
- [ ] **Backend Endpoint for Key Management**
  ```typescript
  // backend/src/routes/encryption.ts
  import { arciumService } from '../services/arcium-encryption';

  export async function encryptionRoutes(app) {
    // Store encryption key after chapter upload
    app.post('/api/encryption/store-key', {
      onRequest: [app.authenticate]
    }, async (req, reply) => {
      const { chapterId, encryptionKey, projectPda } = req.body as any;

      const keyId = await arciumService.storeEncryptionKey(
        chapterId,
        Buffer.from(encryptionKey, 'hex'),
        process.env.ACCESS_CONTROL_PROGRAM_ID!,
        projectPda
      );

      return { keyId };
    });

    // Retrieve decryption key for authorized user
    app.get('/api/encryption/retrieve-key/:chapterId', {
      onRequest: [app.authenticate]
    }, async (req, reply) => {
      const { chapterId } = req.params as any;
      const userWallet = req.user.wallet;

      // Verify user has access pass
      const accessPassPda = deriveAccessPassPda(chapterId, userWallet);

      const key = await arciumService.retrieveDecryptionKey(
        chapterId,
        userWallet,
        accessPassPda
      );

      if (!key) {
        return reply.code(403).send({ error: 'Access denied' });
      }

      return { decryptionKey: key.toString('hex') });
    });
  }
  ```

- [ ] **Frontend Encryption Helper**
  ```typescript
  // frontend/src/lib/encryption.ts
  export async function encryptChapter(content: string): Promise<{
    encrypted: ArrayBuffer;
    key: string;
    iv: string;
    tag: string;
  }> {
    // Generate random AES key
    const key = crypto.getRandomValues(new Uint8Array(32));

    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      new TextEncoder().encode(content)
    );

    return {
      encrypted,
      key: arrayBufferToHex(key),
      iv: arrayBufferToHex(iv),
      tag: '' // GCM tag included in encrypted data
    };
  }

  export async function decryptChapter(
    encrypted: ArrayBuffer,
    keyHex: string,
    ivHex: string
  ): Promise<string> {
    const key = hexToArrayBuffer(keyHex);
    const iv = hexToArrayBuffer(ivHex);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  }
  ```

---

### Day 4-5: Sanctum Gateway RPC Integration (4-5 hours)

- [ ] **Create Sanctum RPC Service** (See detailed implementation in README)
  ```typescript
  // backend/src/services/sanctum-rpc.ts
  import { Connection, Transaction, SendOptions, ComputeBudgetProgram } from '@solana/web3.js';

  export enum TransactionPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
  }

  export class SanctumRPC {
    private sanctumConnection: Connection;
    private fallbackConnections: Connection[];

    constructor() {
      this.sanctumConnection = new Connection(
        'https://gateway.sanctum.so/rpc',
        {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 90000,
          wsEndpoint: 'wss://gateway.sanctum.so/ws'
        }
      );

      this.fallbackConnections = [
        new Connection(process.env.HELIUS_RPC_URL!),
        new Connection(process.env.QUICKNODE_RPC_URL!),
        new Connection('https://api.mainnet-beta.solana.com')
      ];
    }

    async sendTransaction(
      tx: Transaction,
      priority: TransactionPriority = TransactionPriority.MEDIUM
    ): Promise<string> {
      // Add priority fee
      const priorityFee = this.calculatePriorityFee(priority);
      tx.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityFee
        })
      );

      // Try Sanctum first
      try {
        const signature = await this.sanctumConnection.sendTransaction(tx, {
          skipPreflight: false,
          maxRetries: priority === TransactionPriority.CRITICAL ? 10 : 5
        });

        await this.waitForConfirmation(signature);
        return signature;
      } catch (error) {
        // Fallback to other RPCs
        for (const fallback of this.fallbackConnections) {
          try {
            const signature = await fallback.sendTransaction(tx, {
              skipPreflight: false,
              maxRetries: 3
            });
            return signature;
          } catch (fallbackError) {
            continue;
          }
        }

        throw new Error('All RPCs failed');
      }
    }

    private calculatePriorityFee(priority: TransactionPriority): number {
      const feeMap = {
        [TransactionPriority.LOW]: 1000,
        [TransactionPriority.MEDIUM]: 10000,
        [TransactionPriority.HIGH]: 50000,
        [TransactionPriority.CRITICAL]: 100000
      };
      return feeMap[priority];
    }

    private async waitForConfirmation(signature: string, timeout = 60000): Promise<void> {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const status = await this.sanctumConnection.getSignatureStatus(signature);

        if (status.value?.confirmationStatus === 'confirmed' ||
            status.value?.confirmationStatus === 'finalized') {
          return;
        }

        if (status.value?.err) {
          throw new Error(`Transaction failed: ${status.value.err}`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      throw new Error('Transaction confirmation timeout');
    }
  }

  export const sanctumRpc = new SanctumRPC();
  ```

- [ ] **Integrate with Transaction Sending**
  ```typescript
  // shared/transaction-sender.ts
  import { sanctumRpc, TransactionPriority } from './sanctum-rpc';

  export async function sendCriticalTransaction(
    tx: Transaction,
    txType: 'publish' | 'purchase' | 'royalty'
  ): Promise<string> {
    const priority = txType === 'purchase' || txType === 'royalty'
      ? TransactionPriority.CRITICAL
      : TransactionPriority.MEDIUM;

    return await sanctumRpc.sendTransaction(tx, priority);
  }
  ```

---

### Day 6-7: ASI Agents (Fetch.ai) (3-4 hours)

- [ ] **Set up Fetch.ai Agent**
  ```bash
  mkdir agents/reputation-agent
  cd agents/reputation-agent
  pip install fetchai
  ```

- [ ] **Create Reputation Agent**
  ```python
  # agents/reputation-agent/agent.py
  from fetchai.crypto import Entity
  from fetchai.ledger.api import LedgerApi
  import asyncio
  import aiohttp
  from solana.rpc.async_api import AsyncClient
  from solana.publickey import PublicKey

  class ReputationAgent:
      def __init__(self, solana_rpc_url: str):
          self.entity = Entity()
          self.solana = AsyncClient(solana_rpc_url)
          self.webhook_url = "http://localhost:3000/api/webhook/reputation"

      async def calculate_reputation(self, author_wallet: str) -> int:
          """
          Calculate reputation score based on on-chain activity
          """
          # Fetch contribution data from Solana
          contributions = await self.fetch_contributions(author_wallet)

          # Calculate score (0-1000)
          score = (
              contributions['merged_prs'] * 10 +
              contributions['positive_reviews'] * 5 +
              contributions['published_chapters'] * 2 -
              contributions['disputes'] * 15
          )

          # Clamp to 0-1000
          score = max(0, min(1000, score))

          return score

      async def fetch_contributions(self, author_wallet: str):
          """
          Query Solana blockchain for contribution metrics
          """
          # Query collaborator accounts
          # Query chapter accounts
          # Query review accounts

          return {
              'merged_prs': 5,
              'positive_reviews': 10,
              'published_chapters': 3,
              'disputes': 0
          }

      async def update_on_chain_reputation(self, author_wallet: str, score: int):
          """
          Update reputation score in Collaborator account
          """
          # Build transaction to update reputation PDA
          # Send via Sanctum Gateway
          pass

      async def listen_for_events(self):
          """
          Listen for webhook events from backend
          """
          print(f"Reputation Agent {self.entity.address} listening for events...")

          while True:
              # Poll for events or listen to webhook
              await asyncio.sleep(10)

      async def run(self):
          await self.listen_for_events()

  if __name__ == "__main__":
      agent = ReputationAgent("https://api.devnet.solana.com")
      asyncio.run(agent.run())
  ```

- [ ] **Backend Webhook for ASI Agent**
  ```typescript
  // backend/src/routes/webhooks.ts
  export async function webhookRoutes(app) {
    app.post('/api/webhook/contribution', async (req, reply) => {
      const { walletAddr, projectId, type } = req.body as any;

      // Notify ASI agent
      await fetch('http://localhost:5001/contribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddr, projectId, type })
      });

      return { success: true };
    });
  }
  ```

---

## 🎯 Week 4: Deployment & Documentation (8-10 hours)

### Day 1-2: Adevar Labs Security Documentation (4-5 hours)

- [ ] **Create Security Audit Document**
  ```markdown
  // docs/security-audit.md
  # CryptInk Security Audit

  ## Smart Contract Security Analysis

  ### Project Manager Program
  **Potential Vulnerabilities:**
  - [ ] Reentrancy attacks: None (no external calls)
  - [ ] Integer overflow: Protected by Rust's type system
  - [ ] Unauthorized access: Protected by authority checks

  **Security Measures:**
  - PDA-based account derivation
  - Authority validation on all mutations
  - Input validation (string length limits)

  ### Access Control Program
  **Potential Vulnerabilities:**
  - [ ] Token transfer validation
  - [ ] Price manipulation

  **Security Measures:**
  - SPL token program integration (audited)
  - Access pass NFT as proof of purchase
  - Immutable purchase records

  ### Royalty Splitter Program
  **Potential Vulnerabilities:**
  - [ ] Share calculation precision
  - [ ] Beneficiary validation

  **Security Measures:**
  - Basis point arithmetic (10000 = 100%)
  - Total share validation (must equal 100%)
  - Maximum beneficiary limit (10)

  ## Threat Model

  ### Attack Vectors
  1. **Manuscript Theft**
     - Mitigation: Client-side encryption + Arcium key management
     - Risk Level: Low

  2. **Unauthorized Decryption**
     - Mitigation: Access NFT verification before key release
     - Risk Level: Low

  3. **Royalty Manipulation**
     - Mitigation: Immutable royalty config, basis point validation
     - Risk Level: Low

  4. **Replay Attacks**
     - Mitigation: Transaction uniqueness via PDAs
     - Risk Level: Low

  ## Audit Recommendations
  - [x] Formal verification of royalty distribution math
  - [x] Penetration testing of Arcium integration
  - [x] Code review by Adevar Labs security team
  ```

- [ ] **Create Threat Model Document**
  ```markdown
  // docs/threat-model.md
  # CryptInk Threat Model

  ## Assets
  1. Encrypted manuscripts (Arweave)
  2. Encryption keys (Arcium MXE)
  3. User wallets (Solana)
  4. Royalty payments (SPL tokens)

  ## Threats
  1. **Data Breach** - Attacker gains access to encrypted manuscripts
     - Impact: High
     - Likelihood: Low (encryption + Arcium)
     - Mitigation: Multi-layer encryption

  2. **Key Compromise** - Attacker obtains decryption keys
     - Impact: Critical
     - Likelihood: Very Low (Arcium MXE)
     - Mitigation: Confidential compute, access control

  3. **Smart Contract Exploit**
     - Impact: High
     - Likelihood: Low (Anchor framework, audited)
     - Mitigation: Formal verification, testing

  ## Security Controls
  - Client-side encryption (AES-256-GCM)
  - Arcium MXE key management
  - Solana access control smart contracts
  - Sanctum Gateway transaction reliability
  ```

---

### Day 3-4: Production Deployment (3-4 hours)

#### Deploy to Mainnet
- [ ] **Switch to Mainnet**
  ```bash
  solana config set --url mainnet-beta
  ```

- [ ] **Build Programs**
  ```bash
  anchor build --verifiable
  ```

- [ ] **Deploy Programs**
  ```bash
  anchor deploy --provider.cluster mainnet
  ```

- [ ] **Verify Programs on Solscan**
  ```
  https://solscan.io/account/<PROGRAM_ID>
  ```

#### Infrastructure Setup
- [ ] **Deploy Backend to Railway**
  ```bash
  # Install Railway CLI
  npm install -g @railway/cli

  # Login and deploy
  railway login
  railway up
  ```

- [ ] **Configure Environment Variables**
  ```bash
  railway variables set DATABASE_URL=...
  railway variables set ARCIUM_API_KEY=...
  railway variables set OPENAI_API_KEY=...
  ```

- [ ] **Set up PostgreSQL (Railway)**
  - Provision database
  - Run migrations: `railway run npx prisma migrate deploy`

- [ ] **Set up Redis (Upstash)**
  - Create Redis database
  - Update REDIS_URL in environment

#### Frontend Deployment
- [ ] **Deploy to Vercel**
  ```bash
  # Install Vercel CLI
  npm install -g vercel

  # Deploy
  cd frontend
  vercel --prod
  ```

- [ ] **Configure Environment Variables**
  ```
  VITE_SOLANA_NETWORK=mainnet-beta
  VITE_API_URL=https://api.cryptink.io
  VITE_PROJECT_MANAGER_PROGRAM_ID=...
  VITE_ACCESS_CONTROL_PROGRAM_ID=...
  VITE_ROYALTY_SPLITTER_PROGRAM_ID=...
  ```

---

### Day 5: Monitoring & Analytics (1-2 hours)

- [ ] **Set up Monitoring Dashboard**
  ```typescript
  // backend/src/routes/admin/monitoring.ts
  app.get('/api/admin/system-health', async (req, reply) => {
    const health = {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      solana: await checkSolanaConnection(),
      arcium: await checkArciumService()
    };

    return health;
  });

  app.get('/api/admin/transaction-metrics', async (req, reply) => {
    const metrics = await prisma.transactionMetrics.aggregate({
      _avg: { duration: true },
      _count: { signature: true },
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      groupBy: ['rpcUsed', 'priority']
    });

    return {
      sanctumSuccessRate: calculateSuccessRate(metrics, 'sanctum'),
      avgConfirmationTime: metrics._avg.duration,
      totalTransactions: metrics._count.signature
    };
  });
  ```

- [ ] **Set up Alerts (Discord/Slack)**
  ```typescript
  async function alertOperations(message: string) {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🚨 CryptInk Alert: ${message}`
      })
    });
  }
  ```

---

## 🤝 Collaboration Points with Team A

### Week 1 Handoff
**Provide to Team A:**
- [ ] Deployed smart contract addresses (devnet)
- [ ] IDL files for TypeScript type generation
- [ ] `solana-client.ts` utility functions
- [ ] Example transactions for testing

### Week 2 Handoff
**Provide to Team A:**
- [ ] Encryption helper functions
- [ ] Arcium SDK integration guide
- [ ] Client-side encryption example code

### Week 3 Handoff
**Provide to Team A:**
- [ ] Sanctum RPC service for sending transactions
- [ ] Transaction priority guidelines
- [ ] Monitoring API endpoints

### Week 4 Handoff
**Provide to Team A:**
- [ ] Production program IDs (mainnet)
- [ ] Production API URLs
- [ ] Deployment documentation

---

## 📊 Success Metrics

### Week 1 Checklist
- [ ] All 3 smart contracts written
- [ ] Comprehensive test suite (>80% coverage)
- [ ] Deployed to devnet
- [ ] IDL files generated

### Week 2 Checklist
- [ ] Team A successfully integrated smart contracts
- [ ] End-to-end project creation working
- [ ] Chapter publishing functional
- [ ] Access purchase flow complete

### Week 3 Checklist
- [ ] Arcium encryption integrated
- [ ] Sanctum Gateway RPC service operational
- [ ] ASI reputation agent deployed
- [ ] All sponsor tracks functional

### Week 4 Checklist
- [ ] Security audit documentation complete
- [ ] Programs deployed to mainnet
- [ ] Production infrastructure live
- [ ] Monitoring dashboard active
- [ ] Hackathon demo ready

---

## 🛠️ Development Tools

### Recommended Tools
- **Anchor CLI** - Smart contract development
- **Solana Explorer** - On-chain debugging
- **Metaboss** - NFT/token utilities
- **Postman** - API testing
- **Solana Playground** - Quick testing

### VS Code Extensions
- Rust Analyzer
- Better TOML
- Solana Tools

---

## 📚 Resources

### Documentation
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Arcium Docs](https://docs.arcium.com/)
- [Sanctum Gateway](https://docs.sanctum.so/)
- [Fetch.ai Docs](https://docs.fetch.ai/)

### Security
- [Solana Security Best Practices](https://github.com/coral-xyz/sealevel-attacks)
- [Adevar Labs Audit Framework](https://adevar.xyz/)

---

## ⚠️ Common Pitfalls

### Issue 1: PDA Derivation Mismatch
**Solution:** Ensure seeds match exactly between program and client

### Issue 2: Compute Budget Exceeded
**Solution:** Add ComputeBudgetProgram.setComputeUnitLimit()

### Issue 3: Account Size Insufficient
**Solution:** Calculate space correctly (8 bytes discriminator + data)

### Issue 4: Anchor Version Conflicts
**Solution:** Lock Anchor version in Cargo.toml and package.json

---

**Questions for Team A?** Create issues in shared repo with label `team-b-question`
