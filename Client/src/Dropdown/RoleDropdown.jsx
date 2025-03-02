import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import { decryptData } from '../Utils/crypto/cryptoHelper';

const RoleDropdown = ({ value, onChange }) => {
    const [roles, setRoles] = useState([]);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/roledata', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                      },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const filteredRoles = data.results.filter(role => role.status === 1);
                setRoles(filteredRoles);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
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
        onChange(selectedOption);
    };

    const options = roles.map(role => ({
        value: role.role_column,
        label: role.role_column,
    }));

    return (
        <Select
            placeholder="Select Role"
            value={selectedOption}
            onChange={handleSelectChange}
            options={options}
            isClearable
        />
    );
};

export default RoleDropdown;
