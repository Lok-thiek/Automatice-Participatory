# Configuration Examples

This directory contains example code showing how to load and use the Liveplatform global configuration in different programming languages.

## JavaScript/Node.js

```javascript
// config-loader.js
const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor(configPath = './liveplatform.config.json') {
    this.configPath = configPath;
    this.config = null;
  }

  load() {
    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(content);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  get(path) {
    if (!this.config) {
      this.load();
    }
    
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  isEnabled(featurePath) {
    const enabled = this.get(featurePath);
    return enabled === true;
  }
}

// Usage
const config = new ConfigLoader();
config.load();

console.log('Platform Name:', config.get('platform.name'));
console.log('API Base URL:', config.get('api.baseUrl'));
console.log('Authentication Enabled:', config.isEnabled('authentication.enabled'));
console.log('Participatory Enabled:', config.isEnabled('features.participatory.enabled'));
```

## Python

```python
# config_loader.py
import json
from typing import Any, Optional

class ConfigLoader:
    def __init__(self, config_path: str = './liveplatform.config.json'):
        self.config_path = config_path
        self.config: Optional[dict] = None
    
    def load(self) -> dict:
        """Load configuration from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
            return self.config
        except Exception as e:
            raise Exception(f"Failed to load configuration: {str(e)}")
    
    def get(self, path: str, default: Any = None) -> Any:
        """Get configuration value by dot-notation path"""
        if self.config is None:
            self.load()
        
        keys = path.split('.')
        value = self.config
        
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        
        return value
    
    def is_enabled(self, feature_path: str) -> bool:
        """Check if a feature is enabled"""
        return self.get(feature_path, False) is True

# Usage
if __name__ == '__main__':
    config = ConfigLoader()
    config.load()
    
    print(f"Platform Name: {config.get('platform.name')}")
    print(f"API Base URL: {config.get('api.baseUrl')}")
    print(f"Authentication Enabled: {config.is_enabled('authentication.enabled')}")
    print(f"Participatory Enabled: {config.is_enabled('features.participatory.enabled')}")
```

## Java

```java
// ConfigLoader.java
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.FileReader;
import java.io.IOException;

public class ConfigLoader {
    private String configPath;
    private JsonObject config;
    
    public ConfigLoader() {
        this("./liveplatform.config.json");
    }
    
    public ConfigLoader(String configPath) {
        this.configPath = configPath;
    }
    
    public JsonObject load() throws IOException {
        Gson gson = new Gson();
        try (FileReader reader = new FileReader(configPath)) {
            config = gson.fromJson(reader, JsonObject.class);
            return config;
        }
    }
    
    public Object get(String path) {
        return get(path, null);
    }
    
    public Object get(String path, Object defaultValue) {
        if (config == null) {
            try {
                load();
            } catch (IOException e) {
                return defaultValue;
            }
        }
        
        String[] keys = path.split("\\.");
        JsonObject current = config;
        
        for (int i = 0; i < keys.length - 1; i++) {
            if (current.has(keys[i]) && current.get(keys[i]).isJsonObject()) {
                current = current.getAsJsonObject(keys[i]);
            } else {
                return defaultValue;
            }
        }
        
        String lastKey = keys[keys.length - 1];
        if (current.has(lastKey)) {
            return current.get(lastKey);
        }
        
        return defaultValue;
    }
    
    public boolean isEnabled(String featurePath) {
        Object value = get(featurePath, false);
        return value instanceof Boolean && (Boolean) value;
    }
    
    // Usage example
    public static void main(String[] args) {
        try {
            ConfigLoader config = new ConfigLoader();
            config.load();
            
            System.out.println("Platform Name: " + config.get("platform.name"));
            System.out.println("API Base URL: " + config.get("api.baseUrl"));
            System.out.println("Authentication Enabled: " + config.isEnabled("authentication.enabled"));
            System.out.println("Participatory Enabled: " + config.isEnabled("features.participatory.enabled"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Go

```go
// config_loader.go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "strings"
)

type ConfigLoader struct {
    configPath string
    config     map[string]interface{}
}

func NewConfigLoader(configPath string) *ConfigLoader {
    if configPath == "" {
        configPath = "./liveplatform.config.json"
    }
    return &ConfigLoader{
        configPath: configPath,
    }
}

func (c *ConfigLoader) Load() error {
    data, err := ioutil.ReadFile(c.configPath)
    if err != nil {
        return fmt.Errorf("failed to read config file: %w", err)
    }
    
    if err := json.Unmarshal(data, &c.config); err != nil {
        return fmt.Errorf("failed to parse config JSON: %w", err)
    }
    
    return nil
}

func (c *ConfigLoader) Get(path string) (interface{}, error) {
    if c.config == nil {
        if err := c.Load(); err != nil {
            return nil, err
        }
    }
    
    keys := strings.Split(path, ".")
    var current interface{} = c.config
    
    for _, key := range keys {
        if m, ok := current.(map[string]interface{}); ok {
            if val, exists := m[key]; exists {
                current = val
            } else {
                return nil, fmt.Errorf("key not found: %s", key)
            }
        } else {
            return nil, fmt.Errorf("invalid path: %s", path)
        }
    }
    
    return current, nil
}

func (c *ConfigLoader) IsEnabled(featurePath string) bool {
    val, err := c.Get(featurePath)
    if err != nil {
        return false
    }
    
    if b, ok := val.(bool); ok {
        return b
    }
    
    return false
}

// Usage example
func main() {
    config := NewConfigLoader("")
    if err := config.Load(); err != nil {
        fmt.Printf("Error loading config: %v\n", err)
        return
    }
    
    platformName, _ := config.Get("platform.name")
    fmt.Printf("Platform Name: %v\n", platformName)
    
    apiBaseURL, _ := config.Get("api.baseUrl")
    fmt.Printf("API Base URL: %v\n", apiBaseURL)
    
    fmt.Printf("Authentication Enabled: %v\n", config.IsEnabled("authentication.enabled"))
    fmt.Printf("Participatory Enabled: %v\n", config.IsEnabled("features.participatory.enabled"))
}
```

## C#

```csharp
// ConfigLoader.cs
using System;
using System.IO;
using Newtonsoft.Json.Linq;

public class ConfigLoader
{
    private string configPath;
    private JObject config;
    
    public ConfigLoader(string configPath = "./liveplatform.config.json")
    {
        this.configPath = configPath;
    }
    
    public JObject Load()
    {
        try
        {
            string json = File.ReadAllText(configPath);
            config = JObject.Parse(json);
            return config;
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to load configuration: {ex.Message}");
        }
    }
    
    public object Get(string path, object defaultValue = null)
    {
        if (config == null)
        {
            Load();
        }
        
        JToken token = config.SelectToken(path);
        return token?.ToObject<object>() ?? defaultValue;
    }
    
    public bool IsEnabled(string featurePath)
    {
        object value = Get(featurePath, false);
        return value is bool && (bool)value;
    }
    
    // Usage example
    public static void Main(string[] args)
    {
        try
        {
            var config = new ConfigLoader();
            config.Load();
            
            Console.WriteLine($"Platform Name: {config.Get("platform.name")}");
            Console.WriteLine($"API Base URL: {config.Get("api.baseUrl")}");
            Console.WriteLine($"Authentication Enabled: {config.IsEnabled("authentication.enabled")}");
            Console.WriteLine($"Participatory Enabled: {config.IsEnabled("features.participatory.enabled")}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

## Notes

- All examples provide basic configuration loading and access functionality
- For production use, consider adding caching, validation, and error handling
- Ensure the configuration file path is correct for your deployment environment
- Some examples require additional dependencies (e.g., Gson for Java, Newtonsoft.Json for C#)
- Consider using environment variables for environment-specific overrides
