/*
This is the main JS interface for the MyWallet app. 
It serves for: 
    - registering the user
    - logging in
    - plotting the balance
    - storing temporary data from the session
*/
import { clearBox, createUserElementwithLabel } from './utils.js';
import { FormAPI } from './form_api.js';
import { UserData, getUserData} from './user_data.js';
import { BalanceOptions } from './period_options.js';
export { showBalance }


// Global session values used by the program.
window.userData = UserData;

const runUserPortal = async (
    userElementID='upper_nav_bar_span_id', 
    pageContentID='main_page_content',
    dateFrom=null,
    dateTo=null
) => {
    try {
        window.userData = await getUserData(dateFrom, dateTo);
        showUserID(userElementID);
        showBalanceSheet(pageContentID);
    } catch (e) {
        console.log(
            "Unexpected error occured while ploting the user webpage."
        );
        console.log("Error: ", e);
    }
}

const showUserID = (elementID) => {
    const spanElement = document.querySelector(`#${elementID}`);
    spanElement.textContent = `Welcome ${window.userData.username}`;
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

const clickLogin = async (form, div) => {
    const loginQuery = new FormAPI("You have been successfully logged in to your account!");
    const data = await loginQuery.postForm(
        "/my-wallet/src/server/login.php", 
        form,
        div
    )
    if (data.successful) {
        location.assign("/my-wallet/src/user_portal.php");
        window.userData = new UserData(
            data.id,
            data.userName,
            data.userData.incomeData.incomes,
            data.userData.expenseData.expenses,
            data.userData.incomeData.incomeOptions,
            data.userData.expenseData.expenseOptions,
            data.userData.expenseData.paymentOptions
        );
    }
}

const logIn = (elementID, loginButtonID) => {
    document.querySelector(`#${loginButtonID}`).remove();
    clearBox(elementID);

    const sectionLogin = document.createElement("section");
    sectionLogin.classList.add("login_registration");

    const heading = document.createElement("h2");
    heading.innerText = "Please, log in";
    sectionLogin.append(heading);
    const form = document.createElement("form");
    form.id = "formLogin";
    createUserElementwithLabel(form, "text", "user-name-login-id", "username", "User name", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "password", "password-login-id", "password", "Password", ["fa", "fa-unlock-alt"]);
    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Log in";
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Remove the messages from previous round if they exist.
        const msgFromPrevIteration = document.querySelector("#divMsgID");
        if(msgFromPrevIteration!==null) {
            msgFromPrevIteration.remove()
        }
        clickLogin(form, sectionRegister);
      }
    )
    form.append(button);
    sectionLogin.append(form);

    const sectionRegister = document.createElement("section"); 
    const paragraph = document.createElement("p");
    const span1 = document.createElement("span");
    span1.innerText = "Don't have an account yet? Sign up ";
    const span2 = document.createElement("span");
    span2.innerText = "here"
    span2.classList.add("clickable_span");
    span2.addEventListener("click", () => registerUser(elementID));
    const span3 = document.createElement("span");
    span3.innerText = "!"
    paragraph.append(span1);
    paragraph.append(span2);
    paragraph.append(span3);
    sectionRegister.append(paragraph);
    document.querySelector(`#${elementID}`).append(sectionLogin);
    document.querySelector(`#${elementID}`).append(sectionRegister);
}

const logOut = async (elementID) => {
    document.querySelector(`#${elementID}`)
    .addEventListener("click", () => (location.assign("/my-wallet/src/server/logout.php")));
}

const registerUser = (elementID) => {
    clearBox(elementID);    

    const sectionRegister = document.createElement("section");
    sectionRegister.id = "registerSectionID";
    sectionRegister.classList.add("login_registration");
    const heading = document.createElement("h2");
    heading.innerText = "Please, register";
    sectionRegister.append(heading);

    const form = document.createElement("form");
    createUserElementwithLabel(form, "text", "user-name-registration-id", "username", "User name", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "text", "user-name-email-id", "email", "Email", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "password", "password-registration1-id", "password1", "Password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "password-registration2-id", "password2", "Repeated password", ["fa", "fa-unlock-alt"]);

    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Register";
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Remove the messages from previous round if they exist.
        const msgFromPrevIteration = document.querySelector("#divMsgID");
        if(msgFromPrevIteration!==null) {
            msgFromPrevIteration.remove()
        }
        const registrationQuery = new FormAPI("Your account has been successfully created!");
        registrationQuery.postForm(
            "/my-wallet/src/server/registration.php", 
            form,
            sectionRegister
        );
      }
    )
    form.append(button);
    sectionRegister.append(form);
    document.querySelector(`#${elementID}`).append(sectionRegister);
}

// Global function accessible from the module
window.logIn = logIn;
window.registerUser = registerUser;
window.logOut = logOut;
window.runUserPortal = runUserPortal;
window.showBalance = showBalance;
