export class SubmitButton {
    defautInnerText: string;
    innerText: string;
    isActive: boolean;

    constructor(innerText: string) {

        this.defautInnerText = innerText;
        this.innerText = innerText;
        this.isActive = true;
    }

    deactivate() {
        this.innerText = "Please Wait";
        this.isActive = false;
    }

    activate() {
        this.innerText = this.defautInnerText;
        this.isActive = true;
    }

}