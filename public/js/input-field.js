$(function(){

  var puzzleBoard = puzzleBoard || new Puzzle();

  $('#image-input-form').submit((e) => {
    e.preventDefault();

    var inputUrl = $('.input-field')[0].value;

    var apiEndpoint = '/api/image';

    var payload = {
      imageUrl: inputUrl
    };

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
    });
  });
});
