import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "../service/baseURL"; // Make sure this points to your backend

const DiseaseInput = ({ selectedDiseases, setSelectedDiseases }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cachedDiseases, setCachedDiseases] = useState([]);

  const fetchDiseases = async () => {
    if (query.length < 3) return;
    try {
      const res = await axios.get(`${baseURL}/auto/diseases`, {
        params: { query },
      });
      setCachedDiseases(res.data || []);
      filterSuggestions(query, res.data || []);
    } catch (err) {
      console.error("Error fetching Diseases:", err);
    }
  };

  const filterSuggestions = (input, data = cachedDiseases) => {
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const addDisease = (disease) => {
    if (!selectedDiseases.includes(disease)) {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeDisease = (disease) => {
    setSelectedDiseases(selectedDiseases.filter((d) => d !== disease));
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Search Disease..."
        onChange={(e) => {
          setQuery(e.target.value);
          filterSuggestions(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            fetchDiseases();
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
              onClick={() => addDisease(sugg)}
            >
              {sugg}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedDiseases.map((disease, i) => (
          <span
            key={i}
            className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {disease}
            <button
              onClick={() => removeDisease(disease)}
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

export default DiseaseInput;