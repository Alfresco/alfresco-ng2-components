---
applyTo: "**/*.scss"
---

# SCSS Development Standards

* Avoid using `!important` to override styles unless absolutely necessary; instead, increase specificity or refactor the code structure.
* Avoid using Angular Material internal class; prefer using Angular Material Design 3 theming and tokens.
* Use variables for colors, fonts, and other design tokens to maintain consistency across the project.
* Use mixins for reusable styles and to avoid code duplication.
* Ensure that styles are responsive and work well across different screen sizes and devices.
* Use CSS Grid and Flexbox for layout to create flexible and responsive designs.
* Avoid using overly specific selectors (e.g., #header .nav ul li a)
* Be DRY (avoid repeated styles for similar elements)
* Check for inconsistent naming (e.g., mixing BEM and arbitrary classes)
* Make sure selected colors have right contrast (satisfy WCAG AA)
* All interactive elements should have focus state
* Avoid disabled outline without alternative focus indicators

