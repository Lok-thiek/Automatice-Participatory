#!/usr/bin/env node

/**
 * Liveplatform Configuration Validator
 * 
 * This script validates the liveplatform.config.json file against the schema
 * and performs additional checks for configuration integrity.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

function validateConfiguration() {
  log('\n🔍 Validating Liveplatform Configuration...', colors.blue);
  
  const configPath = path.join(__dirname, 'liveplatform.config.json');
  const schemaPath = path.join(__dirname, 'liveplatform.config.schema.json');
  
  // Check if files exist
  if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file not found: liveplatform.config.json');
  }
  
  if (!fs.existsSync(schemaPath)) {
    log('⚠️  Schema file not found, skipping schema validation', colors.yellow);
  }
  
  // Validate JSON syntax
  log('✓ Checking JSON syntax...', colors.blue);
  const config = validateJSON(configPath);
  log('  ✓ JSON syntax is valid', colors.green);
  
  // Validate required sections
  log('✓ Checking required sections...', colors.blue);
  const requiredSections = ['platform', 'global'];
  const missingSections = requiredSections.filter(section => !config[section]);
  
  if (missingSections.length > 0) {
    throw new Error(`Missing required sections: ${missingSections.join(', ')}`);
  }
  log('  ✓ All required sections present', colors.green);
  
  // Validate platform section
  log('✓ Validating platform section...', colors.blue);
  if (!config.platform.name || !config.platform.version || !config.platform.environment) {
    throw new Error('Platform section is missing required fields');
  }
  
  // Check version format (semantic versioning)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(config.platform.version)) {
    throw new Error('Platform version must follow semantic versioning (e.g., 1.0.0)');
  }
  
  // Check environment value
  const validEnvironments = ['production', 'staging', 'development'];
  if (!validEnvironments.includes(config.platform.environment)) {
    throw new Error(`Invalid environment: ${config.platform.environment}. Must be one of: ${validEnvironments.join(', ')}`);
  }
  log('  ✓ Platform configuration is valid', colors.green);
  
  // Validate global section
  log('✓ Validating global section...', colors.blue);
  if (typeof config.global.enabled !== 'boolean') {
    throw new Error('global.enabled must be a boolean');
  }
  if (!config.global.timezone) {
    throw new Error('global.timezone is required');
  }
  log('  ✓ Global configuration is valid', colors.green);
  
  // Validate authentication settings
  if (config.authentication) {
    log('✓ Validating authentication settings...', colors.blue);
    if (config.authentication.sessionTimeout && config.authentication.sessionTimeout < 60) {
      throw new Error('sessionTimeout must be at least 60 seconds');
    }
    if (config.authentication.maxLoginAttempts && 
        (config.authentication.maxLoginAttempts < 1 || config.authentication.maxLoginAttempts > 10)) {
      throw new Error('maxLoginAttempts must be between 1 and 10');
    }
    log('  ✓ Authentication settings are valid', colors.green);
  }
  
  // Validate API settings
  if (config.api) {
    log('✓ Validating API settings...', colors.blue);
    if (config.api.baseUrl) {
      try {
        new URL(config.api.baseUrl);
      } catch {
        throw new Error('api.baseUrl must be a valid URL');
      }
    }
    if (config.api.timeout && config.api.timeout < 1000) {
      throw new Error('api.timeout must be at least 1000ms');
    }
    log('  ✓ API settings are valid', colors.green);
  }
  
  // Validate logging settings
  if (config.logging) {
    log('✓ Validating logging settings...', colors.blue);
    const validLevels = ['debug', 'info', 'warn', 'error'];
    if (config.logging.level && !validLevels.includes(config.logging.level)) {
      throw new Error(`Invalid logging level: ${config.logging.level}. Must be one of: ${validLevels.join(', ')}`);
    }
    log('  ✓ Logging settings are valid', colors.green);
  }
  
  // Summary
  log('\n✅ Configuration validation passed!', colors.green);
  log(`   Platform: ${config.platform.name} v${config.platform.version}`, colors.blue);
  log(`   Environment: ${config.platform.environment}`, colors.blue);
  log(`   Global enabled: ${config.global.enabled}`, colors.blue);
  log('');
}

// Run validation
try {
  validateConfiguration();
  process.exit(0);
} catch (error) {
  log(`\n❌ Configuration validation failed:`, colors.red);
  log(`   ${error.message}`, colors.red);
  log('');
  process.exit(1);
}
