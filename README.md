# CONTRABAND PUNK PLUGINS

A repository of community-contributed JavaScript plugin apps and animations for **The Contraband Punk** — a fully on-chain animated ERC721 NFT by [Sherone Rabinovitz](https://cryptopunksorigins.com).

The Contraband Punk's animation engine exposes 4 plugin hooks. You can write JavaScript that taps into them to add custom apps, animations, games, or visual effects that run inside the NFT's VR-goggle display area. This repo collects approved plugin submissions.

The Lab page (`ContrabandPunks-LAB.html` on the project website) auto-fetches every `.js` file from this repo's `main` branch on page load and lists them under the **SAMPLE SNIPPETS** tab — so contributions show up automatically once merged.

---

## QUICK START — TEST YOUR PLUGIN IN THE LAB FIRST

Before you submit anything, write & test in the Lab:

1. Go to [Contraband Punks Lab](https://cryptopunksorigins.com/ContrabandPunks-LAB.html)
2. Click the **CODE** tab → paste your plugin JS into the editor
3. Click **RUN** → plugin executes inside the live preview
4. Iterate until it looks right; open browser DevTools (Cmd+Opt+I on Mac, Ctrl+Shift+I on Win/Linux) to see any errors

Submissions that don't work in the Lab won't be merged. Save everyone time by verifying first.

---

## FILE FORMAT

Each plugin is a single `.js` file. Add comment headers at the top so it shows up properly in the Lab's snippets list:

```js
// @name: My Awesome Plugin
// @description: One-line description of what it does
// @author: yourname (or your wallet address, or your social handle)

// ...your plugin code starts here...

function pluginRender(ctx, gX, gY, gW, gH, scale) {
   // draw whatever you want inside the VR-goggles area
}
```

The `@name`, `@description`, and `@author` headers are parsed by the Lab and become the visible label on the snippet card. They're optional — if missing, the filename is used as the name.

### FILENAME RULES

- Must end in `.js` (case-insensitive — `.js`, `.JS`, `.Js` all work)
- Use a short descriptive lowercase-hyphenated name: `matrix-rain.js`, `stock-ticker.js`, `red-flash.js`
- No spaces in the filename (use hyphens or underscores)
- One plugin per file

---

## THE 4 PLUGIN HOOKS

Define any of these functions in your code. The animation engine calls them automatically.

| Hook | Signature | When called |
|---|---|---|
| `pluginInit` | `pluginInit(config, canvas, ctx)` | Once, right after the animation initializes |
| `pluginFrame` | `pluginFrame()` | Every animation frame (~60fps), BEFORE rendering |
| `pluginRender` | `pluginRender(ctx, gX, gY, gW, gH, scale)` | Each frame, INSIDE the goggles area. Return `true` to skip default text rendering |
| `pluginClick` | `pluginClick(capPixelIndex)` | When cap pixels 0, 3, or 4 are clicked |

Parameters available to your render function:
- `ctx` — Canvas 2D rendering context
- `gX, gY, gW, gH` — Glasses display area bounds (pixels)
- `scale` — Current punk pixel scale (18 for landscape, 36 for portrait)

For the full reference (accessible globals, hover-glow colors, dimensions, etc.), open the Lab and click the **REFERENCE** tab.

---

## CAP-PIXEL RULES — TWO ARE RESERVED

The punk's white cap has 5 clickable pixels:

| Pixel | Built-in animation | Plugin-overridable? |
|---|---|---|
| 0 | Scanner (green line sweep) | ✅ Yes |
| 1 | EKG heartbeat | 🔒 **NO — engine-reserved** |
| 2 | Graphic Equalizer | 🔒 **NO — engine-reserved** |
| 3 | Flash Burn | ✅ Yes |
| 4 | Pong | ✅ Yes |

**Plugin authors can intercept pixels 0, 3, 4** by defining `pluginClick(idx)`. Pixels 1 and 2 are wired directly to the engine's built-in `toggleEKG()` / `toggleEqualizer()` functions — they never reach `pluginClick`, so plugins cannot disable or override the EKG/Equalizer features. This is by design.

(You CAN observe clicks on pixels 1 and 2 via monkey-patching `toggleEKG` / `toggleEqualizer` — see the `PoliceCap-Pixel_ID-Logger` example for the technique.)

---

## SIZE CONSIDERATIONS — TWO STORAGE PATHS, TWO VERY DIFFERENT LIMITS

Once your plugin is approved, it can be pushed on-chain via one of **two storage paths**. They have radically different size constraints — knowing which one your plugin is targeting matters enormously.

### 🟠 PATH A — Main NFT Contract (function: `addAdditionalJSCode`)

- **Byte budget: ~500 bytes minified per plugin (worst case)**
- **Visibility: EVERYWHERE** — runs on OpenSea, MetaMask, Etherscan, every third-party NFT viewer, AND the project's website
- **Why the tight budget**: the main contract's `tokenURI()` function bundles SVG + animation JS + messages + plugins into a single base64-encoded string with a hard gas ceiling of ~34,890 bytes. The animation JS alone takes ~32,495 bytes, leaving only ~2,395 bytes shared between ALL messages AND plugins combined
- **Best for**: tiny, polished effects with broad cross-platform appeal that everyone should see

### 🟢 PATH B — Stash Contract (function: `addStashJSCode`) — *NO SIZE LIMIT*

- **Byte budget: effectively unlimited** (5 KB+ confirmed working; you could submit hundreds of KB if you wanted)
- **Visibility: project's website + `token-viewer.html` ONLY** — does NOT appear on OpenSea, MetaMask, Etherscan, or any third-party NFT viewer
- **Why no limit**: the Stash contract stores plugins as independent entries with no aggregation function. Reads happen one-entry-at-a-time, so the size of one plugin doesn't affect any other — and nothing has to be packaged together into a single `eth_call` response
- **Best for**: ambitious plugins (full mini-games, complex animations, large libraries) where reaching all NFT viewers isn't critical

### Which path will MY plugin end up on?

You don't pick — the project owner does, at merge time. As a contributor, here's how to optimize for the outcome you want:

- **Want your plugin on OpenSea/MetaMask?** Keep it under 500 bytes minified. Use a JS minifier (Terser, esbuild, or even an online minifier) before submitting. Strip whitespace, shorten variable names, avoid redundant comments.
- **Want to make something larger and don't care about cross-platform reach?** Submit at any size — the owner will route it to the Stash path. Your plugin will run on the project's website and `token-viewer.html` (which is, realistically, where most plugin-art viewing actually happens), just not on third-party platforms.
- **Trusted devs with direct submission** (via the Lab's "🚀 SUBMIT TO STASH" button): your code **always** goes to the Stash contract automatically. No size constraint applies. No need to minify.

The Lab's REFERENCE tab shows the live byte count of your editor content. Aim for whichever target is appropriate to your plugin's design goals.

---

## COMMON GOTCHAS

1. **Don't redeclare existing engine variables/functions.** Your plugin runs in the same scope as the animation engine. Using `let` or `const` for an existing name = `SyntaxError`. Use `var` with a unique prefix (e.g., `var myPlugin_state = ...`).

2. **Avoid smart quotes.** If you paste code from a chat window or rich-text editor, straight `"` and `'` characters can get auto-converted to curly `"` and `'` which break JavaScript parsing. Use a plain-text code editor (VSCode, Sublime, Notepad++, etc.) and verify your file's **Raw** view on GitHub before submitting.

3. **Don't use the literal closing-script-tag anywhere** — not in JavaScript comments, not in strings. The HTML parser closes `<script>` tags on sight regardless of JavaScript context. If you absolutely need that text, build it via concatenation like `'<' + '/script>'`.

4. **Audio doesn't work in real NFT viewers.** Web Audio is sandboxed inside OpenSea/MetaMask NFT iframes. You can play sounds in the Lab preview, but they'll be silent in actual NFT views. Avoid audio-dependent plugins or accept they'll be visual-only on third-party platforms.

5. **The Lab is your truth.** If your plugin works in the Lab via RUN, it will work in the NFT. If it doesn't work in the Lab, fix it first.

---

## HOW TO SUBMIT — STANDARD PR WORKFLOW

If you don't have direct submission rights (see "Trusted Dev Direct Submission" below), use the standard GitHub pull-request flow:

1. **Fork this repo** (top-right "Fork" button on the GitHub page) — creates a copy under your own GitHub account
2. In your fork, click **"Add file" → "Create new file"**
3. Type your filename (e.g., `awesome-effect.js`)
4. Paste your plugin code with the metadata headers
5. Scroll down → **"Commit changes"** button → confirm
6. Go back to your fork's main page. GitHub shows a banner: *"This branch is 1 commit ahead of sherone33:main"* with a **Contribute** dropdown
7. Click **Contribute → Open pull request**
8. Add a title (e.g., `Add awesome-effect.js`) + optional description explaining what your plugin does → click **"Create pull request"**
9. Wait for review. Sherone will check the code, possibly leave comments, and merge if approved.

Once merged into `main`, your plugin auto-appears in the Lab's SAMPLE SNIPPETS list on the next page load.

---

## TRUSTED DEV DIRECT SUBMISSION (NO PR REVIEW NEEDED)

If Sherone has added your wallet address to the contract's `trustedDevsDictionary` allowlist AND you hold at least one Contraband Punk NFT, you can submit directly on-chain without going through PR review:

1. Open the [Lab](https://cryptopunksorigins.com/ContrabandPunks-LAB.html)
2. At the top of the editor panel, click **Connect Wallet** → approve in MetaMask
3. The status bar will display: `Connected Wallet: 0x... | Trusted Dev ✓ | Contraband-Punk #N`
4. Paste & test your plugin in the editor with RUN
5. Once you're happy, click the **🚀 SUBMIT TO STASH** button (appears next to RUN/RESET)
6. Confirm in MetaMask → tx is sent → code is permanently stored on-chain in the Stash contract
7. The plugin is immediately available to the project's website (no merge step)

**How to become a trusted dev:** Sherone hand-picks trusted contributors. The simplest path: submit a few quality plugins via PR first, build a track record, then ask. Trusted-dev status can be revoked at any time if needed.

**Trade-off vs. PR submissions:**

| | PR-submitted plugins | Trusted-dev direct-submitted plugins |
|---|---|---|
| Review step | Yes (Sherone reviews before merge) | No (live immediately on submission) |
| Where they appear | Lab's SAMPLE SNIPPETS list | Stash contract on-chain |
| Visible on OpenSea / MetaMask | Yes (when promoted to the main contract) | No (only on the project's own website) |
| Gas cost to submitter | Zero | ~$0.50-$5 in mainnet gas |
| Curated by | The Sherone-approved repo state | The trusted-devs allowlist + Sherone's moderation tools |

---

## QUESTIONS OR ISSUES?

- Open a [GitHub issue](https://github.com/sherone33/ContrabandPunk-Plugins/issues) on this repo for bug reports, questions, or plugin ideas
- For contract-level questions (how the Stash contract works, etc.), see the [project FAQ](https://cryptopunksorigins.com/ContrabandPunk-FAQs.html)

---

*Made for The Contraband Punk — a fully on-chain animated ERC721 NFT by Sherone Rabinovitz. Project site: [cryptopunksorigins.com](https://cryptopunksorigins.com).*
