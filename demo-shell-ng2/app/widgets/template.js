var widgets = (function (widgets) {
  widgets.COMPONENT = {
    create: createComponent,
    name: 'COMPONENT NAME',
    iconClass: 'fa fa-puzzle-piece'
  };
  
  function createComponent() {
    var widget = document.createElement('button');
    widget.textContent = 'Button';
    widget.classList.add('btn', 'btn-default', 'widget', 'widget-button');
    return widget;
  }
  
  return widgets;
})(widgets || {});