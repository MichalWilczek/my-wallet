/*
This module stores queries for getting data from the server.
*/
export {FormAPI}


class FormAPI {
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
        try {
            const res = await axios.postForm(
                url, 
                formObj
            )
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
            return data;
        } catch (e) {
            console.log("An error occurred while sending server request.");
            console.log("Error: ", e);
        }
    }
}
