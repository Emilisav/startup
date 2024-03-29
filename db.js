const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

const db = client.db("startup");
const userCollection = db.collection("user");
const questionCollection = db.collection("question");

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(
    `Unable to connect to database with ${url} because ${ex.message}`
  );
  process.exit(1);
});

function getUser(name) {
  return userCollection.findOne({ name: name });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(name, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    name: name,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

function addQuestion(score) {
  questionCollection.insertOne(score);
}

function getQuestions() {
  const cursor = questionCollection.find();
  
  return cursor.toArray();
}

async function incStar(question) {
  let el = await questionCollection.findOne({ question: question });

  if (el) {
    el.stars++;

    questionCollection.replaceOne({ question: question }, el);
  }
  return getQuestions();
}

async function decStar(question) {
  let el = await questionCollection.findOne({ question: question });
  if (el) {
    el.stars--;

    questionCollection.replaceOne({ question: question }, el);
  }
  return getQuestions();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addQuestion,
  getQuestions,
  incStar,
  decStar,
};
