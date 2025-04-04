import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const ReportGenerator = ({ data }) => {
  const generatePDF = () => {
    if (!data || data.length === 0) {
      alert("No data available to generate report.");
      return;
    }

    const doc = new jsPDF();
    const apiBaseUrl = process.env.REACT_APP_API;

    // Grouping data by fullname
    const groupedData = data.reduce((acc, curr) => {
      if (!acc[curr.fullname]) {
        acc[curr.fullname] = {
          info: curr,
          visits: [],
          minutes: null,
        };
      }
      acc[curr.fullname].visits.push({
        note: curr.note,
        agent: curr.agent,
        purpose: curr.purpose,
        date: curr.datetime,
        visited1: curr.visited1 ? `${apiBaseUrl}${curr.visited1}` : null,
        visited2: curr.visited2 ? `${apiBaseUrl}${curr.visited2}` : null,
      });

      // Store minutes details if available
      if (curr.minutes_id) {
        acc[curr.fullname].minutes = {
          topic: curr.topic,
          description: curr.description,
          initial_date: curr.initial_date,
          status: curr.status,
          due_date: curr.due_date,
        };
      }

      return acc;
    }, {});

    Object.values(groupedData).forEach(({ info, visits, minutes }, index) => {
      if (index !== 0) doc.addPage();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`Report for ${info.fullname}`, 10, 15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Email: ${info.email}`, 10, 25);
      doc.text(`Company: ${info.companyname}`, 10, 33);
      doc.text(`Address: ${info.companyaddress}`, 10, 41);
      if (info.websiteurl) {
        doc.text(`Website: ${info.websiteurl}`, 10, 49);
      }

      let yPosition = 60;

      // Visited Data Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Visited Data", 10, yPosition);
      yPosition += 8;
      doc.setFont("helvetica", "normal");

      visits.forEach((visit, visitIndex) => {
        if (visitIndex !== 0) yPosition += 15;

        doc.setFontSize(12);
        doc.text(`Note: ${visit.note}`, 10, yPosition);
        doc.text(`Agent: ${visit.agent}`, 10, yPosition + 7);
        doc.text(`Purpose: ${visit.purpose}`, 10, yPosition + 14);
        doc.text(`Date: ${visit.date}`, 10, yPosition + 21);
        yPosition += 30;

        // Images
        if (visit.visited1) {
          doc.addImage(visit.visited1, "JPEG", 10, yPosition, 60, 40);
        }
        if (visit.visited2) {
          doc.addImage(visit.visited2, "JPEG", 80, yPosition, 60, 40);
        }
        yPosition += 50;
      });

      // Minutes Section
      if (minutes) {
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Minutes Details", 10, yPosition);
        yPosition += 10;
        doc.setFont("helvetica", "normal");

        autoTable(doc, {
          startY: yPosition,
          head: [["Topic", "Description", "Initial Date", "Status", "Due Date"]],
          body: [[minutes.topic, minutes.description, minutes.initial_date, minutes.status, minutes.due_date]],
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        });
      }
    });

    doc.save("Professional_Report.pdf");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<PictureAsPdfIcon />}
      onClick={generatePDF}
      sx={{
        mt: 2,
        backgroundColor: "#1E88E5",
        "&:hover": { backgroundColor: "#1565C0" },
      }}
    >
      Download Report
    </Button>
  );
};

export default ReportGenerator;
