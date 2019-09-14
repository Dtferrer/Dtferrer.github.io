var mysql = require("mysql");
var inquirer = require("inquirer");

var choiceArray = [];
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "ValkA@21",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
//   start();
  bidAuction();
});



function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log(results)
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "input",
          message: "What would you like to buy? Type in the Item_ID"
        },
        {
          name: "amount",
          type: "input",
          message: "How much would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id == answer.choice) {
            chosenItem = results[i];
          }
        }

        if (chosenItem.stock_quantity >= answer.amount) {
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: (chosenItem.stock_quantity - answer.amount)
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("You successfully ordered your item(s)! The total cost is " + (chosenItem.stock_quantity * chosenItem.price))
                    connection.end();
                }
            );
        }
        else {
            console.log("Sorry, Bamazon does not have enough of your desired purchase.");
            connection.end();
        };  
      });
  });
}
