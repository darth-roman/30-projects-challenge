export class FlagIcon extends HTMLElement{
    constructor(){
        super()
        this._countryCode = null

        const shadowRoot = this.attachShadow({mode: "open"})

    }

    static get observedAttributes(){
        return ["country"]
    }

    attributeChangedCallback(name, oldValue, newValue){
        this._countryCode = newValue
        this._updateRendering()
    }

    connectedCallback(){
        this._updateRendering()
    }

    get country(){
        return this._countryCode
    }

    set country(v){
        this.setAttribute("country", v)
    }

    _updateRendering(){
        if(!this.ownerDocument.defaultView){
            return;
        }

        this.shadowRoot.innerHTML = ""

        if(!this.country){
            return
        } 

        const code = this._countryCode.toLowerCase()
        const img = document.createElement("img")

        img.src = `https://flagcdn.com/w40/${code}.png`
        img.alt = `${this._countryCode.toUpperCase()} flag`
        img.style.width = "100%"
        img.style.height = "auto"
        img.style.display = "inline-block"

        this.shadowRoot.appendChild(img)
    }
}

customElements.define("flag-icon", FlagIcon)