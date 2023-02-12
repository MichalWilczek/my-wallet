// THESE FUNCTIONS SHOULD BE IN UTILS.JS BUT THE CODE IS CURRENTLY NOT WORKING, THEN...
// import { clearBox, createUserElementwithLabel } from './utils.js';
// ------------------------------------------------------------------------------------
const clearBox = (elementID) => {
    const element = document.querySelector(`#${elementID}`);
    element.innerHTML = "";
}

const createUserElementwithLabel = (
    form,
    type,
    elementID,
    name,
    labelText,
    iconName
) => {
    const inputLabel = document.createElement("label");
    inputLabel.for = elementID;
    inputLabel.innerText = labelText
    form.append(inputLabel);

    const div = document.createElement("div");
    div.classList.add("form_element");
    const icon = document.createElement("i");
    icon.classList.add(...iconName);
    div.append(icon);

    const inputContent = document.createElement("input");
    inputContent.type = type;
    inputContent.id = elementID;
    inputContent.name = name;
    inputContent.required = true;
    div.append(inputContent);
    form.append(div);
}
// HERE, THE UTILS.JS CODE IS ENDING!
// ------------------------------------------------------------------------------------

class Options {
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

const showUserID = (elementID) => {
    const spanElement = document.querySelector(`#${elementID}`);
    spanElement.textContent = `Welcome ${userIDValue}`;
}

const logOut = (elementID) => {
    document.querySelector(`#${elementID}`).addEventListener("click", () => (location.href = "index.php"));
}

const addIncome = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "Please, add income below:"
    document.querySelector(`#${elementID}`).append(header);

    const divElement = document.createElement("div");
    const form = document.createElement("form");

    const subDiv1 = document.createElement("div");
    subDiv1.classList.add("form_element");
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-money");
    subDiv1.append(icon);
    const amount = document.createElement("input");
    amount.type = "number";
    amount.min = 0;
    amount.step = 0.01;
    amount.placeholder = "amount";
    amount.required = true;
    subDiv1.append(amount);
    form.append(subDiv1);

    const subDiv2 = document.createElement("div");
    subDiv2.classList.add("form_element");
    const date = document.createElement("input");
    date.type = "date";
    date.min = "2010-01-01";
    date.required = true;
    subDiv2.append(date);
    form.append(subDiv2);

    const subDiv3 = document.createElement("div");
    subDiv3.classList.add("form_element");
    const category = incomeOptions.createElement();
    subDiv3.append(category);
    form.append(subDiv3);

    const subDiv4 = document.createElement("div");
    subDiv4.classList.add("form_element");
    const comments = document.createElement("text");
    comments.placeholder = "comment (optional)";
    subDiv4.append(comments);
    form.append(subDiv4);

    const subDiv5 = document.createElement("div");
    subDiv5.classList.add("form_element");
    const button = document.createElement("button");
    button.innerText = "Add";
    subDiv5.append(button);
    form.append(subDiv5);

    divElement.append(form);
    document.querySelector(`#${elementID}`).append(divElement);
}

const addExpense = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "Please, add expense below:"
    document.querySelector(`#${elementID}`).append(header);

    const divElement = document.createElement("div");
    const form = document.createElement("form");

    const subDiv1 = document.createElement("div");
    subDiv1.classList.add("form_element");
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-money");
    subDiv1.append(icon);
    const amount = document.createElement("input");
    amount.type = "number";
    amount.min = 0;
    amount.step = 0.01;
    amount.placeholder = "amount";
    amount.required = true;
    subDiv1.append(amount);
    form.append(subDiv1);

    const subDiv2 = document.createElement("div");
    subDiv2.classList.add("form_element");
    const date = document.createElement("input");
    date.type = "date";
    date.min = "2010-01-01";
    date.required = true;
    subDiv2.append(date);
    form.append(subDiv2);

    const subDiv3 = document.createElement("div");
    subDiv3.classList.add("form_element");
    const paymentMethod = paymentOptions.createElement();
    subDiv3.append(paymentMethod);
    form.append(subDiv3);

    const subDiv4 = document.createElement("div");
    subDiv4.classList.add("form_element");
    const category = expenseOptions.createElement();
    subDiv4.append(category);
    form.append(subDiv4);

    const subDiv5 = document.createElement("div");
    subDiv5.classList.add("form_element");
    const comments = document.createElement("text");
    comments.placeholder = "comment (optional)";
    subDiv5.append(comments);
    form.append(subDiv5);

    const subDiv6 = document.createElement("div");
    subDiv6.classList.add("form_element");
    const button = document.createElement("button");
    button.innerText = "Add";
    subDiv6.append(button);
    form.append(subDiv6);

    divElement.append(form);
    document.querySelector(`#${elementID}`).append(divElement);
}

const showBalance = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);
    const header = document.createElement("h2");
    header.innerText = "Wallet balance:"
    document.querySelector(`#${elementID}`).append(header);
}

const changePassword = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "You can change password below:"
    document.querySelector(`#${elementID}`).append(header);

    const divElement = document.createElement("div");
    const form = document.createElement("form");
    createUserElementwithLabel(form, "password", "old-password-change-id", "oldPassword", labelText="Old password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "new-password-change-id", "newPassword1", labelText="New password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "new2-password-change-id", "newPassword2", labelText="Repeated new password", ["fa", "fa-unlock-alt"]);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("form_element");
    const button = document.createElement("button");
    button.innerText = "Submit";
    buttonDiv.append(button);
    form.append(buttonDiv);
    divElement.append(form);
    document.querySelector(`#${elementID}`).append(divElement);
}

const modifyOptions = (elementID, optionsObj) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const divElement = document.createElement("div");
    
    const headerDelete = document.createElement("h2");
    headerDelete.innerText = "Delete option below:"
    divElement.append(headerDelete);

    const deleteForm = document.createElement("form");
    const formElement1 = document.createElement("div");
    formElement1.classList.add("form_element");
    const selectObj = optionsObj.createElement();
    formElement1.append(selectObj);
    deleteForm.append(formElement1);
    const formElement2 = document.createElement("div");
    formElement2.classList.add("form_element");
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener(
        "click", 
        () => {
            const objToDelete = selectObj.options[selectObj.selectedIndex].text;
            optionsObj.removeOption(objToDelete);
        }
    );
    formElement2.append(deleteButton)
    deleteForm.append(formElement2);
    divElement.append(deleteForm);


    const appendForm = document.createElement("form");
    const headerAdd = document.createElement("h2");
    headerAdd.innerText = "Add option below:"
    divElement.append(headerAdd);

    let formElement3 = document.createElement("div");
    formElement3.classList.add("form_element");
    const textObj = document.createElement("input");
    textObj.type = "text";
    textObj.placeholder = "new option";
    formElement3.append(textObj);
    appendForm.append(formElement3);

    const formElement4 = document.createElement("div");
    formElement4.classList.add("form_element");
    const appendButton = document.createElement("button");
    appendButton.innerText = "Append";
    appendButton.addEventListener(
        "click",
        () => {
            const objToAdd = textObj.value;
            optionsObj.addOption(objToAdd);
            // TODO: This piece of code is not working!!! 
            // But why...?
        }
    )
    formElement4.append(appendButton);
    appendForm.append(formElement4);
    divElement.append(appendForm);
    document.querySelector(`#${elementID}`).append(divElement);
}

const changeSettings = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "Please, select one of the options below:"
    document.querySelector(`#${elementID}`).append(header);

    const divElement1 = document.createElement("div");
    divElement1.classList.add("form_element");
    const passwordChange = document.createElement("button");
    passwordChange.addEventListener(
        "click",
        () => {changePassword(elementID)}
    );
    passwordChange.textContent = "Change Password";
    divElement1.append(passwordChange);
    document.querySelector(`#${elementID}`).append(divElement1);
 
    const divElement2 = document.createElement("div");
    divElement2.classList.add("form_element");
    const paymentOptionsEdition = document.createElement("button");
    paymentOptionsEdition.addEventListener(
        "click",
        () => {modifyOptions(elementID, paymentOptions)}
    );
    paymentOptionsEdition.textContent = "Edit Payment Options";
    divElement2.append(paymentOptionsEdition);
    document.querySelector(`#${elementID}`).append(divElement2);
 
    const divElement3 = document.createElement("div");
    divElement3.classList.add("form_element");
    const incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.addEventListener(
        "click",
        () => {modifyOptions(elementID, incomeOptions)}
    );
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    divElement3.append(incomeCategoriesEdition);
    document.querySelector(`#${elementID}`).append(divElement3);
 
    let divElement4 = document.createElement("div");
    divElement4.classList.add("form_element");
    const expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.addEventListener(
        "click",
        () => {modifyOptions(elementID, expenseOptions)}
    );
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    divElement4.append(expenseCategoriesEdition);
    document.querySelector(`#${elementID}`).append(divElement4);
}
