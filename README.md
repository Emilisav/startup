### Talkshow
[notes](./notes.md)
[startup](https://startup.talkshow.click)
[AWS](https://us-east-1.console.aws.amazon.com/console/home?region=us-east-1)

# Elavator Pitch
Have you ever found yourself at a loss for what to talk about, or just wanted to know how to get to know poeple? Well, fear not, this talkshow application will help you ask the questions that will make your conversation awesome! Talkshow will show a list of questions, allow you to add your own, as well as rate questions. You also might be able to record answers to questions for your future self to reminise. And all this is avaliabe on any internet connecting device!

# Key Features
- secure login over HTTPS
- question reccomendation
- question database
- ability to add questions
- rating for questions
- ability to store answers
- call Chat GTP's API to recommend questions

# Technology
I am going to use the required technologies in the following ways.

- __HTML__ - Uses correct HTML structure for application. Three HTML pages. One for login; one to display questions with the ability to rate, answer, and doesn't show questions recently viewed; and then one to show questions when not logged in with only the ability to see questions. Hyperlinks to choice artifact.
- __CSS__ - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- __JavaScript__ - Provides login, questions, ratings, and your answers.
- __Service__ - Backend service with endpoints for:
     - login
     - retrieving questions and ratings
     - submitting ratings
     - sumbitting and retriving answers
- __DB/Login__ - Store users, questions, answers, and ratings in database. Register and login users. Credentials securely stored in database. Can't rate or answer questions unless authenticated.
- __WebSocket__ - New questions will be broadcast to all users.
- __React__ - Application ported to use the React web framework.

# Design
The questions button will reload the questions. The stars will be clickable only when logged in. The A on the logged in screen will allow you to enter you answer. You can create a new question by clicking the plus.

![Login screen](https://github.com/Emilisav/startup/assets/144365339/b8dc2b7d-cb1a-46f6-9732-3b24b4b5ae52)
![Loggein screen](https://github.com/Emilisav/startup/assets/144365339/759ec4de-1b97-427e-a2f3-08bfa96ff308)
![Loggedout Questions](https://github.com/Emilisav/startup/assets/144365339/bd5b3081-ac8e-44ad-b61c-955ec83b18f4)

[Figma design](https://www.figma.com/file/Fg6VrxrCSE1NohcuVY39gn/Talkshow?type=design&node-id=0%3A1&mode=design&t=OaUyk8pHjRbHTPUX-1)

# HTML deliverable
For this deliverable I built out the structure of my application using HTML.

- __HTML__ has two pages for authentication and for the questions.
- __HTML tags__ used different tags including BODY, NAV, MAIN, HEADER, and FOOTER.
- __Links__ if user wants to go back to login
- __Textual content__ Has where it shows top questions
- __3rd party service calls__ Calls chatGPT for help making questions.
- __Images__ Shows a thumbs up image to encourage users.
- __Login__ On login page, shows user name at the top of the questions page
- __Database__ Questions and rating stored stored in the database
- __WebSocket__ Shows new questions at bottom of questions page

# CSS delivarables

☑ - done **Prerequisite**: Simon CSS is deployed to [simon.talkshow.click](https://simon.talkshow.click/)

☑ - done **Prerequisite**: A link to this GitHub startup repository is displayed at the bottom left of my application's home page
☑ - done **Prerequisite**: These notes in this startup Git repository README.md file documenting what I modified and added with this deliverable
☑ - done **Prerequisite**: At least 10 git commits spread consistently throughout the assignment period.
☑ - done Properly styled CSS
      - 30% Header, footer, and main content body is present
      - 20% Navigation elements is present
      - 10% Responsive to window resizing is present
      - 20% Application accordion is present 
      - 10% Application text content showing questions are present
      - 10% Application image is present in title and web page
