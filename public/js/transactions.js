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
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Modify";
    submitButton.addEventListener("click", async () => {
        transactionObj.requestTransaction(form, divBody);
        submitButtonClicked = true;
    })
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


class IncomeDataGenerator {

    createAmountInput(defaultValue=NaN) {
        const div = createFormElementDiv();
        const icon = document.createElement("i");
        icon.classList.add("fa", "fa-money");
        div.append(icon);
        const amount = document.createElement("input");
        amount.type = "number";
        amount.name = "amount"
        if (!isNaN(defaultValue)) {
            amount.value = defaultValue
        }
        amount.placeholder = "amount";
        amount.min = 0;
        amount.step = 0.01;
        amount.required = true;
        div.append(amount);
        return div;
    }

    createDateInput(defaultValue=null) {
        const div = createFormElementDiv();
        const date = document.createElement("input");
        date.type = "date";
        date.name = "date";
        if (defaultValue === null) {
            date.value = new Date().toISOString().slice(0,10);
        } else {
            date.value = defaultValue
        }
        date.required = true;
        div.append(date);
        return div;
    }

    createCommentInput(defaultValue=null) {
        const div = createFormElementDiv();
        const comments = document.createElement("input");
        comments.type = "text";
        comments.name = "comment";
        if (defaultValue !== null) {
            comments.value = defaultValue;
        }
        comments.placeholder = "comment (optional)";
        div.append(comments);
        return div;
    }

    createTransactionCategoryInput(defaultValue) {
        const div = createFormElementDiv();
        const category = window.userData.incomeOptions.createElement(defaultValue);
        div.append(category);
        return div;
    }
}

class ExpenseDataGenerator extends IncomeDataGenerator {

    createTransactionCategoryInput(defaultValue) {
        const div = createFormElementDiv();
        const category = window.userData.expenseOptions.createElement(defaultValue);
        div.append(category);
        return div;
    }

    createPaymentOptionInput(defaultValue) {
        const div = createFormElementDiv();
        const paymentMethod = window.userData.paymentOptions.createElement(defaultValue);
        div.append(paymentMethod);
        return div;
    }
}

// Abstract class
class TransactionOperator {
    formTransaction(...args) {
        throw new Error("Method 'formTransaction()' must be implemented.");
    }
}

class IncomeTransactionAddition extends TransactionOperator {

    HEADER_NAME = 'income';

    constructor() {
        super();
        this.headerMsg = "Please, add income below:";
        this.dataGenerator = new IncomeDataGenerator();
    }

    async requestTransaction(formData, div) {
        const result = await addIncome(formData);
        if (result["status"] === 'success') {
            const latestIncomes = await getIncomes();
            window.userData.setIncomes(latestIncomes['data']['resource']);
            generateFormOutputMessage("You have successfully added income!", div);
        } else {
            generateFormOutputMessage(result["errorMessage"], div, false);
        }
    }

    createButtonElement() {
        const div = createFormElementDiv();
        const button = document.createElement("button");
        button.innerText = "Add";
        div.append(button);
        return div;
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput());
        form.append(this.dataGenerator.createDateInput());
        form.append(this.dataGenerator.createTransactionCategoryInput());
        form.append(this.dataGenerator.createCommentInput());
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
            const tempOption = document.querySelector(`#${window.userData.incomeOptions.id}_base_option`);
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
        header.innerText = this.headerMsg;
        bodyDiv.append(header)

        const divForm = document.createElement("div");
        const form = this.generateForm();
        form.append(this.createButtonElement());
        this.generateOnSubmitEvent(form, bodyDiv);
        divForm.append(form);
        bodyDiv.append(divForm);
        return bodyDiv;
    } 
}

class ExpenseTransactionAddition extends IncomeTransactionAddition {

    HEADER_NAME = 'expense';

    constructor() {
        super();
        this.headerMsg = "Please, add expense below:";
        this.dataGenerator = new ExpenseDataGenerator();
    }

    async requestTransaction(formData, div) {
        const result = await addExpense(formData);
        if (result["status"] === 'success') {
            const latestExpenses = await getExpenses();
            window.userData.setExpenses(latestExpenses['data']['resource']);
            generateFormOutputMessage("You have successfully added expense!", div);
        } else {
            generateFormOutputMessage(result["errorMessage"], div, false);
        }
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput());
        form.append(this.dataGenerator.createDateInput());
        form.append(this.dataGenerator.createTransactionCategoryInput());
        form.append(this.dataGenerator.createPaymentOptionInput());
        form.append(this.dataGenerator.createCommentInput());
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
            const tempExpOption = document.querySelector(`#${window.userData.expenseOptions.id}_base_option`);
            const tempPayOption = document.querySelector(`#${window.userData.paymentOptions.id}_base_option`);
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

    BUTTON_ELEM = null;

    constructor(transactionBaseData) {
        super();
        this.headerMsg = "Please, modify income below:";
        this.transactionBaseData = transactionBaseData;
    }

    getButtonElem() {
        return this.BUTTON_ELEM;
    }

    async requestTransaction(formData, div) {
        const result = await modifyIncome(this.transactionBaseData['id'], formData);
        if (result["status"] === 'success') {
            const latestIncomes = await getIncomes();
            window.userData.setIncomes(latestIncomes['data']['resource']);
            generateFormOutputMessage("You have successfully modified income!", div);
        } else {
            generateFormOutputMessage(result["errorMessage"], div, false);
        }
    }

    createButtonElement() {
        const div = createFormElementDiv();
        const button = document.createElement("button");
        button.innerText = "Modify";
        this.BUTTON_ELEM = button;
        div.append(button);
        return div;
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput(this.transactionBaseData["amount"]));
        form.append(this.dataGenerator.createDateInput(this.transactionBaseData["date"]));
        form.append(this.dataGenerator.createTransactionCategoryInput(this.transactionBaseData["transaction_category"]));
        form.append(this.dataGenerator.createCommentInput(this.transactionBaseData["comment"]));
        return form;
    }
}

class ExpenseTransactionModification extends ExpenseTransactionAddition {

    BUTTON_ELEM = null;

    constructor(transactionBaseData) {
        super();
        this.headerMsg = "Please, modify expense below:";
        this.transactionBaseData = transactionBaseData;
    }

    getButtonElem() {
        return this.BUTTON_ELEM;
    }
    
    async requestTransaction(formData, div) {
        const result = await modifyExpense(this.transactionBaseData['id'], formData);
        if (result["status"] === 'success') {
            const latestExpenses = await getExpenses();
            window.userData.setExpenses(latestExpenses['data']['resource']);
            generateFormOutputMessage("You have successfully modified expense!", div);
        } else {
            generateFormOutputMessage(result["errorMessage"], div, false);
        }
    }

    createButtonElement() {
        const div = createFormElementDiv();
        const button = document.createElement("button");
        button.innerText = "Add";
        this.BUTTON_ELEM = button;
        div.append(button);
        return div;
    }

    generateForm() {
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput(this.transactionBaseData["amount"]));
        form.append(this.dataGenerator.createDateInput(this.transactionBaseData["date"]));
        form.append(this.dataGenerator.createTransactionCategoryInput(this.transactionBaseData["transaction_category"]));
        form.append(this.dataGenerator.createPaymentOptionInput(this.transactionBaseData["payment_method"]));
        form.append(this.dataGenerator.createCommentInput(this.transactionBaseData["comment"]));
        return form;
    }
}


const createFormElementDiv = () => {
    const div = document.createElement("div");
    div.classList.add("form_element");
    return div;
}


const generateFormOutputMessage = (msg, sectionObj, success=true) => {
    let spanClassName = "msg_error";
    if (success) {
        spanClassName = "msg_success";
    }
    
    const msgID = "divMsgID";
    const previousMsg = document.querySelector(`#${msgID}`)
    if (previousMsg !== null) {
        previousMsg.remove();
    }

    const divMsg = document.createElement("div");
    divMsg.classList.add("msg_div");
    const span = document.createElement("span");
    span.classList.add(spanClassName);
    span.textContent = msg;
    divMsg.append(span);

    const div = document.createElement("div");
    div.id = msgID;
    div.append(divMsg);
    sectionObj.append(div);

    return sectionObj;
}
