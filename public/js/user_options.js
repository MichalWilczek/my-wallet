import {
    changePassword,
    deleteAccount
} from './endpoints.js';
import { 
    getIncomeCategoriesObj,
    getExpenseCategoriesObj,
    getPaymentOptionsObj
} from './options.js';
import {
    createFormElementDiv,
    createFormOutputMsg,
} from './components.js'
import { Modal } from './modal.js';
import { clearBox } from './utils.js';

export { changeSettings }


const createButtonElementWithClickAction = (buttonTextContent, clickAction, ...actionParams) => {
    const div = createFormElementDiv();
    const button = document.createElement("button");
    button.addEventListener(
        "click",
        () => {clickAction(...actionParams)}
    );
    button.textContent = buttonTextContent;
    div.append(button);
    return div;
}


const createDivTemplate = (elementID, buttonText) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const div = document.createElement("div");
    const header = document.createElement("h2");
    header.innerText = `${buttonText} option`;
    div.append(header);

    return div;
}


const createAddForm = (elementID, optionsObj) => {
    const textContent = "Add";
    const div = createDivTemplate(elementID, textContent);
    const form = document.createElement("form");
    
    const elem1 = createFormElementDiv();
    const selectObj = optionsObj.createElement();
    elem1.append(selectObj);
    form.append(elem1);

    // TODO: Add click action logic
    form.append(createButtonElementWithClickAction(textContent));
    div.append(form);
    div.append(
        createButtonElementWithClickAction("Cancel", modifyOptions, elementID, optionsObj)
    );
    document.querySelector(`#${elementID}`).append(div);
}


const createDeleteForm = (elementID, optionsObj) => {
    const textContent = "Delete";
    const div = createDivTemplate(elementID, textContent);
    const form = document.createElement("form");
    
    const elem1 = createFormElementDiv();
    const selectObj = optionsObj.createElement();
    elem1.append(selectObj);
    form.append(elem1);

    form.append(createButtonElementWithClickAction(
        textContent,
        async () => {
            const result = await optionsObj.deleteOption(
                selectObj.options[selectObj.selectedIndex].text
            );
            // if (result["status"] === 'success') {
            // } else {
            //     errors.push(result["errorMessage"]);
            //     this.optionsData = {};
            // }
        }
    ));
    div.append(form);
    div.append(
        createButtonElementWithClickAction("Cancel", modifyOptions, elementID, optionsObj)
    );
    document.querySelector(`#${elementID}`).append(div);
}


const createModifyForm = (elementID, optionsObj) => {
    const textContent = "Modify";
    const div = createDivTemplate(elementID, textContent);
    const form = document.createElement("form");
    
    const elem1 = createFormElementDiv();
    const selectObj = optionsObj.createElement();
    elem1.append(selectObj);
    form.append(elem1);

    // TODO: Add new name input element
    const newName = '';

    form.append(createButtonElementWithClickAction(
        textContent,
        async () => {
            await optionsObj.modifyOption(
                selectObj.options[selectObj.selectedIndex].text,
                newName
            )
        }
    ));
    div.append(form);
    div.append(
        createButtonElementWithClickAction("Cancel", modifyOptions, elementID, optionsObj)
    );
    document.querySelector(`#${elementID}`).append(div);
}


const modifyOptions = (elementID, optionObj) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const header = document.createElement("h2");
    header.innerText = `${optionObj.optionBaseName} Menu`;
    document.querySelector(`#${elementID}`).append(header);

    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Add", createAddForm, elementID, optionObj)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Delete", createDeleteForm, elementID, optionObj)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Modify", createModifyForm, elementID, optionObj)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Cancel", changeSettings, elementID, optionObj)
    );
}


const modifyExpenseOptions = (elementID, optionsObj) => {
    modifyOptions(elementID, optionsObj);

    // TODO: Next feature...
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Add expense limits", createModifyForm, elementID)
    );
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
    header.innerText = "Setting options:"
    document.querySelector(`#${elementID}`).append(header);

    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Edit Payment Options", modifyOptions, elementID, window.userData.paymentOptions)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Edit Income Categories", modifyOptions, elementID, window.userData.incomeOptions)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Edit Expense Categories", modifyExpenseOptions, elementID, window.userData.ExpenseOptions)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Change Password", modifyPassword, elementID)
    );
    document.querySelector(`#${elementID}`).append(
        createButtonElementWithClickAction("Delete Account", removeAccount, elementID)
    );
}


const modifyPassword = (elementID) => {
    // clearBox(elementID);
    // window.scrollTo(0, 0);

    // const header = document.createElement("h2");
    // header.innerText = "You can change password below:"
    // document.querySelector(`#${elementID}`).append(header);

    // const divElement = document.createElement("div");
    // const form = document.createElement("form");
    // createUserElementwithLabel(form, "password", "old-password-change-id", "oldPassword", "Old password", ["fa", "fa-unlock-alt"]);
    // createUserElementwithLabel(form, "password", "new-password-change-id", "newPassword1", "New password", ["fa", "fa-unlock-alt"]);
    // createUserElementwithLabel(form, "password", "new2-password-change-id", "newPassword2", "Repeated new password", ["fa", "fa-unlock-alt"]);

    // const buttonDiv = createFormElementDiv();
    // const button = document.createElement("button");
    // button.innerText = "Submit";
    // buttonDiv.append(button);
    // form.append(buttonDiv);
    // divElement.append(form);
    // document.querySelector(`#${elementID}`).append(divElement);
}
