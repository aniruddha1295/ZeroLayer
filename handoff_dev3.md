# 🤝 Handoff Doc: Dev 3 → From Dev 1

> **Purpose:** Dev 3 (OpenClaw Agent + Skills Lead) needs this doc to understand exactly what Dev 1 has built, what hooks are in place for skill binding, and what Dev 3 must deliver back to Dev 1 by **Hour 5**.

---

## 📍 Context: Why Dev 3 and Dev 1 Are Coupled

The CLI commands (`upload`, `status`, `retrieve`) currently call the Filecoin Pin integration directly. In the full agentic architecture, these commands should **delegate to OpenClaw Skills** instead — making the CLI a thin dispatcher and the Skills the actual workers.

Dev 1 has built the CLI dispatcher layer. Dev 3 builds the skill worker layer. At Hour 5 they bind together.

---

## ✅ What Dev 1 Has Already Built (Don't Rebuild These)

### 1. The Full CLI — Already Working End-to-End

All three commands are live and testable **right now** using the mock Filecoin Pin integration:

```bash
node src/cli/index.js upload test.txt
node src/cli/index.js status <CID>
node src/cli/index.js retrieve <CID> ./output.txt
```

Dev 3 does **not** need to touch these commands to build or test skills. Skills can be developed and tested independently.

---

### 2. Filecoin Pin Integration — `src/integration/filecoin-pin.js`

Dev 1 has built a mock wrapper with a **stable interface contract**. Dev 3's `filePin` skill should call these same functions internally:

```javascript
const { pinFile, getPinStatus, retrieveFile } = require('../integration/filecoin-pin');
```

**`pinFile(filePath)`** → Returns:
```javascript
{
  cid: 'bafybeig…',     // Content Identifier
  status: 'pinned',
  size: 74,             // bytes
  cost: '0.00000001 FIL',
  providers: 3
}
```

**`getPinStatus(cid)`** → Returns:
```javascript
{
  cid: '…',
  status: 'pinned',
  providers: 3,
  retrievable: true
}
```

**`retrieveFile(cid, outputPath)`** → Returns:
```javascript
{
  cid: '…',
  outputPath: '/absolute/path/output.txt',
  size: 123
}
```

**Error codes thrown** (Dev 3's skill handlers must propagate these cleanly):

| Error Code | Meaning |
|:---|:---|
| `FILE_NOT_FOUND` | Local file path does not exist |
| `INVALID_CID` | CID string is empty or malformed |
| `CID_NOT_FOUND` | CID not found on the Filecoin network |

---

### 3. Logger Utility — `src/cli/logger.js`

Dev 3 **must use this shared logger** in all skill modules for consistent output:

```javascript
const logger = require('../cli/logger'); // adjust relative path

logger.info('Executing filePin skill…');
logger.success('Skill completed. CID returned.');
logger.error('Skill failed', err);
logger.field('CID', result.cid);
```

Available methods:

| Method | Colour | Use |
|:---|:---|:---|
| `logger.info(msg)` | Cyan | Skill execution status |
| `logger.success(msg)` | Green | Successful skill result |
| `logger.warn(msg)` | Yellow | Non-fatal skill warnings |
| `logger.error(msg, err)` | Red | Skill failure |
| `logger.field(label, val)` | White + Cyan | Structured output |
| `logger.divider()` | Grey | Visual separator |

---

### 4. The `--escrow` Flag Hook — `src/cli/cmd/upload.js`

The upload command already accepts an `--escrow` option. At Hour 5 when CLI binds to skills, the escrow skill (built jointly by Dev 2 and Dev 3) will be invoked through this path.

Dev 3's `escrow` skill module must be importable by `upload.js` at that point. Dev 3 and Dev 2 co-own `src/skills/escrow.js`.

---

### 5. Existing Tests — `tests/cli.test.js`

Dev 1 has 15 passing tests. Dev 3 must **not break any of these** when binding skills. The test file mocks the integration layer — skills sit above this layer, so adding skills should not affect the existing tests.

Dev 3 should write new tests in:
```
tests/unit/skills.test.js    ← skill unit tests (Dev 3 owns)
tests/skills.test.js         ← skill invocation tests (Dev 3 owns)
```

---

## 🔴 What Dev 3 Must Build (Dev 1 Is Blocked On These at Hour 5)

### Task A: OpenClaw Agent Initialization — `src/integration/agent.js`

```javascript
// src/integration/agent.js — required interface for Dev 1

const { OpenClaw } = require('openclaw-sdk');

let agentInstance = null;

/**
 * Initialize and return the OpenClaw agent singleton.
 * Registers all skills from src/skills/index.js.
 * @returns {Promise<OpenClawAgent>}
 */
async function initAgent() {
  if (agentInstance) return agentInstance;
  agentInstance = await OpenClaw.init({ /* config */ });
  // register skills here
  return agentInstance;
}

/**
 * Get the already-initialized agent (throws if not initialized).
 * @returns {OpenClawAgent}
 */
function getAgent() {
  if (!agentInstance) throw new Error('Agent not initialized. Call initAgent() first.');
  return agentInstance;
}

module.exports = { initAgent, getAgent };
```

---

### Task B: Skills Index — `src/skills/index.js`

This is the central registry. All skills are exported from here:

```javascript
// src/skills/index.js — required by Dev 1 when binding CLI to agent

const { filePinSkill } = require('./filePin');
const { escrowSkill } = require('./escrow');  // co-owned with Dev 2

module.exports = {
  filePinSkill,
  escrowSkill,
};
```

---

### Task C: filePin Skill — `src/skills/filePin.js`

**This is the most critical deliverable for Dev 1 binding.** The skill must match this exact interface:

```javascript
// src/skills/filePin.js — required interface contract

const { pinFile, getPinStatus, retrieveFile } = require('../integration/filecoin-pin');

const filePinSkill = {
  name: 'filePin.upload',
  description: 'Pins a file to the Filecoin network and returns its CID',
  params: ['filePath'],

  /**
   * @param {object} ctx — OpenClaw agent context (provides ctx.log)
   * @param {string} filePath — absolute path to the file to pin
   * @returns {Promise<{ cid: string, status: string, size: number, cost: string }>}
   */
  handler: async (ctx, filePath) => {
    ctx.log(`Pinning file: ${filePath}`);
    const result = await pinFile(filePath);
    ctx.log(`Pinned. CID: ${result.cid}`);
    return result;
  },
};

const filePinStatusSkill = {
  name: 'filePin.status',
  description: 'Queries the pin status of a CID',
  params: ['cid'],

  handler: async (ctx, cid) => {
    ctx.log(`Querying status for: ${cid}`);
    const result = await getPinStatus(cid);
    ctx.log(`Status: ${result.status}`);
    return result;
  },
};

module.exports = { filePinSkill, filePinStatusSkill };
```

---

## 🔌 Exact Integration Point: How Dev 3 Binds to Dev 1's CLI (Hour 5)

At Hour 5, Dev 1 will update the CLI commands to route through the agent skills. Here is exactly how the binding will look — so Dev 3 can ensure the skill interface matches:

```javascript
// BEFORE (current — direct integration call in upload.js):
const { pinFile } = require('../../integration/filecoin-pin');
const result = await pinFile(resolvedPath);

// AFTER (Hour 5 — routed through OpenClaw skill):
const { getAgent } = require('../../integration/agent');
const agent = getAgent();
const result = await agent.invoke('filePin.upload', resolvedPath);
// result shape is identical — same { cid, status, size, cost, providers }
```

**Key constraint:** The skill handler's return shape **must be identical** to the direct `pinFile()` return shape, because `upload.js` reads `result.cid`, `result.size`, `result.cost`, and `result.providers` directly. If the shape changes, Dev 1 will need to know.

---

### Skill Invocation Contract (What Dev 1 Will Call)

| CLI Command | Agent Invocation | Expected Return |
|:---|:---|:---|
| `upload <file>` | `agent.invoke('filePin.upload', filePath)` | `{ cid, status, size, cost, providers }` |
| `status <cid>` | `agent.invoke('filePin.status', cid)` | `{ cid, status, providers, retrievable }` |
| `retrieve <cid> <out>` | `agent.invoke('filePin.retrieve', cid, outputPath)` | `{ cid, outputPath, size }` |
| `upload --escrow <file>` | `agent.invoke('escrow.create', cid, walletAddress)` | `{ contractAddress, status }` |

---

## ⏰ Hour 5 Sync Agenda (Dev 1 ↔ Dev 3)

Come prepared with:
1. ✅ `src/integration/agent.js` — `initAgent()` and `getAgent()` working
2. ✅ `src/skills/filePin.js` — `filePinSkill.handler` callable and tested
3. ✅ `src/skills/index.js` — exports all skills
4. ❓ Confirm `agent.invoke()` API shape — is it `agent.invoke(skillName, ...args)` or `agent.run({ skill, params })`? Dev 1 needs the exact call signature to wire the binding.
5. ❓ Confirm if `initAgent()` needs to be called once at startup or per command — affects where Dev 1 puts it in `index.js`.

---

## 🗂️ File Ownership Summary

| File | Owner | Notes |
|:---|:---|:---|
| `src/cli/index.js` | Dev 1 | Dev 3 confirms `initAgent()` placement |
| `src/cli/cmd/upload.js` | Dev 1 | Dev 1 rebinds to skill at Hour 5 |
| `src/cli/cmd/status.js` | Dev 1 | Dev 1 rebinds to skill at Hour 5 |
| `src/cli/cmd/retrieve.js` | Dev 1 | Dev 1 rebinds to skill at Hour 5 |
| `src/cli/logger.js` | Dev 1 ✅ done | Shared — Dev 3 uses this |
| `src/integration/filecoin-pin.js` | Dev 1 ✅ done | Dev 3 calls this from inside skills |
| `src/integration/agent.js` | **Dev 3** | OpenClaw init + singleton |
| `src/skills/index.js` | **Dev 3** | Skill registry |
| `src/skills/filePin.js` | **Dev 3** | filePin upload/status/retrieve skills |
| `src/skills/escrow.js` | **Dev 2 + Dev 3** | Escrow skill (coordinate at Hour 5) |
| `tests/unit/skills.test.js` | **Dev 3** | Skill unit tests |

---

## 📋 Dev 3 Deliverables Checklist (by Hour 5)

| Deliverable | File | Blocks |
|:---|:---|:---|
| OpenClaw agent init | `src/integration/agent.js` | Dev 1 CLI → Skill binding |
| Skill registry | `src/skills/index.js` | Dev 1 skill routing |
| filePin upload skill | `src/skills/filePin.js` | `claw-pin upload` via agent |
| filePin status skill | `src/skills/filePin.js` | `claw-pin status` via agent |
| filePin retrieve skill | `src/skills/filePin.js` | `claw-pin retrieve` via agent |
| Skill unit tests | `tests/unit/skills.test.js` | Test coverage |
| Agent invocation API confirmed | (verbal/message) | Dev 1 can't write the binding without this |

---

## 🔁 What Stays the Same After Skill Binding

These files are **not touched** during the Hour 5 rebind — Dev 3 should not worry about them:

- `src/cli/logger.js` — unchanged
- `src/integration/filecoin-pin.js` — unchanged (skills call into it)
- `tests/cli.test.js` — all 15 tests must continue to pass
- `.env.example` / `.env` — unchanged
