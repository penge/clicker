"use strict";

$(function() {
});

var UI = (function() {
  function init() {
    reset();
    updateHighscore(0);
    $('#score, #play').show();
    startGameOnLinkClick();
  }
  
  function reset() {
    $('.text').hide();
    $('.circle').stop().remove();
    updateScore(0);
  }

  function startGameOnLinkClick() {
    $('.link').click(function() {
      reset();
      $('#score, #highscore').show();
      $(this).hide();
    });
  }

  function over() {
    $('#over, #replay').show();
  }

  function updateScore(score) {
    $('#score').text(score);
  }
  
  function updateHighscore(highscore) {
    $('#highscore').text("HIGH = " + highscore);
  }

  return {
    init:            init,
    over:            over,
    updateScore:     updateScore,
    updateHighscore: updateHighscore,
  }
})();
