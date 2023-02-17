/*
This module stores queries for getting data from the server.
*/

export class QueryAPI {
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
        await axios.postForm(
            url, 
            formObj
        ).then((res) => {
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
        }
        ).catch((error) => {
            console.log("Oh no... ERROR!", error);
        });
    }
}
