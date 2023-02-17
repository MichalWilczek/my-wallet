/*
This module stores objects to operate on: 
    - general user data received from the server
    - options for income and expense settings
*/

export class UserData {
    incomeOptions = null;
    expenseOptions = null;
    paymentOptions = null

    constructor(userID, username, incomes, expenses) {
        this.userID = userID;
        this.username = username;
        this.incomes = incomes;
        this.expenses = expenses;
    }

    setIncomeOptions(incomeOptions) {
        this.incomeOptions = new Options("income-option", incomeOptions)
    }
    setExpenseOptions(expenseOptions) {
        this.expenseOptions = new Options("expense-option", expenseOptions);
    }
    setpaymentOptions(paymentOptions) {
        this.paymentOptions = new Options("payment-option", paymentOptions);
    }
}

export class Options {
    constructor(id, optionNames) {
        this.options = [];
        this.defaultOptions = ["other"];
        this.id = id;
        this.addOptions(optionNames);
    }
    addOption(optionName) {
        if (!this.defaultOptions.includes(optionName)) {
            this.options.push(optionName);
            this.options.sort();
        }
    }
    addOptions(optionNames) {
        for (let optionName of optionNames) {
            this.addOption(optionName);
        }
    }
    removeOption(optionName) {
        this.options = this.options.filter(
            existingOption => existingOption !== optionName
        );
    }
    createElement() {
        const selectObj = document.createElement("select");
        selectObj.name = "category";
        selectObj.id = `${this.id}-select`;
        selectObj.required = true;

        const baseOption = document.createElement("option");
        baseOption.value = this.id;
        baseOption.disabled = true;
        baseOption.selected = true;
        baseOption.innerText = `--- ${this.id} ---`;
        selectObj.append(baseOption);

        for (let option of this.options) {
            const newOption = document.createElement("option");
            newOption.value = option;
            newOption.innerText = option;
            selectObj.append(newOption);
        }
        for (let option of this.defaultOptions) {
            const newOption = document.createElement("option");
            newOption.value = option;
            newOption.innerText = option;
            selectObj.append(newOption);
        }
        return selectObj;
    }
}
