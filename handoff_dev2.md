# 🤝 Handoff Doc: Dev 2 → From Dev 1

> **Purpose:** Dev 2 (Wallet + Escrow Lead) needs this doc to understand exactly what Dev 1 has built, what stubs/hooks have been left behind explicitly for Dev 2, and what Dev 2 must deliver back to Dev 1 by **Hour 3**.

---

## 📍 Context: Why Dev 2 and Dev 1 Are Coupled

The CLI (`upload` command) already supports an `--escrow` flag. The flag is **registered and parsed** by the CLI router. However, the actual escrow logic — creating an Alkahest contract, calling the Filecoin Pay wallet, and releasing funds on verification — is **intentionally left as a stub** waiting for Dev 2's modules.

Dev 1 has built the plumbing. Dev 2 supplies the water.

---

## ✅ What Dev 1 Has Already Built (Don't Rebuild These)

### 1. CLI Entry Point — `src/cli/index.js`

The main CLI is fully wired. All commands are registered via Commander.js. Dotenv is already loaded at startup — meaning any `.env` file Dev 2 creates will be automatically picked up **without any changes to `index.js`**.

```
node src/cli/index.js --help

Commands:
  upload [options] <file>       ← --escrow flag is already registered here
  status <cid>
  retrieve <cid> <outputPath>
```

**Dev 2 does NOT need to touch `index.js`** to register new commands — just add a new command block following the existing pattern.

---

### 2. Upload Command — `src/cli/cmd/upload.js`

The `--escrow` flag is parsed and a stub warning is printed. This is the exact line Dev 2 will replace:

```javascript
// src/cli/cmd/upload.js — Lines 23-25 (THE STUB)
if (options.escrow) {
  logger.warn('Escrow mode enabled — Dev 2 escrow logic will be invoked after pinning.');
}
```

**After pinning succeeds** (line 30), `result` contains:
```javascript
result = {
  cid: 'bafybeig…',   // ← Pass this to your escrow create function
  status: 'pinned',
  size: 74,           // bytes
  cost: '0.00000001 FIL',
  providers: 3
}
```

**Dev 2's job:** Replace the stub warning block with a real call to `src/skills/escrow.js`. The CID from `result.cid` is your input to the escrow contract creation.

---

### 3. Logger Utility — `src/cli/logger.js`

Shared logging is already built. Dev 2 **must use this** for consistent output:

```javascript
const logger = require('../cli/logger');  // adjust path from your file's location

logger.info('Creating escrow contract…');
logger.field('Contract Address', '0x7a23…');
logger.success('Escrow created. Funds locked.');
logger.error('Escrow creation failed', err);
logger.warn('Low wallet balance detected.');
```

Available methods:
| Method | Output colour | Use case |
|:---|:---|:---|
| `logger.info(msg)` | Cyan | Status updates |
| `logger.success(msg)` | Green | Successful completion |
| `logger.warn(msg)` | Yellow | Non-fatal warnings |
| `logger.error(msg, err)` | Red | Failures (no crash) |
| `logger.field(label, val)` | White + Cyan | Key-value display |
| `logger.divider()` | Grey line | Visual separation |

---

### 4. Environment Config — `.env.example`

Dev 1 has already created `.env.example` with the exact placeholder Dev 2 needs to fill:

```bash
# .env.example
WALLET_ADDRESS=          ← Dev 2 fills this
FILECOIN_PIN_API_KEY=    ← Dev 2 fills this if needed
DEBUG=false
```

When Dev 2 creates `.env.wallet`, **dotenv in `index.js` will auto-load it** — no code change needed. Just ensure the key names match.

---

### 5. Filecoin Pin Integration — `src/integration/filecoin-pin.js`

The `pinFile()` function is already implemented and returns:

```javascript
// Return shape of pinFile() — Dev 2 can depend on this contract
{
  cid: 'bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f',
  status: 'pinned',
  size: 74,              // file size in bytes
  cost: '0.00000001 FIL',
  providers: 3
}
```

Dev 2's escrow flow receives `cid` from this output and uses it to:
1. Create the Alkahest escrow contract (lock funds, tied to this CID)
2. Later verify pin status (call `getPinStatus(cid)`) before releasing funds

`getPinStatus()` is also already implemented and returns:
```javascript
{
  cid: '…',
  status: 'pinned',
  providers: 3,
  retrievable: true   // ← Use this as the release condition
}
```

---

## 🔴 What Dev 2 Must Build (Dev 1 Is Blocked On These)

### Task A: Mainnet Wallet — `src/wallet/mainnet.js`

**Dev 1 needs:** The exported wallet address and a working `.env.wallet` file by **Hour 3**.

Expected module shape:

```javascript
// src/wallet/mainnet.js — what Dev 2 must export
async function createMainnetWallet() {
  // ... filecoin-pay-sdk logic
  return {
    address: 'f1…',        // ← Dev 1 will display this via claw-pin init
    privateKey: '…',       // ← store encrypted, do not log
  };
}

module.exports = { createMainnetWallet };
```

Dev 1 will create `src/cli/cmd/init.js` to call this as soon as it's available.

---

### Task B: `.env.wallet` File

Create this file in the project root (it is already in `.gitignore`):

```bash
# .env.wallet — created by Dev 2, consumed by the entire CLI
WALLET_ADDRESS=f1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FILECOIN_PAY_API_KEY=your_key_here
```

Dev 1's `index.js` already calls `require('dotenv').config()` — this file will be auto-loaded.

---

### Task C: Escrow Skill — `src/skills/escrow.js`

This is the module Dev 1's `upload.js` stub is waiting for. It must export at minimum:

```javascript
// src/skills/escrow.js — required interface contract for Dev 1's stub

/**
 * Creates an Alkahest escrow contract for a pinned CID.
 * @param {string} cid — the CID returned from pinFile()
 * @param {string} walletAddress — from process.env.WALLET_ADDRESS
 * @returns {Promise<{ contractAddress: string, status: string }>}
 */
async function createEscrow(cid, walletAddress) { … }

/**
 * Releases escrowed funds once pin is verified.
 * @param {string} contractAddress — from createEscrow()
 * @param {string} cid — to verify pin status before release
 * @returns {Promise<{ released: boolean, txHash: string }>}
 */
async function releaseEscrow(contractAddress, cid) { … }

module.exports = { createEscrow, releaseEscrow };
```

---

## 🔌 Exact Integration Point: How Dev 2 Wires Into Dev 1's Upload

Once Dev 2 delivers `src/skills/escrow.js`, Dev 1 will update the stub in `upload.js` like this:

```javascript
// BEFORE (current stub — src/cli/cmd/upload.js lines 23-25):
if (options.escrow) {
  logger.warn('Escrow mode enabled — Dev 2 escrow logic will be invoked after pinning.');
}

// AFTER (post-integration, wired by Dev 1 at Hour 3-5):
if (options.escrow) {
  const { createEscrow } = require('../../skills/escrow');
  const escrowSpinner = ora('Creating Alkahest escrow contract…').start();
  const escrowResult = await createEscrow(result.cid, process.env.WALLET_ADDRESS);
  escrowSpinner.succeed('Escrow contract created!');
  logger.field('Contract Address', escrowResult.contractAddress);
  logger.field('Escrow Status', escrowResult.status);
}
```

**Dev 2 does not need to touch `upload.js`** — Dev 1 will wire it in. Dev 2 only needs to deliver the working `createEscrow()` and `releaseEscrow()` functions.

---

## 📋 Dev 2 Deliverables Checklist (by Hour 3)

| Deliverable | File | Required By |
|:---|:---|:---|
| Mainnet wallet generator | `src/wallet/mainnet.js` | Dev 1 (`claw-pin init`) |
| Wallet env config | `.env.wallet` in project root | All devs |
| Escrow skill module | `src/skills/escrow.js` | Dev 1 (`upload --escrow`) |
| Escrow release command | `src/cli/cmd/release.js` | Dev 2 owns this entirely |
| Payment flow diagram | `docs/escrow-flow.md` | Dev 4 (docs) |

---

## ⏰ Hour 3 Sync Agenda (Dev 1 ↔ Dev 2)

At Hour 3, come prepared with:
1. ✅ `.env.wallet` file — Dev 1 copies values into `.env` immediately
2. ✅ Function signature of `createEscrow()` confirmed — Dev 1 wires the stub
3. ✅ `src/wallet/mainnet.js` accessible — Dev 1 creates `claw-pin init` immediately
4. ❓ Any breaking changes to `.env` key names — agree on them now

---

## 🗂️ File Ownership Summary

| File | Owner | Notes |
|:---|:---|:---|
| `src/cli/index.js` | Dev 1 | Dev 2 can add `init` command block here |
| `src/cli/cmd/upload.js` | Dev 1 | Dev 1 wires escrow at Hour 3-5 |
| `src/cli/cmd/init.js` | Dev 1 | Created after Dev 2 delivers wallet |
| `src/cli/cmd/release.js` | **Dev 2** | Dev 2 builds this independently |
| `src/wallet/mainnet.js` | **Dev 2** | Core wallet generator |
| `src/wallet/filecoinPay.js` | **Dev 2** | Filecoin Pay SDK wrapper |
| `src/skills/escrow.js` | **Dev 2** | Alkahest escrow logic |
| `src/integration/alkahest.js` | **Dev 2** | Alkahest client wrapper |
| `src/cli/logger.js` | Dev 1 ✅ done | Shared — everyone uses this |
| `.env.example` | Dev 1 ✅ done | Dev 2 populates `.env.wallet` |
