
class Modal {

    constructor(modalDivName) {
        this.modalDivName = modalDivName;
    }

    createModal(bodyDiv, footerDiv=null, headerText=null) {

        const mainDiv = document.createElement("div");
        mainDiv.id = this.modalDivName;
        mainDiv.classList.add("modal", "fade", "custom");
        mainDiv.role = "dialog";
    
        const dialogDiv = document.createElement("div");
        dialogDiv.classList.add("modal-dialog");
        
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("modal-content");

        // Create header
        if (headerText !== null) {
            const headerDiv = document.createElement("div");
            headerDiv.classList.add("modal-header");
            headerDiv.innerHTML = headerText;
            contentDiv.append(headerDiv);
        }
        
        // Create body, i.e., assign Bootstrap class 
        bodyDiv.classList.add("modal-body");
        contentDiv.append(bodyDiv);

        // Create footer



        
        dialogDiv.append(contentDiv);
        mainDiv.append(dialogDiv);

        const footerDiv = document.createElement("div");
        footerDiv.classList.add("modal-footer");

        // Add submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.innerText = "Submit";
        submitButton.addEventListener("click", () => {
            submitButton.dataset.dismiss = "modal";
            window.userDateFrom = dateFromInput.value;
            window.userDateTo = dateToInput.value;
            this._showPeriodBalanceFromModal(dateFromInput.value, dateToInput.value);
        })
        footerDiv.append(submitButton);

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerText = "Close";
        footerDiv.append(closeButton);
        
        contentDiv.append(footerDiv);

    }

    showModal() {

    }

}