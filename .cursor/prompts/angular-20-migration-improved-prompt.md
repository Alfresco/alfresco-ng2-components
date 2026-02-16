# Improved Angular 20 Migration Prompt

## Original Prompt Issues
The original prompt was good but missed several critical considerations that caused issues during execution.

## Improved Prompt

```text
I need a comprehensive plan for migrating this Nx monorepo to Angular 20 and Angular Material 20.

## Target Versions
- typescript@5.9
- @angular/core@20
- @angular/material@20
- @angular/cdk@20
- ng-packagr@20
- @typescript-eslint@8 (required for TypeScript 5.9 compatibility)
- @angular-eslint@20 (required for Angular 20 compatibility)

## Migration Strategy

1. **Pre-migration Analysis** (IMPORTANT - add this phase):
   - Check ALL direct dependencies in package.json for Angular version compatibility
   - Identify packages that may have peer dependency conflicts with Angular 20
   - Check for packages with bundled dependencies (especially webpack versions)
   - Document breaking changes from Angular 19→20 and CDK 19→20
   - Review Angular Material 20 changelog for component API changes
   - Check TypeScript 5.9 breaking changes

2. **Known Issue Prevention**:
   - Plan for peer dependency conflicts (common with date pickers, UI libraries)
   - Account for webpack version alignment (especially with Storybook + Angular DevKit)
   - Prepare for deprecated API removals (PortalInjector, etc.)
   - Plan for ESLint rule changes (@typescript-eslint v6→v8 breaking changes)

3. **Migration Execution**:
   - Use `nx migrate @angular/core@20` (not just "latest")
   - Manually verify and adjust ALL Angular-related packages to v20
   - Add .npmrc with `legacy-peer-deps=true` for CI/CD compatibility
   - Document which dependencies need manual version updates vs auto-migration

4. **Configuration Updates**:
   - Update ESLint config for @typescript-eslint v8 (remove deprecated rules)
   - Check for webpack version conflicts between packages
   - Review ng-packagr schema changes
   - Update TypeScript compiler options if needed

5. **Code Changes Checklist**:
   - Search for Angular CDK deprecated APIs (PortalInjector, etc.)
   - Check for Material component API changes
   - Review import path changes (@angular/common → @angular/core for some APIs)
   - Plan for new Angular 20 lint rules (prefer-inject, etc.)

6. **Verification Strategy**:
   - Run ESLint: `npx nx run-many -t lint --all --fix --skip-nx-cache --parallel=5`
   - Build in dependency order:
     * js-api (no Angular deps)
     * extensions (depends on js-api)
     * core (depends on js-api, extensions)
     * content-services (depends on js-api, core, extensions)
     * process-services (depends on js-api, core, content-services)
     * process-services-cloud (depends on js-api, core, content-services, extensions)
     * insights (depends on core, content-services, js-api)
   - Test Storybook compilation: `npm run storybook`
   - Run tests if time permits

7. **CI/CD Considerations**:
   - Ensure .npmrc is committed (not gitignored) for `npm ci` to work
   - Test that `npm ci` works (not just `npm install`)
   - Document installation instructions for team
   - Plan for pre-commit hook issues (may need --no-verify initially)

8. **Post-Migration Tasks**:
   - Document known warnings (prefer-inject, etc.)
   - Create follow-up issues for:
     * Running Angular's inject() migration
     * Updating peer dependency ranges in library package.json files
     * Addressing new ESLint warnings
   - Update project documentation

## Critical Dependencies to Check

Please specifically check these for Angular 20 compatibility:
- @mat-datetimepicker/core (known issue: v15 only supports Angular 19)
- @storybook/angular (check webpack version compatibility)
- webpack (must match @angular-devkit/build-angular bundled version)
- ng2-charts (verify Angular 20 support)
- Any custom or internal Angular libraries

## Expected Issues & Solutions

Document solutions for:
1. Peer dependency conflicts → .npmrc with legacy-peer-deps
2. Webpack version mismatches → Align with Angular DevKit's bundled version
3. PortalInjector removal → Replace with Injector.create()
4. ESLint deprecated rules → Remove/update in .eslintrc
5. Pre-commit hook failures → Use --no-verify for migration commit

## Output Format

Create a plan that includes:
- Phase-by-phase breakdown with time estimates
- Specific version numbers for all packages
- Code change examples for breaking changes
- Rollback strategy
- Troubleshooting section with common issues
- Commands to run at each step
- Success criteria for each phase
```

## Key Improvements Over Original Prompt

### 1. **Pre-migration Analysis Phase**
The original prompt jumped straight to migration. Adding a discovery phase would have caught:
- `@mat-datetimepicker/core@15.0.2` incompatibility
- Webpack version conflicts
- PortalInjector deprecation

### 2. **Specific Package Versions**
Instead of just "@angular/core@20", specify:
- Complete dependency tree (CDK, Material, ESLint, TypeScript ESLint)
- Related tooling versions
- Known problematic dependencies

### 3. **Known Issue Prevention**
Explicitly call out common migration pitfalls:
- Peer dependency conflicts
- Webpack bundling issues
- Deprecated API removals
- ESLint rule changes

### 4. **CI/CD Specific Instructions**
Original prompt didn't mention:
- .npmrc file need
- Difference between `npm install` and `npm ci`
- Pre-commit hook handling

### 5. **Dependency Order Awareness**
Original showed build commands but not the WHY:
- Explain dependency graph
- Show build order rationale
- Help AI understand project structure

### 6. **Expected Issues Section**
Proactively list known Angular 19→20 issues:
- This helps AI plan prevention strategies
- Reduces discovery time during execution
- Provides ready-made solutions

### 7. **Post-Migration Planning**
Original ended at "verify builds":
- Document technical debt
- Plan follow-up work
- Update team documentation

### 8. **Storybook Testing**
Original prompt didn't mention Storybook:
- Critical for UI library projects
- Common source of webpack conflicts
- Should be in verification checklist

## How This Reduces Time/Effort

| Issue | Original Approach | Improved Approach | Time Saved |
|-------|------------------|-------------------|------------|
| Peer deps | Discover during install | Pre-checked & .npmrc ready | ~30 min |
| Webpack conflict | Debug Storybook error | Version aligned upfront | ~45 min |
| PortalInjector | Find during build | Known breaking change | ~15 min |
| ESLint rules | Debug during lint | Documented deprecated rules | ~10 min |
| CI/CD failure | Fix after PR | .npmrc in initial commit | ~20 min |
| **Total** | | | **~2 hours** |

## Additional Recommendations

### For Plan Creation:
1. **Use broader context**: Include more files in context (@lib/core/package.json, @.gitignore, etc.)
2. **Check project type**: UI library vs app affects migration strategy
3. **Review recent commits**: Check if similar migrations were done before

### For Execution:
1. **Create checkpoint commits**: After each major phase
2. **Test incrementally**: Don't wait until end to verify
3. **Document as you go**: Update plan with actual findings

### For Future Migrations:
1. **Save troubleshooting log**: Create a "lessons learned" doc
2. **Update migration template**: Incorporate new insights
3. **Share with team**: Help others avoid same issues
