var widgets = (function (widgets, utils) {
  widgets.col6x6 = {
    create: createComponent,
    name: 'column 6:6',
    iconClass: 'fa fa-puzzle-piece',
    category: 'Grid system'
  };
  
  function createComponent() {
    var widget = document.createElement('div');
    widget.dataset.widgetId = utils.uid();
    widget.classList.add('row', 'widget', 'widget-row');
    widget.appendChild(utils.col('col-md-6'));
    widget.appendChild(utils.col('col-md-6'));
    return widget;
  }
  
  return widgets;
})(widgets || {}, widgetUtils);