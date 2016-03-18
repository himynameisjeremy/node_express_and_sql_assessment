var animalObject = {};
var animalArray = [];
var population;

$(document).ready(function(){
  getInfo();
  $('#newAnimals').on('submit', function(event){
    event.preventDefault();
    // workNow();
    // animalObject.skolko = population;

    $.each($('#newAnimals').serializeArray(), function(i,field){
      animalObject[field.name] = field.value;

    });

    sendToServer(animalObject);
    $('#newAnimals').find('input[type=text]').val("");
  });
});

function getInfo(){
  $.ajax({
        type: "GET",
        url: "/animals/",
        success: function(response){
          throwStuffinArray(response);
        }
    });
}

function sendToServer(){
  $.ajax({
        type: "POST",
        url: "/animals/",
        data: animalObject,
        success: function(response){
          throwStuffinArray(response);
        }
    });
}


function throwStuffinArray(data){
  for(var i = 0; i < data.length; i++){
    animalArray.push(data[i]);
  }
  $('.panda').text("");
  for(i = 0; i < animalArray.length; i++){
    var whiteTiger;
    whiteTiger = animalArray[i];
    $('.panda').append('<div></div>');
    var bigBrownBear = $('.panda').children().last();
    bigBrownBear.append('<p>ID#' + whiteTiger.id + ') Animal type: ' + whiteTiger.animal_type + ' Population total: ' + whiteTiger.skolko + '</p>');
  }
}

function workNow(){
  $.ajax({
    type: "GET",
    url: "/skolko",
    success: function(randomNum){
      population = randomNum(1,100);
    }
  });
}
