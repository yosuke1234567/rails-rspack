import { useState } from "react"
import styles from './App.module.scss'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div>
			<div className={styles.inner}>
				<h1>Rspack + React + TypeScript</h1>
				<button type="button" onClick={() => setCount(count => count + 1)}>
					count is {count}
				</button>
			</div>
		</div>
	)
}

export default App
