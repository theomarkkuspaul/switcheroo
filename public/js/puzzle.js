function Puzzle () {
  const winningFormula = '012345678';

  this.init = function() {
    this.imageChunks = $('.image-chunk');
    this.moveCounter = 0;
    this.timer       = new Timer();

    startTimer.call(this);
    bindImageChunks.call(this);
    bindRestartButton.call(this);
    return this;
  }

  var startTimer = function () {
    if (this.timer) {
      this.timer.start();
      this.timer.addEventListener('secondsUpdated', function(e){
        this.updateTimer();
      }.bind(this));
      return true;
    }

    else
      return false;
  }

  var handleVictory = function () {
    this.imageChunks.map(function(idx, chunk){
      $(chunk).unbind('click');
    });

    this.timer.stop();

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

  var bindRestartButton = function () {
    $('#restart').click(function(e){
      this.restart();
    }.bind(this));
  }

  this.incrementMoveCounter = function () {
    this.moveCounter += 1;
  }

  this.updateMoveCounter = function () {
    $('#move-counter').text(this.moveCounter);
  }

  this.isCompleted = function () {
    return this.currentShape() === winningFormula;
  }

  this.restart = function () {
    // shuffle the puzzle
    this.shuffle();

    // set the puzzle's move counter back to 0
    this.resetMoveCounter();

    // set the clock back to 00:00:00
    this.resetTimer();

    // start the timer again
    this.timer.start();

    // make images clickable again
    // in case the puzzle has been completed
    bindImageChunks.call(this)
  }

  this.resetMoveCounter = function () {
    // move counter is assigned to 0
    this.moveCounter = 0;

    // update the front end to display move counter
    this.updateMoveCounter();
  }

  this.resetTimer = function () {
    // timer is rewound back to 00:00:00
    this.timer.stop();

    // update the front end to display timer
    this.updateTimer();
  }

  this.updateTimer = function () {
    $('#timer').html(this.timer.getTimeValues().toString());
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

  this.currentShape = function () {
    var shape = '';
    this.imageChunks.each(function(idx, chunk){
      shape += chunk.firstElementChild.dataset.startingPosition;
    });
    return shape;
  }
}
