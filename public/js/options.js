import {
    getIncomeCategories,
    getExpenseCategories,
    getPaymentOptions,
    deleteIncomeCategory,
    deleteExpenseCategory,
    deletePaymentOption,
    modifyIncomeCategory,
    modifyExpenseCategory,
    modifyPaymentOption,
    addIncomeCategory,
    addExpenseCategory,
    addPaymentOption
} from './endpoints.js';

export { 
    Options,
    getIncomeCategoriesObj,
    getExpenseCategoriesObj,
    getPaymentOptionsObj
}


const getIncomeCategoriesObj = async () => {
    const category = new IncomeCategory();
    if (window.userData === null) {
        return category;
    }

    if (window.userData.incomeOptions === null) {
        await category.getOptions();
        window.userData.incomeOptions === category;
        return category;
    }
    return window.userData.incomeOptions;
}

const getExpenseCategoriesObj = async () => {
    const category = new ExpenseCategory();
    if (window.userData === null) {
        return category;
    }

    if (window.userData.expenseOptions === null) {
        await category.getOptions();
        window.userData.expenseOptions === category;
        return category;
    }
    return window.userData.expenseOptions;
}

const getPaymentOptionsObj = async () => {
    const category = new PaymentOption();
    if (window.userData === null) {
        return category;
    }

    if (window.userData.paymentOptions === null) {
        await category.getOptions();
        window.userData.paymentOptions === category;
        return category;
    }
    return window.userData.paymentOptions;
}


class Options {
    constructor(
        getOptionsQueryFunction,
        addOptionQueryFunction,
        deleteOptionQueryFunction,
        modifyOptionQueryFunction,
        optionName, 
        optionsData = []
    ) {
        this.getOptionsQueryFunction = getOptionsQueryFunction;
        this.addOptionQueryFunction = addOptionQueryFunction;
        this.deleteOptionQueryFunction = deleteOptionQueryFunction;
        this.modifyOptionQueryFunction = modifyOptionQueryFunction;

        this.optionBaseName = optionName;
        this.optionsData = this.aggregateOptions(optionsData);
    }

    aggregateOptions(options) {
        const aggregatedOptions = {};
        for (let optionData of options) {
            aggregatedOptions[optionData['name']] = optionData['id'];
        }
        return aggregatedOptions;
    }

    getOptionNames() {
        return Object.keys(this.optionsData).sort();
    }

    async getOptions() {
        const errors = [];
        const result = await this.getOptionsQueryFunction();
        if (result["status"] === 'success') {
            this.optionsData = this.aggregateOptions(result['data']['resource']);
        } else {
            errors.push(result["errorMessage"]);
            this.optionsData = {};
        }
        return errors;
    }

    async addOption(optionName) {
        const result = await this.addOptionQueryFunction(optionName);

        if (result["status"] == 'success') {
            await this.getOptions();
        }
        return result;
    }

    async modifyOption(optionName, newOptionName) {
        const optionID = this.optionsData[optionName];
        const result = await this.modifyOptionQueryFunction(optionID);

        if (result["status"] == 'success') {
            await this.getOptions();
        }
        return result;
    }

    async deleteOption(optionName) {
        const optionID = this.optionsData[optionName];
        const result = await this.deleteOptionQueryFunction(optionID);

        if (result["status"] == 'success') {
            await this.getOptions();
        }
        return result;
    }
}


class IncomeCategory extends Options {
    constructor() {
        super(
            getIncomeCategories,
            addIncomeCategory,
            deleteIncomeCategory,
            modifyIncomeCategory,
            'income-category'
        )
    }

    updateGlobals() {
        window.userData.incomeOptions = this;
    }
}


class ExpenseCategory extends Options {
    constructor() {
        super(
            getExpenseCategories,
            addExpenseCategory,
            deleteExpenseCategory,
            modifyExpenseCategory,
            'expense-category'
        )
    }

    updateGlobals() {
        window.userData.expenseOptions = this;
    }
}


class PaymentOption extends Options {
    constructor() {
        super(
            getPaymentOptions,
            addPaymentOption,
            deletePaymentOption,
            modifyPaymentOption,
            'payment-option'
        )
    }

    updateGlobals() {
        window.userData.paymentOptions = this;
    }
}