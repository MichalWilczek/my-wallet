/*
This module stores objects to operate on: 
    - general user data received from the server
    - options for income and expense settings
*/
export {getUserData, readUserDataFromAPI, UserData, Options}


const getUserData = async () => {
    try {
        const res = await axios.post("/my-wallet/src/server/login.php", {});
        const dictAPI = res.data;
        const userData = new UserData(
            dictAPI.id,
            dictAPI.userName,
            dictAPI.userData.incomeData.incomes,
            dictAPI.userData.expenseData.expenses,
            dictAPI.userData.incomeData.incomeOptions,
            dictAPI.userData.expenseData.expenseOptions,
            dictAPI.userData.expenseData.paymentOptions
        );
        return userData;
    } catch (e) {
        console.log(
            "Unexpected error occured while querying data of the logged in user from server."
        );
        console.log("Error: ", e);
    }
}

class UserData {

    constructor(
        userID, 
        username, 
        incomes=[], 
        expenses=[],
        incomeOptions=new Options("income-option", []),
        expenseOptions=new Options("expense-option", []),
        paymentOptions=new Options("payment-option", [])
    ) {
        this.userID = userID;
        this.username = username;
        this.incomeOptions = incomeOptions;
        this.expenseOptions = expenseOptions;
        this.paymentOptions = paymentOptions;
        this.incomes = this._aggregateTransactionData(incomes);
        this.expenses = this._aggregateTransactionData(expenses);
    }

    _aggregateTransactionData(transactions) {
        const transactionData = [];
        for (const [_, element] of Object.entries(transactions)) {
            const transactionRow = [];
            for (const [count, value] of Object.entries(element)) {
                transactionRow[count] = value;
            }
            transactionData.push(transactionRow);
        }
        return transactionData;
    }

    setIncomeOptions(incomeOptions) {
        this.incomeOptions = new Options("income-option", incomeOptions)
    }
    setExpenseOptions(expenseOptions) {
        this.expenseOptions = new Options("expense-option", expenseOptions);
    }
    setPaymentOptions(paymentOptions) {
        this.paymentOptions = new Options("payment-option", paymentOptions);
    }

    showIncomes() {
        const mainDiv = document.createElement("div");

        // Initialize the empty data set
        const incomesToShow = [];
        for (incomeOption of this.incomeOptions) {
            incomesToShow[incomeOption] = [];
        }
        // Assign incomes to specific categories
        for (income of this.incomes) {
            let incomeCategory = income.category;
            delete income.category;
            incomesToShow[incomeCategory] = income;
        }
       
        const table = document.createElement("table");
        
        // TODO: Create table with assigned incomes!
        const tbl = document.createElement('table');
        for (let i = 0; i < 3; i++) {
            const tr = tbl.insertRow();
            for (let j = 0; j < 2; j++) {
              if (i === 2 && j === 1) {
                break;
              } else {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(`Cell I${i}/J${j}`));
                td.style.border = '1px solid black';
                if (i === 1 && j === 1) {
                  td.setAttribute('rowSpan', '2');
                }
              }
            }
          }
        mainDiv.append(tbl);
        return mainDiv;
    }
    
    showExpenses() {
        // TODO: Create a table with expenses!!!
    }
}

class Options {
    constructor(id, optionNames) {
        this.options = [];
        this.id = id;
        this.addOptions(optionNames);
    }
    addOption(optionName) {
        this.options.push(optionName);
        this.options.sort();
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
        selectObj.name = this.id;
        selectObj.id = `${this.id}`;
        selectObj.required = true;

        const baseOption = document.createElement("option");
        baseOption.id = `${this.id}_base_option`
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
        return selectObj;
    }
}
