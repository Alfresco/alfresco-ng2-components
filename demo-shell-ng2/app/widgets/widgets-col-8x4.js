var widgets = (function (widgets, utils) {
  widgets.col8x4 = {
    create: createComponent,
    name: 'column 8:4',
    iconClass: 'fa fa-puzzle-piece',
    category: 'Grid system'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.dataset.widgetId = utils.uid();
    widget.classList.add('row', 'widget', 'widget-row');
    widget.appendChild(utils.col('col-md-8'));
    widget.appendChild(utils.col('col-md-4'));
    
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);