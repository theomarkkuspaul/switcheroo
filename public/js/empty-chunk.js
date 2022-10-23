function EmptyChunk () {
  this.element = function () {
    return $('#empty-chunk');
  }

  // returns the id of the parent element
  // where the empty chunk is
  // in the puzzle
  this.whereami = function () {
    var id = this.element().parent()[0].id.slice(-1);
    return parseInt(id);
  }

  this.move = function (direction) {
    var newId, style;

    switch (direction) {
      case 'up':
        newId = this.whereami() - 3;
        style = { top: '194.1172px' };
        break;

      case 'down':
        // interesting to note:
        // '1' + 1 == '11'
        // '1' - 1 == 0
        newId = this.whereami() + 3;
        style = { top: '-194.1172px' };
        break;

      case 'left':
        newId = this.whereami() - 1;
        style = { left: '194.1172px'};
        break;

      case 'right':
        newId = this.whereami() + 1;
        style = { left: '-194.1172px' };
        break;
    }

    const imageChunkCell = $(('#chunk-' + newId));
    const imageChunk = imageChunkCell.children();

    const imageChunkSelector = '#chunk-' + newId;
    const emptyChunkSelector = '#chunk-' + this.whereami();

    imageChunk.css(style);
    return new Promise(resolve => {
      setTimeout(() => {
        $(imageChunkSelector).html(this.element());
        $(emptyChunkSelector).html(imageChunk);
        imageChunk.css({top: 0, left: 0});

        resolve();
      }, 550);
    });
  }

  // determines the possible
  // directions the empty chunk can move
  // at a point in time
  this.moveableDirections = function (lastMove) {
    var directions = [];

    if (this.canMoveLeft())
      directions.push('left')

    if (this.canMoveRight())
      directions.push('right')

    if (this.canMoveUp())
      directions.push('up')

    if (this.canMoveDown())
      directions.push('down')

    return directions;
  }

  this.canMoveLeft = function () {
    return this.whereami() % 3 != 0;
  }

  this.canMoveRight = function () {
    return this.whereami() % 3 != 2;
  }

  this.canMoveUp = function () {
    return this.whereami() > 2;
  }

  this.canMoveDown = function () {
    return this.whereami() < 6;
  }
}