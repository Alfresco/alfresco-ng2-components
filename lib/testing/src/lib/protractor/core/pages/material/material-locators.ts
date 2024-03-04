/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const materialLocators = {
  Accent: {
    class: '.mat-accent'
  },
  Accordion: {
    root: 'mat-accordion'
  },
  Autocomplete: {
    panel: {
      class: '.mat-autocomplete-panel',
      root: 'mat-autocomplete-panel'
    }
  },
  Button: {
    class: '.mat-button',
    disabled: 'mat-button-disabled',
    wrapper: '.mat-button-wrapper'
  },
  Calendar: {
    root: 'mat-calendar',
    body: {
      cell: {
        root: 'mat-calendar-body-cell',
        content: {
          class: '.mat-calendar-body-cell-content'
        },
      },
      today: {
        class: '.mat-calendar-body-today'
      },
      active: {
        root: 'mat-calendar-body-active'
      }
    },
    button: (navigation: 'next' | 'previous' | 'period') => `mat-calendar-${navigation}-button`
  },
  Card: {
    root: 'mat-card',
    class: '.mat-card',
    content: {
      class: '.mat-card-content',
      root: 'mat-card-content'
    },
    title: {
      class: '.mat-card-title',
      root: 'mat-card-title',
    },
    actions: 'mat-card-actions',
    subtitle: {
      root: 'mat-card-subtitle'
    }
  },
  Checkbox: {
    root: 'mat-checkbox',
    class: '.mat-checkbox',
    layout: '.mat-checkbox-layout',
    label: {
      class: '.mat-checkbox-label',
      root: 'mat-checkbox-label'
    },
    checked: {
      class: '.mat-checkbox-checked',
      root: 'mat-checkbox-checked'
    },
    disabled: {
      root: 'mat-checkbox-disabled'
    },
    inner: {
      container: {
        class: '.mat-checkbox-inner-container'
      }
    }
  },
  Checked: {
    root: 'mat-checked'
  },
  Chip: {
    root: 'mat-chip',
    class: '.mat-chip',
    list: {
      root: 'mat-chip-list',
      class: '.mat-chip-list'
    }
  },
  Datepicker: {
    root: 'mat-datepicker',
    calendar: {
      body: {
        cell: {
          content: {
            class: '.mat-datepicker-calendar-body-cell-content'
          }
        }
      },
    },
    toggle: {
      root: 'mat-datepicker-toggle',
      class: '.mat-datepicker-toggle'
    },
  },
  DatetimePicker: {
    root: 'mat-datetimepicker-content',
    popup: '.mat-datetimepicker-popup',
    calendar: {
      header: {
        date: {
        class: '.mat-datetimepicker-calendar-header-date',
        time: '.mat-datetimepicker-calendar-header-date-time'
        },
        year: '.mat-datetimepicker-calendar-header-year'
      },
      body: {
        active: '.mat-datetimepicker-calendar-body-active',
        cell: {
          class: '.mat-datetimepicker-calendar-body-cell-content',
          root: 'mat-datetimepicker-calendar-body-cell-content'
        }, 
      },
      content: '.mat-datetimepicker-calendar-content',
      nextButton: '.mat-datetimepicker-calendar-next-button'
    },
    clock: {
      class: '.mat-datetimepicker-clock',
      hours: {
        class: '.mat-datetimepicker-clock-hours',
      },
      minutes: {
        class: '.mat-datetimepicker-clock-minutes',
      },
      cell: (attribute?: 'selected' | 'disabled') => attribute ? `mat-datetimepicker-clock-cell-${attribute}` : 'mat-datetimepicker-clock-cell'
    },
    month: {
      view: 'mat-datetimepicker-month-view'
    },
    toggle: {
      root: 'mat-datetimepicker-toggle',
      class: '.mat-datetimepicker-toggle'
    },
  },
  Dialog: {
    container: {
      root: 'mat-dialog-container',
      class: '.mat-dialog-container'
    },
    content: {
      root: 'mat-dialog-content',
      class: '.mat-dialog-content',
    },
    actions: {
      class: `.mat-dialog-actions`,
      root: `mat-dialog-actions`,
    },
    title: '.mat-dialog-title'
  },
  Disabled: {
    root: 'mat-disabled'
  },
  Drawer: {
    class: '.mat-drawer',
    end: '.mat-drawer-end'
  },
  Error: {
    class: '.mat-error',
    root: 'mat-error'
  },
  Expanded: {
    class: '.mat-expanded',
    root: 'mat-expanded'
  },
  Expansion: {
    panel: {
      root: 'mat-expansion-panel',
      class: '.mat-expansion-panel',
      body: {
        class: '.mat-expansion-panel-body'
      },
      content: {
        class: '.mat-expansion-panel-content'
      },
      header: {
        class: '.mat-expansion-panel-header',
        root: 'mat-expansion-panel-header',
      },
      title: '.mat-expansion-panel-header-title'
    },
    indicator: '.mat-expansion-indicator'
  },
  Focus: {
    indicator: '.mat-focus-indicator'
  },
  Focused: {
    root: 'mat-focused'
  },
  Form: {
    field: {
      class: '.mat-form-field',
      root: 'mat-form-field',
      label: {
        wrapper: '.mat-form-field-label-wrapper'
      }
    },
    fieldInfix: '.mat-form-field-infix'
  },
  Header: {
    cell: '.mat-header-cell'
  },
  Hint: {
    class: 'mat-hint'
  },
  Icon: {
    root: 'mat-icon',
    class: '.mat-icon',
    button: {
      class: '.mat-icon-button',
      root: 'mat-icon-button'
    },
  },
  Input: {
    class: '.mat-input-element'
  },
  Label: {
    root: 'mat-label'
  },
  List: {
    class: '.mat-list',
    root: 'mat-list',
    item: {
      root: 'mat-list-item',
      class: '.mat-list-item'
    },
    option: 'mat-list-option',
    text: {
      class: '.mat-list-text'
    },
    selectionList: 'mat-selection-list'
  },
  Menu: {
    content: {
      class: '.mat-menu-content',
      root: 'mat-menu-content'
    },
    panel: '.mat-menu-panel',
    item: {
      class: '.mat-menu-item',
      submenu: {
        trigger: {
          root: `mat-menu-item-submenu-trigger`
        }
      }
    },
  },
  Month: {
    content: '.mat-month-content'
  },
  Option: {
    root: 'mat-option',
    class: '.mat-option',
    group: 'mat-optgroup',
    text: {
      class: '.mat-option-text',
      root: 'mat-option-text'
    },
  },
  Paginator: {
    class: '.mat-paginator',
    range: {
      label: '.mat-paginator-range-label',
    },
    navigation: (rangeAction: string) => `.mat-paginator-navigation-${rangeAction}`
  },
  Panel: {
    title: 'mat-panel-title'
  },
  Primary: {
    class: '.mat-primary'
  },
  Progress: {
    bar: {
      root: 'mat-progress-bar',
      class: '.mat-progress-bar'
    },
    spinner: {
      root: 'mat-progress-spinner',
      class: '.mat-progress-spinner'
    }
  },
  Radio: {
    root: 'mat-radio',
    button: {
      class: '.mat-radio-button',
      root: 'mat-radio-button',
    },
    group: 'mat-radio-group',
    checked: 'mat-radio-checked',
    label: '.mat-radio-label'
  },
  Ripple: {
    class: '.mat-ripple',
    element: {
      class: '.mat-ripple-element',
      root: 'mat-ripple-element'
    },
  },
  Select: {
    root: 'mat-select',
    class: '.mat-select',
    arrow: {
      class: '.mat-select-arrow',
      wrapper: {
        root: '.mat-select-arrow-wrapper'
      }
    },
    placeholder: {
      class: '.mat-select-placeholder'
    },
    panel: {
      class: '.mat-select-panel',
      wrap: '.mat-select-panel-wrap'
    },
    value: {
      class: '.mat-select-value',
      text: '.mat-select-value-text'
    },
    minLine: '.mat-select-min-line',
    trigger: '.mat-select-trigger'
  },
  Slide: {
    toggle: {
      class: '.mat-slide-toggle',
      root: 'mat-slide-toggle',
      input: '.mat-slide-toggle-input'
    },
  },
  Selection: {
    list: {
      root: 'mat-selection-list'
    }
  },
  Sidenav: {
    root: 'mat-sidenav'
  },
  Snackbar: {
    container: {
      class: '.mat-snack-bar-container'
    }
  },
  Sort: {
    header: {
      container: '.mat-sort-header-container'
    }
  },
  Spinner: {
    root: 'mat-spinner'
  },
  Tab: {
    disabled: '.mat-tab-disabled',
    header: {
      class: '.mat-tab-header',
      pagination: {
        after: '.mat-tab-header-pagination-after',
        before: '.mat-tab-header-pagination-before',
        chevron: '.mat-tab-header-pagination-chevron'
      }
    },
    body: {
      active: '.mat-tab-body-active',
      content: '.mat-tab-body-content'
    },
    label: {
      class: '.mat-tab-label',
      root: 'mat-tab-label',
      active: {
        class: '.mat-tab-label-active',
        root: 'mat-tab-label-active',
      },
      content: {
        class: '.mat-tab-label-content',
        root: 'mat-tab-label-content'
      },
    },
    labels: {
      class: '.mat-tab-labels'
    },
    list: '.mat-tab-list'
  },
  Table: {
    class: '.mat-table',
    root: 'mat-table',
    row: {
      root: 'mat-row',
      class: '.mat-row',
    },
    cell: {
      class: '.mat-cell',
      root: 'mat-cell'
    },
    column: (matColumn: string) => `.mat-column-${matColumn}`
  },
  Toolbar: {
    root: 'mat-toolbar',
    class: '.mat-toolbar'
  },
  Tooltip: {
    root: 'mat-tooltip-component',
    class: '.mat-tooltip',
    trigger: '.mat-tooltip-trigger'
  },
  Tree: {
    root: 'mat-tree',
    node: {
      root: 'mat-tree-node'
    }
  }
};
