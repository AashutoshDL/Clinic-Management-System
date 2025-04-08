import React, { useState } from "react";
import { baseURL } from "../service/baseURL";
import axios from "axios";


const MedicineForm = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [cachedConditions, setCachedConditions] = useState([]);

    const fetchConditions = async () => {
        if (query.length < 3) return;

        try {
            const response = await axios.get(`${baseURL}/auto/medicines`, { params: { query } });
            setCachedConditions(response.data);
            filterSuggestions(query, response.data);
        } catch (error) {
            console.error("Error fetching conditions:", error);
        }
    };

    const filterSuggestions = (input, data = cachedConditions) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        const filtered = data.filter(cond => cond.toLowerCase().includes(input.toLowerCase()));
        setSuggestions(filtered);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        filterSuggestions(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            fetchConditions();
        }
    };

    const addCondition = (condition) => {
        if (!selectedConditions.includes(condition)) {
            setSelectedConditions([...selectedConditions, condition]);
        }
        setQuery("");
        setSuggestions([]);
    };

    const removeCondition = (condition) => {
        setSelectedConditions(selectedConditions.filter(c => c !== condition));
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h2>Medicine Entry Form</h2>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for a medicine..."
                style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
            />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto", position: "absolute", width: "100%", backgroundColor: "white", zIndex: 1 }}>
                {suggestions.map((cond, index) => (
                    <li key={index} onClick={() => addCondition(cond)} style={{ padding: "8px", cursor: "pointer" }}>
                        {cond}
                    </li>
                ))}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
                {selectedConditions.map((condition, index) => (
                    <div key={index} style={{ backgroundColor: "#ddd", padding: "5px", borderRadius: "5px", display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "5px" }}>{condition}</span>
                        <span onClick={() => removeCondition(condition)} style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>×</span>
                    </div>
                ))}
            </div>
            <button style={{ marginTop: "10px", padding: "8px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
                Submit
            </button>
        </div>
    );
};

export default MedicineForm;
