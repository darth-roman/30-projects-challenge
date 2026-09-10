export class PhoneNumber extends HTMLElement{
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        this.render()

    }
    
    checkPhoneNumber(input){
        const regextPattern = new RegExp("^0(5|6|7)[0-9]{8}$")
        return regextPattern.test(input.value)
    }
    
    render(){
        let template = document.querySelector("#phone-field");
        let templateContent = template.content;
        
        this.shadowRoot.innerHTML = ""
        this.shadowRoot.appendChild(document.importNode(templateContent, true));

        const inputEl = this.shadowRoot.querySelector("input")
        const smallEl = this.shadowRoot.querySelector("small")
        
        this.shadowRoot.querySelector("input").addEventListener("input", (e) =>{
            if(!this.checkPhoneNumber(inputEl)){
                inputEl.style.border = "solid 2px red"
                smallEl.textContent = "Invalid"
            }else{
                inputEl.style.border = "solid 2px green"
                smallEl.textContent = "Valid"
            }
        })
    }
}

customElements.define("phone-number", PhoneNumber);