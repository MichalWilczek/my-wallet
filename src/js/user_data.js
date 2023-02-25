/*
This module stores objects to operate on: 
    - general user data received from the server
    - options for income and expense settings
*/
import { capitalizeFirstLetter} from './utils.js';
// import { config, actions } from './pie_chart.js'

export { getUserData, UserData, Options }


const getUserData = async () => {
    try {
        const res = await axios.post("/my-wallet/src/server/login.php", {});
        const dictAPI = res.data;
        const userData = new UserData(
            dictAPI.id,
            dictAPI.userName,
            dictAPI.userData.incomeData.incomes,
            dictAPI.userData.expenseData.expenses,
            dictAPI.userData.incomeData.incomeOptions,
            dictAPI.userData.expenseData.expenseOptions,
            dictAPI.userData.expenseData.paymentOptions
        );
        return userData;
    } catch (e) {
        console.log(
            "Unexpected error occured while querying data of the logged in user from server."
        );
        console.log("Error: ", e);
    }
}

class UserData {

    GRAPH_LAYOUT = {
        height: 400,
        width: 400,
        plot_bgcolor: '#f2efef',
        paper_bgcolor: '#f2efef',
        font: {
            family: 'Arapey',
            size: 14
        }
    }

    constructor(
        userID, 
        username, 
        incomes=[], 
        expenses=[],
        incomeOptions=[],
        expenseOptions=[],
        paymentOptions=[]
    ) {
        this.userID = userID;
        this.username = username;
        this.incomeOptions = new Options("income-option", incomeOptions);
        this.expenseOptions = new Options("expense-option", expenseOptions);
        this.paymentOptions = new Options("payment-option", paymentOptions);
        this.incomes = this._aggregateTransactionData(incomes, incomeOptions);
        this.expenses = this._aggregateTransactionData(expenses, expenseOptions);
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
                divRow.id = `${transactionType}_${catTransaction["id"]}`;

                const divDate = document.createElement("div");
                divDate.classList.add("transaction_row");
                const spanDate = document.createElement("span");
                spanDate.textContent = catTransaction["issue_date"];
                divDate.append(spanDate);
                divRow.append(divDate);

                const divAmount = document.createElement("div");
                divAmount.classList.add("transaction_row");
                const spanAmount = document.createElement("span");
                spanAmount.textContent = catTransaction["amount"];
                divAmount.append(spanAmount);
                divRow.append(divAmount);

                const divComment = document.createElement("div");
                divComment.classList.add("transaction_row");
                divComment.style = "width: 200px;"
                const spanComment = document.createElement("span");
                spanComment.textContent = catTransaction["comment"];
                divComment.append(spanComment);
                divRow.append(divComment);

                divAll.append(divRow);
            }
        }
        return divAll;
    }

    setIncomeOptions(incomeOptions) {
        this.incomeOptions = new Options("income-option", incomeOptions)
    }
    setExpenseOptions(expenseOptions) {
        this.expenseOptions = new Options("expense-option", expenseOptions);
    }
    setPaymentOptions(paymentOptions) {
        this.paymentOptions = new Options("payment-option", paymentOptions);
    }

    showIncomeExpenseSummaryChart(sectionDiv, idAddName="") {
        const div = document.createElement("div");
        div.id = `total_summary_chart_${idAddName}`;
        div.classList.add("chart_local");
        sectionDiv.append(div);

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
        
        const data = [{
            x: ['Total income', 'Total expenses'],
            y: [totalIncome, totalExpense],
            type: 'bar'
        }];
        
        const layout = this.GRAPH_LAYOUT;
        Plotly.newPlot(div.id, data, layout);
    }

    showPieChart(sectionDiv, transactions, idAddName="") {
        const div = document.createElement("div");
        div.id = `balance_chart_${idAddName}`;
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
          
        const layout = this.GRAPH_LAYOUT;
        layout["showlegend"] = true;
        layout["margin"] = {"t": 0, "b": 0, "l": 0, "r": 0};
        Plotly.newPlot(div.id, data, layout);
    }

    showIncomes(sectionDiv) {
        this.showPieChart(sectionDiv, this.incomes, "incomes");
        sectionDiv.append(this._createTable(this.incomes, "incomes"));
    }
    
    showExpenses(sectionDiv) {
        this.showPieChart(sectionDiv, this.expenses, "expenses");
        sectionDiv.append(this._createTable(this.expenses, "expenses"));
    }
}

class Options {
    constructor(id, optionNames) {
        this.options = [];
        this.id = id;
        this.addOptions(optionNames);
    }
    addOption(optionName) {
        this.options.push(optionName);
        this.options.sort();
    }
    addOptions(optionNames) {
        for (let optionName of optionNames) {
            this.addOption(optionName);
        }
    }
    removeOption(optionName) {
        this.options = this.options.filter(
            existingOption => existingOption !== optionName
        );
    }
    createElement() {
        const selectObj = document.createElement("select");
        selectObj.name = this.id;
        selectObj.id = `${this.id}`;
        selectObj.required = true;

        const baseOption = document.createElement("option");
        baseOption.id = `${this.id}_base_option`
        baseOption.value = this.id;
        baseOption.disabled = true;
        baseOption.selected = true;
        baseOption.innerText = `--- ${this.id} ---`;
        selectObj.append(baseOption);

        for (let option of this.options) {
            const newOption = document.createElement("option");
            newOption.value = option;
            newOption.innerText = option;
            selectObj.append(newOption);
        }
        return selectObj;
    }
}
