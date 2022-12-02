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
        let selectObj = document.createElement("select");
        selectObj.setAttribute("name", "category");
        selectObj.setAttribute("id", "income-category-select");
        selectObj.setAttribute("id", `${this.id}-select`);
        selectObj.setAttribute("required", true);

        let baseOption = document.createElement("option");
        baseOption.setAttribute("value", this.id);
        baseOption.setAttribute("disabled", true);
        baseOption.setAttribute("selected", true);
        baseOption.innerText = `--- ${this.id} ---`;
        selectObj.append(baseOption);

        for (let option of this.options) {
            let newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            selectObj.append(newOption);
        }

        for (let option of this.defaultOptions) {
            let newOption = document.createElement("option");
            newOption.setAttribute("value", option);
            newOption.innerText = option;
            selectObj.append(newOption);
        }

        return selectObj;
    }
}

let userIDValue = "mich.wilcz";
const incomeOptions = new Options(
    "income-option", 
    [
        "bank interest", 
        "pay"
    ]
);
const paymentOptions = new Options(
    "payment-option", 
    [
        "cash",
        "credit card",
        "debit card",
    ]
);
const expenseOptions = new Options(
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
    let spanElement = document.getElementById(elementID);
    spanElement.textContent = `Welcome ${userIDValue}`;
}

function createUserElementwithLabel(
    form,
    type, 
    elementID, 
    labelText="User name",
    iconName="fa fa-user icon"
) {
    let inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", elementID);
    inputLabel.innerText = labelText
    form.append(inputLabel);

    let div = document.createElement("div");
    div.setAttribute("class", "form_element");

    let icon = document.createElement("i");
    icon.setAttribute("class", iconName);
    div.append(icon);

    let inputContent = document.createElement("input");
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

    let sectionLogin = document.createElement("section");
    sectionLogin.setAttribute("class", "login_registration");
    let heading = document.createElement("h2");
    heading.innerText = "Please, log in";
    sectionLogin.append(heading);
    let form = document.createElement("form");
    form.setAttribute("action", "my_wallet.html");

    let loginObj = createUserElementwithLabel(form, "text", "user-name-login-id", "User name");
    let passwordObj = createUserElementwithLabel(form, "password", "password-login-id", "Password", "fa fa-unlock-alt");
    let button = document.createElement("button");
    button.innerText = "Log in";
    form.append(loginObj);
    form.append(passwordObj);
    form.append(button);
    sectionLogin.append(form);
    
    let sectionRegister = document.createElement("section"); 
    let paragraph = document.createElement("p");
    let span1 = document.createElement("span");
    span1.innerText = "Don't have an account yet? Sign up ";
    let span2 = document.createElement("span");
    span2.innerText = "here"
    span2.setAttribute("class", "clickable_span");
    span2.onclick = function () {
        registerUser(elementID);
    }
    let span3 = document.createElement("span");
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

    let sectionRegister = document.createElement("section");
    sectionRegister.setAttribute("class", "login_registration");
    let heading = document.createElement("h2");
    heading.innerText = "Please, register";
    sectionRegister.append(heading);

    let form = document.createElement("form");
    form = createUserElementwithLabel(form, "text", "user-name-registration-id", "User name");
    form = createUserElementwithLabel(form, "password", "password-registration-id", "Password", "fa fa-unlock-alt");
    let button = document.createElement("button");
    button.innerText = "Register";
    form.append(button);
    sectionRegister.append(form);
    document.getElementById(elementID).append(sectionRegister);
}

function showMainPage(elementID) {
    clearBox(elementID);
    let section = document.createElement("section");

    let image = document.createElement("img");
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

    let header = document.createElement("h2");
    header.innerText = "Please, add income below:"
    document.getElementById(elementID).append(header);

    let divElement = document.createElement("div");
    let form = document.createElement("form");

    let subDiv1 = document.createElement("div");
    subDiv1.setAttribute("class", "form_element");
    let icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-money");
    subDiv1.append(icon);
    let amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    subDiv1.append(amount);
    form.append(subDiv1);

    let subDiv2 = document.createElement("div");
    subDiv2.setAttribute("class", "form_element");
    let date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    subDiv2.append(date);
    form.append(subDiv2);

    let subDiv3 = document.createElement("div");
    subDiv3.setAttribute("class", "form_element");
    let category = incomeOptions.createElement();
    subDiv3.append(category);
    form.append(subDiv3);

    let subDiv4 = document.createElement("div");
    subDiv4.setAttribute("class", "form_element");
    let comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    subDiv4.append(comments);
    form.append(subDiv4);

    let subDiv5 = document.createElement("div");
    subDiv5.setAttribute("class", "form_element");
    let button = document.createElement("button");
    button.innerText = "Add";
    subDiv5.append(button);
    form.append(subDiv5);

    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function addExpense(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    let header = document.createElement("h2");
    header.innerText = "Please, add expense below:"
    document.getElementById(elementID).append(header);

    let divElement = document.createElement("div");
    let form = document.createElement("form");

    let subDiv1 = document.createElement("div");
    subDiv1.setAttribute("class", "form_element");
    let icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-money");
    subDiv1.append(icon);
    let amount = document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("min", 0);
    amount.setAttribute("step", 0.01);
    amount.setAttribute("placeholder", "amount");
    amount.setAttribute("required", true);
    subDiv1.append(amount);
    form.append(subDiv1);

    let subDiv2 = document.createElement("div");
    subDiv2.setAttribute("class", "form_element");
    let date = document.createElement("input");
    date.setAttribute("type", "date");
    date.setAttribute("min", "2010-01-01");
    date.setAttribute("required", true);
    subDiv2.append(date);
    form.append(subDiv2);

    let subDiv3 = document.createElement("div");
    subDiv3.setAttribute("class", "form_element");
    let paymentMethod = paymentOptions.createElement();
    subDiv3.append(paymentMethod);
    form.append(subDiv3);

    let subDiv4 = document.createElement("div");
    subDiv4.setAttribute("class", "form_element");
    let category = expenseOptions.createElement();
    subDiv4.append(category);
    form.append(subDiv4);

    let subDiv5 = document.createElement("div");
    subDiv5.setAttribute("class", "form_element");
    let comments = document.createElement("text");
    comments.setAttribute("placeholder", "comment (optional)");
    subDiv5.append(comments);
    form.append(subDiv5);

    let subDiv6 = document.createElement("div");
    subDiv6.setAttribute("class", "form_element");
    let button = document.createElement("button");
    button.innerText = "Add";
    subDiv6.append(button);
    form.append(subDiv6);

    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function showBalance(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    let header = document.createElement("h2");
    header.innerText = "Wallet balance:"
    document.getElementById(elementID).append(header);

}

function changePassword(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    let header = document.createElement("h2");
    header.innerText = "You can change password below:"
    document.getElementById(elementID).append(header);

    let divElement = document.createElement("div");
    let form = document.createElement("form");
    form = createUserElementwithLabel(form, "password", "old-password-change-id", labelText="Old password", "fa fa-unlock-alt");
    form = createUserElementwithLabel(form, "password", "new-password-change-id", labelText="New password", "fa fa-unlock-alt");
    form = createUserElementwithLabel(form, "password", "new2-password-change-id", labelText="Repeated new password", "fa fa-unlock-alt");

    let buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "form_element");
    let button = document.createElement("button");
    button.innerText = "Submit";
    buttonDiv.append(button);
    form.append(buttonDiv);
    divElement.append(form);
    document.getElementById(elementID).append(divElement);
}

function modifyOptions(elementID, optionsObj) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    let divElement = document.createElement("div");
    
    let headerDelete = document.createElement("h2");
    headerDelete.innerText = "Delete option below:"
    divElement.append(headerDelete);

    let deleteForm = document.createElement("form");
    let formElement1 = document.createElement("div");
    formElement1.setAttribute("class", "form_element");
    let selectObj = optionsObj.createElement();
    formElement1.append(selectObj);
    deleteForm.append(formElement1);
    let formElement2 = document.createElement("div");
    formElement2.setAttribute("class", "form_element");
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        let objToDelete = selectObj.options[selectObj.selectedIndex].text;
        optionsObj.removeOption(objToDelete);
        alert(optionsObj.options);
    }
    formElement2.append(deleteButton)
    deleteForm.append(formElement2);
    divElement.append(deleteForm);


    let appendForm = document.createElement("form");
    let headerAdd = document.createElement("h2");
    headerAdd.innerText = "Add option below:"
    divElement.append(headerAdd);

    let formElement3 = document.createElement("div");
    formElement3.setAttribute("class", "form_element");
    let textObj = document.createElement("input");
    textObj.setAttribute("type", "text");
    textObj.setAttribute("placeholder", "new option");
    formElement3.append(textObj);
    appendForm.append(formElement3);

    let formElement4 = document.createElement("div");
    formElement4.setAttribute("class", "form_element");
    let appendButton = document.createElement("button");
    appendButton.innerText = "Append";
    appendButton.onclick = function() {
        let objToAdd = textObj.value;
        optionsObj.addOption(objToAdd);
        // TODO: This piece of code is not working!!! 
        // But why...?
    }
    formElement4.append(appendButton);
    appendForm.append(formElement4);
    divElement.append(appendForm);
    document.getElementById(elementID).append(divElement);
}

function changeSettings(elementID) {
    clearBox(elementID);
    window.scrollTo(0, 0);

    let header = document.createElement("h2");
    header.innerText = "Please, select one of the options below:"
    document.getElementById(elementID).append(header);

    let divElement1 = document.createElement("div");
    divElement1.setAttribute("class", "form_element");
    let passwordChange = document.createElement("button");
    passwordChange.onclick = function() {changePassword(elementID)};
    passwordChange.textContent = "Change Password";
    divElement1.append(passwordChange);
    document.getElementById(elementID).append(divElement1);
 
    let divElement2 = document.createElement("div");
    divElement2.setAttribute("class", "form_element");
    let paymentOptionsEdition = document.createElement("button");
    paymentOptionsEdition.onclick = function() {modifyOptions(elementID, paymentOptions)};
    paymentOptionsEdition.textContent = "Edit Payment Options";
    divElement2.append(paymentOptionsEdition);
    document.getElementById(elementID).append(divElement2);
 
    let divElement3 = document.createElement("div");
    divElement3.setAttribute("class", "form_element");
    let incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.onclick = function() {modifyOptions(elementID, incomeOptions)};
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    divElement3.append(incomeCategoriesEdition);
    document.getElementById(elementID).append(divElement3);
 
    let divElement4 = document.createElement("div");
    divElement4.setAttribute("class", "form_element");
    let expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.onclick = function() {modifyOptions(elementID, expenseOptions)};
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    divElement4.append(expenseCategoriesEdition);
    document.getElementById(elementID).append(divElement4);
}