/*
This module stores objects to operate on: 
    - user data received from the server
    - options for income and expense settings
*/
import { showBalance } from './balance.js';
import { getUserData } from './api.js';
import { API } from './api.js';
import { capitalizeFirstLetter} from './utils.js';
import { Modal } from './modal.js';
import { 
    IncomeTransactionModification, 
    ExpenseTransactionModification 
} from './transaction_operators.js';
export { UserData }


const deleteUserTransaction = async (transactionType, transactionID) => {
    const transactionQuery = new API();
    await transactionQuery.postDict(
        "/my-wallet/src/server/transaction_operation.php", 
        {
            'procedure': 'delete', 
            'transaction_type': transactionType,
            'transaction_id': transactionID
        }
    );
    window.userData = await getUserData(window.userDateFrom, window.userDateTo);
    showBalance(window.userData);
}

const modifyUserTransaction = async (transactionType, transactionData) => {
    const modalID = "modify-transaction-modal";
    const modalElement = document.querySelector(`#${modalID}`);
    if (modalElement !== null) {
        modalElement.remove();
    }
    const modalObj = new Modal(modalID);

    let transactionObj = null;
    if (transactionType === 'income') {
        transactionObj = new IncomeTransactionModification(transactionData);
        modalObj.createHeaderDiv("Modify income");
    } else if (transactionType === 'expense') {
        transactionObj = new ExpenseTransactionModification(transactionData); 
        modalObj.createHeaderDiv("Modify expense"); 
    } else {
        throw new Exception(`Transaction type: ${transactionType} must be either 'income' or 'expense'.`);
    }
    const divBody = document.createElement("div");
    const form = transactionObj.generateForm(transactionData);
    divBody.append(form);
    modalObj.addBodyDiv(divBody);
    const footer = document.createElement("div");
    let submitButtonClicked = false;
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Modify";
    submitButton.addEventListener("click", async () => {
        const query = new API("Your transaction has been successfully modified!");
        const result = await query.postForm(
            "/my-wallet/src/server/transaction_operation.php",
            form,
            {
                'procedure': 'modify', 
                'transaction_type': transactionType,
                'transaction_id': transactionData.id
            }
        );
        query.generateOutputMessage(result, divBody);
        submitButtonClicked = true;
    })
    footer.append(submitButton);
    modalObj.closeButton.addEventListener("click", async () => {
        if (submitButtonClicked === true) {
            window.userData = await getUserData(window.userDateFrom, window.userDateTo);
            showBalance(window.userData);
        }
    })
    modalObj.addFooterDiv(footer);
    document.body.append(modalObj.getModal());
    modalObj.showModal();
}

class UserData {

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
                    await deleteUserTransaction(transactionType, catTransaction["id"]);
                })
                divRow.append(divDeleteTransaction);

                const divModifyTransaction = document.createElement("div");
                divModifyTransaction.classList.add("transaction_cell", "transaction-cell-icon");
                const iconModify = document.createElement("i");
                iconModify.classList.add("fa", "fa-pencil-square-o", "custom-icon-style");
                divModifyTransaction.append(iconModify);
                divModifyTransaction.addEventListener("click", async () => {
                    const userTransactionDefaultData = catTransaction;
                    userTransactionDefaultData["transaction_category"] = categoryTransactionName;
                    await modifyUserTransaction(transactionType, userTransactionDefaultData);
                })
                divRow.append(divModifyTransaction);

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
        // Center plotly graph...
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
    createElement(defaultSelectedName=null) {
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
            if (option === defaultSelectedName) {
                newOption.selected = true;
            }
            selectObj.append(newOption);
        }
        return selectObj;
    }
}
