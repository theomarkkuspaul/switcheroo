function Puzzle () {
  this.init = function() {
    this.imageChunks = $('.image-chunk');
    this.moveCounter = 0;

    bindImageChunks.call(this);
    return this;
  }

  var handleVictory = function () {
    this.imageChunks.map(function(idx, chunk){
      $(chunk).unbind('click');
    });

    this.completed = true;

    console.log("You win!");
    alert("You win!");
    return this;
  }

  var bindImageChunks = function () {
    return this.imageChunks.map(function(idx, chunk){

      $(chunk).click(function(e){
        var chunk = new Chunk(e.currentTarget);
        chunk.move();
        this.incrementMoveCounter();
        this.updateMoveCounter();

        if (this.isCompleted())
          handleVictory.call(this);

      }.bind(this));

      return chunk;
    }.bind(this));
  }

  this.incrementMoveCounter = function () {
    this.moveCounter += 1;
  }

  this.updateMoveCounter = function () {
    $('#move-counter').text(this.moveCounter);
  }

  this.isCompleted = function () {
    const winningFormula = '012345678';
    var currentState = '';

    this.imageChunks.map(function(id, chunk){
      currentState += chunk.firstElementChild.dataset.startingPosition;
    });

    return currentState === winningFormula;
  }

  this.shuffle = function (params) {
    // default parameters
    params = params || {};

    // create a container to store history
    // of Puzzle shuffle
    const history = [];

    // randomise a number between
    // a provider min and max value
    // defaults to 15 and 20 respectively
    const minValue = params.minValue || 15;
    const maxValue = params.maxValue || 20;

    // to determine the initial moves to mix up the puzzle
    const randomValueParams = {min: minValue, max: maxValue};
    const randomInt = chance.integer(randomValueParams);

    // loop as many times as the random number
    // perform an action
    for (var i = 0; i < randomInt; i++) {
      // within this action:
      // 1. locate the empty chunk
      var emptyChunk = new EmptyChunk();

      // 2. determine all potential directions the chunk can move in its current chunk (up, down, left, right)
      var directions = emptyChunk.moveableDirections();

      // 3. randomise a direction to travel
      var randomDirection = directions[Math.floor(Math.random() * directions.length)];

      // 4. move empty chunk
      emptyChunk.move(randomDirection);

      // 5. store direction moved in history container
      history.push(randomDirection)
    };

    console.log('Shuffle history:', history);

    // after the loop has completed
    // return the randomised shuffle history container
    return history;
  }
}

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
    var newId;
    switch (direction) {
      case 'up':
        newId = this.whereami() - 3;
        break;

      case 'down':
        // interesting to note:
        // '1' + 1 == '11'
        // '1' - 1 == 0
        newId = this.whereami() + 3;
        break;

      case 'left':
        newId = this.whereami() - 1;
        break;

      case 'right':
        newId = this.whereami() + 1;
        break;
    }

    const imageChunkCell = $(('#chunk-' + newId));
    const imageChunk = imageChunkCell.children()[0];

    const imageChunkSelector = '#chunk-' + newId;
    const emptyChunkSelector = '#chunk-' + this.whereami();

    $(imageChunkSelector).html(this.element());
    $(emptyChunkSelector).html(imageChunk);
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