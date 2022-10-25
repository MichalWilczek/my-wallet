class Options {
    constructor(id, optionNames) {
        this.options = [];
        this.defaultOptions = ["other"];
        this.id = id;
        this.addOptions(optionNames);
    }
    addOption(optionName) {
        if (
            !this.defaultOptions.includes(optionName) &&
            optionName != this.id
        ) {
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
        this.options = this.options.filter(e => e !== optionName);
    }
    showOptions(elementID) {
        var optionsElement = document.getElementById(elementID);

        var baseOption = document.createElement("option");
        baseOption.setAttribute("value", this.id);
        baseOption.setAttribute("disabled", true);
        baseOption.setAttribute("selected", true);
        baseOption.innerText = `--- ${this.id} ---`;
        optionsElement.append(baseOption);

        for (let option of this.options) {
            var newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            optionsElement.append(newOption);
        }

        for (let option of this.defaultOptions) {
            var newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            optionsElement.append(newOption);
        }
    }
}

// DEFINITION OF VARIABLES
let incomeOptions = new Options(
    "category", 
    [
        "bank interest", 
        "pay"
    ]
);
let paymentOptions = new Options(
    "payment option", 
    [
        "cash",
        "credit card",
        "debit card",
    ]
);
let expenseOptions = new Options(
    "category", 
    [
        "appartment",
        "books",
        "children",
        "clothes",
        "debts",
        "donation",
        "entertainment",
        "food",
        "healthcare",
        "internet",
        "phone",
        "savings",
        "training",
        "transport",
        "travel",
        "tv",
        "retirement",
    ]
);

document.body.onload = addElement;

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function showMainPage(elementID) {
    clearBox(elementID);
    document.getElementById(elementID).innerHTML = "Main page to be filled in...";
}

function addIncome(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");

    var amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    form.append(amount);

    var date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    form.append(date);

    var category = document.createElement("select");
    category.setAttribute("name", "category");
    category.setAttribute("id", "income-category-select");
    category.setAttribute("required", true);
    form.append(category);

    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    form.append(comments);

    var button = document.createElement("button");
    button.innerText = "Add";
    form.append(button);

    document.getElementById(elementID).append(form);
    incomeOptions.showOptions("income-category-select");
}

function addExpense(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");

    var amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    form.append(amount);

    var date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    form.append(date);

    var paymentMethod = document.createElement("select");
    paymentMethod.setAttribute("name", "payment-method");
    paymentMethod.setAttribute("id", "payment-option-select");
    paymentMethod.setAttribute("required", true);
    form.append(paymentMethod);

    var category = document.createElement("select");
    category.setAttribute("name", "category");
    category.setAttribute("id", "expense-category-select");
    category.setAttribute("required", true);
    form.append(category);

    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    form.append(comments);

    var button = document.createElement("button");
    button.innerText = "Add";
    form.append(button);

    document.getElementById(elementID).append(form);
    paymentOptions.showOptions("payment-option-select");
    expenseOptions.showOptions("expense-category-select");
}

function showBalance(elementID) {
    clearBox(elementID);
    document.getElementById(elementID).innerHTML = "Show balance to be added...";
}

function changePassword(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");

    var oldPasswordLabel = document.createElement("label");
    oldPasswordLabel.setAttribute("for", "old-password-change-label");
    oldPasswordLabel.innerText = "Type old password";
    form.append(oldPasswordLabel);
    var oldPassword = document.createElement("input");
    oldPassword.setAttribute("type", "password");
    oldPassword.setAttribute("id", "old-password-change-label");
    oldPassword.setAttribute("placeholder", "old password");
    oldPassword.setAttribute("required", true);
    form.append(oldPassword);

    var newPasswordLabel = document.createElement("label");
    newPasswordLabel.setAttribute("for", "new-password-change-label");
    newPasswordLabel.innerText = "Type new password";
    form.append(newPasswordLabel);
    var newPassword = document.createElement("input");
    newPassword.setAttribute("type", "password");
    newPassword.setAttribute("id", "new-password-change-label");
    newPassword.setAttribute("placeholder", "new password");
    newPassword.setAttribute("required", true);
    form.append(newPassword);

    var repeatedNewPasswordLabel = document.createElement("label");
    repeatedNewPasswordLabel.setAttribute("for", "repeated-new-password-change-label");
    repeatedNewPasswordLabel.innerText = "Retype new password";
    form.append(repeatedNewPasswordLabel);
    var repeatedNewPassword = document.createElement("input");
    repeatedNewPassword.setAttribute("type", "password");
    repeatedNewPassword.setAttribute("id", "repeated-new-password-change-label");
    repeatedNewPassword.setAttribute("placeholder", "repeated new password");
    repeatedNewPassword.setAttribute("required", true);
    form.append(repeatedNewPassword);

    var button = document.createElement("button");
    button.innerText = "Submit";
    form.append(button);

    document.getElementById(elementID).append(form);
    return form;
}

function changePaymentOptions(elementID) {
    clearBox(elementID);

    var deleteForm = document.createElement("form");
    var selectObj = document.createElement("select");
    selectObj.setAttribute("name", "payment-method");
    selectObj.setAttribute("id", "payment-option-select");
    selectObj.setAttribute("required", true);
    deleteForm.append(selectObj);
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        var objToDelete = selectObj.options[selectObj.selectedIndex].text;
        paymentOptions.removeOption(objToDelete);
        alert("no way!");

        return paymentOptions;
    }
    deleteForm.append(deleteButton);
    document.getElementById(elementID).append(deleteForm);

    var appendForm = document.createElement("form");
    var textObj = document.createElement("input");
    textObj.setAttribute("type", "text");
    textObj.setAttribute("placeholder", "new payment option");
    appendForm.append(textObj);
    var appendButton = document.createElement("button");
    appendButton.innerText = "Append";
    appendButton.onclick = function() {
        var objToAdd = textObj.value;
        paymentOptions.addOption(objToAdd);
        alert(paymentOptions.options);
        // TODO: This piece of code is not working!!! 
        // But why...?
    }
    appendForm.append(appendButton);
    document.getElementById(elementID).append(appendForm);
    paymentOptions.showOptions("payment-option-select");
}

function changeIncomeCategories(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");
    // TO BE DONE! 
}

function changeExpenseCategories(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");
    // TO BE DONE! 
}

function changeSettings(elementID) {
    clearBox(elementID);
    passwordChange = document.createElement("button");
    passwordChange.onclick = function() {changePassword(elementID)};
    passwordChange.textContent = "Change Password";
    document.getElementById(elementID).append(passwordChange);

    paymentOptionsEdition = document.createElement("button");
    paymentOptionsEdition.onclick = function() {changePaymentOptions(elementID)};
    paymentOptionsEdition.textContent = "Edit Payment Options";
    document.getElementById(elementID).append(paymentOptionsEdition);

    incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.onclick = function() {changeIncomeCategories(elementID)};
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    document.getElementById(elementID).append(incomeCategoriesEdition);

    expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.onclick = function() {changeExpenseCategories(elementID)};
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    document.getElementById(elementID).append(expenseCategoriesEdition);
}