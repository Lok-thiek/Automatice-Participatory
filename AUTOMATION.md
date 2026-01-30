# Automatice-Participatory Automation Guide

This guide explains how to use the automation tools to put everything right automatically in your Automatice-Participatory platform configuration.

## Overview

The Automatice-Participatory platform includes three powerful automation tools:

1. **`automate.js`** - Master automation script (recommended)
2. **`auto-fix-config.js`** - Configuration auto-fix tool
3. **`validate-config.js`** - Configuration validator

## Quick Start

To automatically validate and fix your configuration in one command:

```bash
node automate.js
```

This will analyze your configuration, fix issues automatically, and prompt you for input when needed.

## Master Automation Script (`automate.js`)

The master automation script is the recommended way to manage your configuration. It orchestrates validation and fixing in a single workflow.

### Usage

```bash
# Full automation with interactive prompts
node automate.js

# Non-interactive mode (auto-fix only, no prompts)
node automate.js --no-interactive

# Validate only (no fixes applied)
node automate.js --validate-only
```

### What It Does

1. **Initial Validation** - Checks your configuration for syntax errors and issues
2. **Auto-Fix** - Automatically fixes detected problems
3. **Re-validation** - Verifies all issues have been resolved
4. **Report** - Provides a comprehensive summary of actions taken

### Example Output

```
╔════════════════════════════════════════════════════════════╗
║  Automatice-Participatory Automation System               ║
║  Putting Everything Right Automatically                   ║
╚════════════════════════════════════════════════════════════╝

STEP 1: Initial Configuration Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Checking JSON syntax...
✓ All required sections present
...

STEP 2: Auto-Fix Configuration Issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Auto-adjusted settings for production environment
...

STEP 3: Re-validation After Fixes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Configuration validation passed!
```

## Auto-Fix Tool (`auto-fix-config.js`)

The auto-fix tool detects and corrects common configuration issues automatically.

### Usage

```bash
# Interactive mode (default) - prompts for user input
node auto-fix-config.js

# Non-interactive mode - only auto-fixes without prompts
node auto-fix-config.js --no-interactive

# Fix a specific configuration file
node auto-fix-config.js ./path/to/config.json
```

### What It Fixes

#### Placeholder Values
- **API URLs**: Detects `https://api.example.com` and prompts for actual URL
- **Generic values**: Identifies placeholder values that need customization

#### Security Issues
- **Wildcard CORS in Production**: Warns about `allowedOrigins: ["*"]` in production
- **Missing SSL**: Ensures SSL is enabled in production
- **Missing HSTS**: Enables HTTP Strict Transport Security for production

#### Environment Optimization
- **Development Environment**:
  - Enables database query logging
  - Sets logging level to `debug`
  - Allows wildcard CORS

- **Production Environment**:
  - Disables database query logging (performance)
  - Requires explicit CORS origins (security)
  - Enables SSL/TLS and HSTS
  - Optimizes for performance

#### Performance Settings
- Enables caching if disabled
- Enables compression if disabled
- Creates log directories if missing

### Example Output

```
🔧 Automatice-Participatory Configuration Auto-Fix
    Putting everything right automatically...

📖 Loading configuration...
  ✓ Configuration loaded successfully

🔍 Analyzing configuration for issues...
  ⚠️  Wildcard CORS detected in PRODUCTION environment
  Enter allowed origins (comma-separated): https://app.example.com, https://api.example.com
  ✓ Updated CORS origins
  ✓ Auto-adjusted security settings for production environment

📊 Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Applied 3 fix(es):

1. security.allowedOrigins
   From: ["*"]
   To:   ["https://app.example.com", "https://api.example.com"]
   Reason: Replaced wildcard CORS with explicit origins for production

2. security.enableHSTS
   From: false
   To:   true
   Reason: Enabled HSTS for production environment

3. database.enableLogging
   From: true
   To:   false
   Reason: Disabled database logging for production performance

💾 Save changes to configuration file? (y/n): y
✅ Configuration saved successfully!
```

## Validation Tool (`validate-config.js`)

The validation tool checks your configuration for errors without making changes.

### Usage

```bash
node validate-config.js
```

### What It Validates

- JSON syntax correctness
- Required sections presence
- Semantic versioning format
- Environment values (production, staging, development)
- Timeout values (minimum limits)
- Login attempt limits (reasonable ranges)
- URL formats for API endpoints
- Logging level values

## Integration with CI/CD

You can integrate these tools into your CI/CD pipeline:

### GitHub Actions Example

```yaml
name: Configuration Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Validate Configuration
        run: node validate-config.js
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
node validate-config.js
if [ $? -ne 0 ]; then
    echo "Configuration validation failed. Run 'node automate.js' to fix issues."
    exit 1
fi
```

## Best Practices

### Development Environment

1. Use wildcard CORS for convenience: `allowedOrigins: ["*"]`
2. Enable debug logging: `logging.level: "debug"`
3. Enable database query logging: `database.enableLogging: true`
4. Use `environment: "development"`

### Production Environment

1. **Always** specify explicit CORS origins
2. **Always** use actual API URLs (no placeholders)
3. Enable SSL/TLS: `security.enableSSL: true`
4. Enable HSTS: `security.enableHSTS: true`
5. Disable database logging for performance
6. Use `environment: "production"`

### Automation Workflow

1. **During Development**: Run `node automate.js` regularly to catch issues early
2. **Before Deployment**: Run `node automate.js --no-interactive` to ensure production readiness
3. **In CI/CD**: Use `node automate.js --validate-only` to catch configuration errors
4. **Manual Review**: Always review the changes suggested by the auto-fix tool

## Troubleshooting

### "Configuration validation failed"

Run the auto-fix tool:
```bash
node auto-fix-config.js
```

### "Some warnings remain"

These warnings require manual intervention. Run in interactive mode:
```bash
node auto-fix-config.js
```

### "Invalid JSON"

Check your configuration file for syntax errors:
- Missing or extra commas
- Unclosed quotes or brackets
- Invalid escape sequences

Use a JSON validator or linter to identify the exact issue.

### File Permission Errors

Ensure the scripts are executable:
```bash
chmod +x automate.js auto-fix-config.js validate-config.js
```

## Advanced Usage

### Custom Configuration Files

All tools support custom configuration file paths:

```bash
node automate.js --config ./custom-config.json
node auto-fix-config.js ./custom-config.json
node validate-config.js ./custom-config.json
```

### Programmatic Usage

You can use the tools programmatically in your Node.js code:

```javascript
const ConfigAutoFix = require('./auto-fix-config.js');

async function fixMyConfig() {
  const fixer = new ConfigAutoFix('./my-config.json', { 
    interactive: false 
  });
  
  const success = await fixer.run();
  if (success) {
    console.log('Configuration fixed successfully!');
  }
}
```

## Support

For issues or questions:
1. Check the [CONFIGURATION.md](CONFIGURATION.md) for configuration reference
2. Review the [README.md](README.md) for feature overview
3. Run `node automate.js --help` for usage information
4. Review the automation output for specific error messages
