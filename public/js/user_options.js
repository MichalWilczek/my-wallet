/*
In this module, we put a set of user options such as:
    - add income
    - add expense
    - change settings including
        - change password
        - modify income and expense options
*/
import {
    clearBox,
    createUserElementwithLabel 
} from './utils.js';
export { changeSettings }


const changePassword = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "You can change password below:"
    document.querySelector(`#${elementID}`).append(header);

    const divElement = document.createElement("div");
    const form = document.createElement("form");
    createUserElementwithLabel(form, "password", "old-password-change-id", "oldPassword", "Old password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "new-password-change-id", "newPassword1", "New password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "new2-password-change-id", "newPassword2", "Repeated new password", ["fa", "fa-unlock-alt"]);

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
    header.innerText = "Select one of the options:"
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
