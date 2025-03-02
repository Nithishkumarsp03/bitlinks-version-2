import React from "react";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";
import Profile from "../../Assets/user.jpg";
import nithish from "../../Assets/team/nithish.jpg"
import thayanithi from "../../Assets/team/thayanithi.jpg"
import dhanusri from "../../Assets/team/dhanusri.png"
import tharun from "../../Assets/team/tharun.jpeg"
import sujith from "../../Assets/team/sujith.webp"

export default function DeveloperContact() {
  const developers = [
    {
      name: "NITHISH KUMAR S P",
      role: "Team Lead",
      email: "nithishkumar3115@gmail.com",
      phone: "+918903342911",
      linkedin: "https://www.linkedin.com/in/nithish-kumar-s-p-b5295828b/",
      location: "India",
      skills: "Project Management, Full Stack",
      img: nithish
    },
    {
      name: "THAYANITHI S",
      role: "Team Member",
      email: "thayanithi2006s@gmail.com",
      phone: "+919025391287",
      linkedin: "https://www.linkedin.com/in/thayanithi-s-293999296",
      location: "India",
      skills: "Frontend Development, ReactJS",
      img: thayanithi
    },
    {
      name: "DHANU SHRI V",
      role: "Team Member",
      email: "dhanushri.ec23@bitsathy.ac.in",
      phone: "+916374129588",
      linkedin: "https://www.linkedin.com/in/dhanushri-vijayakumar-28494929b/",
      location: "India",
      skills: "Backend, Node.js, APIs",
      img: dhanusri
    },
    {
      name: "THARUN KRITHIK K S",
      role: "UI/UX Expert",
      email: "tharunkiruthik.cs22@bitsathy.ac.in",
      phone: "+918667074749",
      linkedin: "https://www.linkedin.com/in/tharun-kiruthik-4b222325a/",
      location: "India",
      skills: "UI/UX Design, Figma, Prototyping",
      img: tharun
    },
    {
      name: "SUJITH T",
      role: "UI/UX Expert",
      email: "sujith.cs23@bitsathy.ac.in",
      phone: "+918973785897",
      linkedin: "https://www.linkedin.com/in/sujith-t-a1893a2b8/",
      location: "India",
      skills: "User Research, Wireframing",
      img: sujith
    }
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meet Our Team</h2>
      <div style={styles.grid}>
        {developers.map((dev, index) => (
          <div key={index} style={styles.card}>
            <img src={dev.img} alt={dev.name} style={styles.image} />
            <h3 style={styles.name}>{dev.name}</h3>
            <p style={styles.role}>{dev.role}</p>
            <p style={styles.details}>📍 {dev.location}</p>
            <p style={styles.details}>🛠️ {dev.skills}</p>
            <p style={{display: "flex", alignItems: 'center', justifyContent: "center"}}>
              <FaEnvelope style={styles.icon} />{" "}
              <a href={`mailto:${dev.email}`} style={styles.link}>{dev.email}</a>
            </p>
            <p style={{display: "flex", alignItems: 'center', justifyContent: "center"}}>
              <FaPhone style={styles.icon} />{" "}
              <a href={`tel:${dev.phone}`} style={styles.link}>{dev.phone}</a>
            </p>
            <p style={{display: "flex", alignItems: 'center', justifyContent: "center"}}>
              <FaLinkedin style={{ ...styles.icon, color: "#0077b5" }} />{" "}
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" style={styles.link}>
                LinkedIn Profile
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    animation: "fadeIn 1s ease-in-out",
    color: "#333",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
  },
  image: {
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    objectFit: "cover",
    marginBottom: "10px",
    border: "4px solid rgba(0, 0, 0, 0.1)",
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "5px 0",
  },
  role: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#555",
    marginBottom: "10px",
  },
  details: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "5px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
  },
  icon: {
    marginRight: "5px",
    verticalAlign: "middle",
  },
};
