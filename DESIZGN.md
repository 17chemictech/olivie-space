---
version: alpha
name: designmd.supply
description: Minimal, editorial landing page for generating public-domain style guides into Google DESIGN.md files.
colors:
  primary: "#0a0a0a"
  secondary: "#fbfaf6"
  tertiary: "#e5e7eb"
  neutral: "#6f6f6f"
  surface: "#fbfaf6"
  on-surface: "#0a0a0a"
  error: "#d92d20"
typography:
  headline-display:
    fontFamily: ui-sans-serif
    fontSize: 72px
    fontWeight: 500
    lineHeight: 72px
    letterSpacing: -1.8px
    fontFeature: normal
  headline-lg:
    fontFamily: ui-sans-serif
    fontSize: 24px
    fontWeight: 500
    lineHeight: 29px
    letterSpacing: 0px
    fontFeature: normal
  headline-md:
    fontFamily: ui-sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: 0px
    fontFeature: normal
  body-lg:
    fontFamily: ui-sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 32px
    letterSpacing: 0px
    fontFeature: normal
  body-md:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
    fontFeature: normal
  body-sm:
    fontFamily: ui-sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0px
    fontFeature: normal
  label-lg:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
    fontFeature: normal
  label-md:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
    fontFeature: normal
  label-sm:
    fontFamily: ui-sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
    fontFeature: normal
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 24px
  full: 9999px
spacing:
  xs: 6px
  sm: 20px
  md: 24px
  lg: 32px
  xl: 128px
components:
  button:
    primary:
      backgroundColor: transparent
      color: "#0a0a0a"
      borderColor: transparent
      borderRadius: 9999px
      borderWidth: 1px
      borderStyle: solid
      padding: 6px 14px
      fontSize: 14px
      fontWeight: 500
      minWidth: 140px
      minHeight: 40px
    secondary:
      backgroundColor: transparent
      color: "#0a0a0a"
      borderColor: "#0a0a0a"
      borderRadius: 9999px
      borderWidth: 1px
      borderStyle: solid
      padding: 6px 14px
      fontSize: 14px
      fontWeight: 500
      minWidth: 140px
      minHeight: 40px
    link:
      backgroundColor: transparent
      color: "#0a0a0a"
      borderColor: transparent
      borderRadius: 0px
      borderWidth: 0px
      borderStyle: none
      padding: 0px
      fontSize: 14px
      fontWeight: 400
      minWidth: 0px
      minHeight: 0px
  card:
    backgroundColor: "#fbfaf6"
    borderColor: "#e5e7eb"
    borderRadius: 8px
    borderWidth: 1px
    borderStyle: solid
    padding: 16px
---

# Overview

designmd.supply is a quiet, highly legible marketing page with an editorial hierarchy: oversized headline, muted explanatory copy, a pill-shaped input, and a grid of rounded preview cards. The visual tone is minimal, neutral, and slightly warm, with strong black text on an off-white surface.

Use this system for pages that should feel precise, restrained, and utility-first. The dominant interaction pattern is "enter a domain and generate a guide."

# Colors

The palette is intentionally sparse.

- `primary` / `on-surface`: `#0a0a0a` for headlines, buttons, and core UI chrome.
- `secondary` / `surface`: `#fbfaf6` for the page background and card base.
- `tertiary`: `#e5e7eb` for subtle borders and card edges.
- `neutral`: use for supporting metadata and secondary copy when softer contrast is needed.
- `error`: reserved for validation states only; it is not prominent in the current page, so use sparingly.

Color usage should stay high-contrast and uncluttered. Avoid saturated accents unless they are required for brand previews or third-party content.

# Typography

Typography is built around a sans-serif system stack with a large, confident display style.

## Recommended tokens

- `headline-display`: 72px / 500 / 72px / -1.8px
- `headline-lg`: 24px / 500 / 29px
- `headline-md`: 20px / 500 / 24px
- `body-lg`: 16px / 400 / 32px
- `body-md`: 14px / 400 / 20px
- `body-sm`: 12px / 400 / 16px
- `label-lg`: 14px / 500 / 20px
- `label-md`: 14px / 500 / 20px
- `label-sm`: 12px / 500 / 16px

## Rules

- Use `headline-display` for the hero line only.
- Keep paragraphs airy; the source design uses generous 32px line height for long-form intro copy.
- Maintain medium weight headings and crisp, low-contrast letter spacing only where specified.
- Stick to the system UI sans stack; do not introduce decorative or condensed typefaces.

# Layout

The page is centered with ample whitespace and a narrow content column relative to the viewport.

- Hero content sits in a left-aligned column near the top of the page.
- The input is a wide pill aligned beneath the intro copy.
- A grid of preview cards follows below, with consistent gutters and equal-width tiles.
- The open-source link is placed in the top-right corner.
- A floating Context.dev action appears in the bottom-right corner.

Spacing is notably generous. Use the provided spacing scale as the primary rhythm:
- `xs`: 6px
- `sm`: 20px
- `md`: 24px
- `lg`: 32px
- `xl`: 128px

Prefer large vertical gaps between major sections and tighter internal padding within cards and controls.

# Elevation & Depth

Depth is minimal and mostly achieved through soft shadows and borders rather than raised surfaces.

- The top-right button uses a light shadow for separation.
- The input and cards feel inset by thin borders and subtle surface contrast.
- Do not use strong drop shadows, blur-heavy elevations, or layered depth stacks.
- If elevation is needed, keep it close to `sm` or border-only.

The overall effect should remain flat, calm, and editorial.

# Shapes

Shape language is rounded but disciplined.

- `none`: 0px
- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `xl`: 24px
- `full`: 9999px

Use:
- `full` for pill buttons and the domain input container.
- `md` to `lg` for cards and preview surfaces.
- Minimal rounding for utility elements when a softer edge is enough.

# Components

## Button

Primary and secondary buttons are small, pill-shaped, and compact.

- Height: 40px minimum
- Width: 140px minimum
- Radius: full pill
- Font: 14px medium
- Padding: 6px 14px

Primary buttons are visually quiet and can be transparent with black text. Secondary buttons add a black border. Link buttons are unboxed and text-only.

## Card

Cards are preview containers for guide listings.

- Surface: `#fbfaf6`
- Border: 1px solid `#e5e7eb`
- Radius: 8px
- Padding: 16px
- Shadow: none

Cards should contain a screenshot area, then metadata with icon, title, domain, category, and small color swatches.

## Input

The domain input should be a wide rounded control with a soft border and a circular submit affordance at the right edge.

- Keep the field visually calm and low-profile.
- Use placeholder text in neutral color.
- Keep the submit control black with white or high-contrast iconography.

# Do's and Don'ts

## Do

- Do keep the page mostly off-white with black text.
- Do use large, left-aligned hero typography with generous whitespace.
- Do keep controls pill-shaped and understated.
- Do use thin borders and minimal elevation for cards and buttons.
- Do maintain a compact, grid-based gallery layout for preview content.
- Do preserve the sense that the page is a tool, not a brand-heavy campaign.

## Don't

- Don't introduce gradients, loud accent colors, or decorative backgrounds.
- Don't use heavy shadows, glass effects, or complex motion language.
- Don't center all content; preserve the editorial left column and top-right utility actions.
- Don't over-round cards beyond the documented values.
- Don't use multiple display fonts or extreme typographic contrast beyond the hero treatment.
- Don't make the interface feel dense; leave large breathing room between the intro and the gallery.