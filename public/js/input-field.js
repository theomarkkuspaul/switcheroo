$(function(){

  var puzzleBoard = puzzleBoard || new Puzzle();



  $('#image-input-form').submit((e) => {
    e.preventDefault();

    var inputUrl = $('.input-field')[0].value;

    var apiEndpoint = '/api/image';

    var payload = {
      imageUrl: inputUrl
    };

    loadSpinner();

    $.ajax({
      url: apiEndpoint,
      type: 'POST',
      data: JSON.stringify(payload),
      contentType: 'application/json',
      success: function(data) {

        for (var i = 0; i < 9; i++) {
          var chunkEndpoint = ['chunks', data, (i+'.jpg')].join('/');

          $(('#chunk-' + i) + ' img').attr('src', chunkEndpoint);
          $(('#chunk-' + i) + ' img').attr('data-starting-position', i);
        };
      },
      error: function(err){
        console.error(err.responseText);
      }
    }).done(function(a,b,c){
      puzzleBoard.init();
      puzzleBoard.shuffle({minValue: 1, maxValue: 2});
      hideSpinner();
    });
  });
});

function hideSpinner () {
  $('#loading-spinner').hide();
}

function loadSpinner () {
  const opts = {
    lines: 13, // The number of lines to draw
    length: 30, // The length of each line
    width: 10, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#23DB1C', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    className: 'spinner', // The CSS class to assign to the spinner
    shadow: '0 0 1px transparent', // Box-shadow for the lines
  };

  const spinnerEl = $('#loading-spinner')[0];
  const spinner = new Spinner(opts).spin(spinnerEl);
}