export {
    createValueInput,
    createDateInput,
    createTextInput,
    createSelectInput,
    createButton,
    createFormElementDiv,
    createFormOutputMsg,
}


const createValueInput = (defaultValue=null) => {
    const div = createFormElementDiv();
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-money");
    div.append(icon);
    const amount = document.createElement("input");
    amount.type = "number";
    amount.name = "amount"
    if (!isNaN(defaultValue)) {
        amount.value = defaultValue
    }
    amount.placeholder = "amount";
    amount.min = 0;
    amount.step = 0.01;
    amount.required = true;
    div.append(amount);
    return div;
}


const createDateInput = (defaultValue=null) => {
    const div = createFormElementDiv();
    const date = document.createElement("input");
    date.type = "date";
    date.name = "date";
    if (defaultValue === null) {
        date.value = new Date().toISOString().slice(0,10);
    } else {
        date.value = defaultValue
    }
    date.required = true;
    div.append(date);
    return div;
}


const createTextInput = (inputName, placeholder, defaultValue=null) => {
    const div = createFormElementDiv();
    const comments = document.createElement("input");
    comments.type = "text";
    comments.name = inputName;
    if (defaultValue !== null) {
        comments.value = defaultValue;
    }
    comments.placeholder = placeholder;
    div.append(comments);
    return div;
}


const createSelectInput = (inputName, selectOptions, defaultSelectedName=null) => {
    const div = createFormElementDiv();
    const selectObj = document.createElement("select");
    selectObj.name = inputName;
    selectObj.id = `${inputName}`;
    selectObj.required = true;

    const baseOption = document.createElement("option");
    baseOption.id = `${inputName}_base_option`
    baseOption.value = inputName;
    baseOption.disabled = true;
    baseOption.selected = true;
    baseOption.innerText = `--- ${inputName} ---`;
    selectObj.append(baseOption);

    for (let option of selectOptions) {
        const newOption = document.createElement("option");
        newOption.value = option;
        newOption.innerText = option;
        if (option === defaultSelectedName) {
            newOption.selected = true;
        }
        selectObj.append(newOption);
    }
    div.append(selectObj);
    return div;
}


const createButton = (textContent, clickAction=null, ...clickActionParams) => {
    const div = createFormElementDiv();
    const button = document.createElement("button");
    button.addEventListener(
        "click",
        async () => {
            if (clickAction !== null) {
                await clickAction(...clickActionParams)
            }
        }
    );
    button.textContent = textContent;
    div.append(button);
    return div;
}


const createFormElementDiv = () => {
    const div = document.createElement("div");
    div.classList.add("form_element");
    return div;
}


const createFormOutputMsg = (msg, div, success=true) => {
    let spanClassName = "msg_error";
    if (success) {
        spanClassName = "msg_success";
    }
    
    const msgID = "divMsgID";
    const previousMsg = document.querySelector(`#${msgID}`)
    if (previousMsg !== null) {
        previousMsg.remove();
    }

    const divMsg = document.createElement("div");
    divMsg.classList.add("msg_div");
    const span = document.createElement("span");
    span.classList.add(spanClassName);
    span.textContent = msg;
    divMsg.append(span);

    const divFinal = document.createElement("div");
    divFinal.id = msgID;
    divFinal.append(divMsg);
    divFinal.append(div);

    return divFinal;
}
