---
Title: About Component
Added: v3.5.0
Status: Active
Last reviewed: 2025-07-23
---

# About Component

A flexible presentational component that displays information in collapsible accordion panels. The About Component is ideal for organizing application information, settings, or any content that benefits from a collapsible interface structure.

## Overview

The About Component creates an accordion-style interface using Angular Material's expansion panels. Each panel can contain any content and can be conditionally displayed. This component is commonly used for:

- Application information and version details
- Feature lists and documentation
- Settings panels
- Help and support sections
- Plugin or extension information

## Prerequisites

Before using the About Component, ensure you have imported the necessary modules:

```typescript
import { AboutComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-example',
    imports: [CommonModule, AboutComponent],
    template: `
        <!-- Your template here -->
    `
})
export class ExampleComponent {
    // Component logic
}
```

## API Reference

### AboutComponent

| Property | Type | Description |
|----------|------|-------------|
| `panels` | `QueryList<AboutPanelDirective>` | Content children representing the panels to display |

### AboutPanelDirective (adf-about-panel)

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | The title text displayed in the panel header |
| `automationId` | `string` | No | - | Data automation ID for testing purposes |

## Basic Usage

### Simple Panel Structure

```html
<adf-about>
    <adf-about-panel [label]="'Application Information'">
        <ng-template>
            <div class="about-content">
                <h3>My Application</h3>
                <p>Version: 1.0.0</p>
                <p>Built with Angular and ADF</p>
            </div>
        </ng-template>
    </adf-about-panel>

    <adf-about-panel [label]="'Features'">
        <ng-template>
            <ul>
                <li>Document management</li>
                <li>User authentication</li>
                <li>Process workflows</li>
            </ul>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

### Using Automation IDs for Testing

```html
<adf-about>
    <adf-about-panel 
        [label]="'System Information'" 
        automationId="system-info-panel">
        <ng-template>
            <your-system-info-component></your-system-info-component>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

## Advanced Usage

### Conditional Panel Display

You can control panel visibility using Angular's structural directives:

```html
<adf-about>
    <!-- Show panel only in development mode -->
    <adf-about-panel 
        *ngIf="isDevelopmentMode" 
        [label]="'Debug Information'"
        automationId="debug-panel">
        <ng-template>
            <div class="debug-info">
                <h4>Debug Tools</h4>
                <button (click)="clearCache()">Clear Cache</button>
                <button (click)="showLogs()">View Logs</button>
            </div>
        </ng-template>
    </adf-about-panel>

    <!-- Always visible panel -->
    <adf-about-panel [label]="'General Information'">
        <ng-template>
            <app-general-info></app-general-info>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

### Working with Observables and Async Data

```html
<adf-about>
    <!-- Panel with async data -->
    <adf-about-panel 
        *ngIf="extensions$ | async as extensions" 
        [label]="'ABOUT.PLUGINS.TITLE' | translate"
        automationId="extensions-panel">
        <ng-template>
            <adf-about-extension-list [data]="extensions"></adf-about-extension-list>
        </ng-template>
    </adf-about-panel>

    <!-- Panel with multiple conditions -->
    <adf-about-panel 
        *ngIf="userPermissions$ | async as permissions; else noPermissions"
        [label]="'User Permissions'"
        automationId="permissions-panel">
        <ng-template>
            <div *ngFor="let permission of permissions" class="permission-item">
                {{ permission.name }}: {{ permission.granted ? 'Granted' : 'Denied' }}
            </div>
        </ng-template>
    </adf-about-panel>

    <ng-template #noPermissions>
        <adf-about-panel [label]="'Permissions'">
            <ng-template>
                <p>Loading permissions...</p>
            </ng-template>
        </adf-about-panel>
    </ng-template>
</adf-about>
```

### Dynamic Panel Generation

```typescript
// Component logic
export class MyAboutComponent {
    isDevelopmentMode = environment.production === false;
    
    extensions$ = this.extensionService.getExtensions();
    userPermissions$ = this.authService.getUserPermissions();

    panels = [
        { 
            label: 'System Info', 
            content: 'system-info',
            show: true 
        },
        { 
            label: 'Debug Tools', 
            content: 'debug-tools',
            show: this.isDevelopmentMode 
        }
    ];

    clearCache(): void {
        // Clear cache implementation
    }

    showLogs(): void {
        // Show logs implementation
    }
}
```

```html
<!-- Template using dynamic panels -->
<adf-about>
    <adf-about-panel 
        *ngFor="let panel of panels" 
        [label]="panel.label"
        [automationId]="panel.content + '-panel'"
        *ngIf="panel.show">
        <ng-template>
            <ng-container [ngSwitch]="panel.content">
                <app-system-info *ngSwitchCase="'system-info'"></app-system-info>
                <app-debug-tools *ngSwitchCase="'debug-tools'"></app-debug-tools>
            </ng-container>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

## Styling and Customization

### CSS Classes

The About Component uses these CSS classes that you can customize:

- `.adf-about-panel` - Main accordion container
- `.adf-about-panel-header` - Panel header styling
- `.adf-about-panel-header__title` - Panel title styling

### Custom Styling Example

```scss
// Custom panel styling
.adf-about-panel {
    .mat-expansion-panel {
        margin-bottom: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        &:not(.mat-expanded) {
            .mat-expansion-panel-header {
                background-color: #f5f5f5;
            }
        }
    }
    
    .adf-about-panel-header__title {
        font-weight: 600;
        color: #333;
    }
}

// Custom content styling
.about-content {
    padding: 16px 0;
    
    h3 {
        margin-top: 0;
        color: #1976d2;
    }
    
    .permission-item {
        padding: 4px 0;
        border-bottom: 1px solid #eee;
        
        &:last-child {
            border-bottom: none;
        }
    }
}
```

## Accessibility Features

The About Component inherits accessibility features from Angular Material's expansion panels:

- **Keyboard Navigation**: Use Tab to navigate between panels, Enter/Space to expand/collapse
- **Screen Reader Support**: Panels are properly labeled and state changes are announced
- **ARIA Attributes**: Proper ARIA attributes are automatically applied
- **Focus Management**: Focus is managed correctly when panels are expanded/collapsed

### Enhancing Accessibility

```html
<adf-about>
    <adf-about-panel 
        [label]="'System Information'"
        automationId="system-info-panel"
        role="region"
        [attr.aria-label]="'System information panel'">
        <ng-template>
            <div role="tabpanel" aria-live="polite">
                <h3 id="system-heading">Current System Status</h3>
                <p aria-describedby="system-heading">
                    All systems are operational.
                </p>
            </div>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

## Testing

### Unit Testing Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AboutComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display panels with correct labels', () => {
        const panels = fixture.debugElement.queryAll(
            By.css('[data-automation-id="system-info-panel"]')
        );
        expect(panels.length).toBeGreaterThan(0);
    });
});
```

### E2E Testing with Automation IDs

```typescript
// Page object example
export class AboutPage {
    async expandPanel(automationId: string): Promise<void> {
        const panel = element(by.css(`[data-automation-id="${automationId}"]`));
        const header = panel.element(by.css('.mat-expansion-panel-header'));
        await header.click();
    }

    async isPanelExpanded(automationId: string): Promise<boolean> {
        const panel = element(by.css(`[data-automation-id="${automationId}"]`));
        const classes = await panel.getAttribute('class');
        return classes.includes('mat-expanded');
    }
}
```

## Best Practices

### 1. Use Descriptive Labels

```html
<!-- Good: Descriptive and clear -->
<adf-about-panel [label]="'Application Version Information'">

<!-- Avoid: Vague labels -->
<adf-about-panel [label]="'Info'">
```

### 2. Provide Automation IDs for Testing

```html
<!-- Always include automation IDs for testing -->
<adf-about-panel 
    [label]="'User Settings'" 
    automationId="user-settings-panel">
```

### 3. Handle Loading States

```html
<adf-about-panel 
    *ngIf="data$ | async as data; else loadingPanel"
    [label]="'Dynamic Content'">
    <ng-template>
        <div>{{ data.content }}</div>
    </ng-template>
</adf-about-panel>

<ng-template #loadingPanel>
    <adf-about-panel [label]="'Loading...'">
        <ng-template>
            <mat-spinner diameter="20"></mat-spinner>
        </ng-template>
    </adf-about-panel>
</ng-template>
```

### 4. Organize Related Information

Group related information into logical panels to improve user experience and information architecture.

## Common Use Cases

### Application Information Dashboard

```html
<adf-about>
    <adf-about-panel [label]="'Application Details'" automationId="app-details">
        <ng-template>
            <div class="app-info">
                <h3>{{ appName }}</h3>
                <p>Version: {{ appVersion }}</p>
                <p>Build: {{ buildNumber }}</p>
                <p>Environment: {{ environment }}</p>
            </div>
        </ng-template>
    </adf-about-panel>

    <adf-about-panel [label]="'Dependencies'" automationId="dependencies">
        <ng-template>
            <ul>
                <li *ngFor="let dep of dependencies">
                    {{ dep.name }}: {{ dep.version }}
                </li>
            </ul>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

## See Also

- [Angular Material Expansion Panel](https://material.angular.io/components/expansion/overview)
- [ADF Core Components](../README.md)
- [Accessibility Guidelines](../../user-guide/accessibility.md)
