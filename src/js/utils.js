export const clearBox = (elementID) => {
    const element = document.querySelector(`#${elementID}`);
    element.innerHTML = "";
}

export const createUserElementwithLabel = (
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