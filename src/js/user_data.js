/*
This module stores objects to operate on: 
    - general user data received from the server
    - options for income and expense settings
*/
export {getUserData, readUserDataFromAPI, UserData, Options}


const getUserData = async () => {
    try {
        const res = await axios.post("/my-wallet/src/server/login.php", {});
        const userData = readUserDataFromAPI(res.data);
        return userData;
    } catch (e) {
        console.log(
            "Unexpected error occured while querying data of the logged in user from server."
        );
        console.log("Error: ", e);
    }
}

const readUserDataFromAPI = (dictAPI) => {
    const userData = new UserData(
        dictAPI.id,
        dictAPI.userName,
        dictAPI.userData,
        dictAPI.userData
    );
    userData.setExpenseOptions(dictAPI.userData.expenses.expenseOptions);
    userData.setPaymentOptions(dictAPI.userData.expenses.paymentOptions);
    userData.setIncomeOptions(dictAPI.userData.incomes.incomeOptions);
    return userData;
}

class UserData {
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
    setPaymentOptions(paymentOptions) {
        this.paymentOptions = new Options("payment-option", paymentOptions);
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
        return selectObj;
    }
}
