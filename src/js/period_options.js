/*
TODO: ADD DOCUMENTATION
*/
import { showBalance } from './index.js'
import { getUserData} from './user_data.js';
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
            optionObj.showBalance();
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

    showBalance() {
        throw new Error("Method 'showBalance()' must be implemented.");
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

    async showBalance() {
        const today = new Date();
        const from = new Date(today.getFullYear(), 0, 2).toISOString().slice(0,10);
        const to = new Date(today.getFullYear(), 12, 1).toISOString().slice(0,10);
        const userData = await getUserData(from,  to);
        showBalance(userData);
    }
}

class CurrentMonthOption extends PeriodOption {

    constructor(periodName="Current Month") {
        super(periodName);
    }

    async showBalance() {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().slice(0,10);
        const to = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0,10);
        const userData = await getUserData(from,  to);
        showBalance(userData);
    }
}

class PreviousMonthOption extends PeriodOption {

    constructor(periodName="Previous month") {
        super(periodName);
    }

    async showBalance() {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth() - 1, 2).toISOString().slice(0,10);
        const to = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
        const userData = await getUserData(from,  to);
        showBalance(userData);
    }
}

class CustomDatesOption extends PeriodOption {

    constructor(periodName="Custom dates") {
        super(periodName);
    }

    _setDateInput (form, labelText) {
        const div = document.createElement("div");
        const inputLabel = document.createElement("label");
        inputLabel.innerText = labelText
        div.append(inputLabel);

        const inputContent = document.createElement("input");
        inputContent.type = "date";
        inputContent.name = "dateTo";
        inputContent.min = "2010-01-01";
        inputContent.required = true;
        div.append(inputContent);
        form.append(div);
        return inputContent;
    }
    
    async _showBalanceFromModal(dateFrom, dateTo) {
        const userData = await getUserData(dateFrom, dateTo);
        showBalance(userData);
    }

    _createModalElementForPeriodOptions() {
        const mainDiv = document.createElement("div");
        document.body.append(mainDiv);
        mainDiv.classList.add("modal", "fade");
        mainDiv.role = "dialog";
    
        const dialogDiv = document.createElement("div");
        mainDiv.append(dialogDiv);
        dialogDiv.classList.add("modal-dialog");

        const contentDiv = document.createElement("div");
        dialogDiv.append(contentDiv);
        contentDiv.classList.add("modal-content");
    
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("modal-header");
        headerDiv.innerHTML = 'Select custom dates';
        contentDiv.append(headerDiv);
    
        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("modal-body");
        const form = document.createElement("form");
        form.method = "post";
        form.id = "custom_period_form";
        const dateFromInput = this._setDateInput(form, "From");
        const dateToInput = this._setDateInput(form, "To");
        bodyDiv.append(form);
        contentDiv.append(bodyDiv);
    
        const footerDiv = document.createElement("div");
        footerDiv.classList.add("modal-footer");
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerText = "Close";
        footerDiv.append(closeButton);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.value = "Submit";
        // submitButton.form = "custom_period_form";
        submitButton.addEventListener("submit", () => {
            submitButton.dataset.dismiss = "modal";
            this._showBalanceFromModal(dateFromInput.value, dateToInput.value);
        })
        footerDiv.append(submitButton);
        
        contentDiv.append(footerDiv);
    }

    createOptionElement() {
        const newOption = super.createOptionElement();
        this._createModalElementForPeriodOptions();
        return newOption;
      }

    async showBalance() {
        // Show a popup window to select dates and run showBalanceFromModal()
        $(".modal").modal("show");
    }
}