# SocialAPIs agent skills

Agent skills for [SocialAPIs](https://socialapis.io): public Facebook and Instagram data (pages, posts, comments, groups, Meta Ads Library, Marketplace, Instagram profiles, posts, reels and locations) for AI agents like Claude Code, Cursor, Codex, Gemini CLI and OpenCode.

One skill teaches the agent the API. The others are complete research playbooks: they decide which calls to make, keep the credit cost in check, clean the data and end with a report you can use.

## Install

```bash
npx skills add SocialAPIsHub/skills
```

Or copy the folders in `skills/` into your agent's skills folder (for Claude Code: `~/.claude/skills/` or `.claude/skills/` in a project). Keep `socialapis` with the others: they use its endpoint reference.

Then set your API key (free plan: 200 credits a month, no card) from https://socialapis.io/dashboard:

```bash
export SOCIALAPIS_API_KEY=your_key
```

If the [SocialAPIs MCP server](https://github.com/SocialAPIsHub/mcp-server) is connected, the skills use its tools instead of raw HTTP.

## Skills

### Facebook Marketplace

| Skill | Ask it | You get |
|---|---|---|
| [`marketplace-price-check`](skills/marketplace-price-check/SKILL.md) | "What does a PS5 sell for in Manchester?" | Fair price range and median from cleaned listings, deals worth a look, listings to skip |
| [`used-car-scout`](skills/used-car-scout/SKILL.md) | "2018+ Corolla under $14k near Austin" | Ranked shortlist, each car priced against similar ones, scam flags, questions to ask |
| [`rental-market-snapshot`](skills/rental-market-snapshot/SKILL.md) | "What does a 2-bed cost in Lisbon right now?" | Rent by bedroom count, what's new this week, listings that look too good to be true |

### Meta Ads Library

| Skill | Ask it | You get |
|---|---|---|
| [`ad-longevity-scan`](skills/ad-longevity-scan/SKILL.md) | "Which of Gymshark's ads are working in the UK?" | Ads ranked by days live (the public signal of a winner), what the long runners share, what they're testing now |
| [`ad-market-map`](skills/ad-market-map/SKILL.md) | "Who advertises 'dog insurance' in Germany?" | Advertisers by ad volume, who is ramping up, the promise everyone makes and the angles nobody uses |

### Communities, brands and creators

| Skill | Ask it | You get |
|---|---|---|
| [`group-question-bank`](skills/group-question-bank/SKILL.md) | "What do people keep asking in these 3 sourdough groups?" | Ranked questions in members' own words, what the community recommends, unanswered topics |
| [`social-scorecard`](skills/social-scorecard/SKILL.md) | "Compare our page with these 4 competitors" | Side-by-side table normalized per 1,000 followers, format mix, best posts, what to change |
| [`creator-vetting`](skills/creator-vetting/SKILL.md) | "Should we pay @creator for 3 reels?" | Go / caution / skip verdict: engagement vs size band, reel reach, spikes, past brand deals |
| [`local-spot-report`](skills/local-spot-report/SKILL.md) | "What's around Shoreditch Box Park on Instagram?" | Activity at the place, top posts, nearby spots by activity, local businesses |

### The API itself

| Skill | What it does |
|---|---|
| [`socialapis`](skills/socialapis/SKILL.md) | How to call the SocialAPIs REST API or MCP server: auth, choosing the endpoint, pagination, credits and errors. Full [endpoint reference](skills/socialapis/references/endpoints.md) (53 endpoints). |

## How they're built

- **They plan the spend.** Each skill states its typical credit cost and asks before a large run. `/usage` (free) shows the balance.
- **They clean before they count.** Accessories in a phone search, placeholder prices, duplicate ads and off-topic posts are removed, and the report says how many and why.
- **Medians, not averages,** so one viral post or one silly price doesn't decide the answer.
- **Every claim links to its source** post, ad or listing.
- **They say what the data can't tell you:** asking prices aren't sold prices, ad longevity isn't conversions, location tags undercount visits.
- **Public data only,** and no profiling of private individuals. See https://socialapis.io/terms.

Facebook and Instagram are supported today. Other platforms are on the roadmap; the skills don't pretend otherwise.

## Related

- MCP server: [`SocialAPIsHub/mcp-server`](https://github.com/SocialAPIsHub/mcp-server) (hosted at `https://mcp.socialapis.io/mcp`, or `npx -y @socialapis/mcp`)
- SDKs: [Python](https://github.com/SocialAPIsHub/socialapis-python), [JavaScript](https://github.com/SocialAPIsHub/socialapis-js), [Go](https://github.com/SocialAPIsHub/socialapis-go)
- n8n node: [`n8n-nodes-socialapis`](https://www.npmjs.com/package/n8n-nodes-socialapis)
- OpenAPI spec: https://socialapis.io/openapi.json
- Docs: https://docs.socialapis.io

## License

MIT
