import { useState } from "react"
import WordCloud from "./WordCloud.tsx"
import "./App.css"

export default function App() {
  const [url, setUrl] = useState("")
  const [words, setWords] = useState<any[]>([])
  const [sizeMode, setSizeMode] = useState(true)
  const [colorMode, setColorMode] = useState(true)

  const fetchWords = async () => {
    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })

    const data = await res.json()

    const entries = Object.entries(data.top_words)

    setWords(
      entries.map(([text, weight], i) => ({
        text,
        weight,
        position: [
          Math.cos(i) * 4,
          Math.sin(i) * 4,
          (Math.random() - 0.5) * 4,
        ],
      }))
    )
  }

  const links = [
    'https://nypost.com/2026/01/21/world-news/south-koreas-former-prime-minister-jailed-for-23-years/',
    'https://www.fool.com/investing/2026/01/21/3-red-hot-growth-stocks-to-buy-in-2026/',
    'https://www.nytimes.com/wirecutter/reviews/best-usb-c-battery-packs-and-power-banks/'
  ]
  const listLinks = links.map(link => <li>{link}</li>)

  return (
    <div className="container">
      <h1>
        3D Word Cloud Generator
      </h1>
      <ul>
        {listLinks}
      </ul>
      <input
        placeholder="Paste article URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="controls">
        <label>
          <input
            type="radio"
            checked={sizeMode}
            onChange={() => setSizeMode(true)}
          />
          Size by TF-IDF
        </label>

        <label>
          <input
            type="radio"
            checked={!sizeMode}
            onChange={() => setSizeMode(false)}
          />
          Uniform Size
        </label>

        <label>
          <input
            type="radio"
            checked={colorMode}
            onChange={() => setColorMode(true)}
          />
          Heatmap Color
        </label>

        <label>
          <input
            type="radio"
            checked={!colorMode}
            onChange={() => setColorMode(false)}
          />
          Neutral Color
        </label>
      </div>

      <WordCloud
        words={words}
        sizeMode={sizeMode}
        colorMode={colorMode}
      />

      <button onClick={fetchWords}>Generate Word Cloud</button>
    </div>
  )
}
