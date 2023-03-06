import { UserData } from './user_data.js';
import { logIn, registerUser, logOut, runUserPortal } from './index.js';
import { showBalance } from './balance.js'


// Global session variables and objects
window.userData = UserData;
window.userDateFrom = null;
window.userDateTo = null;

// Global functions
window.logIn = logIn;
window.registerUser = registerUser;
window.logOut = logOut;
window.runUserPortal = runUserPortal;
window.showBalance = showBalance;