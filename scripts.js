$(function() {
  'use strict';

  GAME.init();
});

var UI = (function() {
  'use strict';

  var overSound = new Audio('over.mp3');
  var hitSound = new Audio('hit.mp3');
  
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
      GAME.start();
    });
  }

  function hit(circle) {
    hitSound.play();
    $(circle).stop().remove();
  }

  function over() {
    overSound.play();
    $('#over, #replay').show();
  }

  function updateScore(score) {
    $('#score').text(score);
  }
  
  function updateHighscore(highscore) {
    $('#highscore').text('HIGH = ' + highscore);
  }

  return {
    init:            init,
    hit:             hit,
    over:            over,
    updateScore:     updateScore,
    updateHighscore: updateHighscore,
  }
})();

var GAME = (function(UI) {
  'use strict';

  var //var
    _id        = 0,
    _score     = 0,
    _highscore = 0,
    _circles   = 0,
    _timeout   = 0,
    _over      = true;
   
  function init() {
    reset();
    UI.init();
  }

  function reset() {
    _score   = 0;
    _circles = 0;
    _timeout = 5000;
    _over    = true;
  }

  function incrementScore() {
    ++_score;
  }

  function updateHighscore() {
    _highscore = (_score > _highscore) ? _score : _highscore;
  }

  function canContinue(gameId) {
    return !_over && (_id == gameId);
  }

  function over() {
    addManyCircles(_id);
    reset();
    UI.over();
  }

  function addManyCircles(gameId) {
    for (var i = 0; i < 50; i++) {
      addCircle(gameId);
    }
  }

  function start() {
    ++_id;
    _over = false;
    keepAddingCircles(_id);
  }

  function keepAddingCircles(gameId) {
    if (!canContinue(gameId)) {
      return false;
    }

    addCircle(gameId);
    upSpeed();
    upDifficulty(gameId);
    setTimeout(function() {
      keepAddingCircles(gameId);
    }, _timeout);
  }

  function addCircle(gameId) {
    if (!canContinue(gameId)) {
      return false;
    }
    
    var //var
      id       = ++_circles,
      diameter = 180,
      top      = getRandom(20, $(document.body).height() - diameter),
      left     = getRandom(20, $(document.body).width() - diameter); 

    $('<div/>', {
      id: id,
      class: 'circle',
      css: {
        top:    top,
        left:   left,
        height: diameter,
        width:  diameter
      },
      click: function() {
        if (!canContinue(gameId)) {
          return false;
        }
        hitCircle(this);
      }
    }).appendTo(document.body).animate({
      left:   '+=' + diameter / 2,
      top:    '+=' + diameter / 2,
      width:  0,
      height: 0
    }, {
      duration: 5000,
      easing: 'easeOutQuad',
      step: function(now, fx) {
        fx.now = parseInt(now);
      },
      complete: function() {
        if (canContinue(gameId)) {
          over();
        }
      }
    });
  }

  function hitCircle(circle) {
    incrementScore();
    updateHighscore();
    
    UI.hit(circle);
    UI.updateScore(_score);
    UI.updateHighscore(_highscore);
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function upSpeed() {
    // Increase speed by decreasing timeout and do it every 2nd circle hit
    if (_timeout > 1000 && _circles % 2 === 0) {
      _timeout -= 100;
    }
  }

  function upDifficulty(gameId) {
    // Every 2nd circle, wait 2 seconds, and add another circle
    if (_circles % 2 === 0) {
      setTimeout(function() {
        addCircle(gameId);
      }, 2000);
    }
    
    // Every 5th circle, wait 4 seconds, and add another circle
    if (_circles % 5 === 0) {
      setTimeout(function() {
        addCircle(gameId);
      }, 4000);
    }
    
    // Every 8th circle, wait 5 seconds, and start adding circles more often
    if (_circles % 8 === 0) {
      setTimeout(keepAddingCircles(gameId), 5000);
    }
  }

  return {
    init:  init,
    over:  over,
    start: start,
  } 
})(UI);
