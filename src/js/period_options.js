import { showBalance } from './index.js'
import { getUserData} from './user_data.js';
export { BalanceOptions }


class BalanceOptions {
    
    constructor () {
        this.options = [
            new CurrentMonthOption(),
            new PreviousMonthOption(),
            new CurrentYearOption()
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
            selectObj.append(option.createElement());
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

    createElement() {
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