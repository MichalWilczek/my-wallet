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

const registerUser = (elementID) => {
    clearBox(elementID);

    const sectionRegister = document.createElement("section");
    sectionRegister.classList.add("login_registration");
    const heading = document.createElement("h2");
    heading.innerText = "Please, register";
    sectionRegister.append(heading);

    const form = document.createElement("form");
    form.method = "post";
    form.action = "registration.php";

    createUserElementwithLabel(form, "text", "user-name-registration-id", "username", "User name", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "text", "user-name-email-id", "email", "Email", ["fa", "fa-user"]);
    createUserElementwithLabel(form, "password", "password-registration-id", "password1", "Password", ["fa", "fa-unlock-alt"]);
    createUserElementwithLabel(form, "password", "password-registration-id", "password2", "Repeated password", ["fa", "fa-unlock-alt"]);

    const recaptcha = document.createElement("div");

    // Think of adding ReCaptcha element to the registration !!!
    // recaptcha.classList.add("g-recaptcha");
    // recaptcha.datasitekey = "6LfJyl8kAAAAALSqi2Lr_wvB5XzKNDvkq714tuN4";
    // form.append(recaptcha);
    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Register";
    form.append(button);
    sectionRegister.append(form);


    // <?php
    // if (isset($_SESSION["error"])) {
    //     echo $_SESSION["error"];
    // }
    // ?>


    document.querySelector(`#${elementID}`).append(sectionRegister);
}

// const showMainPage = (elementID) => {
//     clearBox(elementID);
//     const section = document.createElement("section");

//     const image = document.createElement("img");
//     image.classList.add("background_photo");
//     image.src = "img/background-photo.jpg";
//     image.alt = "Background photo for quote";
//     section.append(image);

//     header = document.createElement("h2");
//     header.innerHTML = "A budget is more than just a series of numbers on a page; <br> it is an embodiment of our values."
//     section.append(header);

//     document.querySelector(`#${elementID}`).append(section);
// }

