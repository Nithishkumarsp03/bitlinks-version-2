import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';

const AddressDropdown = ({ value, onChange }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/addressdata', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${localStorage.getItem("token")}`,
                      },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const filteredAddresses = data.results.filter(address => address.status === 1);
                setAddresses(filteredAddresses); 
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
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

    const options = addresses.map(address => ({
        value: address.address_column,
        label: address.address_column,
    }));

    return (
        <FormControl fullWidth>
            <InputLabel id="address-select-label" style={{ display: 'none' }}>Address</InputLabel>
            <Select
                placeholder="Select Location"
                labelId="address-select-label"
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                isClearable
                styles={customStyles}
            />
        </FormControl>
    );
};

export default AddressDropdown;
