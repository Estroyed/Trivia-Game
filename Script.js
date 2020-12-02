let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function.
let urlHelper = [];
var score = 0;
var life = 3;

// this function let the elements in your html to load first.
$(document).ready(function () {
  // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
  // please note that in order to operate the function, in your html there should be a select element that hold the id categories.
  getCategories($("#categories"));
  var StartButton = document
    .getElementById("Start")
    .addEventListener("click", () => {
      getQuestion();
      start();
    });
});

async function start() {
  // questionsArray is the global array that recive the questions from the mock DB function named getQuestion
  // getQuestion USAGE: returns an array of questions, recives (amount, category , difficulty,type) all of the function parameters should be sent as a string!
  // amount = the number of questions you want to recive
  // category = the category of the questions 9-32
  // difficulty = easy, medium, hard
  // type = multiple , boolean
  // getQuestion is an async function. in order to use it you have to use the keyword await.
  var userCatSelection = document.getElementById("categories").value; //store the value of the slected category.

  var difficulty = document.getElementById("difficulty").value; //store the value of the selected level.

  var type = document.getElementById("type").value; //store the value of the slected type.

  var amount = document.getElementById("trivia_amount").value; //store the value of the slected amount  .

  questionsArray = await getQuestion(
    amount,
    userCatSelection,
    difficulty,
    type
  );
  //console.log(Object.entries(questionsArray));

  var myobj = document.getElementById("mainSelect");
  myobj.remove(); //removes the first "window" of the interface.

  var i = 0; //question index

  showGame(i, type, amount); //function to show the core of the game (Q&A).
}

function showGame(i, type, amount) {
  document.getElementById("container").className = "btn-center";

  document.getElementById("question").innerHTML =
    "Question : </br>" + questionsArray[i]['question']; //display the question

  if (questionsArray[i].type == "boolean") {
    //Check if the type selected by the user  if true => makes 2 buttons  if false make 4
    var correctAns = document.createElement("button"); //create first button
    correctAns.id = "correctAns";
    correctAns.className = "btn";
    correctAns.innerHTML = "True"; //the disply value for this button .
    correctAns.value = "True"; //set value for this button
    document.getElementById("answer-buttons").appendChild(correctAns).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = ""; //delete the prev buttons
      check(i, correctAns.value, type, amount);
      //check if the value of this button is the right answer if it is the score goes up 
      //if not you will lose one heart

    });


    var wrongAns = document.createElement("button"); //create second button
    correctAns.id = "correctAns";
    wrongAns.id = "wrongAns";
    wrongAns.className = "btn";
    wrongAns.innerHTML = "False"; //the disply value for this button 
    wrongAns.value = "False"; //set value for this button



    document.getElementById("answer-buttons").appendChild(wrongAns).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = "";
      check(i, wrongAns.value, type, amount);

    });

  } else {

    var ans1 = document.createElement("button");
    ans1.id = "ans1";
    ans1.className = "btn";
    ans1.value = questionsArray[i].incorrect_answers[0]; //get the value from the obj  and store it here
    document.getElementById("answer-buttons").appendChild(ans1).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = "";
      check(i, ans1.value, type, amount); //same as the first 2
    });
    document.getElementById("ans1").innerHTML =
      questionsArray[i].incorrect_answers[0];


    var ans2 = document.createElement("button");
    ans2.id = "ans2";
    ans2.className = "btn";
    ans2.value = questionsArray[i].incorrect_answers[1];
    document.getElementById("answer-buttons").appendChild(ans2).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = "";
      check(i, ans2.value, type, amount);
    });
    document.getElementById("ans2").innerHTML =
      questionsArray[i].incorrect_answers[1];


    var ans3 = document.createElement("button");
    ans3.id = "ans3";
    ans3.className = "btn";
    ans3.value = questionsArray[i].incorrect_answers[2];
    document.getElementById("answer-buttons").appendChild(ans3).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = "";
      check(i, ans3.value, type, amount);
    });
    document.getElementById("ans3").innerHTML =
      questionsArray[i].incorrect_answers[2];


    var ans4 = document.createElement("button");
    ans4.id = "ans4";
    ans4.className = "btn";
    ans4.value = questionsArray[i].correct_answer;
    document.getElementById("answer-buttons").appendChild(ans4).addEventListener("click", () => {
      document.getElementById("answer-buttons").innerHTML = "";
      check(i, ans4.value, type, amount);
    });
    document.getElementById("ans4").innerHTML =
      questionsArray[i].correct_answer;

  }
}

function check(i, value, type, amount) { //check if the value of this button is the right answer

  if (value == questionsArray[i].correct_answer) {
    score += 10;
    document.getElementById("score").innerHTML = "Your score is :" + score;
  } else {

    life--; //if not you will lose one heart .
    if (life == 2) {
      document.getElementById("mistakes").innerHTML = "Life:" + "&#10084; &#10084;";
    }
    if (life == 1) {

      document.getElementById("mistakes").innerHTML = "Life:" + "&#10084;";
    }

    if (life == 0) { //game over.


      document.getElementById("mistakes").innerHTML = "Life: 0";
      window.alert("Game Over");


    }

  }

  if (amount != i + 1 && life != 0) {
    //checks if you're out of Questions if not the index go up by 1 if you're display that was the last Question
    console.log("amount is" + amount);
    i++
    console.log("index is" + i);
    showGame(i, type, amount);

  } else {
    i = amount;
    console.log("index is noww" + i);
    //window.alert("No more Questions");

  }
}


// Mock DB functions you should not edit!

function getCategories(select) {
  $.ajax({
    url: "https://opentdb.com/api_category.php",
    context: document.body,
  }).done(function (data) {
    categories = data.trivia_categories;
    for (i in categories) {
      let cat = categories[i];
      let option = "<option value=" + cat.id + ">" + cat.name + "</option>";
      select.append(option);
    }
  });
}

function editUrl(amount, category, difficulty, type) {
  urlHelper["amount"] = "amount=" + amount;
  urlHelper["category"] = "category=" + category;
  urlHelper["difficulty"] = "difficulty=" + difficulty;
  urlHelper["type"] = "type=" + type;
}

async function getQuestion(amount, category, difficulty, type) {
  editUrl(amount, category, difficulty, type);
  var arr = [];
  var url =
    "https://opentdb.com/api.php?" +
    urlHelper.amount +
    "&" +
    urlHelper.category +
    "&" +
    urlHelper.difficulty +
    "&" +
    urlHelper.type;

  var res = await fetch(url);
  var data = await res.json();
  return data.results;
}