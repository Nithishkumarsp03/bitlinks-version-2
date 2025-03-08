import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import Spocdropdown from "../../Dropdown/Spocdropdown";
import ConflictResolutionDialog from "../../Dialog/datahub/ConflictResolutionDialog";
import ViewContactDialog from "../../Dialog/datahub/ViewContactDialog";
import NonconflictDialog from "../../Dialog/datahub/NonconflictDialog";
import NoDataFound from "../../Components/Nodatafound/Nodatafound";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import { SyncLoader } from "react-spinners";
import useStore from "../../store/store";
import "../../Styles/datahub.css";

export default function Datahub() {
  const {setLogopen} = useStore();
  const api = process.env.REACT_APP_API;
  const [fetchData, setfetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nonConflictopen, setnonConflictopen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [formValues, setFormValues] = useState({ projectLeader: "", rank: -1 });
  const [resolutions, setResolutions] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Fields that allow multiple selections.
  const multiSelectFields = ["hashtags", "purpose"];

  // Toggle contact selection
  const handleCheckboxChange = (tempId) => {
    setSelectedContacts((prev) =>
      prev.includes(tempId)
        ? prev.filter((id) => id !== tempId)
        : [...prev, tempId]
    );
  };

  const handleMergeInitiate = () => {
    if (selectedContacts.length === 0) {
      showSnackbar("Please select at least one contact to merge", 'error');
      return;
    }

    const selected = fetchData.filter((c) =>
      selectedContacts.includes(c.temp_id)
    );

    if (selected.length === 0) {
      showSnackbar("No valid contacts selected.", 'error');
      return;
    }

    if (selected.length === 1) {
      // Open NonConflictDialog instead of calling handleMergeComplete immediately
      setnonConflictopen(true);
      return;
    }

    const detectedConflicts = findConflicts(selected);

    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      setMergeDialogOpen(true);
    } else {
      setnonConflictopen(true);
    }
  };

  // Open view dialog for a single contact
  const handleView = (contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedContact(null);
  };

  // Detect conflicts on specific fields
  const findConflicts = (contacts) => {
    const fields = [
      "fullname",
      "guest_name",
      "phonenumber",
      "companyname",
      "role",
      "email",
      "dob",
      "designation",
      "linkedinurl",
      "visitingcard",
      "rating",
      "hashtags",
      "address",
      "purpose",
      "profile",
    ];

    return fields.reduce((acc, field) => {
      const values = contacts.map((c) => c[field]);
      // Count unique values (including empty strings)
      const uniqueValues = [
        ...new Set(values.filter((v) => v !== undefined && v !== null)),
      ];
      if (uniqueValues.length > 1) {
        acc.push({
          field,
          options: contacts.map((c) => ({
            id: c.temp_id,
            value: c[field],
            profile: c.profile, // For image fields
          })),
        });
      }
      return acc;
    }, []);
  };

  // Fetch contacts from the API
  const fetchdata = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/securehub/fetchdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setfetchData(data.contact);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  // For single-selection fields: update resolution with the chosen contact id.
  const handleResolutionChange = (field, tempId) => {
    setResolutions((prev) => ({ ...prev, [field]: tempId }));
  };

  // For multi-select fields: update resolution as an array of selected ids.
  const handleMultiSelectResolutionChange = (field, tempId) => {
    setResolutions((prev) => {
      const current = prev[field] || [];
      if (current.includes(tempId)) {
        return { ...prev, [field]: current.filter((id) => id !== tempId) };
      } else {
        return { ...prev, [field]: [...current, tempId] };
      }
    });
  };

  const createMergedData = (contacts, resolutions) => {
    if (!contacts || contacts.length === 0) {
      console.error("No contacts provided for merging.");
      return {}; // Prevents breaking the code
    }

    // console.log("Contacts inside createMergedData:", contacts);

    const firstContact = contacts[0];
    if (!firstContact) {
      console.error("First contact is undefined!");
      return {};
    }

    return Object.fromEntries(
      Object.keys(firstContact).map((key) => {
        if (multiSelectFields.includes(key)) {
          if (
            resolutions[key] &&
            Array.isArray(resolutions[key]) &&
            resolutions[key].length > 0
          ) {
            const values = resolutions[key]
              .map((id) => contacts.find((c) => c.temp_id === id)?.[key])
              .filter((v) => v && v.trim() !== "");
            return [key, values.join(", ")];
          } else {
            const values = [
              ...new Set(
                contacts.map((c) => c[key]).filter((v) => v && v.trim() !== "")
              ),
            ];
            return [key, values.join(", ")];
          }
        } else if (key === "profile" || key === "visitingcard") {
          if (resolutions[key]) {
            const value = contacts.find(
              (c) => c.temp_id === Number(resolutions[key])
            )?.[key];
            return [key, value];
          } else {
            const nonEmpty = contacts.find(
              (c) => c[key] && c[key].trim() !== ""
            );
            return [key, nonEmpty ? nonEmpty[key] : firstContact[key]];
          }
        } else {
          if (resolutions[key]) {
            const value = contacts.find(
              (c) => c.temp_id === Number(resolutions[key])
            )?.[key];
            return [key, value];
          } else {
            const values = [
              ...new Set(
                contacts
                  .map((c) => c[key])
                  .filter((v) => v !== "" && v !== null && v !== undefined)
              ),
            ];
            if (values.length === 1) {
              return [key, values[0]];
            } else if (values.length > 1) {
              return [key, values.join(", ")];
            } else {
              return [key, firstContact[key]];
            }
          }
        }
      })
    );
  };

  // Complete merge by sending merged data to the API.
  const handleMergeComplete = async (contacts) => {
    if (!contacts || contacts.length === 0) {
      console.error("No contacts selected for merging.");
      showSnackbar("No contacts selected for merging.", 'error');
      // alert("No contacts selected for merging.");
      return;
    }

    if(!contacts.email){
      showSnackbar('Email is required to insertdata', 'error')
      return;
    }
    if(!contacts.phonenumber){
      showSnackbar('Phonenumber is required to insertdata', 'error')
      return;
    }

    // console.log("Contacts being merged:", contacts);

    const mergedData = createMergedData(contacts, resolutions);

    // console.log("Merged Data:", mergedData, "Selected IDs:", selectedContacts);

    if (Object.keys(mergedData).length === 0) {
      console.error("Merged data is empty. Something went wrong!");
      alert("Merged data is empty. Please check your merge process.");
      return;
    }

    try {
      const res = await fetch(`${api}/api/securehub/mergecontacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          mergedData,
          mergedIds: selectedContacts,
          formValues,
        }),
      });

      if(res.status == 401){
        setLogopen(true);
        return;
      }

      if (!res.ok) throw new Error("Merge failed");

      showSnackbar("Contact is Merged succesfully!", "success");
      setSelectedContacts([]);
      setResolutions({});
      setMergeDialogOpen(false);
      setFormValues({ projectLeader: "", rank: -1 });
      fetchdata();
    } catch (error) {
      console.error("Merge error:", error);
      showSnackbar("Merge failed. Please try again.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "#edf3f7" }}>
      <div className="search-container-middle">
        <div className="projects-header-mom">
          <div>Data Hub</div>
          <button onClick={handleMergeInitiate}>
            <i className="fa-solid fa-plus"></i> <div>Merge</div>
          </button>
        </div>
        <hr />
        <input type="text" placeholder="Search" />
      </div>

      {loading ? (
        <div className="loader-component">
          <SyncLoader color="#2867B2" />
        </div>
      ) : (
        <div className="merge-contacts-card-container">
          {fetchData.length === 0 ? (
            <div className="no-data-error" style={{height: "100%", margin: "0"}}>
              <NoDataFound />
            </div>
          ) : (
            fetchData.map((contact) => (
              <div key={contact.temp_id} className="merge-contacts-card">
                <div className="profile-name-box">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.temp_id)}
                    onChange={() => handleCheckboxChange(contact.temp_id)}
                  />
                  <div className="photo-user">
                    <img
                      src={`${api}${contact.profile}`}
                      alt={contact.fullname}
                    />
                  </div>
                  <div className="profile-name">{contact.fullname}</div>
                </div>
                <div className="bottom-box">
                  <div className="bottom-box-left" style={{ color: "#2867B2" }}>
                    <i className="fa-solid fa-user"></i>
                    <div>{contact.guest_name}</div>
                  </div>
                  <div className="bottom-box-right">
                    <Button onClick={() => handleView(contact)}>
                      <div>
                        <VisibilityIcon />
                      </div>
                      <div>View</div>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <NonconflictDialog
        nonConflictopen={nonConflictopen}
        setnonConflictopen={setnonConflictopen}
        handleMergeComplete={handleMergeComplete}
        formValues={formValues}
        setFormValues={setFormValues}
        fetchData={fetchData} // Pass fetchData
        selectedContacts={selectedContacts} // Pass selectedContacts
      />

      <ConflictResolutionDialog
        open={mergeDialogOpen}
        conflicts={conflicts}
        multiSelectFields={multiSelectFields}
        resolutions={resolutions}
        onResolutionChange={handleResolutionChange}
        onMultiSelectResolutionChange={handleMultiSelectResolutionChange}
        onCancel={() => setMergeDialogOpen(false)}
        onConfirm={() =>
          handleMergeComplete(
            fetchData.filter((c) => selectedContacts.includes(c.temp_id))
          )
        }
        formValues={formValues}
        setFormValues={setFormValues}
      />

      <ViewContactDialog
        open={open}
        contact={selectedContact}
        onClose={handleDialogClose}
        api={api}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
