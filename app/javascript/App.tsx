import { useState } from "react"

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className="App">
			<h1>Rspack + React + TypeScript</h1>
			<div className="card">
				<button type="button" onClick={() => setCount(count => count + 1)}>
					count is {count}
				</button>
			</div>
		</div>
	)
}

export default App
