type UrlInputProps = {
  value: string
  onChange: (url: string) => void
}

const links = [
    'https://nypost.com/2026/01/21/world-news/south-koreas-former-prime-minister-jailed-for-23-years/',
    'https://www.fool.com/investing/2026/01/21/3-red-hot-growth-stocks-to-buy-in-2026/',
    'https://www.nytimes.com/wirecutter/reviews/best-usb-c-battery-packs-and-power-banks/'
]

export default function UrlInput({ value, onChange }: UrlInputProps) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <select
        onChange={(e) => onChange(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Choose an article
        </option>
        {links.map((url) => (
          <option key={url} value={url}>
            {url}
          </option>
        ))}
      </select>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste article URL here"
        style={{ flex: 1 }}
      />
    </div>
  )
}
