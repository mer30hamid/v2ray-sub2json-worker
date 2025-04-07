// 1.package.json script example: `npm run tree -- ./static` (The -- passes arguments to the script.)
// 2.node example: `node tree.cjs` or `node tree.cjs ./src`

const fs = require("fs").promises;
const path = require("path");

// Load .gitignore patterns from the root directory
async function loadGitignore(rootDir) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  try {
    const content = await fs.readFile(gitignorePath, "utf-8");
    return content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));
  } catch (err) {
    return []; // Return empty array if .gitignore doesn't exist
  }
}

// Determine if a path should be ignored
function shouldIgnore(filePath, ignorePatterns, rootDir) {
  const relPath = path.relative(rootDir, filePath);

  // Explicitly ignore .git folder
  if (path.basename(filePath) === ".git") {
    return true;
  }

  // Check against .gitignore patterns
  for (const pattern of ignorePatterns) {
    if (pattern.startsWith("/")) {
      const cleanPattern = pattern.slice(1); // Remove leading /
      if (relPath === cleanPattern || relPath.startsWith(cleanPattern + path.sep)) {
        return true;
      }
    } else {
      if (path.basename(filePath) === pattern || relPath.includes(pattern)) {
        return true;
      }
    }
  }
  return false;
}

// Generate tree view starting from dirPath
async function tree(dirPath, prefix = "", ignorePatterns = null, rootDir = null) {
  if (ignorePatterns === null) {
    ignorePatterns = await loadGitignore(process.cwd()); // Load from project root
  }
  if (rootDir === null) {
    rootDir = process.cwd(); // Root remains project root for .gitignore context
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const filteredEntries = entries.filter(entry => 
    !shouldIgnore(path.join(dirPath, entry.name), ignorePatterns, rootDir)
  );

  for (let i = 0; i < filteredEntries.length; i++) {
    const entry = filteredEntries[i];
    const isLast = i === filteredEntries.length - 1;
    const entryPath = path.join(dirPath, entry.name);
    console.log(`${prefix}${isLast ? "└── " : "├── "}${entry.name}`);

    if (entry.isDirectory()) {
      await tree(entryPath, prefix + (isLast ? "    " : "│   "), ignorePatterns, rootDir);
    }
  }
}

// Get directory from command-line argument or default to current directory
const targetDir = process.argv[2] || ".";
const resolvedDir = path.resolve(targetDir);

// Run the tree function
tree(resolvedDir)
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });