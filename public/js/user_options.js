import { Modal } from './modal.js';
import {
    changePassword,
    deleteAccount
} from './endpoints.js';
import {
    clearBox,
    createUserElementwithLabel 
} from './utils.js';
export { changeSettings }


const modifyPassword = (elementID) => {
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

// TODO: Next step!
// TODO: Modify this function so that I can add, delete, or modify income/expense/payment options!!!
// In the new version we run those operations based on category IDs which has to be stored in the frontend!!!
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


const removeAccount = () => {
    const modal = new Modal("delete_account_div");
    modal.createHeaderDiv("Delete account");

    const bodyDiv = document.createElement("div");
    const text = document.createElement("p");
    text.innerText = "Are you sure you want to delete your account?";
    bodyDiv.append(text);
    modal.addBodyDiv(bodyDiv);

    const footerDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener(
        "click",
        async () => {
            deleteButton.setAttribute("data-bs-dismiss", "modal");
            const result = await deleteAccount();
            if (result["status"] === 'success') {
                window.location.href='/';
            }
        }
    )
    footerDiv.append(deleteButton);
    modal.addFooterDiv(footerDiv);

    document.body.append(modal.getModal());
    modal.showModal();
}


const changeSettings = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = "Select one of the options:"
    document.querySelector(`#${elementID}`).append(header);

    const divElementPassword = document.createElement("div");
    divElementPassword.classList.add("form_element");
    const passwordChangeButton = document.createElement("button");
    passwordChangeButton.addEventListener(
        "click",
        () => {modifyPassword(elementID)}
    );
    passwordChangeButton.textContent = "Change Password";
    divElementPassword.append(passwordChangeButton);
    document.querySelector(`#${elementID}`).append(divElementPassword);
 
    const divElementPaymentOptions = document.createElement("div");
    divElementPaymentOptions.classList.add("form_element");
    const paymentOptionsEditionButton = document.createElement("button");
    paymentOptionsEditionButton.addEventListener(
        "click",
        () => {modifyOptions(elementID, window.userData.incomeOptions)}
    );
    paymentOptionsEditionButton.textContent = "Edit Payment Options";
    divElementPaymentOptions.append(paymentOptionsEditionButton);
    document.querySelector(`#${elementID}`).append(divElementPaymentOptions);
 
    const divElementIncomeCategories = document.createElement("div");
    divElementIncomeCategories.classList.add("form_element");
    const incomeCategoriesEditionButton = document.createElement("button");
    incomeCategoriesEditionButton.addEventListener(
        "click",
        () => {modifyOptions(elementID, window.userData.incomeOptions)}
    );
    incomeCategoriesEditionButton.textContent = "Edit Income Categories";
    divElementIncomeCategories.append(incomeCategoriesEditionButton);
    document.querySelector(`#${elementID}`).append(divElementIncomeCategories);
 
    let divElementExpenseCategories = document.createElement("div");
    divElementExpenseCategories.classList.add("form_element");
    const expenseCategoriesEditionButton = document.createElement("button");
    expenseCategoriesEditionButton.addEventListener(
        "click",
        () => {modifyOptions(elementID, window.userData.expenseOptions)}
    );
    expenseCategoriesEditionButton.textContent = "Edit Expense Categories";
    divElementExpenseCategories.append(expenseCategoriesEditionButton);
    document.querySelector(`#${elementID}`).append(divElementExpenseCategories);

    let divElementRemoveAccount = document.createElement("div");
    divElementRemoveAccount.classList.add("form_element");
    const accountRemovalButton = document.createElement("button");
    accountRemovalButton.addEventListener(
        "click",
        () => {removeAccount(elementID)}
    )
    accountRemovalButton.textContent = "Delete Account";
    divElementRemoveAccount.append(accountRemovalButton);
    document.querySelector(`#${elementID}`).append(divElementRemoveAccount);
}
