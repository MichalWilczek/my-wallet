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
    createElement() {
        var selectObj = document.createElement("select");
        selectObj.setAttribute("name", "category");
        selectObj.setAttribute("id", "income-category-select");
        selectObj.setAttribute("id", `${this.id}-select`);
        selectObj.setAttribute("required", true);

        var baseOption = document.createElement("option");
        baseOption.setAttribute("value", this.id);
        baseOption.setAttribute("disabled", true);
        baseOption.setAttribute("selected", true);
        baseOption.innerText = `--- ${this.id} ---`;
        selectObj.append(baseOption);

        for (let option of this.options) {
            var newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            selectObj.append(newOption);
        }

        for (let option of this.defaultOptions) {
            var newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            selectObj.append(newOption);
        }

        return selectObj;
    }
}

var userIDValue = "mich.wilcz";
let incomeOptions = new Options(
    "income-option", 
    [
        "bank interest", 
        "pay"
    ]
);
let paymentOptions = new Options(
    "payment-option", 
    [
        "cash",
        "credit card",
        "debit card",
    ]
);
let expenseOptions = new Options(
    "expense-option", 
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

function showUserID(elementID) {
    var spanElement = document.getElementById(elementID);
    spanElement.textContent = `Welcome ${userIDValue}`;
}

function createUserElementwithLabel(
    form,
    type, 
    elementID, 
    labelText="User name"
) {
    var userNameLabel = document.createElement("label");
    userNameLabel.setAttribute("for", elementID);
    userNameLabel.innerText = labelText
    form.append(userNameLabel);
    var userName = document.createElement("input");
    userName.setAttribute("type", type);
    userName.setAttribute("id", elementID);
    userName.setAttribute("required", true);
    form.append(userName);
    return form;
}

function logIn(elementID, loginButtonID) {
    document.getElementById(loginButtonID).remove();
    clearBox(elementID);

    var sectionLogin = document.createElement("section");
    sectionLogin.setAttribute("class", "login_registration");
    var heading = document.createElement("h2");
    heading.innerText = "Please, log in";
    sectionLogin.append(heading);
    var form = document.createElement("form");
    form.setAttribute("action", "my_wallet.html");

    var form = createUserElementwithLabel(form, "text", "user-name-login-id", "User name");
    var form = createUserElementwithLabel(form, "password", "password-login-id", "Password");
    var button = document.createElement("button");
    button.innerText = "Log in";
    form.append(button);
    sectionLogin.append(form);
    
    var sectionRegister = document.createElement("section"); 
    var paragraph = document.createElement("p");
    var span1 = document.createElement("span");
    span1.innerText = "Don't have an account yet? Sign up ";
    var span2 = document.createElement("span");
    span2.innerText = "here"
    span2.setAttribute("class", "clickable_span");
    span2.onclick = function () {
        registerUser(elementID);
    }
    var span3 = document.createElement("span");
    span3.innerText = "!"
    paragraph.append(span1);
    paragraph.append(span2);
    paragraph.append(span3);
    sectionRegister.append(paragraph);
    document.getElementById(elementID).append(sectionLogin);
    document.getElementById(elementID).append(sectionRegister);
}

function logOut(elementID) {
    document.getElementById(elementID).onclick = function () {
        location.href = "welcome.html";
    };
}

function registerUser(elementID) {
    clearBox(elementID);

    var sectionRegister = document.createElement("section");
    sectionRegister.setAttribute("class", "login_registration");
    var heading = document.createElement("h2");
    heading.innerText = "Please, register";
    sectionRegister.append(heading);

    var form = document.createElement("form");
    form = createUserElementwithLabel(form, "text", "user-name-registration-id", "User name");
    form = createUserElementwithLabel(form, "password", "password-registration-id", "Password");
    var button = document.createElement("button");
    button.innerText = "Register";
    form.append(button);
    sectionRegister.append(form);
    document.getElementById(elementID).append(sectionRegister);
}

function showMainPage(elementID) {
    clearBox(elementID);
    var paragraph = document.createElement("p");
    paragraph.innerText = "Main page to be filled in...";
    document.getElementById(elementID).append(paragraph);
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

    var category = incomeOptions.createElement();
    form.append(category);

    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    form.append(comments);

    var button = document.createElement("button");
    button.innerText = "Add";
    form.append(button);

    document.getElementById(elementID).append(form);
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

    var paymentMethod = paymentOptions.createElement();
    form.append(paymentMethod);

    var category = expenseOptions.createElement();
    form.append(category);

    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    form.append(comments);

    var button = document.createElement("button");
    button.innerText = "Add";
    form.append(button);

    document.getElementById(elementID).append(form);
}

function showBalance(elementID) {
    clearBox(elementID);
    var paragraph = document.createElement("p");
    paragraph.innerText = "Show balance to be added...";
    document.getElementById(elementID).append(paragraph);
}

function changePassword(elementID) {
    clearBox(elementID);
    var form = document.createElement("form");
    form = createUserElementwithLabel(form, "password", "old-password-change-id", labelText="Old password");
    form = createUserElementwithLabel(form, "password", "new-password-change-id", labelText="New password");
    form = createUserElementwithLabel(form, "password", "new2-password-change-id", labelText="Repeated new password");
    var button = document.createElement("button");
    button.innerText = "Submit";
    form.append(button);

    document.getElementById(elementID).append(form);
}

function modifyOptions(elementID, optionsObj) {
    clearBox(elementID);

    var deleteForm = document.createElement("form");
    var selectObj = optionsObj.createElement();
    deleteForm.append(selectObj);
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        var objToDelete = selectObj.options[selectObj.selectedIndex].text;
        optionsObj.removeOption(objToDelete);
        alert(optionsObj.options);
    }
    deleteForm.append(deleteButton);
    document.getElementById(elementID).append(deleteForm);

    var appendForm = document.createElement("form");
    var textObj = document.createElement("input");
    textObj.setAttribute("type", "text");
    textObj.setAttribute("placeholder", "new option");
    appendForm.append(textObj);
    var appendButton = document.createElement("button");
    appendButton.innerText = "Append";
    appendButton.onclick = function() {
        var objToAdd = textObj.value;
        optionsObj.addOption(objToAdd);
        // TODO: This piece of code is not working!!! 
        // But why...?
    }
    appendForm.append(appendButton);
    document.getElementById(elementID).append(appendForm);
}

function changeSettings(elementID) {
    clearBox(elementID);
    passwordChange = document.createElement("button");
    passwordChange.onclick = function() {changePassword(elementID)};
    passwordChange.textContent = "Change Password";
    document.getElementById(elementID).append(passwordChange);

    paymentOptionsEdition = document.createElement("button");
    paymentOptionsEdition.onclick = function() {modifyOptions(elementID, paymentOptions)};
    paymentOptionsEdition.textContent = "Edit Payment Options";
    document.getElementById(elementID).append(paymentOptionsEdition);

    incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.onclick = function() {modifyOptions(elementID, incomeOptions)};
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    document.getElementById(elementID).append(incomeCategoriesEdition);

    expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.onclick = function() {modifyOptions(elementID, expenseOptions)};
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    document.getElementById(elementID).append(expenseCategoriesEdition);
}