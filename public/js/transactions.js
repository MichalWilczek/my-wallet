import {
    getIncomes,
    getExpenses,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    modifyIncome,
    modifyExpense,
} from "./endpoints.js";
import {
    createValueInput,
    createDateInput,
    createTextInput,
    createSelectInput,
    createButton,
    createFormOutputMsg,
} from "./components.js";
import {
    getIncomeCategoriesObj,
    getExpenseCategoriesObj,
    getPaymentOptionsObj,
} from "./options.js"
import { Modal } from "./modal.js";

export {
    addTransaction,
    deleteTransaction,
    modifyTransaction
}


const addTransaction = (transactionType, elementID) => {
    let transactionObj = TransactionFactory.getAddTransactionObject(transactionType);
    const elem = document.querySelector(`#${elementID}`);
    transactionObj.formTransaction(elem);
}


const deleteTransaction = async (transactionType, transactionID) => {
    if (transactionType === 'income') {
        let result = await deleteIncome(transactionID);
        if (result["status"] === 'success') {
            const latestIncomes = await getIncomes();
            window.userData.setIncomes(latestIncomes['data']['resource']);
        } else {
            // Do something...
        }
    
    } else if (transactionType === 'expense') {
        let result = await deleteExpense(transactionID);
        if (result["status"] === 'success') {
            const latestExpenses = await getExpenses();
            window.userData.setExpenses(latestExpenses['data']['resource']);
        } else {
            // Do something...
        }
        
    } else {
        throw new Exception(`Transaction type: ${transactionType} must be either 'income' or 'expense'.`);
    }
}


const modifyTransaction = async (transactionType, transactionData) => {
    const modalID = "modify-transaction-modal";
    const modalElement = document.querySelector(`#${modalID}`);
    if (modalElement !== null) {
        modalElement.remove();
    }
    const modalObj = new Modal(modalID);

    let transactionObj = TransactionFactory.getModifyTransactionObject(transactionType, transactionData);
    modalObj.createHeaderDiv(`Modify ${transactionObj.HEADER_NAME}`);

    const divBody = document.createElement("div");
    const form = transactionObj.generateForm();
    divBody.append(form);
    modalObj.addBodyDiv(divBody);
    
    const footer = document.createElement("div");
    let submitButtonClicked = false;
    const submitButton = createButton(
        "Modify", 
        async () => {
            transactionObj.requestTransaction(form, divBody);
            submitButtonClicked = true;
        }
    )
    footer.append(submitButton);
    
    modalObj.closeButton.addEventListener("click", async () => {
        if (submitButtonClicked === true) {
            showBalance();
        }
    })
    modalObj.addFooterDiv(footer);
    document.body.append(modalObj.getModal());
    modalObj.showModal();
}


class TransactionFactory {

    static getAddTransactionObject(transactionType) {
        if (transactionType === 'income') {
            return new IncomeTransactionAddition();
        } else if (transactionType === 'expense') {
            return new ExpenseTransactionAddition(); 
        } else {
            throw new Exception(`Transaction type: ${transactionType} must be either 'income' or 'expense'.`);
        }
    }

    static getModifyTransactionObject(transactionType, transactionData) {
        if (transactionType === 'income') {
            return new IncomeTransactionModification(transactionData);
        } else if (transactionType === 'expense') {
            return new ExpenseTransactionModification(transactionData); 
        } else {
            throw new Exception(`Transaction type: ${transactionType} must be either 'income' or 'expense'.`);
        }
    }
}


class TransactionOperator {
    formTransaction(...args) {
        throw new Error("Method 'formTransaction()' must be implemented.");
    }
}


class IncomeTransactionAddition extends TransactionOperator {
    HEADER_NAME = 'income';
    HEADER_MSG = 'Add income:';
    incomeCategoriesObj = getIncomeCategoriesObj()

    async requestTransaction(formData, div) {
        const result = await addIncome(formData);
        if (result["status"] === 'success') {
            const latestIncomes = await getIncomes();
            window.userData.setIncomes(latestIncomes['data']['resource']);
            createFormOutputMsg("You have successfully added income!", div);
        } else {
            createFormOutputMsg(result["errorMessage"], div, false);
        }
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(createValueInput());
        form.append(createDateInput());
        form.append(createSelectInput(
            this.incomeCategoriesObj.optionBaseName,
            this.incomeCategoriesObj.getOptionNames()
        ));
        form.append(createTextInput("comment", "optional comment"));
        return form;
    }

    generateOnSubmitEvent(form, bodyDiv) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Remove the messages from previous round if they exist.
            const msgFromPrevIteration = document.querySelector("#divMsgID");
            if(msgFromPrevIteration!==null) {
                msgFromPrevIteration.remove()
            }
            const tempOption = document.querySelector(`#${window.userData.incomeOptions.optionBaseName}_base_option`);
            tempOption.disabled = false;
            this.requestTransaction(form, bodyDiv)
            tempOption.disabled = true;
        })
        return form;
    }

    formTransaction(bodyDiv) {
        bodyDiv.innerHTML = "";
        window.scrollTo(0, 0);

        const header = document.createElement("h2");
        header.innerText = this.HEADER_MSG;
        bodyDiv.append(header)

        const divForm = document.createElement("div");
        const form = this.generateForm();
        form.append(createButton("Add"));
        this.generateOnSubmitEvent(form, bodyDiv);
        divForm.append(form);
        bodyDiv.append(divForm);
        return bodyDiv;
    } 
}


class ExpenseTransactionAddition extends IncomeTransactionAddition {
    HEADER_NAME = 'expense';
    HEADER_MSG = 'Add expense:';
    expenseCategoriesObj = getExpenseCategoriesObj();
    paymentOptionsObj = getPaymentOptionsObj();

    async requestTransaction(formData, div) {
        const result = await addExpense(formData);
        if (result["status"] === 'success') {
            const latestExpenses = await getExpenses();
            window.userData.setExpenses(latestExpenses['data']['resource']);
            createFormOutputMsg("You have successfully added expense!", div);
        } else {
            createFormOutputMsg(result["errorMessage"], div, false);
        }
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(createValueInput());
        form.append(createDateInput());
        form.append(createSelectInput(
            this.expenseCategoriesObj.optionBaseName,
            this.expenseCategoriesObj.getOptionNames()
        ));
        form.append(createSelectInput(
            this.paymentOptionsObj.optionBaseName,
            this.paymentOptionsObj.getOptionNames()
        ));
        form.append(createTextInput("comment", "optional comment"));
        return form;
    }

    generateOnSubmitEvent(form, bodyDiv) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Remove the messages from previous round if they exist.
            const msgFromPrevIteration = document.querySelector("#divMsgID");
            if(msgFromPrevIteration!==null) {
                msgFromPrevIteration.remove()
            }
            const tempExpOption = document.querySelector(`#${window.userData.expenseOptions.optionBaseName}_base_option`);
            const tempPayOption = document.querySelector(`#${window.userData.paymentOptions.optionBaseName}_base_option`);
            tempExpOption.disabled = false;
            tempPayOption.disabled = false;
            this.requestTransaction(form, bodyDiv);
            tempExpOption.disabled = true;
            tempPayOption.disabled = true;
        })
        return form;
    }
}


class IncomeTransactionModification extends IncomeTransactionAddition {
    HEADER_NAME = 'income';
    HEADER_MSG = 'Modify income:';

    constructor(transactionBaseData) {
        this.transactionBaseData = transactionBaseData;
    }

    async requestTransaction(formData, div) {
        const result = await modifyIncome(this.transactionBaseData['id'], formData);
        if (result["status"] === 'success') {
            const latestIncomes = await getIncomes();
            window.userData.setIncomes(latestIncomes['data']['resource']);
            createFormOutputMsg("You have successfully modified income!", div);
        } else {
            createFormOutputMsg(result["errorMessage"], div, false);
        }
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(createValueInput(this.transactionBaseData["amount"]));
        form.append(createDateInput(this.transactionBaseData["date"]));
        form.append(createSelectInput(this.transactionBaseData["transaction_category"]));
        form.append(createTextInput("comment", "optional comment", this.transactionBaseData["comment"]));
        return form;
    }
}

class ExpenseTransactionModification extends ExpenseTransactionAddition {
    HEADER_NAME = 'expense';
    HEADER_MSG = 'Modify expense:';

    constructor(transactionBaseData) {
        this.transactionBaseData = transactionBaseData;
    }

    async requestTransaction(formData, div) {
        const result = await modifyExpense(this.transactionBaseData['id'], formData);
        if (result["status"] === 'success') {
            const latestExpenses = await getExpenses();
            window.userData.setExpenses(latestExpenses['data']['resource']);
            createFormOutputMsg("You have successfully modified expense!", div);
        } else {
            createFormOutputMsg(result["errorMessage"], div, false);
        }
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(createValueInput(this.transactionBaseData["amount"]));
        form.append(createDateInput(this.transactionBaseData["date"]));
        form.append(createSelectInput(this.transactionBaseData["transaction_category"]));
        form.append(createSelectInput(this.transactionBaseData["payment_method"]));
        form.append(createTextInput("comment", "optional comment", this.transactionBaseData["comment"]));
        return form;
    }
}
