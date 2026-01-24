#!/usr/bin/env node

/**
 * Design Token Migration Script
 * 
 * Automatically migrates hardcoded color classes to semantic design tokens.
 * Run with: node scripts/migrate-design-tokens.js [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  'globals.css',
  'globals.backup.css',
  'tailwind.config',
];

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

// Color mappings: [pattern, replacement, context]
// Context helps decide when to apply certain replacements
const MAPPINGS = [
  // ============================================
  // BACKGROUND COLORS
  // ============================================
  
  // Gray backgrounds -> surface tokens
  { pattern: /\bbg-gray-50\b/g, replacement: 'bg-surface', category: 'bg' },
  { pattern: /\bbg-gray-100\b/g, replacement: 'bg-surface', category: 'bg' },
  { pattern: /\bbg-gray-200\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-gray-700\b/g, replacement: 'bg-surface-hover', category: 'bg' },
  { pattern: /\bbg-gray-800\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-gray-900\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-gray-950\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  
  // Neutral backgrounds -> surface tokens
  { pattern: /\bbg-neutral-50\b/g, replacement: 'bg-surface', category: 'bg' },
  { pattern: /\bbg-neutral-100\b/g, replacement: 'bg-surface', category: 'bg' },
  { pattern: /\bbg-neutral-200\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-neutral-700\b/g, replacement: 'bg-surface-hover', category: 'bg' },
  { pattern: /\bbg-neutral-800\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-neutral-900\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  { pattern: /\bbg-neutral-950\b/g, replacement: 'bg-surface-alt', category: 'bg' },
  
  // Black backgrounds (context-dependent)
  // Only replace standalone bg-black, not bg-black/50 overlays
  { pattern: /\bbg-black(?!\/)\b/g, replacement: 'bg-surface-alt', category: 'bg', skipIfContains: ['overlay', 'backdrop', 'modal'] },
  
  // ============================================
  // HOVER BACKGROUNDS
  // ============================================
  { pattern: /\bhover:bg-gray-50\b/g, replacement: 'hover:bg-surface-hover', category: 'hover' },
  { pattern: /\bhover:bg-gray-100\b/g, replacement: 'hover:bg-surface-hover', category: 'hover' },
  { pattern: /\bhover:bg-gray-200\b/g, replacement: 'hover:bg-surface-hover', category: 'hover' },
  { pattern: /\bhover:bg-gray-600\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  { pattern: /\bhover:bg-gray-700\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  { pattern: /\bhover:bg-gray-800\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  
  { pattern: /\bhover:bg-neutral-100\b/g, replacement: 'hover:bg-surface-hover', category: 'hover' },
  { pattern: /\bhover:bg-neutral-200\b/g, replacement: 'hover:bg-surface-hover', category: 'hover' },
  { pattern: /\bhover:bg-neutral-600\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  { pattern: /\bhover:bg-neutral-700\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  { pattern: /\bhover:bg-neutral-800\b/g, replacement: 'hover:bg-surface-alt', category: 'hover' },
  
  // ============================================
  // BORDER COLORS
  // ============================================
  { pattern: /\bborder-gray-200\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-gray-300\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-gray-600\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-gray-700\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-gray-800\b/g, replacement: 'border-surface-border', category: 'border' },
  
  { pattern: /\bborder-neutral-200\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-neutral-300\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-neutral-600\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-neutral-700\b/g, replacement: 'border-surface-border', category: 'border' },
  { pattern: /\bborder-neutral-800\b/g, replacement: 'border-surface-border', category: 'border' },
  
  // Hover borders
  { pattern: /\bhover:border-gray-300\b/g, replacement: 'hover:border-surface-hover', category: 'border' },
  { pattern: /\bhover:border-gray-400\b/g, replacement: 'hover:border-surface-hover', category: 'border' },
  { pattern: /\bhover:border-neutral-600\b/g, replacement: 'hover:border-surface-hover', category: 'border' },
  
  // Dividers
  { pattern: /\bdivide-gray-200\b/g, replacement: 'divide-surface-border', category: 'border' },
  { pattern: /\bdivide-gray-700\b/g, replacement: 'divide-surface-border', category: 'border' },
  { pattern: /\bdivide-neutral-700\b/g, replacement: 'divide-surface-border', category: 'border' },
  { pattern: /\bdivide-neutral-800\b/g, replacement: 'divide-surface-border', category: 'border' },
  
  // ============================================
  // TEXT COLORS
  // ============================================
  
  // Primary text (dark grays in light mode, white in dark)
  { pattern: /\btext-gray-900\b/g, replacement: 'text-text-primary', category: 'text' },
  { pattern: /\btext-gray-800\b/g, replacement: 'text-text-primary', category: 'text' },
  { pattern: /\btext-neutral-900\b/g, replacement: 'text-text-primary', category: 'text' },
  { pattern: /\btext-neutral-800\b/g, replacement: 'text-text-primary', category: 'text' },
  
  // Secondary text
  { pattern: /\btext-gray-700\b/g, replacement: 'text-text-secondary', category: 'text' },
  { pattern: /\btext-gray-600\b/g, replacement: 'text-text-secondary', category: 'text' },
  { pattern: /\btext-gray-300\b/g, replacement: 'text-text-secondary', category: 'text' },
  { pattern: /\btext-neutral-700\b/g, replacement: 'text-text-secondary', category: 'text' },
  { pattern: /\btext-neutral-600\b/g, replacement: 'text-text-secondary', category: 'text' },
  { pattern: /\btext-neutral-300\b/g, replacement: 'text-text-secondary', category: 'text' },
  
  // Muted text
  { pattern: /\btext-gray-500\b/g, replacement: 'text-text-muted', category: 'text' },
  { pattern: /\btext-gray-400\b/g, replacement: 'text-text-muted', category: 'text' },
  { pattern: /\btext-neutral-500\b/g, replacement: 'text-text-muted', category: 'text' },
  { pattern: /\btext-neutral-400\b/g, replacement: 'text-text-muted', category: 'text' },
  
  // Hover text
  { pattern: /\bhover:text-gray-900\b/g, replacement: 'hover:text-text-primary', category: 'text' },
  { pattern: /\bhover:text-gray-700\b/g, replacement: 'hover:text-text-secondary', category: 'text' },
  { pattern: /\bhover:text-gray-600\b/g, replacement: 'hover:text-text-secondary', category: 'text' },
  { pattern: /\bhover:text-neutral-200\b/g, replacement: 'hover:text-text-primary', category: 'text' },
  
  // ============================================
  // SEMANTIC COLORS (gain/loss/warning)
  // ============================================
  { pattern: /\btext-green-400\b/g, replacement: 'text-gain', category: 'semantic' },
  { pattern: /\btext-green-500\b/g, replacement: 'text-gain', category: 'semantic' },
  { pattern: /\btext-green-600\b/g, replacement: 'text-gain', category: 'semantic' },
  
  { pattern: /\btext-red-400\b/g, replacement: 'text-loss', category: 'semantic' },
  { pattern: /\btext-red-500\b/g, replacement: 'text-loss', category: 'semantic' },
  { pattern: /\btext-red-600\b/g, replacement: 'text-loss', category: 'semantic' },
  
  { pattern: /\btext-yellow-500\b/g, replacement: 'text-warning', category: 'semantic' },
  { pattern: /\btext-yellow-600\b/g, replacement: 'text-warning', category: 'semantic' },
  
  // ============================================
  // PLACEHOLDER COLORS
  // ============================================
  { pattern: /\bplaceholder-gray-400\b/g, replacement: 'placeholder-text-muted', category: 'placeholder' },
  { pattern: /\bplaceholder-gray-500\b/g, replacement: 'placeholder-text-muted', category: 'placeholder' },
  { pattern: /\bplaceholder-neutral-400\b/g, replacement: 'placeholder-text-muted', category: 'placeholder' },
  { pattern: /\bplaceholder-neutral-500\b/g, replacement: 'placeholder-text-muted', category: 'placeholder' },
  
  // ============================================
  // RING COLORS (focus states)
  // ============================================
  { pattern: /\bring-gray-300\b/g, replacement: 'ring-primary', category: 'ring' },
  { pattern: /\bfocus:ring-gray-300\b/g, replacement: 'focus:ring-primary', category: 'ring' },
  { pattern: /\bfocus:ring-gray-500\b/g, replacement: 'focus:ring-primary', category: 'ring' },
  
  // ============================================
  // DARK MODE PREFIXES (can be removed with tokens)
  // ============================================
  // These patterns remove dark: prefix since tokens handle it automatically
  { pattern: /\s+dark:bg-gray-800/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:bg-gray-900/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:bg-neutral-800/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:bg-neutral-900/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:text-white/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:text-gray-100/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:text-gray-200/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:text-gray-300/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:border-gray-700/g, replacement: '', category: 'dark-cleanup' },
  { pattern: /\s+dark:border-gray-800/g, replacement: '', category: 'dark-cleanup' },
];

// Stats tracking
const stats = {
  filesScanned: 0,
  filesModified: 0,
  replacements: {},
  errors: [],
};

// Initialize replacement counters
MAPPINGS.forEach(m => {
  stats.replacements[m.replacement] = 0;
});

/**
 * Check if a file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  if (!EXTENSIONS.includes(ext)) return false;
  
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filePath.includes(pattern)) return false;
  }
  
  return true;
}

/**
 * Get all files recursively
 */
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_PATTERNS.some(p => item.includes(p))) {
        getAllFiles(fullPath, files);
      }
    } else if (shouldProcessFile(fullPath)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  stats.filesScanned++;
  
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    stats.errors.push({ file: filePath, error: err.message });
    return;
  }
  
  let modified = false;
  let newContent = content;
  const fileChanges = [];
  
  for (const mapping of MAPPINGS) {
    const matches = newContent.match(mapping.pattern);
    if (matches) {
      // Check skip conditions
      if (mapping.skipIfContains) {
        const contextMatch = mapping.skipIfContains.some(ctx => 
          newContent.toLowerCase().includes(ctx)
        );
        // Don't skip, just be more careful - only skip if it's an overlay context
      }
      
      const count = matches.length;
      newContent = newContent.replace(mapping.pattern, mapping.replacement);
      stats.replacements[mapping.replacement] += count;
      fileChanges.push({ pattern: mapping.pattern.source, replacement: mapping.replacement, count });
      modified = true;
    }
  }
  
  if (modified) {
    stats.filesModified++;
    
    if (VERBOSE) {
      console.log(`\n📝 ${path.relative(SRC_DIR, filePath)}`);
      fileChanges.forEach(c => {
        console.log(`   ${c.pattern} → ${c.replacement} (${c.count}x)`);
      });
    }
    
    if (!DRY_RUN) {
      try {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      } catch (err) {
        stats.errors.push({ file: filePath, error: err.message });
      }
    }
  }
}

/**
 * Print summary report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 DESIGN TOKEN MIGRATION REPORT');
  console.log('='.repeat(60));
  
  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN MODE - No files were modified\n');
  }
  
  console.log(`\n📁 Files scanned: ${stats.filesScanned}`);
  console.log(`✏️  Files modified: ${stats.filesModified}`);
  
  // Group replacements by category
  const categories = {
    'Background': [],
    'Hover': [],
    'Border': [],
    'Text': [],
    'Semantic': [],
    'Other': [],
  };
  
  for (const [token, count] of Object.entries(stats.replacements)) {
    if (count === 0) continue;
    
    if (token.includes('bg-surface')) categories['Background'].push({ token, count });
    else if (token.includes('hover:')) categories['Hover'].push({ token, count });
    else if (token.includes('border') || token.includes('divide')) categories['Border'].push({ token, count });
    else if (token.includes('text-')) categories['Text'].push({ token, count });
    else if (token.includes('gain') || token.includes('loss') || token.includes('warning')) categories['Semantic'].push({ token, count });
    else categories['Other'].push({ token, count });
  }
  
  console.log('\n🎨 Replacements by category:\n');
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.length === 0) continue;
    
    const total = items.reduce((sum, i) => sum + i.count, 0);
    console.log(`  ${category} (${total} total):`);
    items.sort((a, b) => b.count - a.count);
    items.forEach(({ token, count }) => {
      console.log(`    → ${token}: ${count}`);
    });
    console.log();
  }
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(({ file, error }) => {
      console.log(`   ${file}: ${error}`);
    });
  }
  
  const totalReplacements = Object.values(stats.replacements).reduce((a, b) => a + b, 0);
  console.log('='.repeat(60));
  console.log(`✅ Total replacements: ${totalReplacements}`);
  console.log('='.repeat(60));
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Design Token Migration Script');
  console.log(`📂 Source directory: ${SRC_DIR}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`📢 Verbose: ${VERBOSE ? 'ON' : 'OFF'}`);
  
  const files = getAllFiles(SRC_DIR);
  console.log(`\n🔍 Found ${files.length} files to process...\n`);
  
  for (const file of files) {
    processFile(file);
  }
  
  printReport();
}

main();
