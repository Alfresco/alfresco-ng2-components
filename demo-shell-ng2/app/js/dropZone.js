function dropZone(opts) {
  var options = opts || {},
      element = opts.element || document.createElement('div'),
      minHeight = opts.minHeight || '20px',
      maxHeight = opts.maxHeight || '100px';
  
  element.className = 'drop-zone';
  element.style.height = minHeight;
  element.textAlign = 'center';
  
  // Event listener for when the dragged element enters the drop zone.
  element.addEventListener('dragenter', function (e) {
    this.classList.add('over');
    this.style.height = maxHeight;
  });
  
  // Event listener for when the dragged element is over the drop zone.
  element.addEventListener('dragover', function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  });
  
  // Event listener for when the dragged element leaves the drop zone.
  element.addEventListener('dragleave', function (e) {
    this.classList.remove('over');
    this.style.height = minHeight;
  });
  
  // Event listener for when the dragged element dropped in the drop zone.
  element.addEventListener('drop', function (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    
    this.classList.remove('over');
    this.style.height = minHeight;
    
    if (typeof opts.onDrop === 'function') {
      var dropData = e.dataTransfer.getData('text');
      var payload = {};
      if (dropData) {
        try {
          payload = JSON.parse(dropData);
        } catch (err) {
          payload = {};
        }
      } 
      
      opts.onDrop(this, payload);
    }
    
    return false;
  });
  
  return {
    "element": element
  };
}