const questionEl = document.getElementById("question");
const picEl = document.getElementById("questionPic");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const topAppBarElement = document.querySelector('.mdc-top-app-bar');

let inputEls = document.querySelectorAll('input');
let userGuess;

questionArr = [];
pics = [];

async function start() {
  if (localStorage.getItem("questionData") && localStorage.getItem("picData")) {
    questionArr = JSON.parse(localStorage.getItem("questionData"));
    pics = JSON.parse(localStorage.getItem("picData"));
  } else {
    try {
      const data = await getData(
        "https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple"
      );
      questionArr = data.results;
      localStorage.setItem("questionData", JSON.stringify(questionArr));
    } catch (error) {
      console.error(error);
    }
    try {
        let googleUrl = 'https://www.googleapis.com//customsearch/v1?key=';
        googleUrl += process.env.GOOGLE_KEY;
        googleUrl += '&cx=016797827939605093875:zpsbjfzch8y';
        googleUrl += '&searchType=image&q=';
        googleUrl += questionArr[0].correct_answer;
        googleUrl += '+';
        googleUrl += questionArr[0].category;
        const picsResponse  = await getData(googleUrl);
        pics = picsResponse.items;
        localStorage.setItem("picData", JSON.stringify(pics));
        console.log(pics);
    } catch (error) {
        console.log(error);
    }
  }
  picEl.setAttribute(
    "style",
    `background: url(${pics[0].link});background-size: cover;`
  );
  questionEl.textContent = questionArr[0].question;
  const choices = questionArr[0].incorrect_answers;
  choices.push(questionArr[0].correct_answer);
  for (let i = 0; i < choices.length; i++) {
      let checkboxDiv = document.createElement('div');
      checkboxDiv.setAttribute('class','mdc-checkbox');
      let checkboxInput = document.createElement('input');
      checkboxInput.setAttribute('type',"checkbox")
      checkboxInput.setAttribute('class', "mdc-checkbox__native-control")
      checkboxInput.setAttribute("id","checkbox-"+i);
      checkboxInput.addEventListener("click", uncheckOtherInputs);
      let checkbox = document.createElement('div');
      checkbox.setAttribute("class", "mdc-checkbox__background");
      let checkboxSvg = document.createElement('svg');
      checkboxSvg.setAttribute("class", "mdc-checkbox__checkmark");
      checkboxSvg.setAttribute("viewBox", "0 0 24 24");
      let checkboxPath = document.createElement("path");
      checkboxPath.setAttribute("class", "mdc-checkbox__checkmark-path")
      checkboxPath.setAttribute("fill","none")
      checkboxPath.setAttribute("d","M1.73,12.91 8.1,19.28 22.79,4.59");
      checkboxSvg.append(checkboxPath);
      let mixedmarkDiv = document.createElement('div');
      mixedmarkDiv.setAttribute("class","mdc-checkbox__mixedmark");
      checkbox.append(checkboxSvg,mixedmarkDiv);
      let checkboxRipple = document.createElement('div');
      checkboxRipple.setAttribute("class","mdc-checkbox__ripple");
      checkboxDiv.append(checkboxInput,checkbox,checkboxRipple);
      let checkboxLabel = document.createElement('label');
      checkboxLabel.setAttribute("for","checkbox-"+i);
      checkboxLabel.textContent = choices[i];
      let checkboxForm = document.createElement('div');
      checkboxForm.setAttribute("class","mdc-form-field");
      checkboxForm.append(checkboxDiv,checkboxLabel);
      choicesEl.append(checkboxForm);
  }
  inputEls = document.querySelectorAll('input');
}

async function getData(url = "", cors = 'cors') {
  const response = await fetch(url, {
    method: "GET",
    mode: cors,
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "no-referrer",
  });
  console.log(response);
  return await response.json();
}

function uncheckOtherInputs(event) {
    const id = parseInt(event.target.id.split('-')[1]);
    inputEls.forEach((el,i)=>{
        if(id !== i) {
            const selectedEl = document.getElementById("checkbox-"+i);
            selectedEl.checked = false;
        }
    });
}

function checkUserGuess() {
    inputEls.forEach((el,i)=>{
        const selectedEl = document.getElementById("checkbox-"+i);
        if(selectedEl.checked === true ) {
            userGuess = i
        }
    });
    console.log(userGuess);
}

submitBtn.addEventListener("click", checkUserGuess);
start();



