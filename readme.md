Run the server in development mode: npm run start:dev.
Run all unit-tests: npm test.
Run a single unit-test: npm test -- --testFile="name of test file" (i.e. --testFile=Users).
Check for linting errors: npm run lint.
Build the project for production: npm run build.
Run the production build: npm start.
Run production build with a different env file npm start -- --env="name of env file" (default is production).





/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:<password>@cluster0-kcedv.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/