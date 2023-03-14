import { logIn, registerUser, logOut, runUserPortal } from './index.js';
import { changeSettings } from './user_options.js';
import { addIncome, addExpense } from './transaction_operators.js';
import { showBalance } from './balance.js'


// Global session variables and objects
window.userData = null;
window.userDateFrom = null;
window.userDateTo = null;

// Global functions
window.logIn = logIn;
window.registerUser = registerUser;
window.logOut = logOut;
window.runUserPortal = runUserPortal;
window.showBalance = showBalance;
window.addIncome = addIncome;
window.addExpense = addExpense;
window.changeSettings = changeSettings;