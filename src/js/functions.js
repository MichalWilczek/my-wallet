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
    labelText="User name",
    iconName="fa fa-user icon"
) {
    var inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", elementID);
    inputLabel.innerText = labelText
    form.append(inputLabel);

    var div = document.createElement("div");
    div.setAttribute("class", "form_element");

    var icon = document.createElement("i");
    icon.setAttribute("class", iconName);
    div.append(icon);

    var inputContent = document.createElement("input");
    inputContent.setAttribute("type", type);
    inputContent.setAttribute("id", elementID);
    inputContent.setAttribute("required", true);
    div.append(inputContent);

    form.append(div);
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
    var form = createUserElementwithLabel(form, "password", "password-login-id", "Password", "fa fa-unlock-alt");
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
    form = createUserElementwithLabel(form, "password", "password-registration-id", "Password", "fa fa-unlock-alt");
    var button = document.createElement("button");
    button.innerText = "Register";
    form.append(button);
    sectionRegister.append(form);
    document.getElementById(elementID).append(sectionRegister);
}

function showMainPage(elementID) {
    clearBox(elementID);
    var section = document.createElement("section");

    var image = document.createElement("img");
    image.setAttribute("class", "background_photo");
    image.setAttribute("src", "img/background-photo.jpg");
    image.setAttribute("alt", "Background photo for quote");
    section.append(image);

    header = document.createElement("h2");
    header.innerHTML = "A budget is more than just a series of numbers on a page; <br> it is an embodiment of our values."
    section.append(header);

    document.getElementById(elementID).append(section);
}

function addIncome(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var header = document.createElement("h2");
    header.innerText = "Please, add income below:"
    document.getElementById(elementID).append(header);

    var divElement = document.createElement("div");
    var form = document.createElement("form");

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-money");
    subDiv.append(icon);
    var amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    subDiv.append(amount);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    subDiv.append(date);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var category = incomeOptions.createElement();
    subDiv.append(category);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    subDiv.append(comments);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var button = document.createElement("button");
    button.innerText = "Add";
    subDiv.append(button);
    form.append(subDiv);

    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function addExpense(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var header = document.createElement("h2");
    header.innerText = "Please, add expense below:"
    document.getElementById(elementID).append(header);

    var divElement = document.createElement("div");
    var form = document.createElement("form");

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-money");
    subDiv.append(icon);
    var amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    subDiv.append(amount);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    subDiv.append(date);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var paymentMethod = paymentOptions.createElement();
    subDiv.append(paymentMethod);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var category = expenseOptions.createElement();
    subDiv.append(category);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    subDiv.append(comments);
    form.append(subDiv);

    var subDiv = document.createElement("div");
    subDiv.setAttribute("class", "form_element");
    var button = document.createElement("button");
    button.innerText = "Add";
    subDiv.append(button);
    form.append(subDiv);

    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function showBalance(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var header = document.createElement("h2");
    header.innerText = "Wallet balance:"
    document.getElementById(elementID).append(header);

}

function changePassword(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var header = document.createElement("h2");
    header.innerText = "You can change password below:"
    document.getElementById(elementID).append(header);

    var divElement = document.createElement("div");
    var form = document.createElement("form");
    form = createUserElementwithLabel(form, "password", "old-password-change-id", labelText="Old password", "fa fa-unlock-alt");
    form = createUserElementwithLabel(form, "password", "new-password-change-id", labelText="New password", "fa fa-unlock-alt");
    form = createUserElementwithLabel(form, "password", "new2-password-change-id", labelText="Repeated new password", "fa fa-unlock-alt");

    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "form_element");
    var button = document.createElement("button");
    button.innerText = "Submit";
    buttonDiv.append(button);
    form.append(buttonDiv);
    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function modifyOptions(elementID, optionsObj) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var divElement = document.createElement("div");
    
    var headerDelete = document.createElement("h2");
    headerDelete.innerText = "Delete option below:"
    divElement.append(headerDelete);

    var deleteForm = document.createElement("form");
    var formElement = document.createElement("div");
    formElement.setAttribute("class", "form_element");
    var selectObj = optionsObj.createElement();
    formElement.append(selectObj);
    deleteForm.append(formElement);
    var formElement = document.createElement("div");
    formElement.setAttribute("class", "form_element");
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        var objToDelete = selectObj.options[selectObj.selectedIndex].text;
        optionsObj.removeOption(objToDelete);
        alert(optionsObj.options);
    }
    formElement.append(deleteButton)
    deleteForm.append(formElement);
    divElement.append(deleteForm);


    var appendForm = document.createElement("form");
    var headerAdd = document.createElement("h2");
    headerAdd.innerText = "Add option below:"
    divElement.append(headerAdd);

    var formElement = document.createElement("div");
    formElement.setAttribute("class", "form_element");
    var textObj = document.createElement("input");
    textObj.setAttribute("type", "text");
    textObj.setAttribute("placeholder", "new option");
    formElement.append(textObj);
    appendForm.append(formElement);

    var formElement = document.createElement("div");
    formElement.setAttribute("class", "form_element");
    var appendButton = document.createElement("button");
    appendButton.innerText = "Append";
    appendButton.onclick = function() {
        var objToAdd = textObj.value;
        optionsObj.addOption(objToAdd);
        // TODO: This piece of code is not working!!! 
        // But why...?
    }
    formElement.append(appendButton);
    appendForm.append(formElement);
    divElement.append(appendForm);
    document.getElementById(elementID).append(divElement);
}

function changeSettings(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    var header = document.createElement("h2");
    header.innerText = "Please, select one of the options below:"
    document.getElementById(elementID).append(header);

    var divElement = document.createElement("div");
    divElement.setAttribute("class", "form_element");
    var passwordChange = document.createElement("button");
    passwordChange.onclick = function() {changePassword(elementID)};
    passwordChange.textContent = "Change Password";
    divElement.append(passwordChange);
    document.getElementById(elementID).append(divElement);
 
    var divElement = document.createElement("div");
    divElement.setAttribute("class", "form_element");
    var paymentOptionsEdition = document.createElement("button");
    paymentOptionsEdition.onclick = function() {modifyOptions(elementID, paymentOptions)};
    paymentOptionsEdition.textContent = "Edit Payment Options";
    divElement.append(paymentOptionsEdition);
    document.getElementById(elementID).append(divElement);
 
    var divElement = document.createElement("div");
    divElement.setAttribute("class", "form_element");
    var incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.onclick = function() {modifyOptions(elementID, incomeOptions)};
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    divElement.append(incomeCategoriesEdition);
    document.getElementById(elementID).append(divElement);
 
    var divElement = document.createElement("div");
    divElement.setAttribute("class", "form_element");
    var expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.onclick = function() {modifyOptions(elementID, expenseOptions)};
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    divElement.append(expenseCategoriesEdition);
    document.getElementById(elementID).append(divElement);
}