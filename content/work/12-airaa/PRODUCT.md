# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS/JS in one file (`public/prototypes/airaa/index.html`), embedded as an iframe in the Astro portfolio's case-study page. No framework, no build step.

## Users

Primary audience of the prototype: recruiters and hiring managers skimming Angelo Joy's portfolio, who see it embedded in the Airaa case study and need to judge craft within seconds. Secondary: a design reviewer who may click through every step. Inside the fiction, Airaa's customers are price-conscious leisure travellers booking short Ireland–UK/Europe trips, mostly on desktop or laptop (80% of survey respondents), familiar with low-cost carriers such as Ryanair.

## Product Purpose

A clickable, styled prototype of Airaa's flight booking website, rebuilt from the wireframes in the Figma file "Sketching_Flight-booking-website" (page "Design iterations"). It turns a diploma case study (UX Design Institute, 2026) into something a visitor can use. Success: a skimming visitor understands the flow and the research-led decisions, and it reads as a real airline's product rather than a template.

## Positioning

An honest low-fare challenger: cheap fares like Ryanair, but with clear prices at every step, one forward direction, non-destructive editing, and upsells held to the end of the flow. Ancillaries never interrupt the main task.

## Operating Context

Flow (from the wireframes): Home with search (from/to, dates, passengers) → Flights (outbound and return, date strip, sort) → Seats (seat map, selected-seats panel) → Bags (cabin and check-in, per leg) → Extras (security fast track, travel insurance, skippable) → Review & Pay (passenger details, collapsible review of the whole trip, payment) → Confirmation. A stepper (Flights, Seats, Bags, Extras, Review & Pay) is always visible. The viewer sits at a desktop or laptop inside a 16:9 iframe on the portfolio page, or opens it full screen.

## Capabilities and Constraints

- Desktop-first; must stay usable at narrow widths. Single HTML file, no external network dependencies except optionally self-hosted fonts.
- All data is fictional. Fares, schedules and bag prices are illustrative; no real payment is taken. Card fields are validated for format only.
- The 8-person usability test ran on the Figma wireframe prototype, not on this build. Do not claim otherwise.
- Behavior to preserve: running trip total always visible; stepper lets users jump back to edit any completed step without losing choices; seats, bags and extras are optional.

## Brand Commitments

Name: Airaa (lower-case wordmark in the current build). Honest, plain-spoken voice. No existing logo or colour commitments; the visual look is open and the user has asked for the look to be proposed.

## Evidence on Hand

Behance case study (https://www.behance.net/gallery/248798001/Airaa-Flight-booking-UX-case-study) with research: survey of 10 (80% prefer desktop for final booking, 60% price-driven), 8 interviews, 8 usability tests. Figma wireframes for all screens. No real photography, logo or airline data exists; do not fabricate customers, press or performance claims.

## Product Principles

1. Price is always visible and never a surprise.
2. One forward direction, but nothing is permanent: any step can be edited without losing progress.
3. Offers come after the task, never in the middle of it.
4. Familiar airline conventions where they help; fewer choices per screen where they don't.
5. Errors name the problem and keep everything the user already entered.

## Accessibility & Inclusion

Target WCAG AA: 4.5:1 text contrast, visible keyboard focus, every control reachable by keyboard, seat selection and steppers usable without a mouse, no meaning carried by colour alone.
