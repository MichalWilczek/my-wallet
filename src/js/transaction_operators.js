import { addTransaction as clickAddTransaction } from "./api.js";
export {
    addIncome,
    addExpense,
    IncomeTransactionAddition,
    ExpenseTransactionAddition,
    IncomeTransactionModification,
    ExpenseTransactionModification
}


const addIncome = (elementID) => {
    const elem = document.querySelector(`#${elementID}`);
    const obj = new IncomeTransactionAddition();
    obj.formTransaction(elem);
}

const addExpense = (elementID) => {
    const elem = document.querySelector(`#${elementID}`);
    const obj = new ExpenseTransactionAddition();
    obj.formTransaction(elem);
}

class Utils {

    createFormElementDiv() {
        const div = document.createElement("div");
        div.classList.add("form_element");
        return div;
    }
}

class IncomeDataGenerator {

    constructor() {
        this.utils = new Utils();
    }

    createAmountInput(defaultValue=NaN) {
        const div = this.utils.createFormElementDiv();
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
        const div = this.utils.createFormElementDiv();
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
        const div = this.utils.createFormElementDiv();
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

    // ADD DEFAULT CATEGORY!!!
    createTransactionCategoryInput() {
        const div = this.utils.createFormElementDiv();
        const category = window.userData.incomeOptions.createElement();
        div.append(category);
        return div;
    }
}

class ExpenseDataGenerator extends IncomeDataGenerator {

    // ADD DEFAULT CATEGORY!!!
    createTransactionCategoryInput() {
        const div = this.utils.createFormElementDiv();
        const category = window.userData.expenseOptions.createElement();
        div.append(category);
        return div;
    }

    // ADD DEFAULT CATEGORY!!!
    createPaymentOptionInput() {
        const div = this.utils.createFormElementDiv();
        const paymentMethod = window.userData.paymentOptions.createElement();
        div.append(paymentMethod);
        return div;
    }
}

// Abstract class
class TransactionOperator {

    // Abstract method
    formTransaction(...args) {
        throw new Error("Method 'formTransaction()' must be implemented.");
    }
}

class IncomeTransactionAddition extends TransactionOperator {

    constructor() {
        super();
        this.headerMsg = "Please, add income below:";
        this.utils = new Utils();
        this.dataGenerator = new IncomeDataGenerator();
    }

    async addTransaction(form, div) {
        clickAddTransaction(form, div, {'procedure': 'add', 'transaction_type': 'income'});
    }

    createButtonElement() {
        const div = this.utils.createFormElementDiv();
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
            this.addTransaction(form, bodyDiv)
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

    constructor() {
        super();
        this.headerMsg = "Please, add expense below:";
        this.dataGenerator = new ExpenseDataGenerator();
    }

    async addTransaction(form, div) {
        clickAddTransaction(form, div, {'procedure': 'add', 'transaction_type': 'expense'});
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
            this.addTransaction(form, bodyDiv);
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

    async addTransaction(form, div) {
        clickAddTransaction(form, div, {'procedure': 'modify', 'transaction_type': 'income'});
    }

    createButtonElement() {
        const div = this.utils.createFormElementDiv();
        const button = document.createElement("button");
        button.innerText = "Modify";
        this.BUTTON_ELEM = button;
        div.append(button);
        return div;
    }

    generateForm() {
        // TODO: Add default values here!
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput(this.transactionBaseData.amount));
        form.append(this.dataGenerator.createDateInput(this.transactionBaseData.date));
        form.append(this.dataGenerator.createTransactionCategoryInput());
        form.append(this.dataGenerator.createCommentInput(this.transactionBaseData.comment));
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
    
    async addTransaction(form, div) {
        clickAddTransaction(form, div, {'procedure': 'modify', 'transaction_type': 'expense'});
    }

    createButtonElement() {
        const div = this.utils.createFormElementDiv();
        const button = document.createElement("button");
        button.innerText = "Add";
        this.BUTTON_ELEM = button;
        div.append(button);
        return div;
    }

    generateForm() {
        // TODO: Add default values here!
        const form = document.createElement("form");
        form.append(this.dataGenerator.createAmountInput(this.transactionBaseData.amount));
        form.append(this.dataGenerator.createDateInput(this.transactionBaseData.date));
        form.append(this.dataGenerator.createTransactionCategoryInput());
        form.append(this.dataGenerator.createPaymentOptionInput());
        form.append(this.dataGenerator.createCommentInput(this.transactionBaseData.comment));
        return form;
    }
}