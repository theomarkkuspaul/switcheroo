const DEFAULT_CHUNK_POS = { top: 0, left: 0 };


function Chunk (element) {
  this.element = element;
  this.image = element.firstElementChild;
  this.cellID = parseInt(element.id.slice(-1));

  var emptyChunkID = function () {
    var emptyChunk = $('#empty-chunk').parent()[0];
    var emptyChunkID = emptyChunk.id.slice(-1);
    return parseInt(emptyChunkID);
  };

  var updateChunkPosition = function (style) {
    var emptyChunk = $('#empty-chunk')[0];
    var imageChunk = $(this.image);

    imageChunk.css(style);
    return new Promise (resolve => {
      setTimeout(() => {
        $('#chunk-' + emptyChunkID()).html(imageChunk[0]);
        $('#chunk-' + this.cellID).html(emptyChunk);
        imageChunk.css(DEFAULT_CHUNK_POS);

        resolve();
      }, 550);
    });
  }.bind(this);

  this.move = async function () {
    let direction, style;
  
    if (this.canMoveRight()) {
      direction = 'right';
      style = { left: '194.1172px'};
    }

    if (this.canMoveLeft()) {
      direction = 'left';
      style = { left: '-194.1172px'};
    }

    if (this.canMoveUp()) {
      direction = 'up';
      style = { top: '-194.1172px'};
    }

    if (this.canMoveDown()) {
      direction = 'down';
      style = { top: '194.1172px'};
    }

    await updateChunkPosition(style);
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
