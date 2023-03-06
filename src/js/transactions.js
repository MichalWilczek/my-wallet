export { IncomeOperator, ExpenseOperator }


// Abstract class
class TransactionOperator {

    addTransaction() {
        throw new Error("Method 'addTransaction()' must be implemented.");
    }
    modifyTransaction() {
        throw new Error("Method 'modifyTransaction()' must be implemented.");
    }
    // deleteTransaction() {
    //     // To be check if this is needed...
    //     throw new Error("Method 'deleteTransaction()' must be implemented.");
    // }
}

class IncomeOperator extends TransactionOperator {

    addTransaction() {

    }

    modifyTransaction() {

    }
}

class ExpenseOperator extends IncomeOperator {
    
    addTransaction() {

    }

    modifyTransaction() {
        
    }
}