/**
 * filecoin-pin.js — Integration wrapper for the Filecoin Pin SDK
 *
 * In a real deployment this module would wrap the filecoin-pin-js SDK.
 * For the hackathon sprint we provide a realistic mock that:
 *  - Accepts any local file path
 *  - Generates a deterministic-looking CID from the file content hash
 *  - Simulates network latency
 *  - Returns the shape expected by the rest of the CLI
 *
 * To swap in the real SDK: replace the body of `pinFile` and `getPinStatus`
 * with actual filecoin-pin-js calls. The interface contract stays the same.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Simulate network delay (300-800ms to feel real)
 */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Generate a deterministic CID-like string from file contents.
 * Real filecoin-pin-js returns a proper bafy… CID.
 *
 * @param {string} filePath
 * @returns {string}
 */
function computeMockCID(filePath) {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  // bafy + 52 chars (mimics a real CIDv1 base32 string length)
  return 'bafybeig' + hash.substring(0, 44);
}

/**
 * Pin a file to Filecoin (mock implementation).
 *
 * @param {string} filePath — absolute or relative path to the local file
 * @returns {Promise<{ cid: string, status: string, size: number, cost: string }>}
 */
async function pinFile(filePath) {
  const resolved = path.resolve(filePath);

  // Validate file existence before anything else
  if (!fs.existsSync(resolved)) {
    const err = new Error(`File not found: ${resolved}`);
    err.code = 'FILE_NOT_FOUND';
    throw err;
  }

  const stats = fs.statSync(resolved);
  const sizeMB = stats.size / (1024 * 1024);
  const estimatedCost = (sizeMB * 0.00001).toFixed(8);

  // Simulate network round-trip
  await delay(500 + Math.random() * 300);

  const cid = computeMockCID(resolved);

  return {
    cid,
    status: 'pinned',
    size: stats.size,
    cost: `${estimatedCost} FIL`,
    providers: 3,
  };
}

/**
 * Get pin status for a given CID (mock implementation).
 *
 * @param {string} cid
 * @returns {Promise<{ cid: string, status: string, providers: number, retrievable: boolean }>}
 */
async function getPinStatus(cid) {
  if (!cid || typeof cid !== 'string' || cid.trim().length === 0) {
    const err = new Error('Invalid CID: must be a non-empty string.');
    err.code = 'INVALID_CID';
    throw err;
  }

  // Simulate network round-trip
  await delay(300 + Math.random() * 200);

  // Known-pinned CIDs (deterministic mock) start with our prefix
  const isKnown = cid.startsWith('bafybeig');

  if (!isKnown) {
    const err = new Error(`CID not found on the network: ${cid}`);
    err.code = 'CID_NOT_FOUND';
    throw err;
  }

  return {
    cid,
    status: 'pinned',
    providers: 3,
    retrievable: true,
  };
}

/**
 * Retrieve (download) a pinned file by CID (mock implementation).
 *
 * @param {string} cid
 * @param {string} outputPath — local path to write the downloaded content to
 * @returns {Promise<{ cid: string, outputPath: string, size: number }>}
 */
async function retrieveFile(cid, outputPath) {
  if (!cid || typeof cid !== 'string' || cid.trim().length === 0) {
    const err = new Error('Invalid CID: must be a non-empty string.');
    err.code = 'INVALID_CID';
    throw err;
  }

  await delay(400 + Math.random() * 300);

  const isKnown = cid.startsWith('bafybeig');
  if (!isKnown) {
    const err = new Error(`CID not found on the network: ${cid}`);
    err.code = 'CID_NOT_FOUND';
    throw err;
  }

  // Mock: write a placeholder file so integration tests can verify the path
  const mockContent = `# claw-pin mock retrieval\nCID: ${cid}\nRetrieved at: ${new Date().toISOString()}\n`;
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), mockContent, 'utf8');

  return {
    cid,
    outputPath: path.resolve(outputPath),
    size: Buffer.byteLength(mockContent),
  };
}

module.exports = { pinFile, getPinStatus, retrieveFile };
