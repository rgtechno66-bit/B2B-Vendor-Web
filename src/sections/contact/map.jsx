import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export function Map() {
    const companyAddress = "R G Techno lndustrial Product Pvt.ltd F-471, F Block, Sector 63, Noida, Chotpur, Uttar Pradesh 201301, India"; // Replace with your actual address
    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        companyAddress
    )}&z=15&output=embed`;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: { xs: "40vh", sm: "50vh", md: "65vh" },
                mt: { xs: 3, md: 5 },
                mb: { xs: 3, md: 5 },
            }}
        >
            {/* AppBar */}


            {/* Map Section */}
            <Box
                sx={{
                    flexGrow: 1,
                    height: "100%",
                }}
            >
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    title="Company Location"
                />
            </Box>
        </Box>
    );
}
