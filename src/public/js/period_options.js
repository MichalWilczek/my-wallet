/*
TODO: ADD DOCUMENTATION
*/
import { getUserData } from './api.js';
import { showBalance } from './balance.js';
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
        selectObj.addEventListener("change", () => {
            const option = selectObj.options[selectObj.selectedIndex];
            const optionObj = this._getOptionObj(option.value);
            optionObj.showPeriodBalance();
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

    showPeriodBalance() {
        throw new Error("Method 'showPeriodBalance()' must be implemented.");
    }

    createOptionElement() {
        const newOption = document.createElement("option");
        newOption.innerText = this.name;
        newOption.value = this.name;
        return newOption;
    }
}

class CurrentYearOption extends PeriodOption {

    constructor(periodName="Current Year") {
        super(periodName);
    }

    async showPeriodBalance() {
        const today = new Date();
        window.userDateFrom = new Date(today.getFullYear(), 0, 2).toISOString().slice(0,10);
        window.userDateTo = new Date(today.getFullYear(), 12, 1).toISOString().slice(0,10);
        const userData = await getUserData(window.userDateFrom, window.userDateTo);
        showBalance(userData);
    }
}

class CurrentMonthOption extends PeriodOption {

    constructor(periodName="Current Month") {
        super(periodName);
    }

    async showPeriodBalance() {
        const today = new Date();
        window.userDateFrom = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().slice(0,10);
        window.userDateTo = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0,10);
        const userData = await getUserData(window.userDateFrom, window.userDateTo);
        showBalance(userData);
    }
}

class PreviousMonthOption extends PeriodOption {

    constructor(periodName="Previous month") {
        super(periodName);
    }

    async showPeriodBalance() {
        const today = new Date();
        window.userDateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 2).toISOString().slice(0,10);
        window.userDateTo = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
        const userData = await getUserData(window.userDateFrom, window.userDateTo);
        showBalance(userData);
    }
}

class CustomDatesOption extends PeriodOption {

    MODAL_DIV_NAME = "modal_div_custom_dates";

    constructor(periodName="Custom dates") {
        super(periodName);
        this.modalGen = new Modal(this.MODAL_DIV_NAME);
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
    
    async _showPeriodBalanceFromModal(dateFrom, dateTo) {
        const userData = await getUserData(dateFrom, dateTo);
        showBalance(userData);
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
        submitButton.addEventListener("click", () => {
            submitButton.setAttribute("data-bs-dismiss", "modal");
            window.userDateFrom = dateFromInput.value;
            window.userDateTo = dateToInput.value;
            this._showPeriodBalanceFromModal(dateFromInput.value, dateToInput.value);
        })
        footerDiv.append(submitButton);
        this.modalGen.addFooterDiv(footerDiv);

        document.body.append(this.modalGen.getModal());
    }

    createOptionElement() {
        const newOption = super.createOptionElement();
        const modalDiv = document.querySelector(`#${this.MODAL_DIV_NAME}`);
        if (modalDiv === null) {
            this._createModalElementForPeriodOptions();
        }
        return newOption;
      }

      showPeriodBalance() {
        this.modalGen.showModal();
    }
}