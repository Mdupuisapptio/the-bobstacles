# Cloudability MCP Server Setup - Conversation Export

**Date:** June 16, 2026  
**Topic:** Connecting Bob to Cloudability via MCP Server

---

## Initial Request

**User:** How can I connect to Cloudability?

**Bob:** I searched IBM documentation and found two authentication methods for Cloudability API:

1. **Cloudability API Keys (Basic Auth)**
   - API key forms username in Basic Auth header
   - Example: `curl https://api.cloudability.com/v3/budgets -u 'Your_API_Key:'`

2. **Frontdoor apptio-opentoken (Header-based)**
   - Pass `apptio-opentoken` and `apptio-environmentid` in headers
   - More modern authentication method

**Regional Endpoints:**
- US Commercial: `https://api.cloudability.com`
- US Government: `https://api.usgov.cloudability.com`
- EU/JP/SG/IN/CA: Region-specific endpoints

---

## Clarification

**User:** If I want to connect you (BOB) with CLDY

**Bob:** Asked for clarification on approach preference

**User:** Create a new Cloudability MCP server for me

---

## Implementation Process

### 1. Project Structure Creation

Created MCP server at:
```
C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\
├── package.json
├── tsconfig.json
├── README.md
└── src/
    └── index.ts
```

### 2. Server Implementation

**Tools Implemented:**
- `get_budgets` - Get list of all budgets (limit: 1-100)
- `get_vendor_accounts` - Get cloud vendor accounts (AWS/Azure/GCP)
- `get_cost_report` - Get cost and usage data for date range
- `get_recommendations` - Get cost optimization recommendations

**Technology Stack:**
- TypeScript
- @modelcontextprotocol/sdk v1.0.4
- axios v1.7.9
- zod v3.24.1

### 3. Configuration Details

**User Selected:**
- Region: US Commercial (api.cloudability.com)
- API Key: cPItzxNY9QZ1e4v5cHFCNpNaijk=

**MCP Settings Configuration:**
```json
{
  "cloudability": {
    "command": "node",
    "args": [
      "C:\\Users\\MathieuDupuis-Doiron\\AppData\\Roaming\\Bob-Code\\MCP\\cloudability-server\\build\\index.js"
    ],
    "env": {
      "CLOUDABILITY_API_KEY": "cPItzxNY9QZ1e4v5cHFCNpNaijk=",
      "CLOUDABILITY_API_URL": "https://api.cloudability.com"
    },
    "disabled": false,
    "alwaysAllow": [],
    "disabledTools": []
  }
}
```

### 4. Build Process

Commands executed:
```bash
mkdir C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server
cd C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server
npm install
npm run build
```

Build output: Successfully compiled with 109 packages, 0 vulnerabilities

---

## Available Tools After Setup

### get_budgets
**Description:** Get a list of all budgets configured in Cloudability  
**Parameters:**
- `limit` (optional): Maximum number of budgets to return (1-100)

### get_vendor_accounts
**Description:** Get cloud vendor accounts connected to Cloudability  
**Parameters:**
- `vendor` (required): Cloud vendor name (AWS, Azure, or GCP)
- `limit` (optional): Maximum number of accounts to return

### get_cost_report
**Description:** Get cost and usage data for a specified date range  
**Parameters:**
- `start_date` (required): Start date in YYYY-MM-DD format
- `end_date` (required): End date in YYYY-MM-DD format
- `dimensions` (optional): Dimensions to group by (e.g., ['vendor', 'service'])
- `metrics` (optional): Metrics to include (e.g., ['unblended_cost', 'usage_quantity'])

### get_recommendations
**Description:** Get cost optimization recommendations from Cloudability  
**Parameters:**
- `vendor` (optional): Filter by cloud vendor (AWS, Azure, GCP)
- `category` (optional): Filter by recommendation category

---

## Usage Examples

After restarting Bob, you can use commands like:
- "Show me all my Cloudability budgets"
- "Get my AWS vendor accounts"
- "Get cost report for last month"
- "Show me cost optimization recommendations"
- "Get Azure accounts from Cloudability"

---

## Technical Details

### Authentication Method
The server uses Basic Authentication with the Cloudability API key as the username component. The axios instance is configured with:
```typescript
auth: {
  username: CLOUDABILITY_API_KEY,
  password: "",
}
```

### Error Handling
The server includes comprehensive error handling for:
- Missing API key (throws error on startup)
- Axios errors (returns formatted error messages with status codes)
- Invalid tool names
- Schema validation errors (using Zod)

### API Endpoints
Base URL: `https://api.cloudability.com`
- Budgets: `/v3/budgets`
- Vendor Accounts: `/v3/vendors/{vendor}/accounts`
- Cost Reports: `/v3/reporting/cost`
- Recommendations: `/v3/recommendations`

---

## Next Steps

1. **Restart Bob** to load the new MCP server
2. The Cloudability tools will appear in the "Connected MCP Servers" section
3. Start using the tools with natural language commands

---

## Documentation References

- [Cloudability API V3 Documentation](https://www.ibm.com/docs/en/cloudability-commercial/cloudability-premium/saas?topic=api-getting-started-cloudability-v3)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Enhanced Access Administration API](https://www.ibm.com/docs/en/apptio-platform/access-administration/saas?topic=apis-enhanced-access-administration-api-authentication-via-api-keys)

---

## Files Created

1. `C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\package.json`
2. `C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\tsconfig.json`
3. `C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\src\index.ts`
4. `C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\README.md`
5. `C:\Users\MathieuDupuis-Doiron\AppData\Roaming\Bob-Code\MCP\cloudability-server\build\index.js` (compiled)

## Configuration Modified

- `C:\Users\MathieuDupuis-Doiron\.bob\settings\mcp_settings.json` - Added Cloudability server configuration

---

**Status:** ✅ Complete - Server built, configured, and ready to use after restart