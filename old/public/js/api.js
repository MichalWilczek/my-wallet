/*
This module exports FormAPI class which stores queries for getting data from the server.
*/
import { UserData} from './user_data.js';
export { addTransaction, getUserData, API }


const addTransaction = async (form, div, transactionDict) => {
    const transactionQuery = new API("You have successfully posted a transaction!");
    const res = await transactionQuery.postForm(
        "/server/transaction_operation.php", 
        form, 
        transactionDict
    );
    transactionQuery.generateOutputMessage(res, div);
}

const getUserData = async (dateFrom=null, dateTo=null) => {
    try {
        const queryAPI = new API();
        const dictAPI = await queryAPI.postDict(
            "/server/login.php",
            {
                'dateFrom': dateFrom,
                'dateTo': dateTo
            }
        );
        if (dictAPI.successful) {
            const userData = new UserData(
                dictAPI.id,
                dictAPI.userName,
                dictAPI.userData.incomeData.incomes,
                dictAPI.userData.expenseData.expenses,
                dictAPI.userData.incomeData.incomeOptions,
                dictAPI.userData.expenseData.expenseOptions,
                dictAPI.userData.expenseData.paymentOptions
            );
            return userData;
        } else {
            throw new Exception(`User data from: '${dateFrom}' to: '${dateTo}' where not successfully queried from the server.`);
        }
    } catch (e) {
        console.log(
            "Unexpected error occured while querying data of the logged in user from server."
        );
        console.log("Error: ", e);
    }
}

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
        const msgID = "divMsgID"
        const previousMsg = document.querySelector(`#${msgID}`)
        if (previousMsg !== null) {
            previousMsg.remove();
        }

        const div = document.createElement("div");
        div.id = msgID;
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