export { Modal }


class Modal {

    MODAL_NAME_ID = null

    constructor(modalDivName) {
        this.MODAL_NAME_ID = modalDivName;
        this.modalDiv = document.createElement("div");
        this.dialogDiv = document.createElement("div");
        this.contentDiv = document.createElement("div");
        this._createModalLayer(modalDivName);
    }

    getModal() {
        return this.modalDiv;
    }

    showModal() {
        $(`#${this.MODAL_NAME_ID}`).modal("show");
    }

    _createModalLayer(modalDivName) {
        this.modalDiv.id = modalDivName;
        this.modalDiv.classList.add("modal", "fade", "custom");
        this.modalDiv.role = "dialog";

        this.dialogDiv.classList.add("modal-dialog");
        this.contentDiv.classList.add("modal-content");

        this.modalDiv.append(this.dialogDiv);
        this.dialogDiv.append(this.contentDiv);
    }

    createHeaderDiv(headerText) {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("modal-header");
        headerDiv.innerHTML = headerText;
        this.contentDiv.append(headerDiv);
    }

    addBodyDiv(bodyDiv) {
        bodyDiv.classList.add("modal-body");
        this.contentDiv.append(bodyDiv);
    }

    addFooterDiv(footerDiv) {
        footerDiv.classList.add("modal-footer");

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerText = "Close";
        footerDiv.append(closeButton);
        this.contentDiv.append(footerDiv);
    }
}