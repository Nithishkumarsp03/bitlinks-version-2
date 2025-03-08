import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import { decryptData } from '../Utils/crypto/cryptoHelper';
import useStore from '../store/store';

const SkillsetDropdown = ({ value, onChange }) => {
    const {setLogopen} = useStore();
    const [skills, setSkills] = useState([]);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/skillsets', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                      },
                });

                if(response.status == 401){
                    setLogopen(true);
                    return;
                  }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const filteredSkills = data.results.filter(skills => skills.status === 1);
                setSkills(filteredSkills); 
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, []);

    useEffect(() => {
        if (typeof value === "string") {
            setSelectedOption({ value, label: value }); // Convert string to object
        } else {
            setSelectedOption(value);
        }
    }, [value]);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption); // Pass selected object to parent
    };

    const customStyles = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: '100px',
            overflowY: 'auto',
        }),
    };

    const options = skills.map(skills => ({
        value: skills.skillset_column,
        label: skills.skillset_column,
    }));

    return (
        <FormControl fullWidth>
            <InputLabel id="skill-select-label" style={{ display: 'none' }}>Skillset</InputLabel>
            <Select
                placeholder="Select Skillsets"
                labelId="skill-select-label"
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                isMulti
                isClearable
                styles={customStyles}
            />
        </FormControl>
    );
};

export default SkillsetDropdown;
