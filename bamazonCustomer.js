var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
  showTable();
});

var showTable = function() {
	connection.query('SELECT * FROM products', function (err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].itemId + ' | ' + res[i].productName + ' | ' + res[i].departmentName + ' | ' + res[i].price + ' | ' + res[i].stockQuantity + '\n');
		}
	promptCustomer(res);
	})
}

var promptCustomer = function(res) {
	inquirer.prompt ([{
		type: 'input',
		name: 'choice',
		message: 'Welcome to Bamazon! What would like to buy?'
	}]).then(function(answer) {
		var correct = false;
		for (i = 0; i < res.length; i++) {
			if (answer.choice == res[i].productName) {
				var correct = true;
				var product = answer.choice;
				var id = i;
				inquirer.prompt ([{
					type: 'input',
					name: 'quantity',
					message: 'How many would you like to purchase?',
					validate: function (value) {
						if (isNaN(value) == false) {
							return true;
						} else {
							return false;
						}
					}
				}]).then(function(answer) {
					if ((res[id].stockQuantity - answer.quantity) > 0) {
						connection.query("UPDATE products SET stockQuantity =' "+(res[id].stockQuantity - answer.quantity)+"' WHERE productName ='" + product + "'", function (err, res2) {
							console.log('Item(s) purchased!');
							showTable();
						})
					
					} else {
						console.log('Not a valid selection.');
						promptCustomer(res);
					}
				})
			}
		}
	})
}