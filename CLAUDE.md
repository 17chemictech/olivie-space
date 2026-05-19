# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal landing page for olivie.base.eth — a simple static HTML site hosted on Base chain/IPFS. No build system or framework is used.

## Commands

None required — this is a single static HTML file. To view locally, open `index.html` in a browser, or serve with any static server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## Architecture

Single-file static HTML page with embedded CSS. The page contains:
- Personal avatar/profile section
- ENS name display (olivie.base.eth)
- x402 payment-enabled contact button (simulated)
- Footer with Arweave/IPFS branding

No JavaScript frameworks, CSS preprocessors, or build tools are used.
