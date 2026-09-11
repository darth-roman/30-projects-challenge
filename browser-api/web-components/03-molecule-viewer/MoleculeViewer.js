import { MoleculePanel } from "./MoleculePanel.js"

export class MoleculeViewer extends HTMLElement {
    constructor(){
        super()

        this.viewer = null
        const shadowRoot = this.attachShadow({mode: "open"})

        this.legend = document.createElement("molecule-panel")
        this.legend.setAttribute("pdb", this.getAttribute("pdb-id"))


        this.container = document.createElement("div")
        this.container.style.width = "40rem"
        this.container.style.height = "40rem"
        this.container.style.display = "flex"
        this.container.style.flexDirection = "column"

        shadowRoot.appendChild(this.legend)
        shadowRoot.appendChild(this.container)
    }

    static get observedAttributes(){
        return ["pdb-id"]
    }
    
    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue !== newValue){
            this.loadStructure()
            this.legend.setAttribute("pdb", this.getAttribute("pdb-id"))
            
        }
    }

    connectedCallback(){
        if(window.$3Dmol){
            this.initViewer()
        }else{
            console.error('3Dmol.js library must be loaded on the page.');
        }
    }


    initViewer(){
        const config = {
            backgroundColor: "black"
        }
        this.viewer = $3Dmol.createViewer(this.container, config)
        this.viewer._viewer.glDOM.style.position = "relative";
        this.viewer._viewer.glDOM.style.top = "0";
        
        this.loadStructure()
    }

    async loadStructure(){
        const pdbId = this.getAttribute("pdb-id")

        if(!pdbId) return;

        this.viewer.clear()

        try {
            const responose = await fetch(`https://files.rcsb.org/view/${pdbId}.cif`)
            const data = await responose.text()
            
            this.viewer.addModel(data, "cif")
            this.viewer.setStyle({}, {cartoon: {color: "spectrum"}})

            this.viewer.zoomTo();
            this.viewer.render();
        } catch (error) {
            console.error("Opsies");
            
        }
    }
}

customElements.define("molecule-viewer", MoleculeViewer)