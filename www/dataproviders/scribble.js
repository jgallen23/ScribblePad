var ScribbleData = function() {
  var self = this;
  new Lawnchair({ table: 'scribbles' }, function(lc) {
    self.provider = lc;
  });
};
ScribbleData.prototype.find = function(cb) {
  this.provider.all(function(data) {
    var scribbles = [];
    data.forEach(function(obj) {
      //var s = new Scribble(obj);
      scribbles.push(obj);
    });
    cb(scribbles);
  });
};
ScribbleData.prototype._updateDimentions = function(scribble) {
  var minX = 9999, maxX = 0, minY = 9999, maxY = 0;
  scribble.path.forEach(function(stroke) {
    stroke.forEach(function(point) {
      if (point) {
        if (point[0] < minX)
          minX = point[0];
        if (point[0] > maxX)
          maxX = point[0];
        if (point[1] < minY)
          minY = point[1];
        if (point[1] > maxY)
          maxY = point[1];
      }
    });
  });
  var b = [[minX, minY], [maxX, maxY]];

  scribble.bounds = b;
  scribble.height = b[1][1] - b[0][1];
  scribble.width = b[1][0] - b[0][0];
};
ScribbleData.prototype.save = function(scribble, cb) {
  var update = true;
  if (!scribble.key) {
    update = false;
  }
  this._updateDimentions(scribble);
  this.provider.save(scribble, function(data) {
    if (!update) {
      scribble.key = data.key;
    }
    if (cb) cb(scribble);
  });
};
ScribbleData.prototype.remove = function(scribble, cb) {
  this.provider.remove(scribble.key, cb);
};
