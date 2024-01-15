### Talkshow
[notes](./notes.md)

# Elavator Pitch
Have you ever found yourself at a loss for what to talk about, or just wanted to know how to get to know poeple? Well, fear not, this talkshow application will help you ask the questions that will make your conversation awesome! Talkshow will show a list of questions, allow you to add your own, as well as rate questions. You can also record answers to questions for your future self to reminise. And all this will be avaliabe on any internet connectign device!

# Key Features
- secure login over HTTPS
- question reccomendation
- question database
- ability to add questions
- rating for questions
- ability to store answers

# Technology
I am going to use the required technologies in the following ways.

- *HTML* - Uses correct HTML structure for application. Two HTML pages. One for login and one for voting. Hyperlinks to choice artifact.
- *CSS* - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- *JavaScript* - Provides login, choice display, applying votes, display other users votes, backend endpoint calls.
- Service - Backend service with endpoints for:
     - login
     - retrieving choices
     - submitting votes
     - retrieving vote status
- DB/Login - Store users, choices, and votes in database. Register and login users. Credentials securely stored in database. Can't vote unless authenticated.
- WebSocket - As each user votes, their votes are broadcast to all other users.
- React - Application ported to use the React web framework.

# Design
[Figma design](https://www.figma.com/file/Fg6VrxrCSE1NohcuVY39gn/Untitled?type=design&node-id=1-5&mode=design&t=WDWrVrNgyetLNyEq-0)

