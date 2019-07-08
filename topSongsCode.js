var mysql = require("dotenv/config");
var mysql = require("mysql");
var inquirer = require("inquirer");
var fs = require("fs");

// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
// console.log(process.env.MYSQL_SB_PW);

var connection = mysql.createConnection({
  port: 3306,
  host: process.env.MYSQL_SB_HOST,
  user: process.env.MYSQL_SB_USER,
  password: process.env.MYSQL_SB_PW,
  database: "top_songs"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Find songs by artist",
        "Find all artists who appear more than once",
        "Find data within a specific range",
        "Search for a specific song",
        "exit"
      ]
    })
    .then(function (answer) {
      console.log('\033[2J');
      switch (answer.action) {
        case "Find songs by artist":
          sql = fs.readFileSync("./database_structure/artistSearch.sql").toString();
          // console.log(sql);
          artistSearch(sql);
          break;

        case "Find all artists who appear more than once":
          sql = fs.readFileSync("./database_structure/multiSearch.sql").toString();
          multiSearch(sql);
          break;

        case "Find data within a specific range":
          sql = fs.readFileSync("./database_structure/rangeSearch.sql").toString();
          rangeSearch(sql);
          break;

        case "Search for a specific song":
          sql = fs.readFileSync("./database_structure/songSearch.sql").toString();
          songSearch(sql);
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function artistSearch(query) {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function (answer) {
      // var query = "SELECT position, artist, song, year FROM top5000 WHERE artist LIKE ?";

      connection.query(query, ["%" + answer.artist + "%"], function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " + res[i].position +
            " || Artist: " + res[i].artist +
            " || Song: " + res[i].song +
            " || Year: " + res[i].year
          );
        }
        runSearch();
      });
    });
}

function multiSearch(query) {
  // var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    runSearch();
  });
}

function rangeSearch(query) {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      // var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " + res[i].position +
            " || Song: " + res[i].song +
            " || Artist: " + res[i].artist +
            " || Year: " + res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function (answer) {
      console.log(answer.song);
      connection.query(
        "SELECT * FROM top5000 WHERE song LIKE ?",
        "%" + answer.song + "%",
        function (err, res) {
          if (err) throw err;
          console.log(
            "Position: " + res[0].position +
            " || Song: " + res[0].song +
            " || Artist: " + res[0].artist +
            " || Year: " + res[0].year
          );
          runSearch();
        }
      );
    });
}
