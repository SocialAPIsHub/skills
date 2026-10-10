# SocialAPIs agent skills

Agent skills for [SocialAPIs](https://socialapis.io): public Facebook and Instagram data (pages, posts, comments, groups, Meta Ads Library, Marketplace, Instagram profiles, posts, reels and locations) for AI coding agents like Claude Code, Cursor, Codex and OpenCode.

| Skill | What it does |
|---|---|
| [`socialapis`](skills/socialapis/SKILL.md) | Teaches the agent how to call the SocialAPIs REST API (or use the MCP server when it's connected): auth, choosing the right endpoint, pagination, credits and errors. Includes the full [endpoint reference](skills/socialapis/references/endpoints.md). |

## Install

```bash
npx skills add SocialAPIsHub/skills
```

Or copy `skills/socialapis/` into your agent's skills folder (for Claude Code: `~/.claude/skills/socialapis/` or `.claude/skills/socialapis/` in a project).

Then set your API key (free plan: 200 credits a month, no card) from https://socialapis.io/dashboard:

```bash
export SOCIALAPIS_API_KEY=your_key
```

## Related

- MCP server: [`SocialAPIsHub/mcp-server`](https://github.com/SocialAPIsHub/mcp-server) (hosted at `https://mcp.socialapis.io/mcp`, or `npx -y @socialapis/mcp`)
- SDKs: [Python](https://github.com/SocialAPIsHub/socialapis-python), [JavaScript](https://github.com/SocialAPIsHub/socialapis-js), [Go](https://github.com/SocialAPIsHub/socialapis-go)
- n8n node: [`n8n-nodes-socialapis`](https://www.npmjs.com/package/n8n-nodes-socialapis)
- OpenAPI spec: https://socialapis.io/openapi.json
- Docs: https://docs.socialapis.io

## License

MIT
