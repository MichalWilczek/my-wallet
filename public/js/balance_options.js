
import { 
    getIncomes,
    getExpenses
} from './endpoints.js';
import { showBalance } from './index.js';
import { Modal } from './modal.js';
export { BalanceOptions }


class BalanceOptions {

    constructor () {
        this.options = [
            new CurrentMonthOption(),
            new PreviousMonthOption(),
            new CurrentYearOption(),
            new CustomDatesOption()
        ];
    }

    _getOptionObj(periodName) {
        for (let optionObj of this.options) {
            if (optionObj.name === periodName) {
                return optionObj;
            }
        }
        throw new Excepiton("Option object name for choosing the period was not found.");
    }

    createSelectOption() {
        const selectObj = document.createElement("select");
        selectObj.name = "Balance dates";
        selectObj.addEventListener("change", async () => {
            const option = selectObj.options[selectObj.selectedIndex];
            const optionObj = this._getOptionObj(option.value);
            await optionObj.run();
            showBalance();
        })
        for (let option of this.options) {
            selectObj.append(option.createOptionElement());
        }
        return selectObj;
    }
}

// Abstract class
class PeriodOption {

    constructor(periodName) {
        this.name = periodName;
        if (this.constructor == PeriodOption) {
            throw new Error("Abstract classes cannot be instantiated!");
        }
    }

    run() {
        throw new Error("Method 'showPeriodBalance()' must be implemented.");
    }

    createOptionElement() {
        const newOption = document.createElement("option");
        newOption.innerText = this.name;
        newOption.value = this.name;
        return newOption;
    }

    async updateUserData(dateFrom, dateTo) {
        const incomes = await getIncomes(dateFrom, dateTo);
        if (incomes["status"] !== 'success') {
            incomes = [];
        }
        window.userData.setIncomes(incomes['data']['resource']);
    
        const expenses = await getExpenses(dateFrom, dateTo);
        if (expenses["status"] !== 'success') {
            expenses = [];
        }
        window.userData.setExpenses(expenses['data']['resource']);
    }
}

class CurrentYearOption extends PeriodOption {
    constructor(periodName="Current Year") {
        super(periodName);
    }

    async run() {
        const today = new Date();
        const dateFrom = new Date(today.getFullYear(), 0, 2).toISOString().slice(0,10);
        const dateTo = new Date(today.getFullYear(), 12, 1).toISOString().slice(0,10);
        await this.updateUserData(dateFrom, dateTo);
    }
}

class CurrentMonthOption extends PeriodOption {
    constructor(periodName="Current Month") {
        super(periodName);
    }

    async run() {
        const today = new Date();
        const dateFrom = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().slice(0,10);
        const dateTo = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0,10);
        await this.updateUserData(dateFrom, dateTo);
    }
}

class PreviousMonthOption extends PeriodOption {
    constructor(periodName="Previous month") {
        super(periodName);
    }

    async run() {
        const today = new Date();
        const dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 2).toISOString().slice(0,10);
        const dateTo = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
        await this.updateUserData(dateFrom, dateTo);
    }
}

class CustomDatesOption extends PeriodOption {
    MODAL_DIV_NAME = "modal_div_custom_dates";

    constructor(periodName="Custom dates") {
        super(periodName);
        this.modalGen = new Modal(this.MODAL_DIV_NAME);
    }

    createOptionElement() {
        const newOption = super.createOptionElement();
        const modalDiv = document.querySelector(`#${this.MODAL_DIV_NAME}`);
        if (modalDiv === null) {
            this._createModalElementForPeriodOptions();
        }
        return newOption;
    }

    run() {
        this.modalGen.showModal();
    }

    _setDateInput (form, labelText, defaultDate) {
        const div = document.createElement("div");
        const divLabel = document.createElement("div");
        divLabel.classList.add("date-label-modal");
        divLabel.textContent = labelText;
        div.append(divLabel);
        
        const divDate = document.createElement("div");
        divDate.classList.add("date-input-modal");
        const inputContent = document.createElement("input");
        inputContent.type = "date";
        inputContent.name = "dateTo";
        inputContent.min = "2010-01-01";
        inputContent.value = defaultDate;
        inputContent.required = true;
        divDate.append(inputContent);
        div.append(divDate);

        form.append(div);
        return inputContent;
    }
    
    _createModalElementForPeriodOptions() {
        this.modalGen.createHeaderDiv('Select custom dates');

        const bodyDiv = document.createElement("div");
        const dateFromInput = this._setDateInput(
            bodyDiv, 
            "From",
            // Default date 30 days prior to today
            new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0,10)
        );
        const dateToInput = this._setDateInput(
            bodyDiv, 
            "To", 
            new Date().toISOString().slice(0,10)
        );
        this.modalGen.addBodyDiv(bodyDiv);

        const footerDiv = document.createElement("div");
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.innerText = "Submit";
        submitButton.addEventListener("click", async () => {
            submitButton.setAttribute("data-bs-dismiss", "modal");
            await this.updateUserData(dateFromInput.value, dateToInput.value);
            showBalance();
        })
        footerDiv.append(submitButton);
        this.modalGen.addFooterDiv(footerDiv);

        document.body.append(this.modalGen.getModal());
    }
}