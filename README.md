# YourVotePoll

Public site: https://yourvotepoll.com
Private owner traffic view: /stats (Sign in with ChatGPT).

Edit worker/page.html for the game and worker/index.js for routes. Run npm run build. D1 binding DB holds daily aggregate counts; generated schema migrations are in drizzle/. OWNER_EMAIL is a hosted secret used for owner authorization.

Tracking saves daily totals only, using Central time. A first-party HttpOnly cookie avoids recounting a browser on the same day. Returning another day counts again. No IP addresses, party choices or individual visitor records are saved. Tracking starts with this version; historical visits are unavailable.

GitHub pushes do not automatically publish to Sites. Ask ChatGPT to edit and republish the existing Site.
