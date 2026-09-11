import { MoleculeViewer } from "./MoleculeViewer.js";


addEventListener("DOMContentLoaded", ()=>{
    const btn = document.querySelector("button")
    const moleculeCIF = document.querySelector("#cif")

    // const legend = document.createElement("h3")
    // legend.textContent = `${document.querySelector("molecule-viewer").getAttribute("pdb-id")}'s Structure`
    // moleculViewerStatus.appendChild(legend)

    btn.addEventListener("click", () => {
        const mol = document.querySelector("molecule-viewer")
        mol.setAttribute("pdb-id", moleculeCIF.value)
    })
})