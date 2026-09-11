export class MoleculePanel extends HTMLElement {
    constructor(){
        super()
        const shadowRoot = this.attachShadow({mode: "open"})
        this.messageText = document.createElement("h3")
        this.messageText.textContent = `${this.getAttribute("pdb")}'s Beauty Structure`
        this.messageText.style.color = "white"
        this.messageText.style.position = "absolute"
        this.messageText.style.zIndex = "3"
        this.messageText.style.padding = "1rem"

        this.shadowRoot.appendChild(this.messageText)
    }

    static get observedAttributes(){
        return["pdb"]
    }

    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue !== newValue){
            this.render()
        }
    }

    connectedCallback(){
        this.render()
    }

    render(){
        this.messageText.textContent = ""
        this.messageText.textContent = `${this.getAttribute("pdb")}'s Structure`
        this.shadowRoot.appendChild(messageText)
    }
}

customElements.define("molecule-panel", MoleculePanel)