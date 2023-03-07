/*
This is the main JS interface for the MyWallet app. 
It serves for: 
    - registering the user
    - logging in
    - plotting the balance
    - storing temporary data from the session
*/
import { API, getUserData } from './api.js';
import { UserData} from './user_data.js';
import { showBalanceSheet } from './balance.js';
import { clearBox, createUserElementwithLabel } from './utils.js';
export { runUserPortal, showUserID, logIn, logOut, registerUser }


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

const clickLogin = async (form, div) => {
    const loginQuery = new API("You have been successfully logged in to your account!");
    const data = await loginQuery.postForm(
        "/my-wallet/src/server/login.php", 
        form
    )
    loginQuery.generateOutputMessage(data, div);
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
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Remove the messages from previous round if they exist.
        const msgFromPrevIteration = document.querySelector("#divMsgID");
        if(msgFromPrevIteration!==null) {
            msgFromPrevIteration.remove()
        }
        const registrationQuery = new API("Your account has been successfully created!");
        const results = await registrationQuery.postForm(
            "/my-wallet/src/server/registration.php", 
            form
        );
        registrationQuery.generateOutputMessage(results, sectionRegister);
      }
    )
    form.append(button);
    sectionRegister.append(form);
    document.querySelector(`#${elementID}`).append(sectionRegister);
}
