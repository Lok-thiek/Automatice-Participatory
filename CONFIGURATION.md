# Liveplatform Global Configuration

This document describes the global configuration settings for the Automatice-Participatory Live Platform.

## Configuration File

The global configuration is stored in `liveplatform.config.json` at the root of the repository.

## Configuration Sections

### Platform Settings

- **name**: The display name of the platform
- **version**: Current version of the platform
- **environment**: Deployment environment (production, staging, development)

### Global Settings

- **enabled**: Master switch to enable/disable the platform
- **timezone**: Default timezone for all operations (UTC recommended)
- **language**: Default language/locale (e.g., en-US, fr-FR)
- **dateFormat**: Date format using standard tokens (YYYY-MM-DD)
- **timeFormat**: Time format using 24-hour notation (HH:mm:ss)

### Authentication

- **enabled**: Enable/disable authentication system
- **sessionTimeout**: Session timeout in seconds (default: 3600 = 1 hour)
- **maxLoginAttempts**: Maximum failed login attempts before lockout
- **lockoutDuration**: Account lockout duration in seconds (default: 900 = 15 minutes)
- **requireMFA**: Require multi-factor authentication for all users

### API Configuration

- **baseUrl**: Base URL for API endpoints
- **version**: API version identifier
- **timeout**: Request timeout in milliseconds
- **retryAttempts**: Number of retry attempts for failed requests
- **rateLimiting**: Controls API rate limiting
  - **enabled**: Enable/disable rate limiting
  - **maxRequestsPerMinute**: Maximum requests allowed per minute per client

### Database

- **connectionPoolSize**: Number of database connections in the pool
- **queryTimeout**: Query execution timeout in milliseconds
- **enableLogging**: Enable SQL query logging

### Logging

- **level**: Logging level (debug, info, warn, error)
- **format**: Log format (json, text)
- **enableConsole**: Output logs to console
- **enableFile**: Write logs to file system
- **logDirectory**: Directory for log files
- **maxFileSize**: Maximum size per log file (e.g., 10MB)
- **maxFiles**: Maximum number of log files to retain

### Security

- **enableSSL**: Require SSL/TLS connections
- **sslVerification**: Verify SSL certificates
- **corsEnabled**: Enable Cross-Origin Resource Sharing
- **allowedOrigins**: Array of allowed CORS origins (* for all)
- **contentSecurityPolicy**: Content Security Policy header value
- **enableHSTS**: Enable HTTP Strict Transport Security

### Features

#### Participatory Features
- **enabled**: Enable participatory features
- **autoApproval**: Automatically approve participatory submissions
- **moderationRequired**: Require moderation before publishing

#### Automation Features
- **enabled**: Enable automation capabilities
- **scheduledTasks**: Enable scheduled task execution
- **webhooks**: Enable webhook support

#### Notifications
- **enabled**: Enable notification system
- **channels**: Available notification channels (email, push, sms)
- **defaultChannel**: Default notification channel

### Performance

#### Caching
- **enabled**: Enable caching layer
- **ttl**: Cache time-to-live in seconds
- **provider**: Cache provider (memory, redis, memcached)

#### Compression
- **enabled**: Enable response compression
- **level**: Compression level (0-9, where 9 is maximum compression)

### Monitoring

- **enabled**: Enable monitoring and metrics
- **metricsInterval**: Metrics collection interval in seconds
- **healthCheckEndpoint**: Endpoint for health checks
- **statusCheckEndpoint**: Endpoint for status information

## Usage

To use this configuration in your application:

```javascript
// Node.js example
const config = require('./liveplatform.config.json');

// Access configuration values
console.log(config.platform.name);
console.log(config.global.timezone);
```

```python
# Python example
import json

with open('liveplatform.config.json', 'r') as f:
    config = json.load(f)

# Access configuration values
print(config['platform']['name'])
print(config['global']['timezone'])
```

## Environment-Specific Configuration

For different environments, you can create environment-specific configuration files:

- `liveplatform.config.production.json`
- `liveplatform.config.staging.json`
- `liveplatform.config.development.json`

These files should override the base configuration values as needed.

## Security Considerations

1. **Never commit sensitive data** (passwords, API keys, secrets) to this configuration file
2. Use environment variables or secure secret management for sensitive values
3. Restrict file permissions appropriately in production environments
4. Regularly review and update security settings
5. Enable SSL/TLS for all production environments
6. Use strong authentication mechanisms and enable MFA when possible

## Validation

Before deploying changes to this configuration:

1. Validate JSON syntax
2. Test configuration loading in your application
3. Verify all required settings are present
4. Ensure values are within acceptable ranges
5. Test in a non-production environment first

## Support

For questions or issues related to the global configuration, please refer to the main project documentation or contact the platform administrators.
