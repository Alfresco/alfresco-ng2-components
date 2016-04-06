var widgets = (function (widgets, utils) {
  widgets.col2x6x4 = {
    create: createComponent,
    name: 'column 2:6:4',
    iconClass: 'fa fa-puzzle-piece',
    category: 'Grid system'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.dataset.widgetId = utils.uid();
    widget.classList.add('row', 'widget', 'widget-row');
    widget.appendChild(utils.col('col-md-2'));
    widget.appendChild(utils.col('col-md-6'));
    widget.appendChild(utils.col('col-md-4'));
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);