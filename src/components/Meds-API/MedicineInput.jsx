import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../service/baseURL";

const MedicineInput = ({ selectedMedicines, setSelectedMedicines }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cachedMedicines, setCachedMedicines] = useState([]);

  const fetchMedicines = async () => {
    if (query.length < 3) return;
    try {
      const res = await axios.get(`${baseURL}/auto/medicines`, {
        params: { query },
      });
      setCachedMedicines(res.data || []);
      filterSuggestions(query, res.data || []);
    } catch (err) {
      console.error("Error fetching Medicines:", err);
    }
  };

  const filterSuggestions = (input, data = cachedMedicines) => {
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const addMedicine = (cond) => {
    if (!selectedMedicines.includes(cond)) {
      setSelectedMedicines([...selectedMedicines, cond]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeMedicine = (cond) => {
    setSelectedMedicines(selectedMedicines.filter((c) => c !== cond));
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Search Medicine..."
        onChange={(e) => {
          setQuery(e.target.value);
          filterSuggestions(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            fetchMedicines();
          }
        }}
        className="w-full border p-2 rounded mb-1"
      />
      {suggestions.length > 0 && (
        <ul className="border bg-white absolute z-10 max-h-40 overflow-y-auto w-full">
          {suggestions.map((sugg, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => addMedicine(sugg)}
            >
              {sugg}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedMedicines.map((cond, i) => (
          <span
            key={i}
            className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {cond}
            <button
              onClick={() => removeMedicine(cond)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MedicineInput;
