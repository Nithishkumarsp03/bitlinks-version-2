import React, { useEffect, useState } from 'react';
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

const RoleDropdown = ({ value, onChange }) => {
    const { setLogopen } = useStore();
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

                if (response.status === 401) {
                    setLogopen(true);
                    return;
                }

                const data = await response.json();
                const filteredRoles = data.results.filter(role => role.status === 1);
                const formattedRoles = filteredRoles.map(role => ({
                    value: role.role_column,
                    label: role.role_column,
                }));

                setRoles(formattedRoles);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (typeof value === "string") {
            setSelectedOption({ value, label: value });
        } else {
            setSelectedOption(value);
        }
    }, [value]);

    const handleChange = (option) => {
        setSelectedOption(option);
        onChange(option);
    };

    const handleCreate = async (inputValue) => {
        const newRole = { role_column: inputValue };

        try {
            const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/roledata/add', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify(newRole)
            });

            if (response.status === 401) {
                setLogopen(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to add new role');
            }

            const result = await response.json();
            const createdOption = { value: inputValue, label: inputValue };
            setRoles(prev => [...prev, createdOption]);
            setSelectedOption(createdOption);
            onChange(createdOption);
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    return (
        <CreatableSelect
            placeholder="Search for Role"
            value={selectedOption}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={roles}
            isClearable
            components={{ DropdownIndicator }}
        />
    );
};

export default RoleDropdown;
