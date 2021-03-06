## Quizzer

Final MVP for Bitmaker's course consisting of a real-time classroom quiz application based on Angular.js (v1.2.25), Ruby on Rails and Firebase. 

The inital list of features is as follows:

* Should be a one-page application

* Quiz creators should be able to create a quiz

* Quizzes can have many multiple choice questions

* Questions can have many options

* When a quiz is created, users can "check in" to a quiz using their email address (no password required)

* The quiz should show, in real-time, how many users are checked in to the quiz

* Once the users are checked in, the quiz can begin

* Each question can be "opened" for a set time (i.e. 3 minutes), whereby users will be able to answer the question

* After the open time, a question is marked as closed and can no longer be answered

* After a question is closed, an immediate visualization of the result should be shown

Being an MVP, my focus was on adherence to Angular best practices rather than feature cover. For instance, services are used to model data instead of direct manipulation of $scope, and factories amount to interfaces for interaction with Firebase or RoR.
