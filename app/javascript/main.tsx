import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

const main = () => {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', main)
} else {
	main()
}
