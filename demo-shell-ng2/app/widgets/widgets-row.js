var widgets = (function (widgets, utils) {
  widgets.row = {
    create: createComponent,
    name: 'row',
    iconClass: 'fa fa-puzzle-piece',
    category: 'Grid system'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.classList.add('row', 'widget', 'widget-row');
    widget.dataset.widgetId = utils.uid();
    widget.appendChild(utils.col('col-md-12'));
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);