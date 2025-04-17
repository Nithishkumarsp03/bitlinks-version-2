import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { decryptData } from '../Utils/crypto/cryptoHelper';
import useStore from '../store/store';
import { components } from 'react-select';
import SearchIcon from '@mui/icons-material/Search';

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <SearchIcon fontSize="small" />
        </components.DropdownIndicator>
    );
};

const SkillsetDropdown = ({ value, onChange }) => {
    const { setLogopen } = useStore();
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

                if (response.status === 401) {
                    setLogopen(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const filteredSkills = data.results.filter(skills => skills.status === 1);
                const formattedOptions = filteredSkills.map(skill => ({
                    value: skill.skillset_column,
                    label: skill.skillset_column,
                }));
                setSkills(formattedOptions);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, []);

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedOption(value.map(val =>
                typeof val === 'string' ? { value: val, label: val } : val
            ));
        } else if (typeof value === 'string') {
            setSelectedOption([{ value, label: value }]);
        } else {
            setSelectedOption(value || []);
        }
    }, [value]);

    const handleChange = (selected) => {
        setSelectedOption(selected);
        onChange(selected);
    };

    const handleCreate = async (inputValue) => {
        const newSkill = { skillset_column: inputValue };

        try {
            const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/skillsets/add', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify(newSkill)
            });

            if (response.status === 401) {
                setLogopen(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to add skill');
            }

            const newOption = { value: inputValue, label: inputValue };
            setSkills(prev => [...prev, newOption]);
            const updatedSelection = [...(selectedOption || []), newOption];
            setSelectedOption(updatedSelection);
            onChange(updatedSelection);
        } catch (error) {
            console.error('Error creating skill:', error);
        }
    };

    const customStyles = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: '100px',
            overflowY: 'auto',
        }),
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="skill-select-label" style={{ display: 'none' }}>Skillset</InputLabel>
            <CreatableSelect
                placeholder="Select or Add Skillsets"
                labelId="skill-select-label"
                value={selectedOption}
                onChange={handleChange}
                onCreateOption={handleCreate}
                options={skills}
                isMulti
                isClearable
                styles={customStyles}
                components={{ DropdownIndicator }}
            />
        </FormControl>
    );
};

export default SkillsetDropdown;
