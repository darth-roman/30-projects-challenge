const SMILES_REGEX = /^([A-Za-z0-9@+\-\[\]\(\)\\\/=#%.:]|%(?=\d{2}))+$/
let container = null
let options = {}
let smilesDrawer = new SmilesDrawer.Drawer(options);
// document.addEventListener("DOMContentLoaded", () =>{
    
//   })
  
window.addEventListener("mouseup", (e)=>{
    let selection = window.getSelection()
    let selectedText = selection.toString()
    if (isSmiles(selectedText)){
      setTimeout(() => {
        createContainer(selectedText, smilesDrawer)
      }, 0)
    }else{
      removeContainer()
      console.error("Not a SMILES");
    }
})

window.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    removeContainer()
  }
})
function isSmiles(text){
  return SMILES_REGEX.test(text)
}

function removeContainer() {
  if (container) {
    container.remove();
    container = null;
  }
}

function createContainer(selectedText, smilesDrawer){
  removeContainer()

  container = document.createElement("div")
  container.setAttribute("id", "smiles-floating-popover")
  container.style.position = "fixed";
  // container.style.left = `${posX}px`;
  container.style.top = `0px`;

  const canvas = document.createElement("canvas")
  
  const para = document.createElement("p")
  para.classList = "smiles-caption"
  para.textContent = selectedText

  container.appendChild(canvas)
  container.appendChild(para)
  document.body.appendChild(container)

  SmilesDrawer.parse(selectedText, (tree) => {
      smilesDrawer.draw(tree, canvas, "light", false)
  })
}