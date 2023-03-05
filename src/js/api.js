/*
This module exports FormAPI class which stores queries for getting data from the server.
*/
export { API }

class API {

    constructor(successMsg="") {
        this.successMsg = successMsg;
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

    postForm = async (url, formObj, additionalPostKeys={}) => {
        try {
            const formData = new FormData(formObj);
            for (const [key, value] of Object.entries(additionalPostKeys)) { 
                formData.append(key, value);
            }
            const res = await axios.postForm(url, formData);
            return res.data;
        } catch (e) {
            console.log("An error occurred while sending server request.");
            console.log("Error: ", e);
        }
    }

    postDict = async (url, dict, postNullValues=false) => {
        try {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(dict)) { 
                if (value === null) {
                    if (postNullValues) {
                        params.append(key, value);
                    }
                } else {
                    params.append(key, value);
                }
            }
            const res = await axios.post(
                url, 
                params
            );
            return res.data;
        } catch (e) {
            console.log("An error occurred while sending server request.");
            console.log("Error: ", e);
        }
    }

    generateOutputMessage(dictAPI, sectionObj) {
        const div = document.createElement("div");
        div.id = "divMsgID";
        if (dictAPI.successful) {
            div.append(
                this._createDivWithMsg(
                    "msg_success",
                    this.successMsg
                )
            );
        } else {
            for (const [errorType, message] of Object.entries(dictAPI.errors)) {
                div.append(
                    this._createDivWithMsg(
                        "msg_error",
                        `${errorType.toUpperCase()}: ${message}`
                    )
                );
            }
        }
        sectionObj.append(div);
    }
}