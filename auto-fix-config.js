#!/usr/bin/env node

/**
 * Automatice-Participatory Configuration Auto-Fix Tool
 * 
 * This script automatically fixes common configuration issues and validates settings.
 * It puts everything right automatically by detecting and correcting problematic values.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

class ConfigAutoFix {
  constructor(configPath, options = {}) {
    this.configPath = configPath;
    this.interactive = options.interactive !== false;
    this.config = null;
    this.fixes = [];
    this.warnings = [];
  }

  async run() {
    log('\n🔧 Automatice-Participatory Configuration Auto-Fix', colors.cyan);
    log('    Putting everything right automatically...', colors.cyan);
    log('');

    try {
      // Load configuration
      this.loadConfig();
      
      // Analyze and fix issues
      await this.analyzeAndFix();
      
      // Display summary
      this.displaySummary();
      
      // Save if fixes were applied
      if (this.fixes.length > 0) {
        await this.saveConfig();
      }
      
      return this.fixes.length === 0 && this.warnings.length === 0;
    } catch (error) {
      log(`\n❌ Error: ${error.message}`, colors.red);
      return false;
    }
  }

  loadConfig() {
    log('📖 Loading configuration...', colors.blue);
    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(content);
      log('  ✓ Configuration loaded successfully', colors.green);
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async analyzeAndFix() {
    log('\n🔍 Analyzing configuration for issues...', colors.blue);
    
    // Ensure required sections exist
    if (!this.config.platform) this.config.platform = {};
    if (!this.config.global) this.config.global = {};
    if (!this.config.api) this.config.api = {};
    if (!this.config.security) this.config.security = {};
    if (!this.config.database) this.config.database = {};
    if (!this.config.logging) this.config.logging = {};
    if (!this.config.performance) this.config.performance = {};
    if (!this.config.performance.caching) this.config.performance.caching = {};
    if (!this.config.performance.compression) this.config.performance.compression = {};
    
    // Check and fix placeholder API URL
    await this.fixPlaceholderApiUrl();
    
    // Check and fix wildcard CORS
    await this.fixWildcardCors();
    
    // Check and fix environment settings
    await this.fixEnvironmentSettings();
    
    // Check and fix security settings for production
    await this.fixProductionSecurity();
    
    // Check and optimize performance settings
    await this.optimizePerformanceSettings();
    
    // Check and fix logging settings
    await this.fixLoggingSettings();
  }

  async fixPlaceholderApiUrl() {
    if (this.config.api && this.config.api.baseUrl === 'https://api.example.com') {
      this.warnings.push({
        type: 'placeholder',
        field: 'api.baseUrl',
        current: this.config.api.baseUrl,
        issue: 'Using placeholder API URL'
      });
      
      log('  ⚠️  Placeholder API URL detected', colors.yellow);
      
      if (this.interactive) {
        const newUrl = await this.prompt('  Enter your actual API base URL (or press Enter to skip): ');
        if (newUrl && newUrl.trim()) {
          try {
            const url = new URL(newUrl);
            // Validate protocol for production
            if (this.config.platform.environment === 'production' && url.protocol !== 'https:') {
              log('  ⚠️  Production API URLs should use https://', colors.yellow);
              const proceed = await this.prompt('  Continue anyway? (y/n): ');
              if (proceed.toLowerCase() !== 'y') {
                log('  ✗ Skipping API URL update', colors.yellow);
                return;
              }
            }
            this.config.api.baseUrl = newUrl.trim();
            this.fixes.push({
              field: 'api.baseUrl',
              from: 'https://api.example.com',
              to: newUrl.trim(),
              reason: 'Replaced placeholder with actual API URL'
            });
            log(`  ✓ Updated API URL to: ${newUrl.trim()}`, colors.green);
          } catch (error) {
            log(`  ✗ Invalid URL format: ${error.message}`, colors.red);
          }
        }
      } else {
        log('  ℹ️  Run with --interactive to set a custom API URL', colors.cyan);
      }
    }
  }

  async fixWildcardCors() {
    if (this.config.security && 
        this.config.security.corsEnabled && 
        this.config.security.allowedOrigins &&
        this.config.security.allowedOrigins.includes('*')) {
      
      const env = this.config.platform.environment;
      
      if (env === 'production') {
        this.warnings.push({
          type: 'security',
          field: 'security.allowedOrigins',
          current: this.config.security.allowedOrigins,
          issue: 'Wildcard CORS in production is a security risk'
        });
        
        log('  ⚠️  Wildcard CORS detected in PRODUCTION environment', colors.yellow);
        
        if (this.interactive) {
          const response = await this.prompt('  Enter allowed origins (comma-separated, or press Enter to skip): ');
          if (response && response.trim()) {
            const origins = response.split(',').map(o => o.trim()).filter(o => o);
            // Validate each origin
            const validOrigins = [];
            for (const origin of origins) {
              try {
                const url = new URL(origin);
                if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                  log(`  ⚠️  Skipping invalid origin protocol: ${origin}`, colors.yellow);
                  continue;
                }
                validOrigins.push(origin);
              } catch (error) {
                log(`  ⚠️  Skipping invalid origin URL: ${origin} - ${error.message}`, colors.yellow);
              }
            }
            if (validOrigins.length > 0) {
              this.config.security.allowedOrigins = validOrigins;
              this.fixes.push({
                field: 'security.allowedOrigins',
                from: ['*'],
                to: validOrigins,
                reason: 'Replaced wildcard CORS with explicit origins for production'
              });
              log(`  ✓ Updated CORS origins to: ${validOrigins.join(', ')}`, colors.green);
            }
          }
        } else {
          log('  ℹ️  Run with --interactive to set explicit CORS origins', colors.cyan);
        }
      } else {
        log(`  ℹ️  Wildcard CORS is acceptable for ${env} environment`, colors.cyan);
      }
    }
  }

  async fixEnvironmentSettings() {
    const env = this.config.platform.environment;
    
    // Auto-adjust settings based on environment
    if (env === 'development') {
      let changed = false;
      
      // Enable logging in development
      if (this.config.database && this.config.database.enableLogging === false) {
        this.config.database.enableLogging = true;
        changed = true;
        this.fixes.push({
          field: 'database.enableLogging',
          from: false,
          to: true,
          reason: 'Enabled database logging for development environment'
        });
      }
      
      // Set debug logging in development
      if (this.config.logging && this.config.logging.level !== 'debug') {
        const originalLevel = this.config.logging.level;
        this.config.logging.level = 'debug';
        changed = true;
        this.fixes.push({
          field: 'logging.level',
          from: originalLevel,
          to: 'debug',
          reason: 'Set debug logging level for development environment'
        });
      }
      
      if (changed) {
        log('  ✓ Auto-adjusted settings for development environment', colors.green);
      }
    }
  }

  async fixProductionSecurity() {
    const env = this.config.platform.environment;
    
    if (env === 'production') {
      let changed = false;
      
      // Ensure SSL is enabled in production
      if (this.config.security && this.config.security.enableSSL === false) {
        this.config.security.enableSSL = true;
        changed = true;
        this.fixes.push({
          field: 'security.enableSSL',
          from: false,
          to: true,
          reason: 'Enabled SSL for production environment'
        });
      }
      
      // Ensure HSTS is enabled in production
      if (this.config.security && this.config.security.enableHSTS === false) {
        this.config.security.enableHSTS = true;
        changed = true;
        this.fixes.push({
          field: 'security.enableHSTS',
          from: false,
          to: true,
          reason: 'Enabled HSTS for production environment'
        });
      }
      
      // Disable database logging in production for performance
      if (this.config.database && this.config.database.enableLogging === true) {
        this.config.database.enableLogging = false;
        changed = true;
        this.fixes.push({
          field: 'database.enableLogging',
          from: true,
          to: false,
          reason: 'Disabled database logging for production performance'
        });
      }
      
      if (changed) {
        log('  ✓ Auto-adjusted security settings for production environment', colors.green);
      }
    }
  }

  async optimizePerformanceSettings() {
    // Ensure caching is enabled for better performance
    if (this.config.performance?.caching && this.config.performance.caching.enabled === false) {
      this.config.performance.caching.enabled = true;
      this.fixes.push({
        field: 'performance.caching.enabled',
        from: false,
        to: true,
        reason: 'Enabled caching for better performance'
      });
      log('  ✓ Enabled caching for better performance', colors.green);
    }
    
    // Ensure compression is enabled
    if (this.config.performance?.compression && this.config.performance.compression.enabled === false) {
      this.config.performance.compression.enabled = true;
      this.fixes.push({
        field: 'performance.compression.enabled',
        from: false,
        to: true,
        reason: 'Enabled compression for better performance'
      });
      log('  ✓ Enabled compression for better performance', colors.green);
    }
  }

  async fixLoggingSettings() {
    // Ensure log directory exists in config
    if (this.config.logging && this.config.logging.enableFile) {
      const logDir = this.config.logging.logDirectory || './logs';
      
      // Create log directory if it doesn't exist
      const fullPath = path.resolve(path.dirname(this.configPath), logDir);
      if (!fs.existsSync(fullPath)) {
        try {
          fs.mkdirSync(fullPath, { recursive: true });
          log(`  ✓ Created log directory: ${logDir}`, colors.green);
        } catch (error) {
          log(`  ⚠️  Could not create log directory: ${error.message}`, colors.yellow);
          log(`     You may need to create it manually or check file permissions.`, colors.yellow);
        }
      }
    }
  }

  displaySummary() {
    log('\n📊 Summary:', colors.magenta);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.magenta);
    
    if (this.fixes.length > 0) {
      log(`\n✅ Applied ${this.fixes.length} fix(es):`, colors.green);
      this.fixes.forEach((fix, index) => {
        log(`\n${index + 1}. ${fix.field}`, colors.cyan);
        log(`   From: ${JSON.stringify(fix.from)}`, colors.yellow);
        log(`   To:   ${JSON.stringify(fix.to)}`, colors.green);
        log(`   Reason: ${fix.reason}`, colors.blue);
      });
    } else {
      log('\n✅ No fixes needed - configuration is already optimal!', colors.green);
    }
    
    if (this.warnings.length > 0) {
      log(`\n⚠️  ${this.warnings.length} warning(s):`, colors.yellow);
      this.warnings.forEach((warning, index) => {
        log(`\n${index + 1}. ${warning.field}`, colors.cyan);
        log(`   Issue: ${warning.issue}`, colors.yellow);
        log(`   Current: ${JSON.stringify(warning.current)}`, colors.yellow);
      });
    }
    
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.magenta);
  }

  async saveConfig() {
    if (this.interactive) {
      const response = await this.prompt('\n💾 Save changes to configuration file? (y/n): ');
      if (response.toLowerCase() !== 'y') {
        log('\n❌ Changes not saved', colors.yellow);
        return;
      }
    }
    
    try {
      const content = JSON.stringify(this.config, null, 2) + '\n';
      fs.writeFileSync(this.configPath, content, 'utf8');
      log('\n✅ Configuration saved successfully!', colors.green);
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  prompt(question) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const interactive = !args.includes('--no-interactive');
  const configPath = args.find(arg => !arg.startsWith('--')) || './liveplatform.config.json';
  
  if (args.includes('--help')) {
    console.log(`
Automatice-Participatory Configuration Auto-Fix Tool

Usage: node auto-fix-config.js [options] [config-file]

Options:
  --interactive      Enable interactive mode (default)
  --no-interactive   Disable interactive mode, only auto-fix
  --help             Show this help message

Examples:
  node auto-fix-config.js
  node auto-fix-config.js --no-interactive
  node auto-fix-config.js ./my-config.json
    `);
    process.exit(0);
  }
  
  const fixer = new ConfigAutoFix(configPath, { interactive });
  const success = await fixer.run();
  
  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ConfigAutoFix;
