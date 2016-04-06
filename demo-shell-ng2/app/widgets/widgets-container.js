var widgets = (function (widgets, utils) {
  widgets.container = {
    create: createComponent,
    name: 'container',
    iconClass: 'fa fa-puzzle-piece'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.className = 'container widget widget-container';
    widget.dataset.widgetId = utils.uid();
    //widget.style.borderColor = utils.getRandomColor();
    
    var dropPlaceholder = document.createElement('div');
    dropPlaceholder.className = 'drop-zone';
    widget.appendChild(dropPlaceholder);
    
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);