function Chunk (element) {
  this.element = element;
  this.image = element.firstElementChild;
  this.cellID = parseInt(element.id.slice(-1));

  var emptyChunkID = function () {
    var emptyChunk = $('#empty-chunk').parent()[0];
    var emptyChunkID = emptyChunk.id.slice(-1);
    return parseInt(emptyChunkID);
  };

  var updateChunkPosition = function () {
    var emptyChunk = $('#empty-chunk')[0];
    var imageChunk = this.image

    $('#chunk-' + emptyChunkID()).html(imageChunk)
    $('#chunk-' + this.cellID).html(emptyChunk);
  }.bind(this);

  this.move = function () {
    let direction;
  
    if (this.canMoveRight())
      direction = 'right';

    if (this.canMoveLeft())
      direction = 'left';

    if (this.canMoveUp())
      direction = 'up';

    if (this.canMoveDown())
      direction = 'down';

    updateChunkPosition();
    return direction;
  }

  this.canMoveRight = function () {
    return (this.cellID + 1 == emptyChunkID());
  }

  this.canMoveLeft = function () {
    return (this.cellID - 1 == emptyChunkID());
  }

  this.canMoveDown = function () {
    return (this.cellID + 3 == emptyChunkID());
  }

  this.canMoveUp = function () {
    return (this.cellID - 3 == emptyChunkID());
  }
}
