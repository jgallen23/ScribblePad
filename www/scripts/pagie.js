/*!
  * Pagie - A javascript pagination class
  * v0.0.1
  * https://github.com/jgallen23/pagie
  * copyright JGA 2011
  * MIT License
  */

!function(root) {

  var Pagie = function(items, itemsPerPage) {
    this.items = items;
    this.itemsPerPage = itemsPerPage || 1;

    this.totalPages = Math.ceil(items.length / itemsPerPage);
    this.currentPageNumber = 1;

  };

  Pagie.prototype.isFirstPage = function() {
    return (this.currentPageNumber == 1);
  };

  Pagie.prototype.isLastPage = function() {
    return (this.currentPageNumber == this.totalPages);
  };

  Pagie.prototype.nextPage = function() {
    if (!this.isLastPage())
      this.currentPageNumber++;
  };

  Pagie.prototype.previousPage = function() {
    if (!this.isFirstPage())
      this.currentPageNumber--;
  };

  Pagie.prototype.jumpToPage = function(page) {
    this.currentPageNumber = page;
  };

  Pagie.prototype.getCurrentPageItems = function() {
    var page = [];
    var i = this.itemsPerPage * (this.currentPageNumber - 1);
    var c = this.itemsPerPage * this.currentPageNumber;
    c = (c > this.items.length)?this.items.length:c;
    for(; i < c; i++) {
      page.push(this.items[i]);
    }
    return page;
  };

  var oldPagie = root.Pagie;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pagie;
  } else {
    root.Pagie = Pagie;
  }
  Pagie.noConflict = function() {
    root.Pagie = oldPagie;
    return Pagie;
  };

}(this);


