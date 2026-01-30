# Automatice-Participatory

An automated participatory platform with global configuration management.

## Configuration

The platform uses a global configuration file for system-wide settings. See [CONFIGURATION.md](CONFIGURATION.md) for detailed documentation on all available configuration options.

### Quick Start

1. Review the global configuration in `liveplatform.config.json`
2. Customize settings for your environment
3. Refer to [CONFIGURATION.md](CONFIGURATION.md) for detailed explanations of each setting

### Configuration Files

- `liveplatform.config.json` - Main global configuration file
- `CONFIGURATION.md` - Comprehensive configuration documentation

## Features

- **Global Settings**: Centralized configuration for platform-wide settings
- **Authentication**: Configurable authentication and session management
- **API Management**: Rate limiting, timeouts, and retry logic
- **Security**: SSL/TLS, CORS, and content security policies
- **Monitoring**: Built-in health checks and metrics
- **Performance**: Caching and compression support
- **Automation**: Scheduled tasks and webhook support
- **Notifications**: Multi-channel notification system
- **Auto-Fix Tool**: Automatically detect and fix configuration issues

## Tools

### Master Automation Script

Put everything right automatically with a single command:

```bash
# Full automation with interactive prompts
node automate.js

# Non-interactive mode (auto-fix only, no prompts)
node automate.js --no-interactive

# Validate only (no fixes)
node automate.js --validate-only
```

This master script will:
1. Validate your configuration
2. Automatically fix detected issues
3. Re-validate to ensure everything is correct
4. Provide a comprehensive report

### Configuration Validation

Validate your configuration file for errors and best practices:

```bash
node validate-config.js
```

### Auto-Fix Configuration

Automatically fix common configuration issues and optimize settings:

```bash
# Interactive mode (default) - prompts for user input
node auto-fix-config.js

# Non-interactive mode - only auto-fixes without prompts
node auto-fix-config.js --no-interactive

# Fix a specific configuration file
node auto-fix-config.js ./path/to/config.json
```

The auto-fix tool will:
- Detect placeholder values (API URLs, etc.)
- Fix security issues (wildcard CORS in production)
- Optimize settings based on environment (development/production)
- Enable performance features (caching, compression)
- Create necessary directories (logs, etc.)
- Apply environment-specific best practices