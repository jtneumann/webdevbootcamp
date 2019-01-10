var faker = require("faker");

// var randomProduct = faker.commerce.productName();
// var randomPrice = faker.commerce.price();

// for(var i = 0; )
// console.log()

// var randomName = faker.name.findName(); // Rowan Nikolaus
// var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// var randomCard = faker.helpers.createCard(); // random contact card containing many properties

// console.log(randomCard, randomEmail, randomName);

console.log("==================");
console.log("WELCOME TO MY SHOP");
console.log("==================")

for(var i = 0; i < 10; i++){
    console.log(faker.commerce.productName() + " - $" + faker.commerce.price());
}