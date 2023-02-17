/*
This is the main JS interface for the MyWallet app. 
It serves for: 
    - registering the user
    - logging in
    - plotting the balance
    - storing temporary data from the session
*/
import { clearBox, createUserElementwithLabel } from './utils.js';
import { UserData } from './user_data.js';
import { QueryAPI} from './api_queries.js';

// Global session values used by the program.
const userData = null;

const showUserID = (elementID) => {
    const spanElement = document.querySelector(`#${elementID}`);
    spanElement.textContent = `Welcome ${userData.username}`;
}

const showBalance = (elementID) => {
    clearBox(elementID);
    window.scrollTo(0, 0);
    const header = document.createElement("h2");
    header.innerText = "Wallet balance:"
    document.querySelector(`#${elementID}`).append(header);
}

const clickLogin = async (form, div) => {
    loginQuery = new QueryAPI("You have been successfully logged in to your account!");
    await loginQuery.postForm(
        "/my-wallet/src/server/login.php", 
        form,
        div
    ).then((res) => {
        alert(res);
        if (res.data.successful) {
            location.assign("/my-wallet/src/user_portal.php");
            userData = new UserData(
                userID = res.data.id,
                username = res.data.userName,
                incomes = res.data.userData,
                expenses = res.data.userData
            );
        }
    }
    ).catch((error) => {
        console.log("Oh no... ERROR!", error);
    })
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
        registrationQuery = new QueryAPI("Your account has been successfully created!");
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
window.showBalance = showBalance;
window.showUserID = showUserID;