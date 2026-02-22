#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File to store saved requests
const REQUESTS_FILE = path.join(__dirname, "saved-requests.json");

// Load saved requests
function loadRequests() {
  try {
    if (fs.existsSync(REQUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(REQUESTS_FILE, "utf-8"));
    }
  } catch (error) {
    console.error("Error loading requests:", error);
  }
  return {};
}

// Save requests to file
function saveRequests(requests) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

// Make HTTP request
async function makeRequest(config) {
  const { method, url, headers = {}, body, timeout = 30000 } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseBody;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }
    } else {
      responseBody = await response.text();
    }

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      time: `${endTime - startTime}ms`,
      size: JSON.stringify(responseBody).length,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: `Request timeout after ${timeout}ms`,
      };
    }
    return {
      success: false,
      error: error.message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// Create MCP server
const server = new Server(
  {
    name: "http-client-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "http_request",
        description:
          "Make an HTTP request to any URL. Supports GET, POST, PUT, PATCH, DELETE methods. Returns status, headers, body, and timing information.",
        inputSchema: {
          type: "object",
          properties: {
            method: {
              type: "string",
              enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
              description: "HTTP method",
            },
            url: {
              type: "string",
              description: "Full URL to request (e.g., https://api.example.com/endpoint)",
            },
            headers: {
              type: "object",
              description: "Request headers as key-value pairs",
              additionalProperties: { type: "string" },
            },
            body: {
              type: ["object", "string"],
              description: "Request body (for POST, PUT, PATCH). Can be JSON object or string.",
            },
            timeout: {
              type: "number",
              description: "Request timeout in milliseconds (default: 30000)",
            },
          },
          required: ["method", "url"],
        },
      },
      {
        name: "save_request",
        description: "Save an HTTP request configuration for later use",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Unique name for this request",
            },
            method: {
              type: "string",
              enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
              description: "HTTP method",
            },
            url: {
              type: "string",
              description: "Full URL",
            },
            headers: {
              type: "object",
              description: "Request headers",
              additionalProperties: { type: "string" },
            },
            body: {
              type: ["object", "string"],
              description: "Request body",
            },
            description: {
              type: "string",
              description: "Description of what this request does",
            },
          },
          required: ["name", "method", "url"],
        },
      },
      {
        name: "list_requests",
        description: "List all saved HTTP requests",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "run_saved_request",
        description: "Execute a previously saved request by name",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the saved request to execute",
            },
            overrides: {
              type: "object",
              description: "Optional overrides for headers or body",
              properties: {
                headers: {
                  type: "object",
                  additionalProperties: { type: "string" },
                },
                body: {
                  type: ["object", "string"],
                },
              },
            },
          },
          required: ["name"],
        },
      },
      {
        name: "delete_request",
        description: "Delete a saved request",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the request to delete",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "http_request": {
      const result = await makeRequest(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "save_request": {
      const requests = loadRequests();
      const { name: reqName, ...config } = args;
      requests[reqName] = {
        ...config,
        savedAt: new Date().toISOString(),
      };
      saveRequests(requests);
      return {
        content: [
          {
            type: "text",
            text: `Request "${reqName}" saved successfully.`,
          },
        ],
      };
    }

    case "list_requests": {
      const requests = loadRequests();
      const list = Object.entries(requests).map(([name, config]) => ({
        name,
        method: config.method,
        url: config.url,
        description: config.description || "",
        savedAt: config.savedAt,
      }));

      if (list.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No saved requests found.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    }

    case "run_saved_request": {
      const requests = loadRequests();
      const { name: reqName, overrides = {} } = args;

      if (!requests[reqName]) {
        return {
          content: [
            {
              type: "text",
              text: `Request "${reqName}" not found.`,
            },
          ],
        };
      }

      const config = {
        ...requests[reqName],
        headers: { ...requests[reqName].headers, ...overrides.headers },
        body: overrides.body || requests[reqName].body,
      };

      const result = await makeRequest(config);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    case "delete_request": {
      const requests = loadRequests();
      const { name: reqName } = args;

      if (!requests[reqName]) {
        return {
          content: [
            {
              type: "text",
              text: `Request "${reqName}" not found.`,
            },
          ],
        };
      }

      delete requests[reqName];
      saveRequests(requests);
      return {
        content: [
          {
            type: "text",
            text: `Request "${reqName}" deleted successfully.`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// List resources (saved requests as resources)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const requests = loadRequests();
  return {
    resources: Object.entries(requests).map(([name, config]) => ({
      uri: `request://${name}`,
      name: `${config.method} ${name}`,
      description: config.description || `${config.method} ${config.url}`,
      mimeType: "application/json",
    })),
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^request:\/\/(.+)$/);

  if (!match) {
    throw new Error(`Invalid resource URI: ${uri}`);
  }

  const name = match[1];
  const requests = loadRequests();

  if (!requests[name]) {
    throw new Error(`Request "${name}" not found`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(requests[name], null, 2),
      },
    ],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HTTP Client MCP server running on stdio");
}

main().catch(console.error);
