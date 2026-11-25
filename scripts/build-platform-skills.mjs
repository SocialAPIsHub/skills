// Builds the per-platform skills (skills/<name>/SKILL.md + references/endpoints.md)
// from skills/socialapis/references/endpoints.md, the full reference.
// Run after the reference changes: node scripts/build-platform-skills.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reference = fs.readFileSync(path.join(root, 'skills/socialapis/references/endpoints.md'), 'utf8');

const SITE = 'https://socialapis.io';
const PAGES = {
  '/facebook/pages/id': 'facebook-page-id',
  '/facebook/pages/details': 'facebook-page-details',
  '/facebook/pages/posts': 'facebook-page-posts',
  '/facebook/pages/reels': 'facebook-page-reels',
  '/facebook/pages/videos': 'facebook-page-videos',
  '/facebook/pages/albums': 'facebook-page-albums',
  '/facebook/groups/id': 'facebook-group-id',
  '/facebook/groups/details': 'facebook-group-details',
  '/facebook/groups/posts': 'facebook-group-posts',
  '/facebook/groups/videos': 'facebook-group-videos',
  '/facebook/groups/albums': 'facebook-group-albums',
  '/facebook/albums/items': 'facebook-album-items',
  '/facebook/posts/id': 'facebook-post-id',
  '/facebook/posts/details': 'facebook-post-details',
  '/facebook/posts/details/extended': 'facebook-post-details-extended',
  '/facebook/posts/comments': 'facebook-post-comments',
  '/facebook/posts/comments/replies': 'facebook-post-comment-replies',
  '/facebook/posts/attachments': 'facebook-post-attachment-details',
  '/facebook/posts/video': 'facebook-video-post-details',
  '/facebook/search/pages': 'facebook-search-pages',
  '/facebook/search/people': 'facebook-search-people',
  '/facebook/search/locations': 'facebook-search-locations',
  '/facebook/search/posts': 'facebook-search-posts',
  '/facebook/search/videos': 'facebook-search-videos',
  '/facebook/ads/countries': 'meta-ads-countries',
  '/facebook/ads/search': 'meta-ads-search',
  '/facebook/ads/page-details': 'meta-ads-page-details',
  '/facebook/ads/archive-details': 'meta-ads-archive-details',
  '/facebook/ads/keywords': 'meta-ads-keywords',
  '/facebook/marketplace/search': 'marketplace-search',
  '/facebook/marketplace/listing': 'marketplace-listing-details',
  '/facebook/marketplace/seller': 'marketplace-seller-details',
  '/facebook/marketplace/categories': 'marketplace-categories',
  '/facebook/marketplace/city-coordinates': 'marketplace-city-coordinates',
  '/facebook/marketplace/vehicles': 'marketplace-vehicles',
  '/facebook/marketplace/rentals': 'marketplace-rentals',
  '/facebook/media/download': 'facebook-download-media',
  '/instagram/user/id': 'instagram-user-id',
  '/instagram/profile/details': 'instagram-profile-details',
  '/instagram/profile/posts': 'instagram-profile-posts',
  '/instagram/profile/reels': 'instagram-profile-reels',
  '/instagram/profile/highlights': 'instagram-profile-highlights',
  '/instagram/highlight/details': 'instagram-highlight-details',
  '/instagram/post/id': 'instagram-post-id',
  '/instagram/post/details': 'instagram-post-details',
  '/instagram/reels/feed': 'instagram-reels-feed',
  '/instagram/reels/audio': 'instagram-reels-by-audio',
  '/instagram/search': 'instagram-popular-search',
  '/instagram/location/posts': 'instagram-location-posts',
  '/instagram/location/nearby': 'instagram-nearby-locations',
};
const page = (route) => (PAGES[route] ? `${SITE}/api-sources/${PAGES[route]}` : null);

// "## Section" → [{ route, body }]
const sections = {};
let current = null;
for (const block of reference.split(/^(?=## |### )/m)) {
  const h2 = block.match(/^## (.+)\n/);
  if (h2) {
    current = h2[1].trim();
    sections[current] = [];
    continue;
  }
  const h3 = block.match(/^### `GET ([^`]+)`\n/);
  if (h3 && current) sections[current].push({ route: h3[1], body: block.trim() });
}

const firstSentence = (body) => {
  const text = body.split('\n').slice(1).join(' ').trim();
  const s = text.match(/^(.+?\.)(\s|$)/);
  return (s ? s[1] : text).replace(/\|/g, '\\|');
};
const price = (body) => {
  const p = body.match(/Pricing: ([^.]+(?:\.[0-9][^.]*)?)\./);
  return p ? p[1].replace(/\|/g, '\\|') : '';
};

const SKILLS = [
  {
    name: 'facebook-pages-api',
    title: 'Facebook Pages API',
    sections: ['Facebook pages', 'Facebook posts, videos and comments', 'Facebook albums', 'Facebook search', 'Facebook media'],
    landing: `${SITE}/api-sources/facebook-page-details`,
    tool: { label: 'Free follower count lookup', url: `${SITE}/tools/facebook-follower-count` },
    description:
      "Read public Facebook page data: page details (followers, category, contact info), posts, reels, videos, photo albums, a post's comments and replies, and Facebook search for pages, people, posts and videos, through the SocialAPIs REST API. Use when the user wants to look up, monitor or compare public Facebook pages or posts, collect comments, or write code that does, without a Meta developer app.",
    intro: 'Public Facebook page and post data as JSON: one API key, no Meta developer app, no OAuth, no page access token.',
    example: { route: '/facebook/pages/details', query: 'link=https://www.facebook.com/nike', py: { link: 'https://www.facebook.com/nike' } },
    tips: [
      'Have a page name but no URL? `/facebook/search/pages?query=<name>` first, then use the returned link.',
      '`/facebook/pages/posts` returns 3 to 9 posts per call and costs one credit per 3 posts returned; page with `end_cursor`, filter by date with `after_time` / `before_time`.',
      'Views, video URLs and audio of a reel or video post come from `/facebook/posts/details/extended`, not `/facebook/posts/details`.',
    ],
  },
  {
    name: 'facebook-ads-library-api',
    title: 'Facebook Ads Library API',
    sections: ['Meta Ads Library'],
    landing: `${SITE}/api-sources/meta-ads-search`,
    tool: { label: 'Free ad checker', url: `${SITE}/tools/facebook-ad-checker` },
    description:
      'Search the Meta (Facebook) Ad Library: the ads a brand or keyword is running in a country, with creative text, start date, platforms and, where Meta shows them, impressions and spend ranges; the advertisers behind a keyword; and one ad or one advertiser page in detail, through the SocialAPIs REST API. Use for competitor ad research, ad monitoring, or code that reads the Ad Library without app review.',
    intro: 'The Meta Ad Library as JSON: every public ad a brand runs, searchable by keyword, advertiser and country. No app review, no Meta access token.',
    example: { route: '/facebook/ads/search', query: 'query=nike&country=US&activeStatus=Active&sort_data=impressions', py: { query: 'nike', country: 'US', activeStatus: 'Active', sort_data: 'impressions' } },
    tips: [
      'Valid country codes: `/facebook/ads/countries`.',
      "Which advertisers use a keyword, and how many ads each runs: `/facebook/ads/keywords`. One advertiser's ads: `/facebook/ads/search?ad_page_id=…`, the ID coming from `/facebook/ads/keywords` or `/facebook/pages/details`.",
      'Spend and impressions are ranges, and Meta publishes them for some ads only. When they are missing, say so rather than estimating.',
      'How long an ad has run (start date to today) is the best public signal that it works.',
    ],
  },
  {
    name: 'facebook-marketplace-api',
    title: 'Facebook Marketplace API',
    sections: ['Facebook Marketplace'],
    landing: `${SITE}/api-sources/marketplace-search`,
    description:
      'Search Facebook Marketplace near any city: listings with price, photos, location and seller, plus one listing or one seller in detail, vehicles (make, model, year, mileage) and rentals (price, bedrooms), through the SocialAPIs REST API. Use for price checks, deal hunting, used-car or rental research, resale monitoring, or code that reads Marketplace.',
    intro: 'Public Facebook Marketplace listings as JSON, for any city: search, listing details, sellers, vehicles and rentals.',
    example: { route: '/facebook/marketplace/city-coordinates', query: 'city=Austin', py: { city: 'Austin' } },
    tips: [
      'Searches take coordinates: get them once with `/facebook/marketplace/city-coordinates?city=<city>`, then pass `latitude` / `longitude` to the search, vehicles or rentals endpoint.',
      'Category IDs: `/facebook/marketplace/categories`.',
      'Listings include accessories, placeholder prices ($1, $123) and duplicates: clean them before computing a price, and use the median, not the average.',
    ],
  },
  {
    name: 'facebook-groups-api',
    title: 'Facebook Groups API',
    sections: ['Facebook groups', 'Facebook albums'],
    landing: `${SITE}/api-sources/facebook-group-posts`,
    description:
      "Read public Facebook groups: a group's details (members, description, privacy), its posts, videos and photo albums, through the SocialAPIs REST API. Use when the user wants to see what a public community talks about, track questions or mentions in groups, or write code that reads public group posts. Private groups are not accessible.",
    intro: 'Public Facebook group data as JSON: details, posts, videos and albums of any public group. No login, no group membership.',
    example: { route: '/facebook/groups/details', query: 'link=https://www.facebook.com/groups/<group>', py: { link: 'https://www.facebook.com/groups/<group>' } },
    tips: [
      'Only public groups. A private group returns an error, not an empty list: tell the user it is private.',
      'Albums need the numeric group ID: `/facebook/groups/id` first, then `/facebook/groups/albums?group_id=…`, then `/facebook/albums/items?album_id=…`.',
    ],
  },
  {
    name: 'instagram-api',
    title: 'Instagram API',
    sections: ['Instagram'],
    landing: `${SITE}/api-sources/instagram-profile-details`,
    tool: { label: 'Free Instagram follower count', url: `${SITE}/tools/instagram-follower-count` },
    description:
      "Read public Instagram data: profiles (followers, bio, business contact), a profile's posts, reels and story highlights, one post's details, reels by audio, places and the posts at a place, and Instagram search, through the SocialAPIs REST API. Use for influencer or creator research, competitor monitoring, engagement analysis, or code that reads public Instagram without the Graph API.",
    intro: 'Public Instagram profiles, posts, reels, highlights and places as JSON. One API key, no Instagram login, no Graph API app.',
    example: { route: '/instagram/profile/details', query: 'username=nike', py: { username: 'nike' } },
    tips: [
      '**Two IDs per profile.** `/instagram/user/id` returns the long `user_id` (for `/instagram/profile/posts` and `/instagram/profile/reels`) and the short `pk` (for `/instagram/profile/highlights`, which still calls it `user_id`). The wrong one returns nothing.',
      'One post: `/instagram/post/details?shortcode=<code>`, the code being the part after `/p/` or `/reel/` in its URL.',
      'Engagement rate = (likes + comments) / followers over the last 9 to 12 posts; use the median per post so one viral post does not decide it.',
    ],
  },
];

const ROUTER = {
  'facebook-pages-api': 'Facebook pages, posts and comments',
  'facebook-ads-library-api': 'Meta Ads Library',
  'facebook-marketplace-api': 'Facebook Marketplace',
  'facebook-groups-api': 'public Facebook groups',
  'instagram-api': 'Instagram',
};

for (const s of SKILLS) {
  const eps = s.sections.flatMap((name) => {
    if (!sections[name]) throw new Error(`Section "${name}" not found in the reference`);
    return sections[name];
  });
  const rows = eps
    .map((e) => {
      const url = page(e.route);
      const route = url ? `[\`${e.route}\`](${url})` : `\`${e.route}\``;
      return `| ${route} | ${firstSentence(e.body)} | ${price(e.body)} |`;
    })
    .join('\n');
  const pyParams = Object.entries(s.example.py)
    .map(([k, v]) => `"${k}": "${v}"`)
    .join(', ');
  const others = SKILLS.filter((o) => o.name !== s.name)
    .map((o) => `\`${o.name}\` (${ROUTER[o.name]})`)
    .join(', ');

  const skill = `---
name: ${s.name}
description: ${s.description}
---

# ${s.title} (SocialAPIs)

${s.intro}

- Website: ${SITE} · this API: ${s.landing}
- Free API key: ${SITE}/auth/signup (200 credits a month, no card)${s.tool ? `\n- ${s.tool.label}, no signup: ${s.tool.url}` : ''}
- Every parameter: [references/endpoints.md](references/endpoints.md) · OpenAPI: ${SITE}/openapi.json · llms.txt: ${SITE}/llms.txt

## Setup

1. The user needs an API key from ${SITE}/dashboard.
2. Read it from the environment, \`SOCIALAPIS_API_KEY\`. **Never** hard-code it, print it, or ask the user to paste it into the chat. If it is missing, tell the user to set it.
3. Send it in the **\`x-api-token\` header**, never in the URL.

If SocialAPIs MCP tools are available in this session (\`facebook_page\`, \`facebook_ads\`, \`instagram_profile\`, …), use them instead of raw HTTP. Hosted MCP server: \`https://mcp.socialapis.io/mcp\`.

## Making a call

\`\`\`bash
curl -s -H "x-api-token: $SOCIALAPIS_API_KEY" \\
  "https://api.socialapis.io${s.example.route}?${s.example.query}"
\`\`\`

\`\`\`python
import os, requests

r = requests.get(
    "https://api.socialapis.io${s.example.route}",
    params={${pyParams}},
    headers={"x-api-token": os.environ["SOCIALAPIS_API_KEY"]},
    timeout=120,
)
r.raise_for_status()
data = r.json()
\`\`\`

SDKs: Python \`pip install socialapis-sdk\`, JavaScript \`npm install socialapis-sdk\`, PHP \`composer require socialapishub/socialapis\`.

## Endpoints

All \`GET\`, base URL \`https://api.socialapis.io\`. Each link opens the endpoint's page with a live example.

| Endpoint | What it returns | Credits |
|---|---|---|
${rows}

## Things that matter

${s.tips.map((t) => `- ${t}`).join('\n')}
- **Credits:** the response headers \`X-SocialAPIs-Credits-Deducted\` and \`X-SocialAPIs-Credits-Remaining\` say what a call cost. Before a large batch, check \`/usage\` (free) and tell the user roughly what it will cost.
- **Pagination:** list endpoints return a page plus \`end_cursor\`; pass it back as \`end_cursor\` until it is missing or the user has enough.
- **Slow calls:** a call can take up to about 90 seconds. Use a timeout of at least 120 s and don't fire hundreds of calls in parallel (\`/usage/limits\` shows the plan's rate limit).
- **Errors:** \`401\` bad or missing key · \`403\` out of credits or account paused · \`429\` rate limit, retry with backoff · \`502\` / \`504\` the source failed or timed out, retry once later. Failed calls are not charged.

Other SocialAPIs skills: ${others}, and \`socialapis\` for every endpoint at once.
`;

  const ref = `# ${s.title} endpoint reference (SocialAPIs)

Base URL: \`https://api.socialapis.io\` · Auth: header \`x-api-token: $SOCIALAPIS_API_KEY\` · All endpoints are \`GET\` with query parameters.

Generated from the full reference in the \`socialapis\` skill. Machine-readable: ${SITE}/openapi.json

${eps
  .map((e) => {
    const url = page(e.route);
    const [head, ...rest] = e.body.split('\n');
    return [head, '', url ? `Docs and live example: ${url}` : null, ...rest].filter((l) => l !== null).join('\n');
  })
  .join('\n\n')}
`;

  const dir = path.join(root, 'skills', s.name);
  fs.mkdirSync(path.join(dir, 'references'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), skill);
  fs.writeFileSync(path.join(dir, 'references/endpoints.md'), ref);
  console.log(`${s.name}: ${eps.length} endpoints`);
}
