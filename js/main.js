const english = false;

let lang = "DE_DE";
let voice = "Deutsch Female";

if (english) {
    lang = "EN_US";
    voice = "US English Male";
}
    

const translator = new T2W(lang);

function getAvg(values) {
    return values.reduce(function (p, c) {
        return p + c;
    }) / values.length;
}


function makeTimeString(milliseconds) {
    return new Date(milliseconds).toISOString().substr(14, 9);
}

const stopWatch = {
    startedTime: null,
    interval: null,
    stoppedElapsed: null,

    updateDisplay: function() {
        $("#currentTime").html(makeTimeString(stopWatch.getTime()));
    },

    start: function() {
        stopWatch.stoppedElapsed = null;
        stopWatch.startedTime = new Date();
        stopWatch.interval = setInterval(stopWatch.updateDisplay, 77);
    },

    stop: function() {
        stopWatch.stoppedElapsed = stopWatch.getTime();
        clearInterval(stopWatch.interval);
    },
    
    getTime: function() {
        if (stopWatch.stoppedElapsed) {
            return stopWatch.stoppedElapsed;
        }
        if (!stopWatch.startedTime) {
            return 0;
        }
        
        return new Date().getTime() - stopWatch.startedTime.getTime();
    }
}


const game = {
    times: [],
    currentNumber: null,
    
    makeNewNumber: function() {
        game.currentNumber = Math.round(Math.random() * 100)
        if (Math.random() * 10 > 9) {
            game.currentNumber = Math.round(game.currentNumber * (2 + (Math.random() * 10)));
        }
    },
                                                                
    speakNumber: function() {
        responsiveVoice.speak(translator.toWords(game.currentNumber), voice);
    },
    
    completeRound: function() {
        stopWatch.stop();
        game.times.push(stopWatch.getTime());
        $("#averageTime").html("Average: " + makeTimeString(getAvg(game.times)));
    },
    
    checkAnswer: function() {
        if ($("#numberInput").val() && parseInt($("#numberInput").val()) == game.currentNumber) {
            $("#wrongText").hide();
            game.completeRound();
            game.newRound();
            return false;
        } else {
            $("#wrongText").show();
        }
        $("#numberInput").val("");
        
        return false;
    },
    
    showWord: function() {
        $("#word").html(translator.toWords(game.currentNumber));
    },
        
    newRound: function() {
        $("#numberInput").val("");
        stopWatch.stop();
        game.makeNewNumber();
        game.showWord();
        game.speakNumber();
        stopWatch.start();
    }
}
    


$(document).ready(function() {
    game.newRound();
    $("#gameInput").submit(function(e) {
        e.preventDefault();
        game.checkAnswer();
    });
});