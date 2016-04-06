var widgetUtils = (function (utils) {
  utils.col = function(className) {
    var col = document.createElement('div');
    col.dataset.widgetId = utils.uid();
    col.classList.add(className, 'widget', 'widget-col');
        
    var dropPlaceholder = document.createElement('div');
    dropPlaceholder.className = 'drop-zone';
    col.appendChild(dropPlaceholder);
    
    return col;
  };
  
  utils.getRandomColor = function () {
    var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    return color;
  };
  
  utils.uid = (function(){
    var id = 0;
    return function(){
      if (arguments[0] === 0) {
          id = 0;
      }
      return id++;
    };
  })();
  
  return utils;
})(widgetUtils || {});