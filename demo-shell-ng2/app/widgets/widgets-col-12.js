var widgets = (function (widgets, utils) {
  widgets.col12 = {
    create: createComponent,
    name: 'column 12',
    iconClass: 'fa fa-puzzle-piece',
    category: 'Grid system'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.dataset.widgetId = utils.uid();
    widget.classList.add('row', 'widget', 'widget-row');
    widget.appendChild(utils.col('col-md-12'));
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);