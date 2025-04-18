const { MongoClient } = require("mongodb");
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
  try {
    return userCollection.findOne({ name: name });
  } catch (error) {
    console.log(error);
  }
}

function getUserByToken(token) {
  try {
    return userCollection.findOne({ token: token });
  } catch (error) {
    console.log(error);
  }
}

async function createUser(name, password) {
  try {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      name: name,
      password: passwordHash,
      token: uuid.v4(),
    };
    await userCollection.insertOne(user);

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(user) {
  try {
    await userCollection.updateOne({ name: user.name }, { $set: user });
  } catch (error) {
    console.log(error);
  }
}

function addQuestion(score) {
  try {
    questionCollection.insertOne(score);
  } catch (error) {
    console.log(error);
  }
}

function getQuestions() {
  try {
    const cursor = questionCollection.find();

    return cursor.toArray();
  } catch (error) {
    console.log(error);
  }
}

async function incStar(question) {
  try {
    let el = await questionCollection.findOne({ question: question });

    if (el) {
      el.stars++;

      questionCollection.replaceOne({ question: question }, el);
    }
    return getQuestions();
  } catch (error) {
    console.log(error);
  }
}

async function decStar(question) {
  try {
    let el = await questionCollection.findOne({ question: question });
    if (el) {
      el.stars--;

      questionCollection.replaceOne({ question: question }, el);
    }
    return getQuestions();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUser,
  getUserByToken,
  updateUser,
  createUser,
  addQuestion,
  getQuestions,
  incStar,
  decStar,
};
