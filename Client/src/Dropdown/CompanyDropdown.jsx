import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select from 'react-select';
import { decryptData } from '../Utils/crypto/cryptoHelper';
import useStore from '../store/store';

const AddressDropdown = ({ value, onChange }) => {
    const {setLogopen} = useStore();
    const [name, setName] = useState([]);
    const [selectedOption, setSelectedOption] = useState(value);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API + '/api/dropdown/companynamedata', {
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
                const filteredcompany = data.results.filter(role => role.status === 1);
                setName(filteredcompany);
            } catch (error) {
                console.error('Error fetching name:', error);
            }
        };

        fetchCompany();
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

    const options = name.map(company => ({
        value: company.company_column,
        label: company.company_column,
    }));

    return (
        <Select
            placeholder="Select Companyname"
            value={selectedOption}
            onChange={handleSelectChange}
            options={options}
            isClearable
        />
    );
};

export default AddressDropdown;
