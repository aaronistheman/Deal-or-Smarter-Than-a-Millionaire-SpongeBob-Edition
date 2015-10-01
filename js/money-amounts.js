"use strict";

/*
    Author: Aaron Kaloti
    Release number: 0.1
*/

/*
    @returns an array of instances of MoneyAmount; each instance
    represents a value of one the briefcases in the game
*/
function getBeginningMoneyAmounts() {
    var moneyAmounts = [];

    moneyAmounts.push(new MoneyAmount(0.01));
    moneyAmounts.push(new MoneyAmount(50));
    moneyAmounts.push(new MoneyAmount(300));
    moneyAmounts.push(new MoneyAmount(750));
    moneyAmounts.push(new MoneyAmount(1000));
    moneyAmounts.push(new MoneyAmount(10000));
    moneyAmounts.push(new MoneyAmount(25000));
    moneyAmounts.push(new MoneyAmount(100000));
    moneyAmounts.push(new MoneyAmount(250000));
    moneyAmounts.push(new MoneyAmount(500000));

    return moneyAmounts;
}