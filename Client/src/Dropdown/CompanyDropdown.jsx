import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import { decryptData } from '../Utils/crypto/cryptoHelper';
import useStore from '../store/store';
import SearchIcon from '@mui/icons-material/Search';

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <SearchIcon fontSize="small" />
        </components.DropdownIndicator>
    );
};

const AddressDropdown = ({ value, onChange }) => {
    const { setLogopen } = useStore();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/companynamedata', {
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
                const activeCompanies = data.results.filter(role => role.status === 1);
                const formattedOptions = activeCompanies.map(company => ({
                    value: company.company_column,
                    label: company.company_column,
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
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
        const newCompany = { company_column: inputValue };

        try {
            const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/companynamedata/add', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify(newCompany)
            });

            if (response.status === 401) {
                setLogopen(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to create new company');
            }

            const result = await response.json();
            const createdOption = { value: inputValue, label: inputValue };
            setOptions(prev => [...prev, createdOption]);
            setSelectedOption(createdOption);
            onChange(createdOption);
        } catch (error) {
            console.error('Error creating company:', error);
        }
    };

    return (
        <CreatableSelect
            placeholder="Search for Company"
            value={selectedOption}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={options}
            components={{ DropdownIndicator }}
            isClearable
        />
    );
};

export default AddressDropdown;
