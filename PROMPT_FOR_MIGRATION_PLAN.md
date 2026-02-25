# Prompt: Generate Concise Angular Migration Plan

Create a concise migration plan (max 200 lines) for an Angular framework upgrade. Focus on clear steps and expected outcomes.

## Input Requirements

Specify the following for your migration:

**Current State:**
- Current Angular version (e.g., 19.2.18)
- Current TypeScript version (e.g., 5.8.3)
- Current @typescript-eslint version (e.g., 6.21.0)
- Other key packages (Material, ng-packagr, etc.)
- Branch name

**Target State:**
- Target Angular version (e.g., 20.3.9)
- Target TypeScript version (e.g., 5.9.3)
- Target @typescript-eslint version (e.g., 8.x)
- Other package targets

**Known Breaking Changes:**
- List any known API changes from Angular docs
- List any deprecated features to address
- List any ESLint rule changes

## Document Structure

1. **Front matter** - YAML with name, overview, actionable todos
2. **Title** - Migration goal and target version
3. **Summary section** - Current → Target versions
4. **What Will Be Done** - Package updates, migrations to run, breaking changes to fix
5. **Known Challenges** - Expected issues with mitigation steps
6. **Quick Reference** - Essential commands to execute
7. **Files to Modify** - Expected changes by category
8. **Success Criteria** - Checklist of verification steps

## Style Requirements

- **Concise**: Maximum 200 lines
- **Imperative/Future tense**: Describe what will be done
- **Specific**: Include exact versions, file names
- **Code examples**: Show expected changes (before/after)
- **Actionable**: Include executable commands
- **Practical**: Focus on steps to take, not theory
- **Professional**: Clear, direct, technical tone

## What NOT to Include

❌ Extensive background explanations  
❌ Detailed timeline estimates  
❌ Risk assessment matrices  
❌ Multiple rollback strategies  
❌ Verbose troubleshooting guides  
❌ Architecture diagrams  
❌ Speculative "might need" content  

## Success Criteria

The plan should:
- Be scannable in under 5 minutes
- Provide clear migration steps
- List expected outcomes
- Include verification commands
- Note known issues upfront
- Reference detailed docs if needed

---

**Usage:** Provide this information to your AI model and ask it to generate a concise migration completion document following the structure and style requirements above.
