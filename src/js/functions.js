class Settings {
    constructor(){
        this.addButtons();
    }
    addButtons() {
        var content = 
        "<button>Change Password</button>" + 
        "<button>Edit Income Categories</button>" + 
        "<button>Edit Expense Categories</button>"
    }
}

class Options {
    constructor(id, optionNames) {
        this.options = [];
        this.defaultOptions = ["other"];
        this.id = id;
        this.addOptions(optionNames);
    }
    addOption(optionName) {
        if (
            !this.defaultOptions.includes(optionName) &&
            optionName != this.id
        ) {
            this.options.push(optionName);
            this.options.sort();
        }
    }
    addOptions(optionNames) {
        for (let optionName of optionNames) {
            this.addOption(optionName);
        }
    }
    removeOption(optionName) {}
    changeOptionName(optionName, newOptionName) {}
    showOptions(elementID) {
        var optionsToShow =
            '<option value="' +
            this.id +
            '" disabled selected>' +
            this.id +
            "</option>";
        for (let option of this.options) {
            optionsToShow +=
                '<option value="' + option + '">' + option + "</option>";
        }
        for (let option of this.defaultOptions) {
            optionsToShow +=
                '<option value="' + option + '">' + option + "</option>";
        }
        document.getElementById(elementID).innerHTML = optionsToShow;
    }
}

// DEFINITION OF VARIABLES
let incomeOptions = new Options(
    "category", 
    [
        "bank interest", 
        "pay"
    ]
);
let paymentOptions = new Options(
    "payment option", 
    [
        "cash",
        "credit card",
        "debit card",
    ]
);
let expenseOptions = new Options(
    "category", 
    [
        "appartment",
        "books",
        "children",
        "clothes",
        "debts",
        "donation",
        "entertainment",
        "food",
        "healthcare",
        "internet",
        "phone",
        "savings",
        "training",
        "transport",
        "travel",
        "tv",
        "retirement",
    ]
);

function runAddIncome() {
    incomeOptions.showOptions("income-category-select");
}

function runAddExpense() {
    paymentOptions.showOptions("payment-option-select");
    expenseOptions.showOptions("expense-category-select");
}

function changeSettings(elementID) {
    var content = 
    "<button>Change Password</button>" + 
    "<button>Edit Income Categories</button>" + 
    "<button>Edit Expense Categories</button>"
    document.getElementById(elementID).innerHTML = content;
}

// function addExpense(elementID) {
//     var content = 
//     "<form>" + 
//     '<input type="number" min="0" step="0.01" placeholder="amount" onfocus="this.placeholder='amount'" onblur="this.placeholder='amount'" required>' +
//     <input type="date" min='2010-01-01' required>
//     <select name="payment-method" id="payment-option-select" required></select>
//     <select name="category" id="expense-category-select" required></select>
//     <input type="text" placeholder="comment (optional)" onfocus="this.placeholder='optional comment'" onblur="this.placeholder='optional comment'">
//     <button>Add</button>
// </form>"
// }