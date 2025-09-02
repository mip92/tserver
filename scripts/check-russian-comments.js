#!/usr/bin/env node

/**
 * Script to check for Russian comments in TypeScript/JavaScript files
 * Usage: node scripts/check-russian-comments.js
 */

const fs = require("fs");
const path = require("path");

// Russian Cyrillic characters regex
const russianRegex = /[а-яё]/i;

// Directories to check
const sourceDirs = ["src"];

// File extensions to check
const extensions = [".ts", ".js", ".tsx", ".jsx"];

// Files to ignore
const ignoreFiles = ["node_modules", "dist", "coverage", ".git"];

function shouldIgnoreFile(filePath) {
  return ignoreFiles.some((ignore) => filePath.includes(ignore));
}

function hasRussianText(text) {
  return russianRegex.test(text);
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    const issues = [];

    lines.forEach((line, index) => {
      // Check for Russian text in comments
      if (line.trim().startsWith("//") && hasRussianText(line)) {
        issues.push({
          line: index + 1,
          content: line.trim(),
          type: "comment",
        });
      }

      // Check for Russian text in JSDoc comments
      if (line.trim().startsWith("*") && hasRussianText(line)) {
        issues.push({
          line: index + 1,
          content: line.trim(),
          type: "jsdoc",
        });
      }
    });

    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const results = [];

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (shouldIgnoreFile(fullPath)) {
        continue;
      }

      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          const issues = checkFile(fullPath);
          if (issues.length > 0) {
            results.push({
              file: fullPath,
              issues,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }

  return results;
}

function main() {
  console.log("🔍 Checking for Russian comments in source files...\n");

  const allResults = [];

  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) {
      allResults.push(...scanDirectory(dir));
    }
  }

  if (allResults.length === 0) {
    console.log("✅ No Russian comments found!");
    return 0;
  }

  console.log(`❌ Found Russian comments in ${allResults.length} file(s):\n`);

  allResults.forEach((result) => {
    console.log(`📁 ${result.file}`);
    result.issues.forEach((issue) => {
      console.log(`   Line ${issue.line}: ${issue.content}`);
    });
    console.log("");
  });

  console.log("💡 Please replace Russian comments with English equivalents.");
  return 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { checkFile, scanDirectory, hasRussianText };
