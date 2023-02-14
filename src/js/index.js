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

const logIn = (elementID, loginButtonID) => {
    document.querySelector(`#${loginButtonID}`).remove();
    clearBox(elementID);

    const sectionLogin = document.createElement("section");
    sectionLogin.classList.add("login_registration");

    const heading = document.createElement("h2");
    heading.innerText = "Please, log in";
    sectionLogin.append(heading);
    const form = document.createElement("form");
    form.method = "post";
    form.action = "login.php";

    createUserElementwithLabel(form, "text", "user-name-login-id", "username", "User name", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "password", "password-login-id", "password", "Password", ["fa", "fa-unlock-alt"]);
    const button = document.createElement("button");
    button.innerText = "Log in";
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

const getRegistrationDataAPI = async (url, querySelectorObj) => {
    
    const res = await axios.postForm(url, document.querySelector(querySelectorObj))
        .then((res) => {

            try {
                // Remove the messages from previous round if they exist.
                const msgFromPrevIteration = document.querySelector("#divMsgID");
                if(msgFromPrevIteration!==null) {
                    msgFromPrevIteration.remove()
                }

                // Put the success/error messages on the screen.
                const div = document.createElement("div");
                div.id = "divMsgID";
                const data = res.data;
                console.log(data.registrationSuccessful);
                if (data.registrationSuccessful) {
                    const divTemp = document.createElement("div");
                    divTemp.classList.add("msg_div");
                    const spanSuccess = document.createElement("span");
                    spanSuccess.classList.add("msg_success");
                    spanSuccess.textContent = "Your account has been successfully created!";
                    divTemp.append(spanSuccess);
                    div.append(divTemp);
                } else {
                    for (const [errorType, messsage] of Object.entries(data.errors)) {
                        const divTemp = document.createElement("div");
                        divTemp.classList.add("msg_div");
                        const spanError = document.createElement("span");
                        spanError.classList.add("msg_error");
                        spanError.textContent = `${errorType.toUpperCase()}: ${messsage}`;
                        divTemp.append(spanError);
                        div.append(divTemp);
                        }
                }
                const section = document.querySelector("#registerSectionID");
                section.append(div);
            } catch (e) {
                console.log("Oh no... ERROR!", e);
            }
            
        })
        .catch((error) => {
            console.log("Oh no... ERROR!", error);
        })
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
    form.id = "formRegistration";
    createUserElementwithLabel(form, "text", "user-name-registration-id", "username", "User name", ["fa", "fa-user"]);

    const divForm1 = document.createElement("div");
    const spanError = document.createElement("span");
    spanError.id = "registrationErrorMessageID";
    spanError.classList.add("error_message");
    divForm1.append(spanError);
    form.append(divForm1);

    createUserElementwithLabel(form, "text", "user-name-email-id", "email", "Email", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "password", "password-registration1-id", "password1", "Password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "password-registration2-id", "password2", "Repeated password", ["fa", "fa-unlock-alt"]);

    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Register";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        getRegistrationDataAPI("/my-wallet/src/server/registration.php", `#${form.id}`);
      })

    form.append(button);
    sectionRegister.append(form);
    document.querySelector(`#${elementID}`).append(sectionRegister);
}
