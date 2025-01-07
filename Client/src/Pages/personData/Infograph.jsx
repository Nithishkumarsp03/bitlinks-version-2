import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import '../../Styles/infograph.css';
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
import Outcomeicon from "../../Assets/flowchart/outcome.svg";
import Withbit from "../../Assets/flowchart/withbit.svg";
import Othersicon from "../../Assets/flowchart/others.svg";
import CircularProgressBarWrapper from '../../Components/ProgressBar/CircularProgressBarWrapper';

export default function Infograph() {

  const progress = 70;
  const rootNode = 10;
  const level1node = 40;
  const level2node = 40;
  const level3node = 100;
  const level4node = 100;

  return (
    <div className="infograph-container">
      <Tree
        label={
            <div className="node-label">
                <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={rootNode}>
                    <div>
                        <img src={Personicon} alt="Personicon"/>
                        <div>Person</div>
                    </div>
                </CircularProgressBarWrapper>
            </div>
        }
        className="person-tree"
      >
        <TreeNode
          label={
            <div className="node-label">
                <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level1node}>
                <div>
                    <img src={Experienceicon} alt="Personicon" />
                    <div>Experience</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
          }
          className="experience-node"
        />
        <TreeNode
          label={
            <div className="node-label">
                <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level1node}>
                <div>
                    <img src={Companyicon} alt="Personicon" />
                    <div>Company</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
          }
          className="company-node"
        >
          <TreeNode
            label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level2node}>
                <div>
                    <img src={Opportunityicon} alt="Personicon" />
                    <div>Opportunity</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
            }
            className="opportunity-node"
          >
            <TreeNode
              label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level3node}>
                <div>
                    <img src={Placementicon} alt="Personicon" />
                    <div>Placement</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
              }
              className="placement-node"
            />
            <TreeNode
              label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level3node}>
                <div>
                    <img src={Consultancyicon} alt="Personicon" />
                    <div>Consultancy</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
              }
              className="consultancy-node"
            />
            <TreeNode
              label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level3node}>
                <div>
                    <img src={Internshipicon} alt="Personicon" />
                    <div>Internship</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
              }
              className="internship-node"
            />
          </TreeNode>
        </TreeNode>
        <TreeNode
          label={
            <div className="node-label">
                <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level1node}>
                <div>
                    <img src={Expertiseicon} alt="Personicon" />
                    <div>Expertise</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
          }
          className="expertise-node"
        />
        <TreeNode
          label={
            <div className="node-label">
                <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level1node}>
                <div>
                    <img src={connectionicon} alt="Personicon" />
                    <div>Connections</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
          }
          className="connections-node"
        >
          <TreeNode
            label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level2node}>
                <div>
                    <img src={Withbit} alt="Personicon" />
                    <div>With BIT</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
            }
            className="with-bit-node"
          >
            <TreeNode
              label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level3node}>
                <div>
                    <img src={Alumniicon} alt="Personicon" />
                    <div>Alumni</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
              }
              className="alumni-node"
            />
            <TreeNode
              label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level3node}>
                <div>
                    <img src={Interactionicon} alt="Personicon" />
                    <div>Interactions</div>
                </div>
                </CircularProgressBarWrapper>
            </div>
              }
              className="interactions-node"
            >
              <TreeNode
                label={
                    <div className="node-label">
                        <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level4node}>
                    <div>
                        <img src={Outcomeicon} alt="Personicon" />
                        <div>Outcome</div>
                    </div>
                    </CircularProgressBarWrapper>
                </div>
                }
                className="outcome-node"
              />
            </TreeNode>
          </TreeNode>
          <TreeNode
            label={
                <div className="node-label">
                    <CircularProgressBarWrapper progress={progress} pathColor={progress > 0 ? "#122E50" : "transparent"} size={level2node}>
                <div>
                    <img src={Othersicon} alt="Personicon" />
                    <div>Others</div>
                </div>
                </CircularProgressBarWrapper>   
            </div>
            }
            className="others-node"
          />
        </TreeNode>
      </Tree>
    </div>
  );
}
