var HTMLBuilder = require("./generateHTML");
var inquirer = require("inquirer");
var axios = require('axios');
var htmlToPdf = require('html-pdf');

const questions = [
  {
    type: "input",
    message: "What´s your Github username?",
    name: "username" 
  },
  {
    type: "list",
    message: "What is your favorite color?",
    name: "colors",
    choices: [
      "blue", 
      "red",  
      "green"
    ]
  }
];

const htmlData = {
  color: "",
  profile: {}
};

function writeToFile(data) {
  const html = new HTMLBuilder().generateHTML(data);
  htmlToPdf.create(html).toFile('./profile.pdf', function(err, res) {
    if (err) return console.log(err);
    
    console.log("GitHub resume created!");
    console.log("---------------------");
    console.log(`File: ${res.filename}`);
    console.log("---------------------");
    console.log("Thank you!"); 
  });
}

function inquiryUser() {
  inquirer.prompt(questions).then(function(answers) {     
    htmlData.color = answers.colors;   
    callGithubUserAPI(answers.username);
    
  }).catch(function (err) {
    console.log(err);
  });
}

function callGithubUserAPI(username) {
  if (username === "") throw new Error("The 'username' cannot be empty");

  const queryUrl = `https://api.github.com/users/${username}`;

  axios.get(queryUrl).then(function (res) {     
    htmlData.profile = res.data;
    writeToFile(htmlData);
  
  }).catch(function (err) {
    const response = err.response;
    
    if(response.status === 404) {
      console.log(`User '${username}' not found!`);
    } else {
      console.log(response.status +" - "+ response.statusText);
    }   
  });
}

function init() {
  inquiryUser();
}

init();