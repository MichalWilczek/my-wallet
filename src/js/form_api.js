/*
This module exports FormAPI class which stores queries for getting data from the server.
*/
export { FormAPI }

class FormAPI {
    /**
     * Constructor for FormAPI.
     * @param {string} successMsg - Success message to be displayed once the query is sucessfully executed.
     */
    constructor(successMsg) {
        this.successMsg = successMsg;
    }

    /**
     * Creates a div element with a span element containing a message for (un)successful query result.
     * @param {string} spanClassName - The CSS class name for the span element.
     * @param {string} spanContent - The message to be displayed in the span element.
     * @returns {HTMLDivElement} A div element with a span element.
     */
    _createDivWithMsg = (spanClassName, spanContent) => {
        const div = document.createElement("div");
        div.classList.add("msg_div");
        const span = document.createElement("span");
        span.classList.add(spanClassName);
        span.textContent = spanContent;
        div.append(span);
        return div;
    }

    /**
     * Sends a POST request to the server with form data and displays response messages.
     * @param {string} url - The URL to which the request will be sent.
     * @param {FormData} formObj - A FormData object containing form data to be sent.
     * @param {HTMLElement} sectionObj - The section element to which the response messages will be appended.
     * @returns {Object} An object containing response data from the server.
     */
    postForm = async (url, formObj, sectionObj) => {
        try {
            const res = await axios.postForm(url, formObj)
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
                for (const [errorType, message] of Object.entries(data.errors)) {
                    div.append(
                        this._createDivWithMsg(
                            "msg_error",
                            `${errorType.toUpperCase()}: ${message}`
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