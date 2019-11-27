const questionEl = document.getElementById("question");
const picEl = document.getElementById("questionPic");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const topAppBarElement = document.querySelector('.mdc-top-app-bar');

let inputEls = document.querySelectorAll('input');
let i = 0;
let interval = 0;
let count = 20;
let progress = 100;
let userGuess;

window.customElements.define('progress-ring', ProgressRing);

questionArr = [];
pics = [];

let newTimeIndicator = document.createElement("div");
newTimeIndicator.setAttribute("id", "time-indicator");
newTimeIndicator.setAttribute("style","position: relative;display: flex;justify-content: center;flex-direction: column");
let progressRing = document.createElement("progress-ring");
progressRing.setAttribute("stroke",4);
progressRing.setAttribute("radius",45);
progressRing.setAttribute("progress",100);
let spanEl = document.createElement("span");
spanEl.setAttribute("style","bottom: 55px;position: relative;left: 35px;color: antiquewhite;");
newTimeIndicator.appendChild(progressRing);
newTimeIndicator.appendChild(spanEl);
picEl.append(newTimeIndicator);

async function load() {
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
    for (let i = 0; i < questionArr.length; i++) {
      try {
        let googleUrl = 'https://www.googleapis.com//customsearch/v1?';
        googleUrl += 'key=AIzaSyD_tgpw_aI3elBJ3FQzH5kqi00Qep6jXxM';
        googleUrl += '&cx=016797827939605093875:zpsbjfzch8y';
        googleUrl += '&searchType=image&q=';
        googleUrl += questionArr[i].correct_answer;
        googleUrl += '+';
        googleUrl += questionArr[i].category;
        const picsResponse  = await getData(googleUrl);
        pics.push(picsResponse.items[0].link);
      } catch (error) {
          console.log(error);
      } 
    }
    localStorage.setItem("picData", JSON.stringify(pics));
  }
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
  return await response.json();
}

function start () {
  if (i < questionArr.length) {
    picEl.setAttribute(
      "style",
      `background: url(${pics[i]});background-size: cover;`
    );
    choicesEl.innerHTML = "";
    questionEl.textContent = questionArr[i].question;
    const choices = questionArr[i].incorrect_answers;
    choices.push(questionArr[i].correct_answer);
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
  } else {
    clearInterval(interval);
  }
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
    let answerChecked = false;
    inputEls.forEach((el,i)=>{
        const selectedEl = document.getElementById("checkbox-"+i);
        if(selectedEl.checked === true ) {
            userGuess = i
            answerChecked = true;
        }
    });
    if (answerChecked){
      if (document.getElementById('checkbox-'+userGuess).parentNode.parentNode.children[1].textContent === questionArr[i].correct_answer) {
        alert("Correct Answer!")
      } else {
        alert("Wrong!!!!!!!!!")
      }
    } else {
      alert("No answer checked!");
    }
}

function decrement() {
  if(count>0) {
    count--;
    newTimeIndicator.children[1].textContent = count;
    progress -= 5;
    progressRing.setAttribute('progress',progress);
  } else {
    count = 20;
    progress = 100;
    i++;
    start();
  }
}

document.addEventListener('scroll', function() {
    topAppBarElement.setAttribute('class','mdc-top-app-bar mdc-top-app-bar--short mdc-top-app-bar--short-collapsed');
    topAppBarElement.children[0].children[1].children[0].setAttribute('style','display: none');
    if(this.scrollingElement.scrollTop===0) {
        topAppBarElement.setAttribute('class','mdc-top-app-bar mdc-top-app-bar--short');
        topAppBarElement.children[0].children[1].children[0].setAttribute('style','display: inline-block');
    }
});
submitBtn.addEventListener("click", checkUserGuess);
async function run() {
  await load();
  start();
  interval = setInterval(decrement, 1000);
}
run();



