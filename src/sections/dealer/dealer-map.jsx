import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { loadGoogleMaps, getGoogleMapsLoadErrorMessage } from "src/utils/google-maps";


export function DealerMap() {
  const states = [
    {
      name: "Gujarat",
      lat: 23.19446401948418,
      lng: 70.74038766085862,
      cities: [
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
        { name: "Surat", lat: 21.1702, lng: 72.8311 },

      
      ],
    },
    {
      name: "Maharashtra",
      lat: 19.7515,
      lng: 75.7139,
      cities: [
        { name: "Mumbai", lat: 19.076, lng: 72.8777 },
        { name: "Pune", lat: 18.5204, lng: 73.8567 },
      ],
    },
    {
      name: "Rajasthan",
      lat: 27.0238,
      lng: 74.2179,
      cities: [
        { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
        { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
      ],
    },
  ];

  const [selectedState, setSelectedState] = useState("All");
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openStates, setOpenStates] = useState({});
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    window.gm_authFailure = () => {
      if (cancelled) return;
      setMapError(
        'Google Maps API key does not allow this site. Add http://localhost:3031/* in Google Cloud Console → Credentials → API key → Website restrictions.'
      );
      setMapLoading(false);
    };

    loadGoogleMaps()
      .then(() => {
        if (cancelled) return;

        const mapElement = document.getElementById("map");
        if (!mapElement) {
          throw new Error("Map container not found");
        }

        const mapInstance = new window.google.maps.Map(mapElement, {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 5,
        });

        setMap(mapInstance);
        setMapLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load Google Maps:", error);
        setMapError(getGoogleMapsLoadErrorMessage(error));
        setMapLoading(false);
      });

    return () => {
      cancelled = true;
      delete window.gm_authFailure;
    };
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    setMarkers([]);
  };
  const addMarkers = (locations) => {
    clearMarkers();
    const newMarkers = locations.map((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
      });
  
      // Change the marker color if it's the selected city
      if (selectedCity === location.name) {
        marker.setIcon({
          url: "/pin-point.png",
          scaledSize: new window.google.maps.Size(30, 30), // Set the size (width, height)
        });
      }
      
  
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            font-family: Arial, sans-serif; 
            font-size: 14px; 
            max-width: 300px; 
            text-align: center; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            
            <!-- Image Section -->
            <div style="
              width: 100%; 
              height: auto; 
              display: flex; 
              justify-content: center; 
              align-items: center;">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQgpa6K8PvsMxVT_0nJz8L0LL9swhJwWHtdw&s" 
                alt="${location.name}" 
                style="
                  width: 80%; 
                  max-height: 150px; 
                  object-fit: cover; 
                  border-radius: 8px;">
            </div>
            
            <!-- Text Section -->
            <div style="padding: 10px;">
              <h3 style="margin: 0; font-size: 18px; color: #333;">${location.name}</h3>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">${location.state || ''}</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
              
              <!-- Button Section -->
              <button 
                style="
                  background-color: #007BFF; 
                  color: white; 
                  padding: 10px 15px; 
                  border: none; 
                  border-radius: 4px; 
                  font-size: 14px; 
                  cursor: pointer;
                  text-align: center;
                  display: block;
                  width: 100%;
                  box-sizing: border-box;">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
                  target="_blank" 
                  style="text-decoration: none; color: white;">
                  Get Directions
                </a>
              </button>
            </div>
          </div>
        `,
      });
      
  
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
  
      return marker;
    });
    markersRef.current = newMarkers;
    setMarkers(newMarkers);
  };
  
  useEffect(() => {
    if (map) {
      const allLocations = [
        ...states.map((state) => ({
          name: state.name,
          lat: state.lat,
          lng: state.lng,
        })),
        ...states.flatMap((state) =>
          state.cities.map((city) => ({
            name: city.name,
            lat: city.lat,
            lng: city.lng,
          }))
        ),
      ];
  
      if (selectedCity) {
        const selectedCityData = allLocations.find((loc) => loc.name === selectedCity);
  
        map.setCenter({ lat: selectedCityData.lat, lng: selectedCityData.lng });
        map.setZoom(10);
        addMarkers(allLocations, selectedCity);
      } else if (selectedState === "All") {
        map.setCenter({ lat: 20.5937, lng: 78.9629 });
        map.setZoom(5);
        addMarkers(allLocations);
      } else {
        const selectedStateData = states.find((state) => state.name === selectedState);
        map.setCenter({ lat: selectedStateData.lat, lng: selectedStateData.lng });
        map.setZoom(6);
        addMarkers(allLocations);
      }
    }
  }, [selectedState, selectedCity, map]);
  
  const toggleState = (stateName) => {
    setOpenStates((prev) => ({
      ...prev,
      [stateName]: !prev[stateName],
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "65vh",
        mt: 5,
        mb: 5,
      }}
    >
      {/* AppBar */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#2f2f2f",
          color: "#ffffff",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Sidebar */}
        {isSidebarOpen && (
          <Box
            sx={{
              width: "300px",
              backgroundColor: "#f4f4f4",
              p: 2,
              boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Dealers
            </Typography>
            <List>
              <ListItem
                button
                onClick={() => {
                  setSelectedState("All");
                  setSelectedCity(null);
                }}
                selected={selectedState === "All"}
              >
                <ListItemText primary="All Items" />
              </ListItem>
              <Divider />
              {states.map((state, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={() => {
                      setSelectedState(state.name);
                      setSelectedCity(null);
                      toggleState(state.name);
                    }}
                    selected={selectedState === state.name}
                  >
                    <ListItemText primary={state.name} />
                  </ListItem>
                  <Collapse in={openStates[state.name]} timeout="auto" unmountOnExit>
                    {state.cities.map((city, cityIndex) => (
                      <ListItem
                      key={cityIndex}
                      button
                      sx={{
                        pl: 4,
                        color: selectedCity === city.name ? "blue" : "inherit", // Change color if selected
                        fontWeight: selectedCity === city.name ? "bold" : "normal", // Optional: Make it bold
                      }}
                      onClick={() => {
                        setSelectedState(state.name);
                        setSelectedCity(city.name);
                      }}
                      selected={selectedCity === city.name}
                    >
                      <ListItemText primary={city.name} />
                    </ListItem>
                    
                
                    ))}
                  </Collapse>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Map Section */}
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            position: "relative",
          }}
        >
          <div id="map" style={{ width: "100%", height: "100%" }} />
          {mapLoading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {mapError && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.9)",
                px: 3,
              }}
            >
              <Typography color="error" textAlign="center">
                {mapError}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
