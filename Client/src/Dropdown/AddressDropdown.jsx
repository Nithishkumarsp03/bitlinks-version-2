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
        const fetchAddresses = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/addressdata', {
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
                const activeAddresses = data.results.filter(address => address.status === 1);
                const formattedOptions = activeAddresses.map(addr => ({
                    value: addr.address_column,
                    label: addr.address_column,
                }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
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
        const newAddress = { address_column: inputValue };

        try {
            const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/addressdata/add', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify(newAddress)
            });

            if (response.status === 401) {
                setLogopen(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to create new address');
            }

            const result = await response.json();
            const createdOption = { value: inputValue, label: inputValue };
            setOptions(prev => [...prev, createdOption]);
            setSelectedOption(createdOption);
            onChange(createdOption);
        } catch (error) {
            console.error('Error creating address:', error);
        }
    };

    const customStyles = {
        menuList: (provided) => ({
            ...provided,
            maxHeight: '120px',
            overflowY: 'auto',
        }),
    };

    return (
        <CreatableSelect
            placeholder="Search for location"
            value={selectedOption}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={options}
            isClearable
            styles={customStyles}
            components={{ DropdownIndicator }}
        />
    );
};

export default AddressDropdown;
