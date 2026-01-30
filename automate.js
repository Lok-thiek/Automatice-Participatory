#!/usr/bin/env node

/**
 * Automatice-Participatory Master Automation Script
 * 
 * This script puts everything right automatically by:
 * 1. Validating the configuration
 * 2. Auto-fixing detected issues
 * 3. Re-validating after fixes
 * 4. Providing a comprehensive report
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      resolve(code);
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const skipFix = args.includes('--validate-only');
  const noInteractive = args.includes('--no-interactive');
  
  log('\n╔════════════════════════════════════════════════════════════╗', colors.cyan + colors.bold);
  log('║  Automatice-Participatory Automation System               ║', colors.cyan + colors.bold);
  log('║  Putting Everything Right Automatically                   ║', colors.cyan + colors.bold);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan + colors.bold);
  
  try {
    // Step 1: Initial validation
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
    log('STEP 1: Initial Configuration Validation', colors.blue + colors.bold);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', colors.blue);
    
    const validateCode = await runCommand('node', ['validate-config.js']);
    
    if (validateCode === 0 && skipFix) {
      log('\n✅ Configuration is valid. No fixes needed.', colors.green);
      return 0;
    }
    
    if (!skipFix) {
      // Step 2: Auto-fix issues
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
      log('STEP 2: Auto-Fix Configuration Issues', colors.blue + colors.bold);
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', colors.blue);
      
      const fixArgs = noInteractive ? ['auto-fix-config.js', '--no-interactive'] : ['auto-fix-config.js'];
      const fixCode = await runCommand('node', fixArgs);
      
      // Step 3: Re-validate after fixes
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
      log('STEP 3: Re-validation After Fixes', colors.blue + colors.bold);
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', colors.blue);
      
      const revalidateCode = await runCommand('node', ['validate-config.js']);
      
      // Final summary
      log('\n╔════════════════════════════════════════════════════════════╗', colors.magenta);
      log('║  Automation Complete                                      ║', colors.magenta + colors.bold);
      log('╚════════════════════════════════════════════════════════════╝\n', colors.magenta);
      
      if (revalidateCode === 0) {
        log('✅ All issues have been resolved!', colors.green + colors.bold);
        log('   Configuration is now valid and optimized.\n', colors.green);
        return 0;
      } else {
        log('⚠️  Some warnings remain. Review the output above.', colors.yellow);
        log('   Run with --interactive to fix remaining issues.\n', colors.yellow);
        return 1;
      }
    }
    
    return 0;
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    return 1;
  }
}

// Show help
if (process.argv.includes('--help')) {
  console.log(`
Automatice-Participatory Master Automation Script

This script puts everything right automatically by validating and fixing
configuration issues in a single command.

Usage: node automate.js [options]

Options:
  --validate-only     Only validate, don't fix issues
  --no-interactive    Run in non-interactive mode (auto-fix only)
  --help              Show this help message

Examples:
  node automate.js                    # Full automation with interactive fixes
  node automate.js --no-interactive   # Auto-fix without prompts
  node automate.js --validate-only    # Only validate configuration
  `);
  process.exit(0);
}

// Run
main().then(code => {
  process.exit(code);
}).catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
