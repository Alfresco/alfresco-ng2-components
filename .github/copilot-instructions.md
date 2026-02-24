# General Code Review Instructions

## Review Priorities
When performing a code review, prioritize issues in the following order:

🔴 CRITICAL (Block merge)
* Security: Vulnerabilities, exposed secrets, authentication/authorization issues, injection, XSS
* Memory/resource leaks
* Crashes or undefined behavior
* Correctness: Logic errors, data corruption risks, race conditions, missing error handling
* Data Loss: Risk of data loss or corruption

🟡 IMPORTANT (Requires discussion)
* Code Quality: Severe violations of SOLID principles, excessive duplication
* Test Coverage: Missing tests for critical paths or new functionality
* Performance: Obvious performance bottlenecks (N+1 queries, memory leaks)
* Architecture: Significant deviations from established patterns

🟢 SUGGESTION (Non-blocking improvements)
* Readability: Poor naming, complex logic that could be simplified
* Optimization: Performance improvements without functional impact
* Best Practices: Minor deviations from conventions
* Documentation: Missing or incomplete comments/documentation

## General Review Principles
When performing a code review, follow these principles:

* Be specific: Reference exact lines, files, and provide concrete examples
* Be pragmatic: Not every suggestion needs immediate implementation
* Provide context: Explain WHY something is an issue and the potential impact
* Suggest solutions: Show corrected code when applicable, not just what's wrong
* Be constructive: Focus on improving the code, not criticizing the author
* Recognize good practices: Acknowledge well-written code and smart solutions
* Group related comments: Avoid multiple comments about the same topic
* Ask clarifying questions when code intent is unclear

## Code Quality Standards
When performing a code review, check for:

### Clean Code
* Descriptive and meaningful names for variables, functions, and classes
* Single Responsibility Principle: each function/class does one thing well
* DRY (Don't Repeat Yourself): no code duplication
* Functions should be small and focused (ideally < 20-30 lines)
* Avoid deeply nested code (max 3-4 levels), unit tests should be an exception from this rule
* Avoid magic numbers and strings (use constants)
* Code should be self-documenting; comments only when necessary
* Code follows consistent style and conventions
* No commented-out code or TODO without tickets

## Error Handling
* Proper error handling at appropriate levels
* Meaningful error messages
* No silent failures or ignored exceptions
* Fail fast: validate inputs early
* Use appropriate error types/exceptions

## Testing Standards
When performing a code review, verify test quality:

* Coverage: Critical paths and new functionality must have tests
* Test Names: Descriptive names that explain what is being tested
* Independence: Tests should not depend on each other or external state
* Assertions: Use specific assertions, avoid generics
* Edge Cases: Test boundary conditions, null values, empty inputs
* Mock Appropriately: Mock external dependencies, not domain logic
* New code has appropriate test coverage
*  No tests that always pass or are commented out

## Architecture and Design
When performing a code review, verify architectural principles:

* Separation of Concerns: Clear boundaries between layers/modules
* Dependency Direction: High-level modules don't depend on low-level details
* Interface Segregation: Prefer small, focused interfaces
* Loose Coupling: Components should be independently testable
* High Cohesion: Related functionality grouped together
* Consistent Patterns: Follow established patterns in the codebase
