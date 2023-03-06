import { BalanceOptions } from './period_options.js';
import { clearBox } from './utils.js';
export { showBalance, showBalanceSheet}


const showBalanceSheet = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);

    const balanceDiv = document.querySelector(`#${elementID}`);
    const header = document.createElement("h2");
    header.innerText = "Wallet balance";

    const optionsElement = new BalanceOptions().createSelectOption();
    const divPeriod = document.createElement('div');
    divPeriod.append(optionsElement);
    balanceDiv.append(header);
    balanceDiv.append(divPeriod);
    balanceDiv.append(document.createElement("hr"));

    showBalance(undefined, balanceDiv);
}

const showBalance = (userData=null, sectionDiv=null) => {

    if (userData !== null) {
        window.userData = userData;
    }

    const mainDivNameID = "balance_summary_div_id";
    let balanceDiv = document.querySelector(`#${mainDivNameID}`);
    if (balanceDiv === null) {
        balanceDiv = document.createElement("div");
        balanceDiv.id = mainDivNameID;
    } else {
        clearBox(mainDivNameID);
    }
    if (sectionDiv !== null) {
        sectionDiv.append(balanceDiv);
    }

    const balanceSummary = window.userData.showIncomeExpenseSummaryChart(balanceDiv);

    if (balanceSummary['totalIncome'] > 0) {
        const incomeHeader = document.createElement("h3");
        incomeHeader.innerText = "Income summary";
        balanceDiv.append(incomeHeader);
        balanceDiv.append(document.createElement("hr"));
        window.userData.showIncomes(balanceDiv);
        balanceDiv.append(document.createElement("hr"));
    }

    if (balanceSummary['totalExpense'] > 0) {
        const expenseHeader = document.createElement("h3");
        expenseHeader.innerText = "Expense summary";
        balanceDiv.append(expenseHeader);
        balanceDiv.append(document.createElement("hr"));
        window.userData.showExpenses(balanceDiv);
        balanceDiv.append(document.createElement("hr"));  
    }

    return balanceDiv; 
}