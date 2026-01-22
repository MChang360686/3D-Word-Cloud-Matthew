import { useState, useRef } from "react"

type ComboBoxProps = {
  options: string[];
  onChange: (value: string) => void;
}

const ComboBox = ({ options, onChange }: ComboBoxProps) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSelect = (option: string) => {
    setValue(option);
    setOpen(false);
    onChange(option);
  };

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div style={{ position: "relative", width: "80%" }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
          onChange(e.target.value)
        }}
        onFocus={() => setOpen(true)}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="combo-options"
        style={{ width: "100%", padding: "8px" }}
        placeholder="Select or type..."
      />

      {open && filtered.length > 0 && (
        <ul
          id="combo-options"
          role="listbox"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            position: "absolute",
            width: "100%",
            border: "1px solid #ccc",
            background: "white",
            zIndex: 10,
          }}
        >
          {filtered.map((option) => (
            <li
              key={option}
              role="option"
              onClick={() => handleSelect(option)}
              style={{ padding: "8px", cursor: "pointer", textAlign: "left" }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComboBox
