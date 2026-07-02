const fs = require("node:fs");
const path = require("node:path");

const DIRECTORIES = [
  path.join(__dirname, "../apps/web/src"),
  path.join(__dirname, "../apps/backend/src"),
];

const WHITELIST_PATH = path.join(__dirname, "line-limit-whitelist.json");

// Load whitelist
let whitelist = {};
if (fs.existsSync(WHITELIST_PATH)) {
  try {
    whitelist = JSON.parse(fs.readFileSync(WHITELIST_PATH, "utf-8"));
  } catch (e) {
    console.error(`Error parsing whitelist file: ${e.message}`);
    process.exit(1);
  }
}

// Helper to check if path should be ignored
function shouldIgnore(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return (
    normalized.includes("/components/ui/") || // Shadcn components
    normalized.endsWith("routeTree.gen.ts") || // TanStack Router generated
    normalized.endsWith(".css") // CSS style files
  );
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = [];
DIRECTORIES.forEach((dir) => {
  if (fs.existsSync(dir)) {
    allFiles.push(...getFiles(dir));
  }
});

let failed = false;
const newViolations = [];
const grownViolations = [];
const shrinkSuggestions = [];

allFiles.forEach((file) => {
  if (shouldIgnore(file)) return;

  // Read lines
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split(/\r?\n/).length;

  const relPath = path.relative(path.join(__dirname, ".."), file).replace(/\\/g, "/");
  const isWhitelisted = relPath in whitelist;

  if (lines > 300) {
    if (!isWhitelisted) {
      newViolations.push({ path: relPath, lines });
      failed = true;
    } else {
      const allowedBaseline = whitelist[relPath];
      if (lines > allowedBaseline) {
        grownViolations.push({ path: relPath, lines, allowed: allowedBaseline });
        failed = true;
      }
    }
  } else {
    // If a whitelisted file is now under 300 lines, recommend removing it
    if (isWhitelisted) {
      shrinkSuggestions.push({ path: relPath, lines });
    }
  }
});

if (newViolations.length > 0) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "ERROR: The following files exceed the 300-line limit but are not whitelisted:",
  );
  newViolations.forEach((v) => {
    console.error(`  - ${v.path} (${v.lines} lines)`);
  });
  console.error();
}

if (grownViolations.length > 0) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "ERROR: The following whitelisted files have grown beyond their allowed line counts:",
  );
  grownViolations.forEach((v) => {
    console.error(`  - ${v.path} (${v.lines} lines, allowed baseline is ${v.allowed})`);
  });
  console.error();
}

if (shrinkSuggestions.length > 0) {
  console.log(
    "\x1b[32m%s\x1b[0m",
    "TIP: The following whitelisted files are now 300 lines or less. You can remove them from the whitelist:",
  );
  shrinkSuggestions.forEach((s) => {
    console.log(`  - ${s.path} (${s.lines} lines)`);
  });
  console.log();
}

if (failed) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Failed the 300-line limit check. Please refactor these files or update their baselines in the whitelist.",
  );
  process.exit(1);
} else {
  console.log("\x1b[32m%s\x1b[0m", "All files passed the 300-line limit check.");
  process.exit(0);
}
