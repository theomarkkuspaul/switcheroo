$(function(){
  $('.image-chunk').click(function(e){
    new Chunk(this).move();
  });
});

function Chunk (element) {
    this.image = element.firstElementChild
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
      if (this.canMoveRight())
        return updateChunkPosition();

      if (this.canMoveLeft())
        return updateChunkPosition();

      if (this.canMoveUp())
        return updateChunkPosition();

      if (this.canMoveDown())
        return updateChunkPosition();
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