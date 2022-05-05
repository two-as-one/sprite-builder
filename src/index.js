import "core-js/stable"
import "regenerator-runtime/runtime"
import { MyApp } from "components/MyApp"

customElements.define("my-app", MyApp)
document.body.appendChild(document.createElement("my-app"))
document.body.style.margin = 0
document.body.style.backgroundColor = "#000"
