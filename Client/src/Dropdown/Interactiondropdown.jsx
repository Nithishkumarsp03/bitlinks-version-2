import React, { useState, useEffect } from "react";
import Select from "react-select";
import { decryptData } from "../Utils/crypto/cryptoHelper";
import useStore from "../store/store";

export default function InteractionDropdown({
  purpose,
  setPurpose,
  handleChange,
}) {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`${api}/api/dropdown/interactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
          },
        });
        if(res.status == 401){
          setLogopen(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          // console.log('Interactions:', data);
          // Ensure data is an array
          if (Array.isArray(data.data)) {
            setInteractions(data.data);
          } else {
            console.error("Fetched data is not an array:", data);
          }
        } else {
          console.error("Failed to fetch interactions:", res.status);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error.message);
      }
    };

    fetchInteractions();
  }, []); // Run the effect once when the component mounts

  return (
    <div>
      <Select
        placeholder="Select type of Conversation"
        options={interactions.map((interaction) => ({
          value: interaction.interaction,  // Use the `interaction` field for value
          label: interaction.interaction,   // Use the `interaction` field for the label
        }))}
        onChange={handleChange}
        isClearable
      />
    </div>
  );
}
