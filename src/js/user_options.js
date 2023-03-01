/*
In this module, we put a set of user options such as:
    - add income
    - add expense
    - change settings including
        - change password
        - modify income and expense options
*/
import { clearBox, createUserElementwithLabel } from './utils.js';
import { FormAPI } from './form_api.js';


const clickAddTransaction = async (form, div) => {
    const transactionQuery = new FormAPI("You have successfully added a transaction!");
    const res = await transactionQuery.postForm(
        "/my-wallet/src/server/transaction_input.php", 
        form,
        div
    )
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
    amount.name = "amount";
    amount.required = true;
    subDiv1.append(amount);
    form.append(subDiv1);

    const subDiv2 = document.createElement("div");
    subDiv2.classList.add("form_element");
    const date = document.createElement("input");
    date.type = "date";
    date.min = "2010-01-01";
    date.required = true;
    date.name = "date";
    subDiv2.append(date);
    form.append(subDiv2);

    const subDiv3 = document.createElement("div");
    subDiv3.classList.add("form_element");
    const category = window.userData.incomeOptions.createElement();
    subDiv3.append(category);
    form.append(subDiv3);

    const subDiv4 = document.createElement("div");
    subDiv4.classList.add("form_element");
    const comments = document.createElement("input");
    comments.type = "text";
    comments.placeholder = "comment (optional)";
    comments.name = "comment";
    subDiv4.append(comments);
    form.append(subDiv4);

    const subDiv5 = document.createElement("div");
    subDiv5.classList.add("form_element");
    const button = document.createElement("button");
    button.innerText = "Add";
    subDiv5.append(button);
    form.append(subDiv5);
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Remove the messages from previous round if they exist.
        const msgFromPrevIteration = document.querySelector("#divMsgID");
        if(msgFromPrevIteration!==null) {
            msgFromPrevIteration.remove()
        }
        const tempOption = document.querySelector(`#${window.userData.incomeOptions.id}_base_option`);
        tempOption.disabled = false;
        clickAddTransaction(form, divElement);
        tempOption.disabled = true;
    })

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
    amount.name = "amount"
    amount.required = true;
    subDiv1.append(amount);
    form.append(subDiv1);

    const subDiv2 = document.createElement("div");
    subDiv2.classList.add("form_element");
    const date = document.createElement("input");
    date.type = "date";
    date.name = "date";
    date.min = "2010-01-01";
    date.required = true;
    subDiv2.append(date);
    form.append(subDiv2);

    const subDiv3 = document.createElement("div");
    subDiv3.classList.add("form_element");
    const paymentMethod = window.userData.paymentOptions.createElement();
    subDiv3.append(paymentMethod);
    form.append(subDiv3);

    const subDiv4 = document.createElement("div");
    subDiv4.classList.add("form_element");
    const category = window.userData.expenseOptions.createElement();
    subDiv4.append(category);
    form.append(subDiv4);

    const subDiv5 = document.createElement("div");
    subDiv5.classList.add("form_element");
    const comments = document.createElement("input");
    comments.type = "text";
    comments.placeholder = "comment (optional)";
    comments.name = "comment";
    subDiv5.append(comments);
    form.append(subDiv5);

    const subDiv6 = document.createElement("div");
    subDiv6.classList.add("form_element");
    const button = document.createElement("button");
    button.innerText = "Add";
    subDiv6.append(button);
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Remove the messages from previous round if they exist.
        const msgFromPrevIteration = document.querySelector("#divMsgID");
        if(msgFromPrevIteration!==null) {
            msgFromPrevIteration.remove()
        }
        const tempExpOption = document.querySelector(`#${window.userData.expenseOptions.id}_base_option`);
        const tempPayOption = document.querySelector(`#${window.userData.paymentOptions.id}_base_option`);
        tempExpOption.disabled = false;
        tempPayOption.disabled = false;
        clickAddTransaction(form, divElement);
        tempExpOption.disabled = true;
        tempPayOption.disabled = true;
    })
    form.append(subDiv6);

    divElement.append(form);
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
        () => {modifyOptions(elementID, window.userData.incomeOptions)}
    );
    paymentOptionsEdition.textContent = "Edit Payment Options";
    divElement2.append(paymentOptionsEdition);
    document.querySelector(`#${elementID}`).append(divElement2);
 
    const divElement3 = document.createElement("div");
    divElement3.classList.add("form_element");
    const incomeCategoriesEdition = document.createElement("button");
    incomeCategoriesEdition.addEventListener(
        "click",
        () => {modifyOptions(elementID, window.userData.incomeOptions)}
    );
    incomeCategoriesEdition.textContent = "Edit Income Categories";
    divElement3.append(incomeCategoriesEdition);
    document.querySelector(`#${elementID}`).append(divElement3);
 
    let divElement4 = document.createElement("div");
    divElement4.classList.add("form_element");
    const expenseCategoriesEdition = document.createElement("button");
    expenseCategoriesEdition.addEventListener(
        "click",
        () => {modifyOptions(elementID, window.userData.expenseOptions)}
    );
    expenseCategoriesEdition.textContent = "Edit Expense Categories";
    divElement4.append(expenseCategoriesEdition);
    document.querySelector(`#${elementID}`).append(divElement4);
}


// Global function accessible from the module
window.addIncome = addIncome;
window.addExpense = addExpense;
window.changeSettings = changeSettings;
