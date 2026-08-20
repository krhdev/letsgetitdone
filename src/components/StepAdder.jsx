import { useState } from "react";
import { Plus } from "lucide-react";

export default function StepAdder({ onAdd }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };
  return (
    <form className="step-adder" onSubmit={submit}>
      <input
        className="text-input small"
        placeholder="Next tiny step..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="add-btn small">
        <Plus size={14} />
      </button>
    </form>
  );
}
