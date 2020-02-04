# Todolist-App

### Installation
1. Import "todolist.sql" to Database.
2. Configure Database in "database/DB.js".
~~~
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : ''
});
~~~
3. 
~~~sh
npm install
node app
~~~

4. will serve at http://localhost:8000/
