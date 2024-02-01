async function loadData(){
    const response = await fetch('https://rgmaier.github.io/quiz/data.json');
    const data = await response.json();
    return data;
}

function daysSince(date) {
    const now = new Date();
    const pastDate = new Date(date);
    const timeDiff = now.getTime() - pastDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
}

function loadQuestion(data){
    if ('Medicine name' in data) {
        console.log(data["Medicine name"]);
        $("#question").text(data["Medicine name"]);
    } else {
        console.log(data["Name"]);
        $("#question").text(data["Name"]);
    }
}

function isRx(question_data){
    if('Medicine name' in question_data){
        return true;
    }
}

function addRxInfo(question_data){

    $('#rx_name').text(question_data["Medicine name"]);
    $('#rx_inn').text(question_data["INN"]);
    $('#rx_ta').text(question_data["Therapeutic area"]);
    $('#rx_company').text(question_data["Marketing authorization holder"]);
    $('#rx_link').attr("href", question_data["URL"]);
    $("#rx").removeClass("d-none");
}

function addPokeInfo(question_data){
    //Replacing the brackets and the ' in the types string
    var types = question_data["Types"];
    types = types.replace(/[\[\]']/g, "");

    $('#poke_img').attr("src", "https:"+question_data["Image URL"]);
    $('#poke_img').attr("alt", "Image of "+question_data["Name"]);
    $('#poke_no').text(question_data["Pokedex Number"]);
    $('#poke_name').text(question_data["Name"]);
    $('#poke_type').text(types);
    $('#poke_gen').text(question_data["Generation"]);
    $('#poke_link').attr("href", question_data["Link"]);
    $("#poke").removeClass("d-none");

}

function addResult(isCorrect){
    $('.result').removeClass("text-success");
    $('.result').removeClass("text-danger");

    if(isCorrect){
        $('.result').addClass("text-success");
        $('.result').text("Correct!");
    } else {
        $('.result').addClass("text-danger");
        $('.result').text("Wrong!");
    }
    
}



function newRound(){
    loadData().then(data => {
        gameData = data[daysSince("2024-02-01")][1][localStorage.getItem('qAnswered')];
        loadQuestion(gameData);
    });
}

//A function that increases the local storage variable qAnswered by 1
function increaseQAnswered(){
    console.log("increaseQAnswered");
    var qAnswered = localStorage.getItem('qAnswered');
    qAnswered = parseInt(qAnswered) + 1;
    localStorage.setItem('qAnswered', qAnswered);
}

function enoughPlayed(){
    var qAnswered = localStorage.getItem('qAnswered');
    if (qAnswered < 7){
        return true;
    } else {
        return false;
    }

}

function setQuestionTracker(){
    var qAnswered = localStorage.getItem('qAnswered');
    if (qAnswered === null) {
        localStorage.setItem('qAnswered', 0);
    }
}

//A function that sets the local storage variable points to 0 if it is null
function setPoints(){
    var points = localStorage.getItem('points');
    if (points === null) {
        localStorage.setItem('points', 0);
    }
}

//A function that increases the local storage variable points by 1
function increasePoints(){
    var points = localStorage.getItem('points');
    points = parseInt(points) + 1;
    localStorage.setItem('points', points);
}

//A function that sets the local storage variable lastPlayed to today's date
function lastPlayedToday(){
    var lastPlayed = localStorage.getItem('lastPlayed');
    var today = new Date().toISOString().slice(0, 10);
    if (lastPlayed === null) {
        lastPlayed = today;
        localStorage.setItem('lastPlayed', lastPlayed);
    } else if (lastPlayed != today) {
        lastPlayed = today;
        localStorage.setItem('lastPlayed', lastPlayed);
        localStorage.setItem('qAnswered', 0);
        localStorage.setItem('points', 0);
    }
}

function shareWith(){
    var shareText = "I just scored "+localStorage.getItem('points')+" out of 7 points in today's #RxOrPoke quiz! Can you beat me? https://rgmaier.github.io/quiz/";
    var encodedShareText = encodeURIComponent(shareText);

    var whatsappLink = "https://api.whatsapp.com/send?text="+encodedShareText;
    $('#shareWhatsapp').attr("href", whatsappLink);

    var telegramLink = "https://t.me/share/url?url=https://rgmaier.github.io/quiz/&text="+encodedShareText;
    $('#shareTelegram').attr("href", telegramLink);

    $('#copyToClipboard').click(function(){
        navigator.clipboard.writeText(shareText).then(function() {
            console.log('Copying to clipboard was successful!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    });
}
 
$(document).ready(function(){
    setQuestionTracker();
    setPoints();
    lastPlayedToday();

    $("#answer_poke").click(function(){
        $('#game').addClass("d-none");
        if(!isRx(gameData)){
            addResult(true);
            addPokeInfo(gameData);
            increasePoints();
        } else{
            addResult(false);
            addRxInfo(gameData);
        }
        increaseQAnswered();
        newRound();
    });
    
    $("#answer_rx").click(function(){
        $('#game').addClass("d-none");
        if(isRx(gameData)){
            addResult(true);
            addRxInfo(gameData);
            increasePoints();
        } else {
            addResult(false);
            addPokeInfo(gameData);
        }
        increaseQAnswered();
        newRound();
    });

    $(".nextQuestion").click(function(){
        $("#rx").addClass("d-none");
        $("#poke").addClass("d-none");
        if(enoughPlayed()){
            $("#game").removeClass("d-none");
            newRound();
        } else {
            $("#main").addClass("d-none");
            $("#game").addClass("d-none");
            $("#end").removeClass("d-none");
            shareWith();
        }
    });
    
    $("#letsgo button").click(function(){
        if(enoughPlayed()){
            newRound();
            $("#main").addClass("d-none");
            $("#game").removeClass("d-none");
        } else {
            $("#main").addClass("d-none");
            $("#game").addClass("d-none");
            $('#points').text(localStorage.getItem('points'));
            $("#end").removeClass("d-none");
            shareWith();
        }
    });
});