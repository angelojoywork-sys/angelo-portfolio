---
name: Airaa booking prototype
description: A plain-spoken, price-first airline booking interface in one committed green, white panels and hairline borders.
colors:
  brand: "#0e5a41"
  brand-deep: "#0a4531"
  brand-soft: "#e3f0e9"
  brand-line: "#a9cdbb"
  ground: "#f2f4f1"
  panel: "#ffffff"
  line: "#d5dcd7"
  line-soft: "#e6ebe7"
  ink: "#0e1914"
  ink-2: "#3f4e47"
  ink-3: "#5e6d66"
  error: "#b3261e"
  price: "#a8470f"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 620
    lineHeight: 1.3
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
  price:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.02em"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: "6px"
  control: "10px"
  panel: "14px"
  pill: "99px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.panel}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
  button-line:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 12px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "22px"
  tag:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-deep}"
    rounded: "{rounded.sm}"
---

# Design System: Airaa booking prototype

## Overview

**Creative North Star: "The Honest Fare Board"**

Airaa's interface behaves like a fare board that never hides a number: the trip total sits beside the one forward button on every step, and every choice moves it visibly. The look is a committed deep green on a faintly green-tinted grey ground, white panels with one-pixel borders, and a single grotesque. It reads as a real low-fare airline, not a template, because the only decoration is functional: a route arc, destination tiles, and state.

Density is moderate and desktop-first. Space separates decisions; it does not pad them. The tone is plain and exact, with errors that name the problem and keep the user's work.

**Key Characteristics:**
- One committed green carries the shell, the active step, selection and every primary action.
- Price and action are always attached (the sticky trip strip).
- State is never colour alone: check marks, struck-through crosses, labels and hints carry it too.
- Flat at rest; depth appears only in response to state.

## Colors

A single deep green over green-tinted neutrals. Strategy: Committed on the home band, Restrained inside the booking flow.

### Primary
- **Airaa Green** (#0e5a41): the shell band, the active step, selected options and seats, primary buttons, links. Roughly a tenth of any flow screen.
- **Deep Green** (#0a4531): primary hover and pressed fills; tag text.
- **Mist Green** (#e3f0e9): selected-option and tag backgrounds, the selected-flight wash.
- **Rail Green** (#a9cdbb): valid-field borders and the stepper progress line.

### Neutral
- **Green-Tinted Ground** (#f2f4f1): the page behind panels.
- **Panel White** (#ffffff): all panels, inputs, the top bar.
- **Hairline** (#d5dcd7) and **Soft Hairline** (#e6ebe7): borders and dividers.
- **Ink** (#0e1914), **Slate Ink** (#3f4e47), **Quiet Ink** (#5e6d66): text, descending in importance; Quiet Ink is the lightest text allowed on white.
- **Error Red** (#b3261e): errors only, always with an icon and a sentence.

### Secondary
- **Fare Amber** (#a8470f): reserved for money: fares on flight rows and the trip total. It appears nowhere else.

### Named Rules
**The One Green Rule.** Green means "yours" (selected, active, go). Never use it decoratively inside the flow.
**The Money Is Warm Rule.** Anything the user pays is Fare Amber; nothing else is. A warm number among green and grey is how the price is always findable.
**The Tint Rule.** Neutrals carry a trace of the brand hue; never pure grey.

## Typography

**Display and Body Font:** Schibsted Grotesk (self-hosted, 400–700, with system-ui fallback)

**Character:** A sturdy, slightly editorial grotesque that stays legible at small sizes and gives numbers weight.

### Hierarchy
- **Display** (650, 44px, 1.1): the home headline only.
- **Headline** (650, 28px, 1.15): each step's title.
- **Title** (620, 17px): panel and leg headings.
- **Body** (400, 15px, 1.45): all running text, measure under 65ch.
- **Price** (650, 28px on flight rows, 24px for the trip total, -0.025em): fares in Fare Amber; times are the same weight in Ink.
- **Label** (600, 13px): field labels, tags, helper text.

### Named Rules
**The Numbers Lead Rule.** Prices and times are the heaviest text in any row.

## Layout

A 1160px container with 32px gutters (16px on phones), centred. Flow screens stack: sticky trip strip, stepper, title, then the work area. Seats use three columns (key, fuselage, selection); pay uses a form column and a sticky 380px summary. Below 900px everything collapses to one column and the stepper scrolls horizontally. Rhythm is an 8px base: 8, 12, 16, 24, 32; sections separate by 24–32px, related controls by 8–12px.

## Elevation & Depth

Flat by default: borders separate surfaces. Depth appears only as a response to state: the flow bar gains a soft shadow once the page scrolls, destination tiles lift on hover, and the total breakdown floats as a popover (the only resting shadow).

### Shadow Vocabulary
- **Scroll bar shadow** (`0 8px 22px rgba(14,25,20,.08)`): the sticky trip strip when stuck.
- **Popover** (`0 12px 32px rgba(14,25,20,.12)`): the itemised-total breakdown.
- **Tile lift** (`0 16px 30px rgba(14,25,20,.2)`): destination tiles on hover.

### Named Rules
**The Border-Or-Shadow Rule.** A surface has a hairline border or a shadow, never both.

## Shapes

10px controls, 14px panels, 6px tags, 99px only for dots and round icon buttons. Seats are 34px squares with an 8px top and 5px bottom radius. The fuselage is a single hairline-bordered shape with an elliptical nose. The confirmation ticket has semicircle notches on its tear line. Icons are drawn in one 1.75px round-capped stroke.

## Components

### Buttons
- **Shape:** 10px radius, 44px high (36px small).
- **Primary:** Airaa Green fill, white label, an arrow that nudges 3px right on hover.
- **Hover / Active:** fill darkens to Deep Green; pressed scales to 0.97.
- **Disabled:** Soft Hairline fill, Quiet Ink text, with a hint beside it saying why.
- **Line:** white fill, hairline border that darkens on hover.
- **Busy:** keeps the green, shows a 16px spinner and a present-tense label.

### Inputs / Fields
- **Style:** white, 1px Hairline, 10px radius, 44px high, labels above in Label type.
- **Focus:** 2px green outline.
- **Valid:** Rail Green border and a drawn check on blur.
- **Error:** red border and an icon plus a sentence that says how to fix it.

### Flight row (signature: the fare receipt)
White panel, times with airport codes beneath, a hairline route line with end dots and duration above, the fare right-aligned in Fare Amber with its split beneath ("€28 fare + €6 taxes"), a Select button. Under the times runs the fare receipt: what is included (check: small bag, taxes and fees) and what is not (cross: seat, checked bag). This is the product's honesty made visible on every row. Selected: green border, Mist Green wash fading right, button becomes "Selected" with a check.

### Pay button
The form ends with a full-width primary button carrying the total, with "Nothing is charged until you press this" beneath. The trip strip repeats the same action as a shortcut.

### Seats
34px squares: standard (white, grey border), extra legroom (Mist Green, green border), selected (green fill, check), unavailable (grey, cross; clicking shakes it and says why). A tooltip names the seat and price.

### Option cards and toggles
Radio cards for cabin bags, add/added toggles for extras, steppers for checked bags. Selected state is border, wash and check together.

### Navigation
A text top bar; a stepper of five labelled steps (done = green check, current = green with underline, future = disabled) with a progress line that animates between steps.

### Trip strip (signature)
Sticky under the header: route and dates left, the total (with a disclosure to an itemised breakdown and a floating "+€34.00" chip on change) and the single forward button right.

## Do's and Don'ts

### Do:
- **Do** keep the total and the next action together on every step.
- **Do** show state with shape and text as well as colour.
- **Do** keep errors specific and keep everything the user entered.
- **Do** use Airaa Green only for selection, activity and the primary action.
- **Do** respect `prefers-reduced-motion`.

### Don't:
- **Don't** put offers (insurance, fast track) before the user has chosen flights.
- **Don't** add shadows to resting panels.
- **Don't** use tabular figures on Schibsted Grotesk (it widens punctuation); set numbers in the default figures.
- **Don't** fill an unavailable choice with a price or a promise.
