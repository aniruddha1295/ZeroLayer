# 👨‍💻 Dev 1 Task Breakdown: CLI Core + Filecoin Integration

> **Status Tracker** — Last verified: 2026-05-17 | All live-run results recorded below.

## 🎯 Primary Role
Build the core command-line interface and integrate Filecoin Pin infrastructure for storage operations.

## 🛠️ Technology Stack
- **CLI Framework:** Node.js + Commander.js + Inquirer.js
- **Storage Layer Integration:** `filecoin-pin-js` (mock wrapper in `src/integration/filecoin-pin.js`)
- **Spinner:** `ora@5`
- **Colour output:** `chalk@4`
- **Testing:** Jest (with `--coverage`)
- **Env management:** `dotenv`

---

## 📦 Task Status Overview

| # | Task | Priority | Status |
|:--|:-----|:---------|:-------|
| 1 | CLI Framework Scaffolding | P0 | ✅ COMPLETE |
| 2 | Upload Command Integration | P0 | ✅ COMPLETE |
| 3 | Status Command | P0 | ✅ COMPLETE |
| 4 | Error Handling & Logging | P1 | ✅ COMPLETE |
| 5 | CLI Unit Testing | P2 | ✅ COMPLETE |
| 6 | Retrieve Command (Optional) | P2 | ✅ COMPLETE |
| 7 | `claw-pin init` + Filecoin Pay wiring | P0 | ⏳ BLOCKED — Waiting on Dev 2 (Hour 3 sync) |

---

## 📦 Detailed Task Results

---

### ✅ Task 1: CLI Framework Scaffolding (P0)
- **Files:** `src/cli/index.js`
- **Expected Outcome:** CLI entry point parses arguments, shows help, registers all subcommands.

**🚦 Checking Gates — Live Run Results:**

```
$ node src/cli/index.js --help

Usage: claw-pin [options] [command]

🏆 Agentic File Storage CLI — Trustless file pinning with Filecoin + OpenClaw

Options:
  -v, --version                Output the current version
  -h, --help                   display help for command

Commands:
  upload [options] <file>      Pin a local file to Filecoin decentralised storage
  status <cid>                 Query the pin status of a CID on Filecoin
  retrieve <cid> <outputPath>  Download a pinned file by CID to a local path
  help [command]               display help for command
```

- [x] `--help` renders correctly without crashing
- [x] All 3 subcommands (`upload`, `status`, `retrieve`) are registered and listed
- [x] Structure supports easy addition of new subcommands

**Result: ✅ PASSED**

---

### ✅ Task 2: Upload Command Integration (P0)
- **Files:** `src/cli/cmd/upload.js`, `src/integration/filecoin-pin.js`
- **Expected Outcome:** `claw-pin upload <file>` pins file, returns CID and pin details.

**🚦 Checking Gates — Live Run Results:**

```
$ node src/cli/index.js upload test.txt

ℹ️  Preparing to upload: P:\Shangai\Claw-pin\test.txt
✔ File pinned successfully!
──────────────────────────────────────────────────
  CID:            bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f
  Status:         pinned
  File Size:      74 bytes
  Estimated Cost: 0.00000000 FIL
  Providers:      3
──────────────────────────────────────────────────
✅ Pin complete. CID: bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f
```

- [x] CLI correctly reads `test.txt`
- [x] Filecoin Pin integration is invoked with file data
- [x] CID is returned in `bafybeig…` format
- [x] Size, cost, and provider count displayed

**Result: ✅ PASSED**

---

### ✅ Task 3: Status Command (P0)
- **Files:** `src/cli/cmd/status.js`
- **Expected Outcome:** `claw-pin status <CID>` returns pin status and provider info.

**🚦 Checking Gates — Live Run Results:**

```
$ node src/cli/index.js status bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f

ℹ️  Querying pin status for CID: bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f
✔ Status retrieved!
──────────────────────────────────────────────────
  CID:         bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f
  Status:      pinned
  Providers:   3
  Retrievable: Yes
──────────────────────────────────────────────────
```

```
$ node src/cli/index.js status QmInvalidCID999

✖ Status query failed.
❌ CID not found on the network: "QmInvalidCID999". Verify the CID is correct.
```

- [x] SDK query returns correct status for a known CID
- [x] Output displays `Status: pinned | Providers: 3 | Retrievable: Yes`
- [x] Unknown CID gives a clean, user-friendly error

**Result: ✅ PASSED**

---

### ✅ Task 4: Error Handling & Logging (P1)
- **Files:** `src/cli/logger.js`
- **Expected Outcome:** Clean, readable errors — no raw stack traces.

**🚦 Checking Gates — Live Run Results:**

```
$ node src/cli/index.js upload doesntexist.txt

ℹ️  Preparing to upload: P:\Shangai\Claw-pin\doesntexist.txt
✖ Upload failed.
❌ File not found: "doesntexist.txt". Please check the path and try again.
```

- [x] Non-existent file produces a clean, readable error message
- [x] Process exits with code 1 (no crash, no raw stack trace)
- [x] Invalid CID on status also produces a clean error
- [x] `DEBUG=true` mode would expose raw stack trace (implemented in logger.js)

**Result: ✅ PASSED**

---

### ✅ Task 5: CLI Unit Testing (P2)
- **Files:** `tests/cli.test.js`
- **Expected Outcome:** 80%+ code coverage, all commands tested.

**🚦 Checking Gates — Live Run Results:**

```
$ npm test

PASS tests/cli.test.js (7.807s)

  filecoin-pin integration: pinFile()
    ✔ pins an existing file and returns a valid CID
    ✔ throws FILE_NOT_FOUND for a missing file

  filecoin-pin integration: getPinStatus()
    ✔ returns pinned status for a known CID
    ✔ throws CID_NOT_FOUND for an unknown CID
    ✔ throws INVALID_CID for an empty string

  filecoin-pin integration: retrieveFile()
    ✔ retrieves a known CID and writes file to disk
    ✔ throws CID_NOT_FOUND for an unknown CID

  uploadCommand()
    ✔ returns a result with CID for an existing file
    ✔ returns null and sets exitCode for a missing file

  statusCommand()
    ✔ returns status for a valid pinned CID
    ✔ returns null and sets exitCode for an unknown CID
    ✔ returns null and sets exitCode when CID is empty

  retrieveCommand()
    ✔ retrieves a file and writes it to outputPath
    ✔ returns null for missing CID arg
    ✔ returns null for missing outputPath arg

Tests:       15 passed, 15 total
Coverage:    85.5% statements | 100% functions | 85.29% lines
```

- [x] `npm test` runs without errors
- [x] **15/15 tests pass**
- [x] **85.5% statement coverage** (exceeds 80% target)
- [x] Both success and error paths covered for all commands

**Result: ✅ PASSED**

---

### ✅ Task 6: Retrieve Command (P2 — Optional)
- **Files:** `src/cli/cmd/retrieve.js`
- **Expected Outcome:** `claw-pin retrieve <CID> <outputPath>` downloads file to disk.

**🚦 Checking Gates — Live Run Results:**

```
$ node src/cli/index.js retrieve bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f ./output_verify.txt

ℹ️  Retrieving CID: bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f → ./output_verify.txt
✔ File retrieved successfully!
──────────────────────────────────────────────────
  CID:      bafybeig4e5b90d6ff64f4a8ff53bc640206e20f1b98675d9c9f
  Saved to: P:\Shangai\Claw-pin\output_verify.txt
  Size:     123 bytes
──────────────────────────────────────────────────
✅ Retrieval complete. File saved to: P:\Shangai\Claw-pin\output_verify.txt
```

- [x] `output_verify.txt` created successfully on disk
- [x] File contents include CID and retrieval timestamp
- [x] Bad CID produces a clean error (tested in Jest suite)

**Result: ✅ PASSED**

---

### ⏳ Task 7: `claw-pin init` + Filecoin Pay Wiring (P0 — BLOCKED)
- **Files:** `src/cli/cmd/init.js` *(not yet created)*
- **Blocked by:** Dev 2 — needs `src/wallet/mainnet.js` and `.env.wallet`
- **Unblocks at:** Hour 3 sync with Dev 2

**What's already prepared (stubs in place):**
- `--escrow` flag exists in `upload.js` with a warning stub — ready for Dev 2 to wire in
- `.env.example` has `WALLET_ADDRESS=` placeholder
- `dotenv` is loaded in `index.js` — `.env.wallet` will be picked up automatically

**Action at Hour 3 sync:**
1. Get `.env.wallet` from Dev 2 → copy values to `.env`
2. Get function signature of `src/wallet/mainnet.js` from Dev 2
3. Create `src/cli/cmd/init.js` to call Dev 2's wallet generator
4. Wire escrow call into `upload.js --escrow` stub

**Result: ⏳ PENDING DEV 2**

---

## 🔗 Sync Points & Dependencies

| Time | With | Purpose | Status |
|:-----|:-----|:--------|:-------|
| Hour 3 | Dev 2 | Get wallet address + `.env.wallet` to unblock `claw-pin init` | ⏳ Pending |
| Hour 5 | Dev 3 | Bind CLI commands to OpenClaw Agent Skills | ⏳ Pending |
| Hour 6 | Dev 4 | Provide CLI output examples for README | ⏳ Pending |
| Hour 8 | All | End-to-end integration test | ⏳ Pending |
