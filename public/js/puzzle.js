function Puzzle () {
  this.init = function() {
    this.imageChunks = $('.image-chunk');
    this.emptyChunk = new EmptyChunk();
    this.tileMoving = false;
    this.moveCounter = 0;
    this.timer       = new Timer();

    // create a container to store history of random and human moves
    this.history     = [];

    startTimer.call(this);
    bindImageChunks.call(this);
    bindRestartButton.call(this);
    bindSolveButton.call(this);
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

      $(chunk).click(async function(e){
        if (this.tileMoving)
          return;

        var chunk = new Chunk(e.currentTarget);

        this.tileMoving = true;
        const chunkDirection = await chunk.move();
        this.tileMoving = false;

        const emptyChunkDirection = oppositeMove(chunkDirection);
        this.history.push({ direction: emptyChunkDirection, player: true, moveNumber: this.history.length + 1 });
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

  var bindSolveButton = function () {
    $('#solve').click(function(e){
      this.solve();
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

  this.restart = async function () {
    // shuffle the puzzle
    await this.shuffle();

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

  this.shuffle = async function (params) {
    // default parameters
    params = params || {};

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
      // 2. determine all potential directions the chunk can move in its current chunk (up, down, left, right)
      var directions = this.emptyChunk.moveableDirections();

      // 3. randomise a direction to travel
      var randomDirection = directions[Math.floor(Math.random() * directions.length)];

      // 4. move empty chunk
      await this.emptyChunk.move(randomDirection);

      // 5. store direction moved in history container
      this.history.push({ direction: randomDirection, player: false, moveNumber: this.history.length + 1 });
    };

    console.log('Shuffle history:', this.history);

    // after the loop has completed
    // return the randomised shuffle history container
    return this.history;
  }

  this.solve = async () => {
    const history = this.history;

    for (move of history.reverse()) {
      const undoMove = oppositeMove(move.direction);
      await this.emptyChunk.move(undoMove);
    };

    this.history = [];
  }

  function oppositeMove (m) {
    if (m == 'right')
      return 'left';
    else if (m == 'left')
      return 'right';
    else if (m == 'down')
      return 'up';
    else if (m == 'up')
      return 'down';
    else
      return false;
  }
}
