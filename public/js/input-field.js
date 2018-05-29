$(function(){

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
        };
      },
      error: function(err){
        console.log(err.responseText);
      }
    });

  });
});