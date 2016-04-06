var widgets = (function (widgets, utils) {
  widgets.input = {
    create: createComponent,
    name: 'Input',
    iconClass: 'fa fa-file-text-o',
    category: 'Components',
    getDragImage: getDragImage
  };
  
  function createComponent() {
    var widget = document.createElement('input');
    widget.type = 'text';
    widget.readOnly = true;
    widget.classList.add('form-control', 'widget', 'widget-input');
    widget.dataset.widgetId = utils.uid();
    return widget;
  }
  
  /*function getDragImage() {
    var container = document.createElement('div');
    container.style.width = '200px';
    
    var label = document.createElement('label');
    label.textContent = "Input";
    label.style.display = 'block';
    label.style.margin = '0';
    label.style.fontSize = '12px';
    container.appendChild(label);
    
    var element = document.createElement('input');
    element.className = 'form-control';
    element.style.display = 'block';
    container.appendChild(element);
    
    return container;
  }*/
  
  function getDragImage() {
    var element = document.createElement('input');
    element.style.width = '200px';
    element.className = 'form-control';
    return element;
  }
  
  // TODO: move to shared library
  function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
  }
  
  // TODO: move to shared library
  function setCursorPosition (element, pos) {
    if (element.setSelectionRange) {
      element.setSelectionRange(pos, pos);
    } else if (element.createTextRange) {
      var range = element.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
  
  return widgets;
})(widgets || {}, widgetUtils);