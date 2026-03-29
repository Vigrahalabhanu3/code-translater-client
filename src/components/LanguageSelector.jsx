import { LANGUAGES } from "../constants/languages.js";
import "../styles/components.css";

function LanguageSelector({ value, onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="lang-select"
    >
      <option value="">Select</option>
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;