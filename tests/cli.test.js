/**
 * cli.test.js — Unit tests for Dev 1's CLI commands
 *
 * Tests cover:
 *  - upload:   success path, file-not-found error
 *  - status:   success path, unknown CID, empty CID
 *  - retrieve: success path, bad CID, missing args
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const { pinFile, getPinStatus, retrieveFile } = require('../src/integration/filecoin-pin');
const { uploadCommand } = require('../src/cli/cmd/upload');
const { statusCommand } = require('../src/cli/cmd/status');
const { retrieveCommand } = require('../src/cli/cmd/retrieve');

// ─── Silence logger output during tests ──────────────────────────────────────
jest.mock('../src/cli/logger', () => ({
  info: jest.fn(),
  success: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  field: jest.fn(),
  divider: jest.fn(),
}));

// Silence ora spinner
jest.mock('ora', () =>
  jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
  }))
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
let tmpFile;

beforeAll(() => {
  // Create a temporary real file for upload tests
  tmpFile = path.join(os.tmpdir(), 'claw-pin-test.txt');
  fs.writeFileSync(tmpFile, 'hello from claw-pin test', 'utf8');
});

afterAll(() => {
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
});

// ─── Integration wrapper: pinFile ────────────────────────────────────────────
describe('filecoin-pin integration: pinFile()', () => {
  test('pins an existing file and returns a valid CID', async () => {
    const result = await pinFile(tmpFile);
    expect(result).toHaveProperty('cid');
    expect(result.cid).toMatch(/^bafybeig/);
    expect(result.status).toBe('pinned');
    expect(result.size).toBeGreaterThan(0);
    expect(result.providers).toBe(3);
  });

  test('throws FILE_NOT_FOUND for a missing file', async () => {
    await expect(pinFile('/this/path/does/not/exist.txt')).rejects.toMatchObject({
      code: 'FILE_NOT_FOUND',
    });
  });
});

// ─── Integration wrapper: getPinStatus ───────────────────────────────────────
describe('filecoin-pin integration: getPinStatus()', () => {
  test('returns pinned status for a known CID', async () => {
    const { cid } = await pinFile(tmpFile);
    const status = await getPinStatus(cid);
    expect(status.status).toBe('pinned');
    expect(status.retrievable).toBe(true);
    expect(status.providers).toBe(3);
  });

  test('throws CID_NOT_FOUND for an unknown CID', async () => {
    await expect(getPinStatus('Qmunknown123')).rejects.toMatchObject({
      code: 'CID_NOT_FOUND',
    });
  });

  test('throws INVALID_CID for an empty string', async () => {
    await expect(getPinStatus('')).rejects.toMatchObject({
      code: 'INVALID_CID',
    });
  });
});

// ─── Integration wrapper: retrieveFile ───────────────────────────────────────
describe('filecoin-pin integration: retrieveFile()', () => {
  test('retrieves a known CID and writes file to disk', async () => {
    const { cid } = await pinFile(tmpFile);
    const outPath = path.join(os.tmpdir(), `claw-pin-retrieve-test-${Date.now()}.txt`);
    const result = await retrieveFile(cid, outPath);

    expect(result.cid).toBe(cid);
    expect(fs.existsSync(result.outputPath)).toBe(true);

    fs.unlinkSync(result.outputPath); // cleanup
  });

  test('throws CID_NOT_FOUND for an unknown CID', async () => {
    await expect(retrieveFile('Qmunknown', '/tmp/out.txt')).rejects.toMatchObject({
      code: 'CID_NOT_FOUND',
    });
  });
});

// ─── Command: uploadCommand ───────────────────────────────────────────────────
describe('uploadCommand()', () => {
  test('returns a result with CID for an existing file', async () => {
    const result = await uploadCommand(tmpFile);
    expect(result).not.toBeNull();
    expect(result.cid).toMatch(/^bafybeig/);
  });

  test('returns null and sets exitCode for a missing file', async () => {
    const prevCode = process.exitCode;
    const result = await uploadCommand('/nonexistent/file.txt');
    expect(result).toBeNull();
    expect(process.exitCode).toBe(1);
    process.exitCode = prevCode; // restore
  });
});

// ─── Command: statusCommand ───────────────────────────────────────────────────
describe('statusCommand()', () => {
  test('returns status for a valid pinned CID', async () => {
    const { cid } = await pinFile(tmpFile);
    const result = await statusCommand(cid);
    expect(result.status).toBe('pinned');
    expect(result.providers).toBe(3);
  });

  test('returns null and sets exitCode for an unknown CID', async () => {
    const prevCode = process.exitCode;
    const result = await statusCommand('QmInvalidCID999');
    expect(result).toBeNull();
    expect(process.exitCode).toBe(1);
    process.exitCode = prevCode;
  });

  test('returns null and sets exitCode when CID is empty', async () => {
    const prevCode = process.exitCode;
    const result = await statusCommand('');
    expect(result).toBeNull();
    expect(process.exitCode).toBe(1);
    process.exitCode = prevCode;
  });
});

// ─── Command: retrieveCommand ─────────────────────────────────────────────────
describe('retrieveCommand()', () => {
  test('retrieves a file and writes it to outputPath', async () => {
    const { cid } = await pinFile(tmpFile);
    const outPath = path.join(os.tmpdir(), `claw-pin-cmd-retrieve-${Date.now()}.txt`);
    const result = await retrieveCommand(cid, outPath);
    expect(result).not.toBeNull();
    expect(fs.existsSync(result.outputPath)).toBe(true);
    fs.unlinkSync(result.outputPath);
  });

  test('returns null for missing CID arg', async () => {
    const prevCode = process.exitCode;
    const result = await retrieveCommand('', './out.txt');
    expect(result).toBeNull();
    process.exitCode = prevCode;
  });

  test('returns null for missing outputPath arg', async () => {
    const prevCode = process.exitCode;
    const result = await retrieveCommand('bafybeig123', '');
    expect(result).toBeNull();
    process.exitCode = prevCode;
  });
});
