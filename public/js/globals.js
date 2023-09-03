import { runUserPortal, showBalance } from './index.js';
import { changeSettings } from './user_options.js';
import { addTransaction } from './transactions.js';


// Global session variables and objects
window.userData = null;
window.appErrors = [];
window.userDateFrom = null;
window.userDateTo = null;
window.host = "localhost";

// Global functions
window.runUserPortal = runUserPortal;
window.showBalance = showBalance;
window.addTransaction = addTransaction;
window.changeSettings = changeSettings;
