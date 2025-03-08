import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, LinearProgress, Box } from '@mui/material';
import Input from '@mui/joy/Input';
import AddressDropdown from '../../Dropdown/AddressDropdown';  // Assuming it's a custom dropdown
import "../../Styles/dialog.css"
import { useParams } from 'react-router-dom';
import { decryptData } from '../../Utils/crypto/cryptoHelper';
import useStore from '../../store/store';

const Alumni = ({ open, setAlumniopen, setalumniCompletion, showSnackbar }) => {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const { uuid } = useParams();
  const [alumniInfo, setAlumniInfo] = useState({
    name: '',
    batch: '',
    graduatedyear: '',
    phonenumber: '',
    companyaddress: null,  // Empty string initially
  });

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setAlumniInfo({ ...alumniInfo, [name]: value });
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(alumniInfo).length;
    const filledFields = Object.values(alumniInfo).filter((value) => {
      if (value === null) return false; // For select fields
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    }).length;
    return (filledFields / totalFields) * 100;
  };

  setalumniCompletion(calculateProgress())

  const fetchAlumni = async () => {
    try {
      const res = await fetch(`${api}/api/infograph/fetch/alumni`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ uuid: uuid }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        showSnackbar(data.message, 'error')
        throw new Error(data.message);
      }

      const alumni = data.alumni[0]

      setAlumniInfo({
        name: alumni.name || '',
        batch: alumni.batch || '',
        graduatedyear: alumni.graduatedyear || '',
        phonenumber: alumni.phonenumber || '',
        companyaddress: alumni.companyaddress 
        ? { value: alumni.companyaddress, label: alumni.companyaddress }
        : null, 
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [uuid]);

  const completion = calculateProgress()

  const handleSaveChanges = async(event) => {
    event.preventDefault();

    const updateAlumni = {
      uuid: uuid,
      name: alumniInfo.name,
      batch: alumniInfo.batch,
      graduatedyear: alumniInfo.graduatedyear,
      phonenumber: alumniInfo.phonenumber,
      companyaddress: alumniInfo.companyaddress,
      completion: completion
    }

    try {
      const res = await fetch(`${api}/api/infograph/update/alumni`,{
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ updateAlumni }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const data = await res.json()
      if(!res.ok){
        showSnackbar(data.message, 'error')
        throw new Error(data.message);
      }

      showSnackbar('Alumni Info Updated Successfully', 'success')
      setAlumniopen(false);
    } catch (error) {
      showSnackbar(error, 'error');
    }
  };

  return (
    <Dialog open={open} onClose={() => setAlumniopen(false)} maxWidth="sm" fullWidth>
      <LinearProgress
        variant="determinate"
        value={calculateProgress()}
        sx={{ height: 10 }}
      />
      <DialogTitle>Alumni Details</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="input-group">
            <div>
              <Input
                placeholder="Name"
                name="name"
                value={alumniInfo.name}
                onChange={handleDetailsChange}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                placeholder="Batch"
                name="batch"
                value={alumniInfo.batch}
                onChange={handleDetailsChange}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: "15px" }}>
            <Input
              placeholder="Graduated Year"
              type='number'
              name="graduatedyear"
              value={alumniInfo.graduatedyear}
              onChange={handleDetailsChange}
              fullWidth
              required
            />
            <Input
              placeholder="Phone Number"
              name="phonenumber"
              value={alumniInfo.phonenumber}
              onChange={handleDetailsChange}
              fullWidth
              required
            />
          </div>
          <Box>
            {/* Ensure the value prop is correctly passed to the AddressDropdown */}
            <AddressDropdown
              value={alumniInfo.companyaddress}  // This value should be set to 'Dubai' or null
              onChange={(newValue) => setAlumniInfo({ ...alumniInfo, companyaddress: newValue })}
            />
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAlumniopen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleSaveChanges} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Alumni;
