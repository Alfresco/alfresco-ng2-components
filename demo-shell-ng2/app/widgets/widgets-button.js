var widgets = (function (widgets, utils) {
  widgets.button = {
    create: createComponent,
    name: 'Button',
    iconClass: 'fa fa-square',
    category: 'Components'
  };
  
  function createComponent() {
    var widget = document.createElement('button');
    widget.textContent = 'Button';
    widget.classList.add('btn', 'btn-default', 'widget', 'widget-button');
    widget.dataset.widgetId = utils.uid();
    
    widget.addEventListener('dblclick', function (e) {
      if (this.contentEditable !== 'true') {
        this.dataset.originalValue = this.textContent;  
      }

      this.contentEditable = true;  
      selectElementContents(this);
    });
    
    widget.addEventListener('blur', function (e) {
      if (!this.textContent) {
        this.textContent = 'Button';
      }
      this.contentEditable = false;
    });
    
    widget.addEventListener('input', function (e) {
      // when button has no text - place the stub and autoselect it
      if (!this.textContent) {
        this.textContent = 'Button';
        selectElementContents(this);
      }
    });
    
    widget.addEventListener('keydown', function (e) {
      // special handling of 'spacebar' key
      if (e.keyCode == 32) {
        insertHtmlAtCursor('&nbsp;');
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      // 'Enter' key
      if (e.keyCode == 13) {
        e.stopPropagation();
        e.preventDefault();
        this.blur();
        return false;
      }

      // 'Esc' key
      if (e.keyCode == 27) {
        var originalValue = this.dataset.originalValue || 'Button';
        this.textContent = originalValue;
        delete this.dataset.originalValue;
        this.blur();
        return false;
      }
    });
    
    return widget;
  }
  
  // TODO: move to shared library
  function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  // TODO: move to shared library
  function insertHtmlAtCursor(html) {
    var range, node;
    if (window.getSelection && window.getSelection().getRangeAt) {
      range = window.getSelection().getRangeAt(0);
      node = range.createContextualFragment(html);
      range.insertNode(node);
      window.getSelection().collapseToEnd();
      window.getSelection().modify('move', 'forward', 'character');
    } else if (document.selection && document.selection.createRange) {
      document.selection.createRange().pasteHTML(html);
      document.selection.collapseToEnd();
      document.selection.modify('move', 'forward', 'character');
    }
  }
  
  return widgets;
})(widgets || {}, widgetUtils);