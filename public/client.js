const QUESTIONS = [
  'In your career thus far, what has been your favorite job and least favorite job and why?',
  'What do you hope to be doing professionally five years from now?',
  `Imagine that you work at a home repair company. You recently visited a homeowner and gave them a proposal for $5,000 in repairs to fix a broken outdoor staircase ($1,000), fix a storm drain ($500) and install storm windows for the living room ($3,500).<br><br>You receive the below email from the client later. Please write your reply below:<br><br><i>Hey! Thanks for coming by earlier. I'm interested in having your home repair company give my house some touch-ups, but I just can't afford the $5,000 right now. I'll be back in touch in six months when I'm done with car payments and can discuss it then. Have a great day! - Doris</i>`,
  'Imagine that you are hired to work at a home repair company. Please describe how you would go about generating customers for your new company.',
  'What is a CRM? What are the greatest benefits of using a CRM?',
];

const QUESTION_TEMPLATE = document.getElementById('question-template');
const FINAL_TEMPLATE = document.getElementById('final-template');
const START_BUTTON = document.getElementById('start-button');
const EMAIL_INPUT = document.getElementById('email-input');
const MAIN = document.getElementsByTagName('main')[0];

class App {
  constructor(pages, startPageIndex=0) {
    this.currentPageIndex = startPageIndex;
    this.pages = pages;
    this.responses = [];
  }

  setEmail(email) {
    this.email = email;
  }

  appendResponse(responseValue) {
    this.responses.push(responseValue);
  }

  goToNextPage() {
    MAIN.innerHTML = '';
    MAIN.appendChild(this.pages[this.currentPageIndex].node);
    if (this.currentPageIndex == this.pages.length - 1) {
      this.validateAndSubmitResponse()
    }
    this.currentPageIndex++;
  }

  isResponseValid() {
    return true; // TODO :)
  }

  validateAndSubmitResponse() {
    if (this.isResponseValid()) {
      const method = 'POST';
      const body = JSON.stringify({
        responses: this.responses,
        email: this.email
      })
      const headers = {
        'Content-Type': 'application/json'
      }
      fetch('/submit', {
        method,
        body,
        headers
      })
    }
  }
}

class Page {
  constructor(node) {
    this.node = node;
  }
}

function createQuestionHtmlString(index) {
  const node = document.importNode(QUESTION_TEMPLATE.content, true);
  const label = node.querySelector('label');
  label.innerHTML = `${index+1}. ${QUESTIONS[index]}`;
  const submitButton = node.querySelector('button');
  submitButton.addEventListener('click', onProceedClick);
  return node;
}

function createFinalHtmlString() {
  const node = document.importNode(FINAL_TEMPLATE.content, true);
  return node;
}

function onProceedClick() {
  const responseTextarea = document.getElementById('response');
  const responseValue = responseTextarea.value;
  if (responseValue.length > 0) {
    APP.appendResponse(responseValue)
    APP.goToNextPage();
  }
  else {
    // Report error
  }
}

const PAGES = [
  new Page(createQuestionHtmlString(0)),
  new Page(createQuestionHtmlString(1)),
  new Page(createQuestionHtmlString(2)),
  new Page(createQuestionHtmlString(3)),
  new Page(createQuestionHtmlString(4)),
  new Page(createFinalHtmlString())
]

const APP = new App(PAGES)

START_BUTTON.addEventListener('click', () => {
  const email = EMAIL_INPUT.value;
  if (email && email.length > 0) {
    APP.setEmail(email);
    APP.goToNextPage();
  }
});

