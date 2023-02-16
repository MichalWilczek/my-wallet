// THESE FUNCTIONS SHOULD BE IN UTILS.JS BUT THE CODE IS CURRENTLY NOT WORKING, THEN...
// import { clearBox, createUserElementwithLabel } from './utils.js';
// ------------------------------------------------------------------------------------
const clearBox = (elementID) => {
    const element = document.querySelector(`#${elementID}`);
    element.innerHTML = "";
}

const createUserElementwithLabel = (
    form,
    type,
    elementID,
    name,
    labelText,
    iconName
) => {
    const inputLabel = document.createElement("label");
    inputLabel.for = elementID;
    inputLabel.innerText = labelText
    form.append(inputLabel);

    const div = document.createElement("div");
    div.classList.add("form_element");
    const icon = document.createElement("i");
    icon.classList.add(...iconName);
    div.append(icon);

    const inputContent = document.createElement("input");
    inputContent.type = type;
    inputContent.id = elementID;
    inputContent.name = name;
    inputContent.required = true;
    div.append(inputContent);
    form.append(div);
}
// HERE, THE UTILS.JS CODE IS ENDING!
// ------------------------------------------------------------------------------------
class UserData {
    constructor(userID, username) {
        this.userID = userID;
        this.username = username;
    }
}

class QueryAPI {
    constructor(successMsg, switchPage=false) {
        this.successMsg = successMsg;
        this.switchPage = switchPage;
    }

    _createDivWithMsg = (spanClassName, spanContent) => {
        const div = document.createElement("div");
        div.classList.add("msg_div");
        const span = document.createElement("span");
        span.classList.add(spanClassName);
        span.textContent = spanContent;
        div.append(span);
        return div;
    }
    
    postForm = async (url, formObj, sectionObj) => {
        const res = await axios.postForm(url, formObj)
        .then((res) => {
            const div = document.createElement("div");
            div.id = "divMsgID";
            const data = res.data;
            if (data.successful) {
                div.append(
                    this._createDivWithMsg(
                        "msg_success",
                        this.successMsg
                    )
                );
            } else {
                for (const [errorType, messsage] of Object.entries(data.errors)) {
                    div.append(
                        this._createDivWithMsg(
                            "msg_error",
                            `${errorType.toUpperCase()}: ${messsage}`
                        )
                    );
                }
            }
            sectionObj.append(div);
        })
        .then(() => {return res})
        .catch((error) => {
            console.log("Oh no... ERROR!", error);
        });
    }
}

const clickLogin = async (form, div) => {
    loginQuery = new QueryAPI("You have been successfully logged in to your account!");
    await loginQuery.postForm(
        "/my-wallet/src/server/login.php", 
        form,
        div
    ).then((res) => {
        if (res.data.successful) {
            location.assign("/my-wallet/src/user_portal.php");
        }
    })
    .catch((error) => {
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
