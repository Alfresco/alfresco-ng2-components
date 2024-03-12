/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    class: '.mat-mdc-accent'
  },
  Accordion: {
    root: 'mat-accordion'
  },
  Autocomplete: {
    panel: {
      class: '.mat-mdc-autocomplete-panel',
      root: 'mat-autocomplete-panel'
    }
  },
  Button: {
    class: '.mat-mdc-button',
    disabled: 'mat-button-disabled',
    wrapper: '.mat-mdc-button-wrapper'
  },
  Calendar: {
    root: 'mat-calendar',
    body: {
      cell: {
        root: 'mat-calendar-body-cell',
        content: {
          class: '.mat-mdc-calendar-body-cell-content'
        }
      },
      today: {
        class: '.mat-mdc-calendar-body-today'
      },
      active: {
        root: 'mat-calendar-body-active'
      }
    },
    button: (navigation: 'next' | 'previous' | 'period') => `mat-calendar-${navigation}-button`
  },
  Card: {
    root: 'mat-card',
    class: '.mat-mdc-card',
    content: {
      class: '.mat-mdc-card-content',
      root: 'mat-card-content'
    },
    title: {
      class: '.mat-mdc-card-title',
      root: 'mat-card-title'
    },
    actions: 'mat-card-actions',
    subtitle: {
      root: 'mat-card-subtitle'
    }
  },
  Checkbox: {
    root: 'mat-checkbox',
    class: '.mat-mdc-checkbox',
    layout: '.mat-mdc-checkbox-layout',
    label: {
      class: '.mat-mdc-checkbox-label',
      root: 'mat-checkbox-label'
    },
    checked: {
      class: '.mat-mdc-checkbox-checked',
      root: 'mat-checkbox-checked'
    },
    disabled: {
      root: 'mat-checkbox-disabled'
    },
    inner: {
      container: {
        class: '.mat-mdc-checkbox-inner-container'
      }
    }
  },
  Checked: {
    root: 'mdc-switch--checked'
  },
  Chip: {
    root: 'mat-chip',
    class: '.mat-mdc-chip',
    list: {
      root: 'mat-chip-list',
      class: '.mat-mdc-chip-list'
    }
  },
  Datepicker: {
    root: 'mat-datepicker',
    calendar: {
      body: {
        cell: {
          content: {
            class: '.mat-mdc-datepicker-calendar-body-cell-content'
          }
        }
      }
    },
    toggle: {
      root: 'mat-datepicker-toggle',
      class: '.mat-datepicker-toggle'
    }
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
        }
      },
      content: '.mat-datetimepicker-calendar-content',
      nextButton: '.mat-datetimepicker-calendar-next-button'
    },
    clock: {
      class: '.mat-datetimepicker-clock',
      hours: {
        class: '.mat-datetimepicker-clock-hours'
      },
      minutes: {
        class: '.mat-datetimepicker-clock-minutes'
      },
      cell: (attribute?: 'selected' | 'disabled') => attribute ? `mat-datetimepicker-clock-cell-${attribute}` : 'mat-datetimepicker-clock-cell'
    },
    month: {
      view: 'mat-datetimepicker-month-view'
    },
    toggle: {
      root: 'mat-datetimepicker-toggle',
      class: '.mat-datetimepicker-toggle'
    }
  },
  Dialog: {
    container: {
      root: 'mat-dialog-container',
      class: '.mat-mdc-dialog-container'
    },
    content: {
      root: 'mat-dialog-content',
      class: '.mat-mdc-dialog-content'
    },
    actions: {
      class: `.mat-mdc-dialog-actions`,
      root: `mat-dialog-actions`
    },
    title: '.mat-mdc-dialog-title'
  },
  Disabled: {
    root: 'mat-disabled'
  },
  Drawer: {
    class: '.mat-mdc-drawer',
    end: '.mat-mdc-drawer-end'
  },
  Error: {
    class: '.mat-mdc-error',
    root: 'mat-error'
  },
  Expanded: {
    class: '.mat-expanded',
    root: 'mat-expanded'
  },
  Expansion: {
    panel: {
      root: 'mat-expansion-panel',
      class: '.mat-mdc-expansion-panel',
      body: {
        class: '.mat-mdc-expansion-panel-body'
      },
      content: {
        class: '.mat-mdc-expansion-panel-content'
      },
      header: {
        class: '.mat-mdc-expansion-panel-header',
        root: 'mat-expansion-panel-header'
      },
      title: '.mat-mdc-expansion-panel-header-title'
    },
    indicator: '.mat-mdc-expansion-indicator'
  },
  Focus: {
    indicator: '.mat-mdc-focus-indicator'
  },
  Focused: {
    root: 'mat-focused'
  },
  Form: {
    field: {
      class: '.mat-mdc-form-field',
      root: 'mat-form-field',
      label: {
        wrapper: '.mat-mdc-form-field-label-wrapper'
      }
    },
    fieldInfix: '.mat-mdc-form-field-infix'
  },
  Header: {
    cell: '.mat-mdc-header-cell'
  },
  Hint: {
    class: 'mat-hint'
  },
  Icon: {
    root: 'mat-icon',
    class: '.mat-mdc-icon',
    button: {
      class: '.mat-mdc-icon-button',
      root: 'mat-icon-button'
    }
  },
  Input: {
    class: '.mat-mdc-input-element'
  },
  Label: {
    root: 'mat-label'
  },
  List: {
    class: '.mat-mdc-list',
    root: 'mat-list',
    item: {
      root: 'mat-list-item',
      class: '.mat-mdc-list-item'
    },
    option: 'mat-list-option',
    text: {
      class: '.mat-mdc-list-text'
    },
    selectionList: 'mat-selection-list'
  },
  Menu: {
    content: {
      class: '.mat-mdc-menu-content',
      root: 'mat-menu-content'
    },
    panel: '.mat-mdc-menu-panel',
    item: {
      class: '.mat-mdc-menu-item',
      submenu: {
        trigger: {
          root: `mat-menu-item-submenu-trigger`
        }
      }
    }
  },
  Month: {
    content: '.mat-mdc-month-content'
  },
  Option: {
    root: 'mat-option',
    class: '.mat-mdc-option',
    group: 'mat-optgroup',
    text: {
      class: '.mdc-list-item__primary-text',
      root: 'span'
    }
  },
  Paginator: {
    class: '.mat-mdc-paginator',
    range: {
      label: '.mat-mdc-paginator-range-label'
    },
    navigation: (rangeAction: string) => `.mat-mdc-paginator-navigation-${rangeAction}`
  },
  Panel: {
    title: 'mat-panel-title'
  },
  Primary: {
    class: '.mat-mdc-primary'
  },
  Progress: {
    bar: {
      root: 'mat-progress-bar',
      class: '.mat-mdc-progress-bar'
    },
    spinner: {
      root: 'mat-progress-spinner',
      class: '.mat-mdc-progress-spinner'
    }
  },
  Radio: {
    root: 'mat-radio',
    button: {
      class: '.mat-mdc-radio-button',
      root: 'mat-radio-button'
    },
    group: 'mat-radio-group',
    checked: 'mat-radio-checked',
    label: '.mat-mdc-radio-label'
  },
  Ripple: {
    class: '.mat-mdc-ripple',
    element: {
      class: '.mat-mdc-ripple-element',
      root: 'mat-ripple-element'
    }
  },
  Select: {
    root: 'mat-select',
    class: '.mat-mdc-select',
    arrow: {
      class: '.mat-mdc-select-arrow',
      wrapper: {
        root: '.mat-mdc-select-arrow-wrapper'
      }
    },
    placeholder: {
      class: '.mat-mdc-select-placeholder'
    },
    panel: {
      class: '.mat-mdc-select-panel',
      wrap: '.mat-mdc-select-panel-wrap'
    },
    value: {
      class: '.mat-mdc-select-value',
      text: '.mat-mdc-select-value-text'
    },
    minLine: '.mat-mdc-select-min-line',
    trigger: '.mat-mdc-select-trigger'
  },
  Slide: {
    toggle: {
      class: '.mat-mdc-slide-toggle',
      root: 'mat-slide-toggle',
      input: '.mat-mdc-slide-toggle-input',
      checked: 'mat-mdc-slide-toggle-checked'
    }
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
      class: '.mat-mdc-snack-bar-container'
    }
  },
  Sort: {
    header: {
      container: '.mat-mdc-sort-header-container'
    }
  },
  Spinner: {
    root: 'mat-spinner'
  },
  Tab: {
    disabled: '.mat-mdc-tab-disabled',
    header: {
      class: '.mat-mdc-tab-header',
      pagination: {
        after: '.mat-mdc-tab-header-pagination-after',
        before: '.mat-mdc-tab-header-pagination-before',
        chevron: '.mat-mdc-tab-header-pagination-chevron'
      }
    },
    body: {
      active: '.mat-mdc-tab-body-active',
      content: '.mat-mdc-tab-body-content'
    },
    label: {
      class: '.mdc-tab',
      root: 'mat-tab-label',
      active: {
        class: '.mdc-tab--active',
        root: 'mat-tab-label-active'
      },
      content: {
        class: '.mdc-tab__content',
        root: 'mat-tab-label-content'
      }
    },
    labels: {
      class: '.mdc-tab__text-label',
      container: {
        class: '.mat-mdc-tab-labels'
      }
    },
    list: '.mat-mdc-tab-list'
  },
  Table: {
    class: '.mat-mdc-table',
    root: 'mat-table',
    row: {
      root: 'mat-row',
      class: '.mat-mdc-row'
    },
    cell: {
      class: '.mat-mdc-cell',
      root: 'mat-cell'
    },
    column: (matColumn: string) => `.mat-mdc-column-${matColumn}`
  },
  Toolbar: {
    root: 'mat-toolbar',
    class: '.mat-mdc-toolbar'
  },
  Tooltip: {
    root: 'mat-tooltip-component',
    class: '.mat-mdc-tooltip',
    trigger: '.mat-mdc-tooltip-trigger'
  },
  Tree: {
    root: 'mat-tree',
    node: {
      root: 'mat-tree-node'
    }
  }
};
