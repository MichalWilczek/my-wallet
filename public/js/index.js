import {
    getIncomes,
    getExpenses,
    getIncomeCategories,
    getExpenseCategories,
    getPaymentOptions,
} from './endpoints.js';
import {
    deleteTransaction,
    modifyTransaction
} from './transactions.js'
import { Options } from './options.js';
import { BalanceOptions } from './balance_options.js';
import { clearBox, capitalizeFirstLetter } from './utils.js';
export { runUserPortal, showBalance }



const runUserPortal = async (
    pageContentID='main_page_content',
    dateFrom=null,
    dateTo=null
) => {
    try {
        await getUserData(dateFrom, dateTo);
        showBalanceSheet(pageContentID);
    } catch (e) {
        console.log(`Unexpected error occured while ploting the user webpage. Error: ${e}`);
    }
}

const getUserData = async (dateFrom=null, dateTo=null) => {
    const errors = [];

    let incomes = await getIncomes(dateFrom, dateTo);
    if (incomes["status"] === 'success') {
        incomes = incomes['data']['resource'];
    } else {
        errors.push(incomes["errorMessage"]);
        incomes = [];
    }

    let expenses = await getExpenses(dateFrom, dateTo);
    if (expenses["status"] === 'success') {
        expenses = expenses['data']['resource'];
    } else {
        errors.push(expenses["errorMessage"]);
        expenses = [];
    }

    let incomeCategories = await getIncomeCategories();
    if (incomeCategories["status"] === 'success') {
        incomeCategories = incomeCategories['data']['resource'];
    } else {
        errors.push(incomeCategories["errorMessage"]);
        incomeCategories = [];
    }

    let expenseCategories = await getExpenseCategories();
    if (expenseCategories["status"] === 'success') {
        expenseCategories = expenseCategories['data']['resource'];
    } else {
        errors.push(expenseCategories["errorMessage"]);
        expenseCategories = [];
    }

    let paymentOptions = await getPaymentOptions();
    if (paymentOptions["status"] === 'success') {
        paymentOptions = paymentOptions['data']['resource'];
    } else {
        errors.push(paymentOptions["errorMessage"]);
        paymentOptions = [];
    }

    window.appErrors = errors;
    window.userData = new UserData(
        incomes, 
        expenses,
        incomeCategories,
        expenseCategories,
        paymentOptions
    )
}

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

    showBalance(balanceDiv);
}

const showBalance = (sectionDiv=null) => {
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

class UserData {

    constructor(
        incomes=[], 
        expenses=[],
        incomeOptions=[],
        expenseOptions=[],
        paymentOptions=[]
    ) {
        this.incomeOptions = new Options("income-option", incomeOptions);
        this.expenseOptions = new Options("expense-option", expenseOptions);
        this.paymentOptions = new Options("payment-option", paymentOptions);
        this.incomes = this._aggregateTransactionData(incomes, incomeOptions);
        this.expenses = this._aggregateTransactionData(expenses, expenseOptions);
    }

    setIncomes(incomes) {
        this.incomes = [];
        this.incomes = this._aggregateTransactionData(incomes, this.incomeOptions.options);
    }

    setExpenses(expenses) {
        this.expenses = [];
        this.expenses = this._aggregateTransactionData(expenses, this.expenseOptions.options);
    }

    showIncomeExpenseSummaryChart(sectionDiv, idAddName="") {
        const mainDiv = document.createElement('div');

        const mainInfoDiv = document.createElement('div');
        const spanInfo = document.createElement('span');
        mainInfoDiv.append(spanInfo);
        
        const div = document.createElement("div");
        div.id = `total_summary_chart${idAddName}`;
        div.classList.add("chart_local");
        mainDiv.append(div);
        mainDiv.append(mainInfoDiv);
        sectionDiv.append(mainDiv);

        let totalIncome = 0;
        const incomeSummary = this._summarizeTransactions(this.incomes);
        for (const [_, value] of Object.entries(incomeSummary)) {
            totalIncome += parseFloat(value);
        }

        let totalExpense = 0;
        const expenseSummary = this._summarizeTransactions(this.expenses);
        for (const [_, value] of Object.entries(expenseSummary)) {
            totalExpense += parseFloat(value);
        }

        if (totalIncome === 0 && totalExpense === 0) {
            const msg = "There are no transactions to show for the chosen period.";
            spanInfo.textContent = msg;
            return {
                totalIncome: totalIncome,
                totalExpense: totalExpense
            }
        } 
        
        if (totalIncome >= totalExpense) {
            spanInfo.textContent = "Bravo! You manage your finances very well in the specified period!";
            spanInfo.style.color = "green";
        } else {
            spanInfo.textContent = "Oh no... you are in debt in the specified period!";
            spanInfo.style.color = "red";
        }
        
        const data = [
            {
                x: ['Total income'],
                y: [totalIncome],
                type: 'bar'
            },
            {
                x: ['Total expenses'],
                y: [totalExpense],
                type: 'bar'
            },
        ];
        
        const layout = {
            showlegend: false,
            colorway: ['green', 'red'],
            height: 300,
            width: 400,
            plot_bgcolor: '#f2efef',
            paper_bgcolor: '#f2efef',
            margin: { "t": 15, "b": 30 },
            font: { family: 'Arapey', size: 14 }
        };
        Plotly.newPlot(div.id, data, layout);

        const divPlotly = document.querySelector(`#${div.id} .user-select-none.svg-container`);
        divPlotly.style.margin = "auto";
        return {
            totalIncome: totalIncome,
            totalExpense: totalExpense
        }
    }

    showPieChart(sectionDiv, transactions, idAddName="") {
        const div = document.createElement("div");
        div.id = `balance_chart${idAddName}`;
        div.classList.add("chart_local");
        sectionDiv.append(div);

        const transactionsSummary = this._summarizeTransactions(transactions);
        const data = [{
            type: "pie",
            values: Object.values(transactionsSummary),
            labels: Object.keys(transactionsSummary),
            textinfo: "label+percent",
            textposition: "outside",
            automargin: true
        }]
          
        const layout = {
            showlegend: false,
            height: 300,
            width: 400,
            plot_bgcolor: '#f2efef',
            paper_bgcolor: '#f2efef',
            margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
            font: { family: 'Arapey', size: 14 }
        };
        Plotly.newPlot(div.id, data, layout);
        // Center plotly graph...
        const divPlotly = document.querySelector(`#${div.id} .user-select-none.svg-container`);
        divPlotly.style.margin = "auto";
    }

    showIncomes(sectionDiv) {
        this.showPieChart(sectionDiv, this.incomes, "_incomes");
        sectionDiv.append(this._createTable(this.incomes, "income"));
    }
    
    showExpenses(sectionDiv) {
        this.showPieChart(sectionDiv, this.expenses, "_expenses");
        sectionDiv.append(this._createTable(this.expenses, "expense"));
    }

    _aggregateTransactionData(transactions, transactionOptions) {

        // Initialize the empty data set
        const transactionContainer = [];
        for (let option of transactionOptions) {
            transactionContainer[option] = [];
        }

        for (const [_, element] of Object.entries(transactions)) {
            const transactionRow = [];
            for (const [count, value] of Object.entries(element)) {
                transactionRow[count] = value;
            }
            const tempCategory = transactionRow.category;
            delete transactionRow.category;
            transactionContainer[tempCategory].push(transactionRow);
        }
        return transactionContainer;
    }

    _summarizeTransactions(transactions) {
        const transactionsSummary = [];
        for (const [categoryTransactionName, categoryTransactions] of Object.entries(transactions)) {
            const catTransactionName = capitalizeFirstLetter(categoryTransactionName);
            let sum = 0;
            for (let catTransaction of categoryTransactions) {
                sum += parseFloat(catTransaction["amount"]);
            }
            if (sum > 0) {
                transactionsSummary[catTransactionName] = sum.toFixed(2);
            }
        }
        return transactionsSummary;
    }

    _createTable(transactions, transactionType) {

        // All income data
        const divAll = document.createElement("div");

        // Different categories
        for (const [categoryTransactionName, categoryTransactions] of Object.entries(transactions)) {
            const catTransactionName = capitalizeFirstLetter(categoryTransactionName);
            
            // Add sum of for the category (only if transactions exist...)
            let sum = 0;
            for (let catTransaction of categoryTransactions) {
                sum += parseFloat(catTransaction["amount"]);
            }
            if (sum > 0) {
                const categorySummary = document.createElement("div");
                categorySummary.classList.add("transaction_category")
                const catSummarySpan = document.createElement("span");
                catSummarySpan.textContent = `${catTransactionName}: ${sum.toFixed(2)}`;
                categorySummary.append(catSummarySpan);
                categorySummary.append(document.createElement("hr"));
                divAll.append(categorySummary);
            }
            
            // Add category elements
            for (let catTransaction of categoryTransactions) {
                const divRow = document.createElement("div");
                divRow.classList.add("transaction_row");
                divRow.id = `${transactionType}_${catTransaction["id"]}`;

                const divDate = document.createElement("div");
                divDate.classList.add("transaction_cell");
                const spanDate = document.createElement("span");
                spanDate.textContent = catTransaction["issue_date"];
                divDate.append(spanDate);
                divRow.append(divDate);

                const divAmount = document.createElement("div");
                divAmount.classList.add("transaction_cell");
                const spanAmount = document.createElement("span");
                spanAmount.textContent = catTransaction["amount"];
                divAmount.append(spanAmount);
                divRow.append(divAmount);

                const divComment = document.createElement("div");
                divComment.classList.add("transaction_cell", "transaction-cell-comment");
                const spanComment = document.createElement("span");
                spanComment.textContent = catTransaction["comment"];
                divComment.append(spanComment);
                divRow.append(divComment);

                const divDeleteTransaction = document.createElement("div");
                divDeleteTransaction.classList.add("transaction_cell", "transaction-cell-icon");
                const iconDelete = document.createElement("i");
                iconDelete.classList.add("fa", "fa-eraser", "custom-icon-style");
                divDeleteTransaction.append(iconDelete);
                divDeleteTransaction.addEventListener("click", async () => {
                    await deleteTransaction(transactionType, catTransaction["id"]);
                    showBalance();
                })
                divRow.append(divDeleteTransaction);

                const divModifyTransaction = document.createElement("div");
                divModifyTransaction.classList.add("transaction_cell", "transaction-cell-icon");
                const iconModify = document.createElement("i");
                iconModify.classList.add("fa", "fa-pencil-square-o", "custom-icon-style");
                divModifyTransaction.append(iconModify);
                divModifyTransaction.addEventListener("click", async () => {
                    await modifyTransaction(transactionType, catTransaction);
                    showBalance();
                })
                divRow.append(divModifyTransaction);

                divAll.append(divRow);
            }
        }
        return divAll;
    }
}
