# 📋 Product Requirements Document (PRD) - claw-pin

## 🎯 Project Overview

| Attribute | Value |
| :--- | :--- |
| **Project Name** | claw-pin (Agentic File Storage CLI) |
| **Hackathon** | IPFS × OpenClaw Hackathon |
| **Duration** | 10 Days (May 9-18, 2026) - 1-Day Sprint Mode |
| **Team Size** | 4 People (Parallel Development) |
| **Primary Prize** | IPFS Grand Prize ($1000) |
| **Secondary Prizes** | Arkhai Escrow ($200) + Aomi Best App ($300) |

## 🎯 Problem Statement

"Current file storage tools are one-way pipes: you upload, you pay, you trust nothing is proven. In the cybernetic economy, AI agents need to execute verified services with trustless payments. We're building infrastructure where agents can offer, verify, and settle storage services autonomously."

## 🏆 Success Metrics

| Metric | Target | Why It Matters |
| :--- | :--- | :--- |
| **Technical Execution** | 90%+ | Core CLI commands working |
| **Innovation** | Scorable with escrow | Arkhai integration shown |
| **Demo** | Live + documented | Judges see functional demo |
| **Team Coverage** | 4 members, parallel | All skills leveraged |

## 🛠️ Tech Stack Details

| Component | Technology | Purpose | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **CLI Framework** | Node.js + Inquirer.js | User interaction | Command-line interface |
| **Agent Core** | OpenClaw SDK (v1.x) | Agent orchestration | Skill registration & execution |
| **Storage Layer** | filecoin-pin-js | File pinning to storage | CID return with success status |
| **Payment Layer** | Filecoin Pay SDK | Mainnet wallet management | $0.01 test transaction possible |
| **Escrow Logic** | alkahest-client | Conditional payment | Contract creation + release |
| **State Management** | SQLite (local) | CLI state persistence | CID → status mapping |
| **Testing** | Jest + Mocha | Unit tests for skills | 80% code coverage (bonus) |
| **Documentation** | Markdown + Mermaid | README + architecture | Clear explanation for judges |
| **Version Control** | Git + GitHub | Source control | Public repo with commits |

## 🎨 Feature Requirements

### Phase 1: Core Features (MUST HAVE)

| Feature | Functionality | Expected Output | Owner |
| :--- | :--- | :--- | :--- |
| **Upload Command** | `claw-pin upload <file>` | Returns CID, confirms pin status | Dev 1 |
| **Status Command** | `claw-pin status <CID>` | Shows pin status, provider list | Dev 1 |
| **Pay Wallet** | `claw-pin init` | Mainnet wallet created + address shown | Dev 2 |
| **Skill Registration** | `OpenClaw skills load filePin` | Skill registers with agent | Dev 3 |
| **Error Handling** | Graceful failures with logs | User-friendly error messages | All |

### Phase 2: Escrow Features (BONUS - Arkhai)

| Feature | Functionality | Expected Output | Owner |
| :--- | :--- | :--- | :--- |
| **Escrow Create** | `claw-pin upload --escrow <file>` | Alkahest contract address returned | Dev 2 |
| **Escrow Release** | `claw-pin release <CID>` | Funds released on verification | Dev 2 |
| **Mock Flow** | Visualize escrow lifecycle diagram | Architecture flow for judges | Dev 4 |

### Phase 3: Polish (OPTIONAL - Time Permitting)

| Feature | Functionality | Expected Output | Owner |
| :--- | :--- | :--- | :--- |
| **Retrieve Command** | `claw-pin retrieve <CID>` | Download pin to local | Dev 1 |
| **Aomi UI** | Web interface for chat commands | Simple React UI for demo | Dev 3 |
| **Video Demo** | 3-minute demonstration video | Screen recording + narration | Dev 4 |

## 👥 Team Division (4 Members)

### Developer 1: CLI Core + Filecoin Integration

| Task | Description | Timeline | Deliverable |
| :--- | :--- | :--- | :--- |
| **CLI Scaffold** | Initialize Node.js + Inquirer | 0-2 hours | Project structure |
| **Upload Command** | Integrate filecoin-pin-js | 2-6 hours | `upload <file>` → CID |
| **Status Command** | Query pin status from Filecoin | 6-8 hours | `status <CID>` → status |
| **Test Suite** | Write unit tests | 8-10 hours | Jest tests (80% coverage) |
| **Total** | **10 hours** | **Day 1-2** | **Working CLI core** |

**Key Deliverable:** Commands work without crashing, return expected data.

### Developer 2: Wallet + Escrow Integration

| Task | Description | Timeline | Deliverable |
| :--- | :--- | :--- | :--- |
| **Pay Wallet Setup** | Generate mainnet wallet | 0-2 hours | Address + `.env` config |
| **Wallet Test** | Small transaction demo | 2-4 hours | Confirmation receipt |
| **Alkahest Client** | Integrate alkahest-client | 4-6 hours | Install + config |
| **Escrow Create** | Mock contract creation | 6-8 hours | CLI command that returns address |
| **Escrow Release** | Conditional release flow | 8-10 hours | `release <CID>` command |
| **Total** | **10 hours** | **Day 1-3** | **Mainnet wallet + escrow flow** |

**Key Deliverable:** Wallet deployed on mainnet, escrow commands mockable for demo.

### Developer 3: OpenClaw Agent + Skills

| Task | Description | Timeline | Deliverable |
| :--- | :--- | :--- | :--- |
| **OpenClaw Integration** | SDK installation + init | 0-2 hours | Agent initialized |
| **Skill Registration** | Create filePin skill module | 2-5 hours | Skill file in `/src/skills` |
| **Skill Invocation** | Test skill execution via agent | 5-7 hours | Agent calls skill correctly |
| **Aomi UI (Optional)** | React interface for chat | 7-10 hours | Simple web UI (if time) |
| **Total** | **10 hours** | **Day 1-2** | **Agent + Skill integration** |

**Key Deliverable:** Skills registered with OpenClaw agent, can be invoked.

### Developer 4: Architecture + Demo + Submission

| Task | Description | Timeline | Deliverable |
| :--- | :--- | :--- | :--- |
| **Architecture Diagram** | Mermaid flowchart | 0-1 hours | README diagram |
| **README Creation** | Documentation writing | 1-3 hours | Complete `README.md` |
| **Demo Preparation** | Screen recording setup | 3-5 hours | Demo video (optional) |
| **Loops.house Submission** | Fill submission form | 5-7 hours | Verified submission |
| **QA Testing** | Test all features end-to-end | 7-10 hours | Bug report + fix |
| **Total** | **10 hours** | **Day 1-2** | **Ready submission** |

**Key Deliverable:** All documentation ready, submission complete.

## 📅 1-Day Parallel Sprint Timeline

### Hour 0-1: Initialization (ALL TEAM)

```bash
# All team members clone this structure
mkdir claw-pin
cd claw-pin
npm init -y
npm install openclaw-sdk filecoin-pin alkahest-client inquirer jest
```

| Person | Task |
| :--- | :--- |
| **Dev 1** | Start CLI scaffolding (`src/cli/`) |
| **Dev 2** | Start wallet setup (`src/wallet/`) |
| **Dev 3** | Start skill registration (`src/skills/`) |
| **Dev 4** | Start README draft + architecture |

**Status Check:** All repo files initialized, git committed.

### Hour 1-4: Parallel Core Dev (ALL TEAM)

| Dev 1 | Dev 2 | Dev 3 | Dev 4 |
| :--- | :--- | :--- | :--- |
| Upload command integration | Mainnet wallet address | Skill file structure | Architecture diagram |
| Filecoin Pin API calls | Wallet .env config | OpenClaw agent init | README sections |
| Status command queries | Alkahest client install | Skill registration test | QA test cases |
| Unit tests (upload) | Unit tests (wallet) | Unit tests (skill) | Bug report logging |

**Status Check:** Dev 1 & 2 have working modules, Dev 3 has agent init, Dev 4 has draft doc.

### Hour 4-6: Integration (ALL TEAM)

| Dev 1 | Dev 2 | Dev 3 | Dev 4 |
| :--- | :--- | :--- | :--- |
| CLI → Skill integration | Wallet → Payment integration | Skill → Filecoin integration | Test all commands |
| Error logging | Escrow mock flow | Aomi UI (if time) | Submit Loops.house |
| Final CLI tests | Escrow tests | Final skill tests | Video recording |

**Status Check:** All commands pass tests, submission form filled.

### Hour 6-8: Final Polish (ALL TEAM)

| Dev 1 | Dev 2 | Dev 3 | Dev 4 |
| :--- | :--- | :--- | :--- |
| Fix bugs from testing | Fix bugs from testing | Fix bugs from testing | Final documentation |
| Clean error messages | Clean error messages | Clean error messages | Final README |
| Commit to GitHub | Commit to GitHub | Commit to GitHub | Submit final release |

**Status Check:** All code committed, all tests pass.

### Hour 8-10: Submission Window (ALL TEAM)

| Dev 1 | Dev 2 | Dev 3 | Dev 4 |
| :--- | :--- | :--- | :--- |
| Verify submission | Verify submission | Verify submission | Push final to GitHub |
| Test live demo | Test live demo | Test live demo | Final Loops.house submit |

**Status Check:** Submission confirmed on Loops.house.

## 📦 File Structure (Project Layout)

```text
claw-pin/
├── src/
│   ├── cli/
│   │   ├── index.js          # Main CLI entry point
│   │   ├── cmd/
│   │   │   ├── upload.js     # Upload command
│   │   │   └── status.js     # Status command
│   │   └── escrow.js         # Escrow commands
│   ├── skills/
│   │   ├── filePin.js        # Filepin skill
│   │   └── escrow.js         # Escrow skill
│   ├── wallet/
│   │   ├── filecoinPay.js    # Filecoin Pay integration
│   │   └── mainnet.js        # Mainnet config
│   └── integration/
│       ├── alkahest.js       # Alkahest client
│       └── agent.js          # OpenClaw agent setup
├── tests/
│   ├── unit/
│   │   └── skills.test.js
│   └── integration/
│       └── cli.test.js
├── .env.example              # Environment config template
├── .gitignore               # Git ignore
├── README.md                # Project documentation
├── package.json             # Dependencies
└── diagram.md               # Architecture diagram (Mermaid)
```

## 📊 Expected Outcomes Summary

| Role | Deliverable | Success Criteria |
| :--- | :--- | :--- |
| **Dev 1** | Core CLI commands | `upload` + `status` return expected data |
| **Dev 2** | Wallet + Escrow | Mainnet wallet deployed, escrow mock works |
| **Dev 3** | OpenClaw + Skills | Skills registered, agent can invoke them |
| **Dev 4** | Documentation + Submission | README complete, Loops.house submission done |

## 🚀 Quick Start Commands for Team

```bash
# Initial Setup (all team)
git clone <repo-url>
cd claw-pin
npm install

# Parallel Development Hooks
npm start          # Run CLI
npm test           # Run tests
npm run build      # Build for submission
npm run demo       # Demo mode (if implemented)
```

**Communication:**
- **Dev 1 & 2** → Sync at Hour 4 (CLI + Wallet)
- **Dev 3 & 1** → Sync at Hour 5 (Skill + CLI)
- **Dev 2 & 4** → Sync at Hour 7 (Escrow + Submission)

## ✅ Submission Prerequisites

| Checklist Item | Status | Owner |
| :--- | :--- | :--- |
| Code committed to GitHub | ⬜ | All |
| Loops.house submission | ⬜ | Dev 4 |
| Mainnet wallet deployed | ⬜ | Dev 2 |
| Demo video (optional) | ⬜ | Dev 4 |
| README complete | ⬜ | Dev 4 |
| All commands tested | ⬜ | Dev 1 |
| Escrow flow explained | ⬜ | Dev 2 |
| Architecture diagram | ⬜ | Dev 4 |

## 💸 Prize Alignment

| Prize | Alignment | Required Deliverable |
| :--- | :--- | :--- |
| **IPFS Grand Prize ($1000)** | Core CLI + Filecoin Pin + OpenClaw | Working upload + Filecoin Pay mainnet |
| **Arkhai Bounties ($200)** | Escrow integration | `--escrow` flag + Alkahest explanation |
| **Aomi Best App ($300)** | UI + Non-custodial workflow | Optional UI layer (if time) |

## 🚀 Immediate Next Steps

### Step 1: Initialize Project ALL TOGETHER (5 mins)

```bash
# All 4 team members do this in a shared folder
mkdir claw-pin-hackathon && cd claw-pin-hackathon
npm init -y
npm install openclaw-sdk filecoin-pin alkahest-client inquirer jest
git init -q
git add .
git commit -m "Initial scaffolding - PRD ready"
```

### Step 2: Assign Tasks (5 mins)

| Person | Folder to Create | First Task |
| :--- | :--- | :--- |
| **Dev 1** (`src/cli/`) | `src/cli/cmd/upload.js` | Write upload command skeleton |
| **Dev 2** (`src/wallet/`) | `src/wallet/filecoinPay.js` | Create mainnet wallet generator |
| **Dev 3** (`src/skills/`) | `src/skills/filePin.js` | Write skill module |
| **Dev 4** (`docs/`) | `README.md` + `diagram.md` | Draft architecture diagram |

### Step 3: Start Building (Start Clock!)

#### Dev 1: First command should look like:

```javascript
// src/cli/cmd/upload.js
module.exports = {
  name: 'upload',
  action: async (user, file) => {
    console.log(`Uploading ${file}...`);
    // TODO: Integrate filecoin-pin-js
    return { status: 'uploaded', cid: 'placeholder' };
  }
};
```

#### Dev 2: First wallet code:

```javascript
// src/wallet/filecoinPay.js
const fs = require('fs');
const { generateWallet } = require('filecoin-pay-sdk');

async function createMainnetWallet() {
  const wallet = await generateWallet('mainnet');
  fs.writeFileSync('.env.wallet', `WALLET_ADDRESS=${wallet.address}`);
  return wallet;
}
```

#### Dev 3: First skill:

```javascript
// src/skills/filePin.js
const FilePin = require('filecoin-pin');

module.exports = {
  name: 'filePin.upload',
  params: ['file'],
  handler: async (ctx, file) => {
    const pin = await FilePin.upload(file);
    ctx.log(`Pinned to CID: ${pin.cid}`);
    return { cid: pin.cid };
  }
};
```

#### Dev 4: First README section:

```markdown
# claw-pin: Agentic File Storage CLI

## Architecture
\`\`\`mermaid
flowchart LR
  User --> CLI[claw-pin CLI]
  CLI --> OpenClaw[OpenClaw Agent]
  OpenClaw --> FilePin[Filecoin Pin]
  OpenClaw --> Alkahest[Alkahest Escrow]
\`\`\`

## Commands
- \`claw-pin upload <file>\` - Pin file to Filecoin
- \`claw-pin status <CID>\` - Check pin status
- \`claw-pin upload --escrow <file>\` - Create escrow payment
```

## 👨‍💻 Developer Responsibility Breakdown

### 📋 Overview
- **Team Configuration:** 4 Developers (Parallel Work) 
- **Project Mode:** 1-Day Sprint (May 17-18, 2026) 
- **Objective:** Build Agentic File Storage CLI with OpenClaw + Filecoin Pin + Arkhai

---

### 👨‍💻 Developer 1: CLI Core + Filecoin Integration Lead

**🎯 Primary Role:** Build the core command-line interface and integrate Filecoin Pin infrastructure for storage operations.

**📦 Core Responsibilities**

| Priority | Task | Deliverable | Files Owned |
| :--- | :--- | :--- | :--- |
| 🔴 P0 | CLI Framework Scaffolding | Working Node.js CLI with Inquirer.js | `src/cli/index.js` |
| 🔴 P0 | Upload Command | `claw-pin upload <file>` returns CID | `src/cli/cmd/upload.js` |
| 🔴 P0 | Status Command | `claw-pin status <CID>` shows pin data | `src/cli/cmd/status.js` |
| 🟠 P1 | Filecoin Pin SDK Integration | filecoin-pin-js methods working | `src/integration/filecoin-pin.js` |
| 🟠 P1 | Error Handling & Logging | User-friendly error messages | `src/cli/logger.js` |
| 🟢 P2 | Retrieve Command | `claw-pin retrieve <CID>` downloads file | `src/cli/cmd/retrieve.js` |
| 🟢 P2 | Unit Tests (CLI) | Jest tests for upload+status | `tests/cli.test.js` |

**🔧 Technical Components**
```bash
src/cli/
├── index.js           # CLI entry point
├── cmd/
│   ├── upload.js      # Upload command handler
│   ├── status.js      # Status query handler
│   └── retrieve.js    # File download handler (optional)
├── config/
│   └── filecoinPin.js # Filecoin Pin SDK configuration
└── logger/
    └── index.js       # Logging utility
```

**✅ Success Criteria**
- All 3 core commands execute without crashing
- Filecoin Pin SDK calls return valid responses (or mocks)
- Commands print clear success/error output
- Code passes Jest test suite

**🔗 Coordination Points**

| With Dev | Sync Time | Purpose |
| :--- | :--- | :--- |
| Dev 2 | Hour 3 | Pass wallet config to CLI |
| Dev 3 | Hour 5 | Bind skills to CLI commands |
| Dev 4 | Hour 7 | Provide CLI examples for README |

---

### 👨‍💻 Developer 2: Wallet + Escrow Integration Lead

**🎯 Primary Role:** Manage payment infrastructure and implement Arkhai escrow logic for trustless transactions.

**📦 Core Responsibilities**

| Priority | Task | Deliverable | Files Owned |
| :--- | :--- | :--- | :--- |
| 🔴 P0 | Filecoin Pay Wallet | Mainnet wallet generation & config | `src/wallet/mainnet.js` |
| 🔴 P0 | Wallet Initialization | `claw-pin init` shows address | `src/cli/init.js` |
| 🔴 P0 | Alkahest SDK Setup | alkahest-client installed & configured | `src/integration/alkahest.js` |
| 🟠 P1 | Escrow Create Flow | `--escrow` flag creates contract | `src/skills/escrow.js` |
| 🟠 P1 | Escrow Release Flow | `release <CID>` releases funds | `src/cli/cmd/release.js` |
| 🟢 P2 | Mock Escrow Verification | Simple proof check before release | `src/utils/verification.js` |
| 🟢 P2 | Unit Tests (Wallet) | Jest tests for wallet+escrow | `tests/wallet.test.js` |
| 🟢 P2 | Payment Flow Diagram | Visual escrow lifecycle | `docs/escrow-flow.md` |

**🔧 Technical Components**
```bash
src/wallet/
├── mainnet.js         # Mainnet wallet setup
├── filecoinPay.js     # Filecoin Pay SDK wrapper
└── .env.wallet        # Wallet address config (gitignored)

src/skills/
└── escrow.js          # Escrow logic module

src/integration/
└── alkahest.js        # Alkahest client wrapper
```

**✅ Success Criteria**
- Mainnet wallet address displayed to user
- Escrow contract "address" returned on create
- Release command verifies pin before payout
- Architecture flow documented

**🔗 Coordination Points**

| With Dev | Sync Time | Purpose |
| :--- | :--- | :--- |
| Dev 1 | Hour 4 | Pass wallet address to CLI |
| Dev 3 | Hour 5 | Pass escrow data to skills |
| Dev 4 | Hour 7 | Provide escrow docs for submission |

> ⚠️ **Critical Note:** Mainnet wallet must be deployed before submission. Test with $0.01 if possible.

---

### 👨‍💻 Developer 3: OpenClaw Agent + Skills Lead

**🎯 Primary Role:** Build the agent orchestration layer and skill registration system that makes the CLI "agentic."

**📦 Core Responsibilities**

| Priority | Task | Deliverable | Files Owned |
| :--- | :--- | :--- | :--- |
| 🔴 P0 | OpenClaw SDK Setup | Agent initialized in project | `src/integration/agent.js` |
| 🔴 P0 | Skill Registration | Skills load at startup | `src/skills/index.js` |
| 🔴 P0 | filePin Skill | Skill that calls Filecoin Pin | `src/skills/filePin.js` |
| 🟠 P1 | Skill Invocation Test | Agent calls skill with parameters | `tests/skills.test.js` |
| 🟠 P1 | Skill → Command Binding | CLI commands → Skills mapping | `src/cli/index.js` |
| 🟢 P2 | Aomi UI Integration | React UI layer (if time permits) | `src/ui/index.js` |
| 🟢 P2 | Skill Documentation | Explain agent workflow in README | `docs/skills.md` |
| 🟢 P2 | Unit Tests (Skills) | Jest tests for skill logic | `tests/unit/skills.test.js` |

**🔧 Technical Components**
```bash
src/
├── integration/
│   └── agent.js       # OpenClaw agent initialization
│
├── skills/
│   ├── index.js       # Skill export & registration
│   ├── filePin.js     # Filepin skill handler
│   └── escrow.js      # Escrow skill (with Dev 2)
│
└── ui/                # Optional Aomi UI layer
    └── index.js       # React component (if time)
```

**✅ Success Criteria**
- OpenClaw agent loads without errors
- `filePin` skill is registered and discoverable
- Agent can invoke skill with proper params
- Skills can call external APIs (Filecoin Pin)

**🔗 Coordination Points**

| With Dev | Sync Time | Purpose |
| :--- | :--- | :--- |
| Dev 1 | Hour 5 | Bind CLI commands to skills |
| Dev 2 | Hour 5 | Use escrow skill for payment |
| Dev 4 | Hour 7 | Document agent flow for README |

> 💡 **Key Insight:** The skill registration layer is what makes this an "agent" not just a CLI tool. This scores innovation points.

---

### 👨‍💻 Developer 4: Architecture, Demo + Submission Lead

**🎯 Primary Role:** Own all documentation, architecture diagrams, demo materials, and Loops.house submission.

**📦 Core Responsibilities**

| Priority | Task | Deliverable | Files Owned |
| :--- | :--- | :--- | :--- |
| 🔴 P0 | README Creation | Complete project documentation | `README.md` |
| 🔴 P0 | Architecture Diagram | Mermaid flowchart | `README.md` / `diagram.md` |
| 🔴 P0 | Loops.house Submission | Filled submission form | Submission page |
| 🔴 P0 | Submission Verification | All fields complete, ready to submit | Submission form |
| 🟠 P1 | Demo Video | 3-minute screen recording | `demo/video.mp4` |
| 🟠 P1 | PRD Draft | Project requirements document | `PRD.md` |
| 🟢 P2 | QA Testing | Test all features, log bugs | `tests/qa-report.md` |
| 🟢 P2 | Bug Tracking | GitHub issues for found bugs | `.github/ISSUES.md` |

**🔧 Technical Components**
```bash
docs/
├── README.md          # Project documentation
├── diagram.md         # Mermaid architecture
├── PRD.md            # Requirements doc
└── demo/
    └── video.mp4     # Demo recording (if created)

submission/
└── loops-house-creds.txt  # Submission form data
```

**✅ Success Criteria**
- README includes all required sections
- Architecture diagram clearly shows agent flow
- Loops.house submission is submitted + confirmed
- Demo video captures all CLI commands

**🔗 Coordination Points**

| With Dev | Sync Time | Purpose |
| :--- | :--- | :--- |
| Dev 1 | Hour 6 | Collect CLI examples |
| Dev 2 | Hour 7 | Get escrow flow explanation |
| Dev 3 | Hour 7 | Get agent architecture |
| All | Hour 9 | Final submission review |

> ⚠️ **Critical Deadline:** Submission must be on Loops.house by May 18, 2026 (hackathon end date).

---

### 📊 Cross-Developer Dependencies

| Dependency | Blocker | Who Fixes |
| :--- | :--- | :--- |
| Wallet address | Dev 1 needs address for CLI | Dev 2 (P0) |
| Mainnet config | Dev 1 needs to call Filecoin API | Dev 2 (P0) |
| Skill registration | CLI needs skills to work | Dev 3 (P0) |
| Filecoin Pin API | Dev 3 needs skill to call | Dev 1 (P0) |
| Escrow flow | Dev 4 needs explanation for docs | Dev 2 (P1) |
| Architecture | All devs need diagram | Dev 4 (P0) |

### 🎯 Individual Code Ownership Summary

| Developer | Owns These Files |
| :--- | :--- |
| **Dev 1** | `src/cli/`, `tests/cli.test.js` |
| **Dev 2** | `src/wallet/`, `src/integration/alkahest.js`, `tests/wallet.test.js` |
| **Dev 3** | `src/integration/agent.js`, `src/skills/`, `tests/unit/skills.test.js` |
| **Dev 4** | `README.md`, `diagram.md`, `submission/*` |

### ⚡ Daily Communication Checkpoints

| Time | Team | Attendees | Agenda |
| :--- | :--- | :--- | :--- |
| Hour 1 | Kickoff | All | Scope, file structure |
| Hour 3 | Sync | Dev 1, Dev 2 | CLI + Wallet handoff |
| Hour 5 | Integration | Dev 1, Dev 3 | CLI + Skills binding |
| Hour 7 | Escrow | Dev 2, Dev 4 | Docs + flow |
| Hour 8 | Final Test | Dev 1-4 | End-to-end verification |
| Hour 9 | Submit Prep | All | Review submission |
| Hour 10 | Go Live | All | Final launch |

### ✅ Individual Sign-Off Checklist (End of Day)

| Developer | Tasks Complete |
| :--- | :--- |
| **Dev 1** | CLI works, tests pass, code committed |
| **Dev 2** | Wallet deployed, escrow mocks working, code committed |
| **Dev 3** | Skills registered, agent loads, code committed |
| **Dev 4** | README done, submission submitted, docs complete |
