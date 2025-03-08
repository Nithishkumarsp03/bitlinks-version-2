import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Input } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import Adddata from "../../Dialog/settings/Adddata";
import Deletedata from "../../Dialog/settings/Deletedata";
import useStore from "../../store/store";
import { SyncLoader } from "react-spinners";

export default function DataTable({ tab }) {
  const {setLogopen} = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setopendelete] = useState(false);
  const [deleteid, setDeleteid] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const api = process.env.REACT_APP_API;

  const columnMapping = {
    location: "address_column",
    companyname: "company_column",
    domain: "domain_column",
    role: "role_column",
    skillset: "skillset_column",
    login: "EMAIL",
  };

  const columnKey = columnMapping[tab] || "column";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = decryptData(localStorage.getItem("token"));
      const response = await fetch(`${api}/api/settings/${tab}/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if(response.status == 401){
        setLogopen(true);
        return;
      }
      const responseText = await response.text();
      const result = JSON.parse(responseText);
      setData(result.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SyncLoader color="#2867B2" />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  const handleDelete = (id) => {
    setDeleteid(id);
    setopendelete(true);
  };

  const handleFreeze = async (id, status) => {
    const newStatus = status === 0 ? 1 : 0;
    try {
      const token = decryptData(localStorage.getItem("token"));
      const res = await fetch(`${api}/api/settings/${tab}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on the search query
  const filteredData = data.filter((item) => {
    if (tab === "login") {
      return (
        item["EMAIL"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item["NAME"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item["ROLE"]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return item[columnKey]?.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <Box p={2}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Typography variant="h4">
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
          <Input
            placeholder="Search"
            variant="plain"
            value={searchQuery}
            onChange={handleSearchChange}
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Add
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {tab === "login" ? (
              <TableRow>
                <TableCell>Sno</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>Sno</TableCell>
                <TableCell>Column</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {filteredData.map((item, index) =>
              tab === "login" ? (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item["EMAIL"]}</TableCell>
                  <TableCell>{item["NAME"]}</TableCell>
                  <TableCell>{item["ROLE"]}</TableCell>
                  <TableCell>
                    {item.STATUS === 0 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFreeze(item.ID, item.STATUS)}
                      >
                        Unfreeze
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleFreeze(item.ID, item.STATUS)}
                      >
                        Freeze
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(item.ID)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item[columnKey]}</TableCell>
                  <TableCell>
                    {item.status === 0 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFreeze(item.id, item.status)}
                      >
                        Unfreeze
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleFreeze(item.id, item.status)}
                      >
                        Freeze
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Adddata
        tab={tab}
        open={openDialog}
        setOpen={setOpenDialog}
        fetchData={fetchData}
      />
      <Deletedata
        tab={tab}
        open={openDelete}
        setOpen={setopendelete}
        fetchData={fetchData}
        id={deleteid}
      />
    </Box>
  );
}
