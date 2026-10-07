# YourVotePoll

A parody voting game with a runaway party button. No votes are collected or stored.

## Play

Public site: https://voterpoll.morphd335.chatgpt.site

Custom domain: yourvotepoll.com (DNS setup pending).

## Local preview

From the repository folder, run:

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000.

## Behavior

- Democrat escapes six times, then allows a vote.
- Switch parties reverses which button escapes.
- Mouse and touch interaction are supported.
- Keyboard activation and Skip the chase allow direct voting.
- Play again resets the round.

## Hosting

The site is hosted with ChatGPT Sites. `.openai/hosting.json` identifies the existing site. This GitHub repository contains a copy of its source; GitHub pushes do not automatically publish changes to Sites.

Edit `dist/index.html` for design and behavior changes. To update the live site, ask ChatGPT to apply and publish the changes to the existing Site.
