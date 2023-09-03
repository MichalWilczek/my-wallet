export { Modal }


class Modal {

    MODAL_NAME_ID = null

    constructor(modalDivName) {
        this.MODAL_NAME_ID = modalDivName;
        this.modalDiv = document.createElement("div");
        this.dialogDiv = document.createElement("div");
        this.contentDiv = document.createElement("div");
        this.closeButton = this._getCloseButton();
        this._createModalLayer(modalDivName);
    }

    getModal() {
        return this.modalDiv;
    }

    getCloseButton() {
        return this.closeButton;
    }

    showModal() {
        const modal = new bootstrap.Modal(document.querySelector(`#${this.MODAL_NAME_ID}`));
        modal.show();
    }

    _createModalLayer(modalDivName) {
        this.modalDiv.id = modalDivName;
        this.modalDiv.classList.add("modal", "fade", "custom");
        this.modalDiv.tabIndex = -1;
        this.modalDiv.setAttribute("aria-hidden", "true");
        this.modalDiv.setAttribute("aria-modal", "true");
        this.modalDiv.setAttribute("role", "dialog");
        this.modalDiv.setAttribute("id", modalDivName);

        this.dialogDiv.classList.add("modal-dialog");
        this.contentDiv.classList.add("modal-content");

        this.modalDiv.append(this.dialogDiv);
        this.dialogDiv.append(this.contentDiv);
    }

    _getCloseButton() {
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.setAttribute("data-bs-dismiss", "modal");
        closeButton.innerText = "Close";
        return closeButton;
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
        footerDiv.append(this.closeButton);
        this.contentDiv.append(footerDiv);
    }
}