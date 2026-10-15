# mat-selectors migration — progress & resume notes

> Goal: remove ADF's overrides of Angular Material internal DOM classes
> (`#{ms.$mat-...}` from the `mat-selectors.scss` maps). Committed work is on
> branch `develop` under `[ACS-8630]` commits. This file tracks the in-flight state.

## ⏸️ RESUME HERE (saved 2026-08-06 before restart)
- **Branch:** `improvement/AAE-49015-removing-mat-selectors`. **Last commit:** `9106d64511 [AAE-49015] - Removing comments`.
- **Working tree CLEAN** — everything committed except this untracked doc. Nothing to re-apply.
- **Current state:** `ms.$` usages **51** · per-map vars: core **22** · content-services **12** · process-services **10** · psc **3** · feature-flags **2**. (Session start was ~89 usages / core 43.)
- **Build + lint verified:** `nx build` of all 5 touched packages (core, content-services, process-services, psc, insights) PASSES; `stylelint` on all 47 changed .scss PASSES. NOT visually verified in a running app.
- **All explanatory comments I added were removed** (per request) — rationale lives in THIS doc only.

### 🔴 OPEN DECISION to make first on resume — element selector vs ADF class
During conversions I replaced some `#{ms.$mat-form-field}` (→ `.mat-mdc-form-field`) rules with the
**element selector `mat-form-field`**. User correctly pointed out this still binds ADF to Material's
spec — if Material renames the tag (`<mat-form-field>` → `<mat-whatever>`), the element selector breaks
just like the class would. TRUE decoupling = add an **ADF-owned class** to the element and target that.
**Files using the element-selector `mat-form-field { width: 100% }` pattern that should be reworked to an ADF class:**
  - `lib/process-services/src/lib/task-list/components/attach-form/attach-form.component.scss`
  - `lib/process-services/src/lib/task-list/components/checklist/checklist.component.scss`
  - `lib/core/src/lib/card-view/components/card-view-selectitem/select-filter-input/select-filter-input.component.scss`
  - Also `mat-card { … }` element selectors in `form-renderer.component.scss` + `start-form.component.scss` (same critique applies).
**Plan:** add `class="adf-…-field"` / `class="adf-…-card"` to each `<mat-form-field>`/`<mat-card>` in the
templates, target the ADF class. (Note: `width:100%` MUST stay on the field itself — Material form-field
is `display:inline-flex`, so styling the parent does NOT work.) User leaning toward doing this rework.

- **Guiding principle (agreed):** ADF should render **as close to stock Angular Material as possible**,
  and bind to ADF-owned hooks NOT Material internals (class OR tag). Priority order for converting a rule:
  (1) `mat.*-overrides` design token → (2) ADF-owned class on the element → (3) keep only if neither works
  (Material-generated inner node w/ no token, or projected ng-content). Every LIVE-value removal gets
  flagged RISKY + a downstream ACA/HFA check.
- **Verification method:** `sass` compile per file (no undefined-var errors) + grep dangling `ms.$` +
  downstream check. Neither ACA nor HFA imports ADF's maps (they have own copies), so map-var deletions
  are internally safe; only LIVE rule/DOM changes reach them.

### ⚠️ Downstream (ACA) cosmetic shifts to communicate (from full impact review — both repos build-safe)
1. **ACA tag-chip padding** (`metadata-tab.component.scss`, `tags-column.component.scss`): we removed
   dynamic-chip-list's `.mdc-evolution-chip__action{padding:2px 12px}`; ACA sets no padding → chips use
   Material default (slightly larger). Fix: ACA adds `padding:2px 12px` to `.adf-dynamic-chip-list-chip`.
2. **ACA notification bell button** (`sidenav.component.scss:45-66`): mat-button→mat-icon-button swap
   makes ACA's `--mat-text-button-*` / `text-with-icon-horizontal-padding` tokens dead no-ops. Fix: use
   `mat.icon-button-overrides(...)` or accept the 40px icon-button default. HFA: fully clean, no impact.

### Committed this session (all `[AAE-49015]`)
- Dead map-var cleanup: 24 unused defs across all 5 maps (+1 dup collapsed).
- card-view-keyvaluepairsitem: removed dead table rules + self-cancelling `mat-elevation-z8`.
- dynamic-chip-list: removed LIVE chip-action padding — **RISKY** (see below).
- search-chip-autocomplete-input: chip margin → ADF class; removed dead `:has(.mdc-notched-outline)`.
- card-view-selectitem: line-ripple `display:none` → `mat.form-field-overrides` tokens (kept dead select block per decision).
- amount.widget: removed dead `.mat-focused` descendant-typo rule → freed `$mat-focused`.
- Verified-dead batch: 9 rules / 9 files, freed 7 var defs. Excluded FALSE POSITIVE: task-form-cloud
  `$mat-button`/`-label` are LIVE (projected `<adf-cloud-user-task-cloud-buttons>` under Encapsulation.None).
- 2nd sweep: search-properties `$mat-text-field-outlined` (dead, fill default) + start-process
  `$mat-select-arrow-wrapper` (no-op vs default) removed.
- search-facet-chip pair: `$mat-evolution-chip-graphic{display:none}` DEAD (Material only renders graphic
  `@if(leadingIcon)`; no matChipAvatar) → freed the var. menu-panel → ADF-class compound.
- Element-selector conversions (SEE OPEN DECISION): mat-card ×2, mat-form-field ×3, plus ADF-class /
  token conversions: card-view input-element→`input,textarea`; textitem touch-target→`icon-button-overrides`;
  info-drawer tab-label (redundant compound removed); snackbar/start-process buttons→ADF class.
- Removed all explanatory comments (commit `9106d64511`).

### Confirmed KEEPS (investigated, no non-disruptive path — do NOT re-investigate)
form-renderer `$mat-button`/`-label` (projected outcome buttons) · `$mat-form-field-wrapper`/`-label`/`-infix`
/`-icon-suffix` (Material-generated inner nodes, only typography tokens exist) · `$mat-tab-body-content`
(generated, overflow override) · layout-container sidenav/drawer (load-bearing animation) · comments
`$mat-list-item-unscoped-content` (cross-component) · columns-selector `$mat-list-item-end` (generated slot)
· sidenav-layout `$mat-icon` (projected) · notification `$mat-menu-content` (generated) · card-view-selectitem
dead `.adf-property-value-editable` select block (kept per user: don't lose/enable) · pdf-viewer `$mat-toolbar`
(has deferred alpha-bug at :106) · datatable `$mat-checkbox-label` (sr-only a11y) · aspect-list-dialog
`$mat-expansion-panel-body`.

### Committed this session (all `[AAE-49015]`)
- Dead map-var cleanup: 24 unused defs across all 5 maps (+1 dup collapsed).
- card-view-keyvaluepairsitem: removed dead table rules + self-cancelling `mat-elevation-z8`.
- dynamic-chip-list: removed LIVE chip-action padding — **RISKY** (see below).
- search-chip-autocomplete-input: chip margin → ADF class; removed dead `:has(.mdc-notched-outline)`.
- card-view-selectitem: line-ripple `display:none` → `mat.form-field-overrides` tokens (kept dead select block per decision).
- amount.widget: removed dead `.mat-focused` descendant-typo rule → freed `$mat-focused`.
- **Verified-dead batch (commit c54b3e3d11): 9 rules across 9 files**, freed 7 var defs
  (core `$mat-form-field-suffix`/`$mat-line`; content-services `$mat-checkbox-background`/`$mat-chip`;
  process-services `$mat-line`; psc `$mat-form-field-suffix`/`$mat-card-content`). Excluded a subagent
  FALSE POSITIVE: task-form-cloud `$mat-button`/`-label` are LIVE (rendered via projected
  `<adf-cloud-user-task-cloud-buttons>` under ViewEncapsulation.None) — NOT removed.

1. **card-view-arrayitem** (`lib/core/src/lib/card-view/components/card-view-arrayitem/`)
   - `.scss`: removed dead `$mat-chip-list` block (template uses `<mat-chip-listbox>` →
     `.mat-mdc-chip-listbox`, NOT `.mat-mdc-chip-list` → was a no-op); removed redundant
     `box-shadow:none` (card is `appearance="outlined"` = level0 = already no shadow);
     simplified `&#{ms.$mat-card}` → plain `.adf-array-item-more-chip-container`;
     `$mat-chip:hover` → `.adf-card-view-array-chip:hover`; **removed the `ms` import.**
   - `.html`: added `class="adf-card-view-array-chip"` to the 3 container `<mat-chip>` (lines ~6,16,24).

2. **notification-history** (`lib/core/src/lib/notifications/components/`)
   - `.html`: `<button mat-button>` → `<button mat-icon-button>` (the trigger button).
   - `.scss`: dropped `&-notification-history-menu_button#{ms.$mat-button}` circle-coercion
     (`border-radius:90%; padding:0; min-width:40px; height:40px`) — now native via
     `mat-icon-button`; kept `margin-top:1px` + icon sizing on plain `.adf-...menu_button`.
   - STILL has 1 usage: `$mat-menu-content` (internal child, bucket c — keep).

3. **people** (`lib/process-services/src/lib/people/components/people/people.component.scss`)
   - `.adf-assignment-top-container#{ms.$mat-card}` → plain `.adf-assignment-top-container`;
     dropped redundant `display:flex`/`margin:0`/`padding:0` (all Material `.mat-mdc-card`
     defaults); kept real additions `border-top`, `flex-flow:row wrap`, `align-items:stretch`.
   - **Removed the `ms` import** (0 usages left).

## RESUME CHECKLIST (do first after restart)
1. `git status` — confirm the 5 files above are the uncommitted changes.
2. `npx nx run-many -t build -p core process-services content-services --skip-nx-cache`
   (the interrupted verification — MUST pass before committing).
3. `npx stylelint` the touched files.
4. Commit as `[ACS-8630]` if green.

## REMAINING WORK (after this batch, ~86 usages will remain)

### (a) Override API — still TODO
- **card-view-keyvaluepairsitem** `$mat-header-row` + `$mat-row` `padding:0` → `mat.table-overrides`
  (and `$mat-table box-shadow:none` → drop `mat-elevation-z8` class, it's ADF-owned).
- **dynamic-chip-list** `$mat-evolution-chip-action` `padding:2px 12px` → `mat.chips-overrides`.
- **search-chip-autocomplete-input** `$mat-evolution-chip` `margin` → chips density/overrides.

### (d) HTML/class — still TODO
- **card-view-selectitem** `$mat-select` / `$mat-select-trigger` (margin/radius/padding) →
  ADF class on the owned `<mat-select>` (check specificity vs Material).
- **search-facet-chip** + **search-facet-chip-tabbed** `$mat-evolution-chip-graphic {display:none}` →
  suppress chip avatar/graphic via chip content/input (ADF owns the chip).

### (c) ACCEPT / KEEP — the irreducible ~65
Layout/positioning/display on Material-internal or projected DOM, no token, no ADF element:
form-field suffix `top`/label reposition/`line-ripple`/`notched-outline`/`focused`/`input-element`/
`width:100%`×5, tab `body-content`/`label-text`/`body`, card `padding`/`content`/`header`,
select `arrow-wrapper`, sidenav/drawer, list-item, checkbox box/background, `mat-icon` (projected),
`mat-toolbar` (pdf-viewer — mostly layout), menu-content, dialog-surface, cdk-overlay-pane,
expansion-panel-body, columns-selector list-item-end, comments list-item-unscoped-content.
**Plan for these:** consolidate remaining duplicated maps into ONE documented
`_mat-internal-overrides.scss` per package, grouped by component family with "why kept" comments.
Or run `/verify` (remove-and-observe) to test if version-sensitive positioning hacks still needed.

## RISKY REMOVALS (revert-first candidates if a regression appears)
- **dynamic-chip-list.component.scss** — REMOVED `#{ms.$mat-evolution-chip-action} { padding: 2px 12px }`
  (was a LIVE override; no `chips-overrides` token exists for action padding, and moving it to the
  ADF-owned `.adf-dynamic-chip-list-content` would shrink the chip ripple/state-layer area).
  Reverts chip action to Material default `padding: 0` (vertical) → chips may render ~2px tighter.
  **Downstream:** ACA styles `.adf-dynamic-chip-list-chip` (metadata-tab, tags-column) for
  color/border only — does NOT set action padding → will inherit the tighter default. HFA: no usage.
  **If chip spacing looks off in ACA metadata/tags: revert THIS block first.** Needs visual /verify.

## SKIP — leave exactly as-is (converting would lose OR enable styles)
- **card-view-selectitem.component.scss** — KEEP untouched, `ms` import stays.
  - `$mat-line-ripple { display:none }` is LIVE (directly under component) → removing would lose a style.
  - The nested `.adf-property-value-editable { $mat-select … }` block is DEAD: in the template
    `.adf-property-value-editable` sits on `<mat-label>`/`<input>`, NOT an ancestor of `<mat-select>`
    (they're siblings), so `.adf-property-value-editable .mat-mdc-select` matches nothing. Moving the
    class onto `<mat-form-field>` to "convert" it would ENABLE 6px radius + trigger padding = a real
    visual change. Decision: leave both alone — no loss, no accidental enable. (Latent bug = separate ticket.)

## CONFIRMED KEEPS (investigated — no non-disruptive conversion exists)
- **layout-container.component.scss** — `$mat-sidenav-content` / `$mat-drawer-transition` `$mat-drawer-content`.
  LIVE + load-bearing: neutralizes Material's built-in sidenav content push (margin/transform/400ms
  transition) so ADF's custom width/margin animation is the only driver. No ADF class on Material's
  generated `.mat-drawer-content`, no sidenav override token, no @Input to disable it. Comment added in-file.

- **comments.component.scss** — `$mat-list-item-unscoped-content`. LIVE but via a cross-component
  `ViewEncapsulation.None` descendant leak: `adf-comments .mat-mdc-list-item-unscoped-content`
  styles the `<mat-list-item>` rendered by the CHILD `<adf-comment-list>` (`display:flex; padding:0 16px`).
  Target is a Material-generated wrapper (no ADF class on it, no list token). Relocating to the child
  only MOVES the `ms.$` usage (child has no import) — does not free the var. KEEP for now.
  Optional future cleanup: move rule into comment-list.component.scss anchored to `.adf-comment-list-item`.

## INVESTIGATED KEEPS — LIVE, no clean conversion (batch 2)
All verified against compiled Material CSS + templates; all LIVE (real effect), no ADF hook/token:
- **search-check-list** `$mat-checkbox-box` — margins on Material's inner `.mdc-checkbox` (default 0). `.adf-facet-filter` is the outer host, not the box → no ADF hook on the target.
- **datatable** `$mat-checkbox-label` — sr-only a11y positioning on `.mdc-label`. Accessibility-critical.
- **aspect-list-dialog** `$mat-expansion-panel-body` — `margin-top:-2px` (default has none); Material-generated body, no hook.
- **dropdown-breadcrumb** `$cdk-overlay-pane` — `:has(> .adf-breadcrumb-dropdown-panel)` styles the PARENT overlay pane from the child panel; `:has()` is the only mechanism. Structural.
- **select-filter-input** `$mat-select-panel` — `.mat-mdc-select-panel.adf-select-filter` already compounds with ADF's panelClass; `overflow-x:hidden` is live. Dropping the mat class = (0,1,0) specificity tie, not worth it.

## KNOWN ISSUES / FLAGS
- **pdf-viewer.component.scss:106** — `box-shadow: ... rgba(0, 0, 0, 20.4)` — INVALID alpha
  (20.4 clamps to 1 = opaque black). Left UNCHANGED (visual bug fix deferred so as not to
  surprise during testing). Fix to `0.2` when ready. This block ($mat-toolbar) is bucket c.
- **permission-list** `$mat-card-content` `padding:0` — NOT converted: dropping the mat
  compound would tie Material's `.mat-mdc-card-content{padding:0 16px}` (0,1,0) on specificity
  (fragile source-order dependence). Kept the compound intentionally.

## KEY LEARNINGS (avoid re-deriving)
- Material form-field is `display:inline-flex` → `width:100%` overrides are NEEDED, not redundant.
- Material tab-body-content default is `overflow:auto` → ADF's `overflow:hidden` is a REAL override.
- `mat.*-overrides` token keys use SHORT form (e.g. `text-container-height`, not
  `button-text-container-height`). Convention confirmed in form-renderer `.adf-readonly`.
- Buttons in `.adf-form-mat-card-actions` also style CONSUMER-PROJECTED buttons (ng-content) →
  use tokens (style projected too), NOT a dedicated class (would regress projected buttons).
- Verify redundancy claims against `node_modules/@angular/material/fesm2022/*.mjs` compiled CSS —
  the subagent got tab-body-content backwards once.
- Always check specificity: adf-class-only (0,1,0) vs Material's element-class rules (0,1,0) can TIE.
