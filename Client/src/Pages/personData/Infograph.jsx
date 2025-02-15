import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tree, TreeNode } from "react-organizational-chart";
import "../../Styles/infograph.css";
import Personicon from "../../Assets/flowchart/person.svg";
import Experienceicon from "../../Assets/flowchart/experience.svg";
import Companyicon from "../../Assets/flowchart/company.svg";
import Expertiseicon from "../../Assets/flowchart/expertise.svg";
import connectionicon from "../../Assets/flowchart/connections.svg";
import Opportunityicon from "../../Assets/flowchart/opportunity.svg";
import Placementicon from "../../Assets/flowchart/placement.svg";
import Consultancyicon from "../../Assets/flowchart/consultancy.svg";
import Internshipicon from "../../Assets/flowchart/internship.svg";
import Alumniicon from "../../Assets/flowchart/alumni.svg";
import Interactionicon from "../../Assets/flowchart/interactions.svg";
// import Outcomeicon from "../../Assets/flowchart/outcome.svg";
import Withbit from "../../Assets/flowchart/withbit.svg";
import Othersicon from "../../Assets/flowchart/others.svg";
import CircularProgressBarWrapper from "../../Components/ProgressBar/CircularProgressBarWrapper";
import Alumni from "../../Dialog/Infograph/Alumni";
import Person from "../../Dialog/Infograph/Person";
import CompanyDialog from "../../Dialog/Infograph/Company";
import ConsultancyDialog from "../../Dialog/Infograph/Consultancy";
import InternshipDialog from "../../Dialog/Infograph/Internship";
import PlacementDialog from "../../Dialog/Infograph/Placement";
import Expertise from "../../Dialog/Infograph/Expertise";
import ExperienceDialog from "../../Dialog/Infograph/Experience";
import CustomSnackbar from "../../Utils/snackbar/CustomsnackBar";

export default function Infograph() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { uuid } = useParams();
  const progress = 70;
  const rootNode = 18;
  const level1node = 50;
  const level3node = 60;
  const [alumniopen, setAlumniopen] = useState(false);
  const [personopen, setPersonopen] = useState(false);
  const [companyopen, setCompanyopen] = useState(false);
  const [consultancyopen, setConsultancyopen] = useState(false);
  const [internshipopen, setInternshipopen] = useState(false);
  const [placementopen, setPlacementopen] = useState(false);
  const [expertiseopen, setExpertiseopen] = useState(false);
  const [experienceopen, setExperienceopen] = useState(false);

  const [alumniCompletion, setalumniCompletion] = useState(0);
  const [personCompletion, setpersonCompletion] = useState(0);
  const [companyCompletion, setcompanyCompletion] = useState(0);
  const [consultancyCompletion, setconsultancyCompletion] = useState(0);
  const [internshipCompletion, setinternshipCompletion] = useState(0);
  const [placementCompletion, setplacementCompletion] = useState(0);
  const [expertiseCompletion, setexpertiseCompletion] = useState(0);
  const [experienceCompletion, setexperienceCompletion] = useState(0);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="infograph-container">
      <Tree
        label={
          <div className="node-label" onClick={() => setPersonopen(true)}>
            <div className="image-name-container">
              <div>
                <CircularProgressBarWrapper
                  progress={personCompletion}
                  pathColor={progress > 0 ? "#122E50" : "transparent"}
                  size={rootNode}
                >
                  <img src={Personicon} alt="Personicon" />
                </CircularProgressBarWrapper>
                <div>Person</div>
              </div>
            </div>
          </div>
        }
        className="person-tree"
      >
        <TreeNode
          label={
            <div className="node-label" onClick={() => setExperienceopen(true)}>
              <div className="image-name-container">
                <div>
                  <CircularProgressBarWrapper
                    progress={experienceCompletion}
                    pathColor={progress > 0 ? "#122E50" : "transparent"}
                    size={level1node}
                  >
                    <img src={Experienceicon} alt="Personicon" />
                  </CircularProgressBarWrapper>
                  <div>Experience</div>
                </div>
              </div>
            </div>
          }
          className="experience-node"
        />
        <TreeNode
          label={
            <div className="node-label" onClick={() => setCompanyopen(true)}>
              <div className="image-name-container">
                <div>
                  <CircularProgressBarWrapper
                    progress={companyCompletion}
                    pathColor={progress > 0 ? "#122E50" : "transparent"}
                    size={18}
                  >
                    <img src={Companyicon} alt="Personicon" />
                  </CircularProgressBarWrapper>
                  <div>Company</div>
                </div>
              </div>
            </div>
          }
          className="company-node"
        >
          <TreeNode
            label={
              <div className="node-label">
                <div className="image-name-container">
                  <div>
                    <CircularProgressBarWrapper
                      progress={100}
                      pathColor={progress > 0 ? "#122E50" : "transparent"}
                      size={18}
                    >
                      <img src={Opportunityicon} alt="Personicon" />
                    </CircularProgressBarWrapper>
                    <div>Opportunity</div>
                  </div>
                </div>
              </div>
            }
            className="opportunity-node"
          >
            <TreeNode
              label={
                <div
                  className="node-label"
                  onClick={() => setPlacementopen(true)}
                >
                  <div className="image-name-container">
                    <div>
                      <CircularProgressBarWrapper
                        progress={placementCompletion}
                        pathColor={progress > 0 ? "#122E50" : "transparent"}
                        size={level3node}
                      >
                        <img src={Placementicon} alt="Personicon" />
                      </CircularProgressBarWrapper>
                      <div>Placement</div>
                    </div>
                  </div>
                </div>
              }
              className="placement-node"
            />
            <TreeNode
              label={
                <div
                  className="node-label"
                  onClick={() => setConsultancyopen(true)}
                >
                  <div className="image-name-container">
                    <div>
                      <CircularProgressBarWrapper
                        progress={consultancyCompletion}
                        pathColor={progress > 0 ? "#122E50" : "transparent"}
                        size={level3node}
                      >
                        <img src={Consultancyicon} alt="Personicon" />
                      </CircularProgressBarWrapper>
                      <div>Consultancy</div>
                    </div>
                  </div>
                </div>
              }
              className="consultancy-node"
            />
            <TreeNode
              label={
                <div
                  className="node-label"
                  onClick={() => setInternshipopen(true)}
                >
                  <div className="image-name-container">
                    <div>
                      <CircularProgressBarWrapper
                        progress={internshipCompletion}
                        pathColor={progress > 0 ? "#122E50" : "transparent"}
                        size={level3node}
                      >
                        <img src={Internshipicon} alt="Personicon" />
                      </CircularProgressBarWrapper>
                      <div>Internship</div>
                    </div>
                  </div>
                </div>
              }
              className="internship-node"
            />
          </TreeNode>
        </TreeNode>
        <TreeNode
          label={
            <div className="node-label" onClick={() => setExpertiseopen(true)}>
              <div className="image-name-container">
                <div>
                  <CircularProgressBarWrapper
                    progress={expertiseCompletion}
                    pathColor={progress > 0 ? "#122E50" : "transparent"}
                    size={level1node}
                  >
                    <img src={Expertiseicon} alt="Personicon" />
                  </CircularProgressBarWrapper>
                  <div>Expertise</div>
                </div>
              </div>
            </div>
          }
          className="expertise-node"
        />
        <TreeNode
          label={
            <div className="node-label">
              <div className="image-name-container">
                <div>
                  <CircularProgressBarWrapper
                    progress={100}
                    pathColor={progress > 0 ? "#122E50" : "transparent"}
                    size={18}
                  >
                    <img src={connectionicon} alt="Personicon" />
                  </CircularProgressBarWrapper>
                  <div>Connections</div>
                </div>
              </div>
            </div>
          }
          className="connections-node"
        >
          <TreeNode
            label={
              <div className="node-label">
                <div className="image-name-container">
                  <div>
                    <CircularProgressBarWrapper
                      progress={100}
                      pathColor={progress > 0 ? "#122E50" : "transparent"}
                      size={25}
                    >
                      <img src={Withbit} alt="Personicon" />
                    </CircularProgressBarWrapper>
                    <div>With BIT</div>
                  </div>
                </div>
              </div>
            }
            className="with-bit-node"
          >
            <TreeNode
              label={
                <div className="node-label" onClick={() => setAlumniopen(true)}>
                  <div className="image-name-container">
                    <div>
                      <CircularProgressBarWrapper
                        progress={alumniCompletion}
                        pathColor={progress > 0 ? "#122E50" : "transparent"}
                        size={level3node}
                      >
                        <img src={Alumniicon} alt="Personicon" />
                      </CircularProgressBarWrapper>
                      <div>Alumni</div>
                    </div>
                  </div>
                </div>
              }
              className="alumni-node"
            />
            <TreeNode
              label={
                <div className="node-label">
                  <div className="image-name-container">
                    <div>
                      <CircularProgressBarWrapper
                        progress={100}
                        pathColor={progress > 0 ? "#122E50" : "transparent"}
                        size={level3node}
                      >
                        <img src={Interactionicon} alt="Personicon" />
                      </CircularProgressBarWrapper>
                      <div>Interaction</div>
                    </div>
                  </div>
                </div>
              }
              className="interactions-node"
            ></TreeNode>
          </TreeNode>
          <TreeNode
            label={
              <div className="node-label">
                <div className="image-name-container">
                  <div>
                    <CircularProgressBarWrapper
                      progress={100}
                      pathColor={progress > 0 ? "#122E50" : "transparent"}
                      size={50}
                    >
                      <img src={Othersicon} alt="Personicon" />
                    </CircularProgressBarWrapper>
                    <div>Others</div>
                  </div>
                </div>
              </div>
            }
            className="others-node"
          />
        </TreeNode>
      </Tree>

      <Alumni
        open={alumniopen}
        setAlumniopen={setAlumniopen}
        setalumniCompletion={setalumniCompletion}
        showSnackbar={showSnackbar}
      />
      <CompanyDialog
        open={companyopen}
        setCompanyopen={setCompanyopen}
        setcompanyCompletion={setcompanyCompletion}
        showSnackbar={showSnackbar}
      />
      <ConsultancyDialog
        open={consultancyopen}
        setConsultancyopen={setConsultancyopen}
        setconsultancyCompletion={setconsultancyCompletion}
        showSnackbar={showSnackbar}
      />
      <ExperienceDialog
        open={experienceopen}
        setExperienceopen={setExperienceopen}
        setexperienceCompletion={setexperienceCompletion}
        showSnackbar={showSnackbar}
      />
      <Expertise
        open={expertiseopen}
        setExpertiseopen={setExpertiseopen}
        setexpertiseCompletion={setexpertiseCompletion}
        showSnackbar={showSnackbar}
      />
      <InternshipDialog
        open={internshipopen}
        setInternshipopen={setInternshipopen}
        setinternshipCompletion={setinternshipCompletion}
        showSnackbar={showSnackbar}
      />
      <Person
        open={personopen}
        setPersonopen={setPersonopen}
        setpersonCompletion={setpersonCompletion}
        showSnackbar={showSnackbar}
      />
      <PlacementDialog
        open={placementopen}
        setPlacementopen={setPlacementopen}
        setplacementCompletion={setplacementCompletion}
        showSnackbar={showSnackbar}
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
