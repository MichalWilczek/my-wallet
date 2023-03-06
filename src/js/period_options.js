/*
TODO: ADD DOCUMENTATION
*/
import { getUserData } from './api.js';
import { showBalance } from './balance.js';
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

    async showPeriodBalance() {
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

    async showPeriodBalance() {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth() - 1, 2).toISOString().slice(0,10);
        const to = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
        const userData = await getUserData(from,  to);
        showBalance(userData);
    }
}

class CustomDatesOption extends PeriodOption {

    MODAL_DIV_NAME = "modal_div_custom_dates";

    constructor(periodName="Custom dates") {
        super(periodName);
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
        const mainDiv = document.createElement("div");
        mainDiv.id = this.MODAL_DIV_NAME;
        document.body.append(mainDiv);
        mainDiv.classList.add("modal", "fade", "custom");
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
        contentDiv.append(bodyDiv);
    
        const footerDiv = document.createElement("div");
        footerDiv.classList.add("modal-footer");

        // Add submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.innerText = "Submit";
        submitButton.addEventListener("click", () => {
            submitButton.dataset.dismiss = "modal";
            this._showPeriodBalanceFromModal(dateFromInput.value, dateToInput.value);
        })
        footerDiv.append(submitButton);

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerText = "Close";
        footerDiv.append(closeButton);
        
        contentDiv.append(footerDiv);
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
        // Show a popup window to select dates and run showPeriodBalanceFromModal()
        $(".modal").modal("show");
    }
}