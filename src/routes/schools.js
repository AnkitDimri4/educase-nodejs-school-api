import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// helper: haversine distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(rLat1) * Math.cos(rLat2);

  const R = 6371; // km
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

// POST /api/addSchool
router.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // basic validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude must be valid numbers" });
    }

    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), lat, lon],
    );

    return res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (error) {
    console.error("Error in /addSchool:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/listSchools?lat=..&lon=..
router.get("/listSchools", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "User latitude (lat) and longitude (lon) are required" });
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);

    if (Number.isNaN(userLat) || Number.isNaN(userLon)) {
      return res
        .status(400)
        .json({ message: "lat and lon must be valid numbers" });
    }

    const [rows] = await pool.execute("SELECT * FROM schools");

    const schoolsWithDistance = rows.map((school) => {
      const distance = haversineDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude,
      );

      return {
        ...school,
        distanceKm: Number(distance.toFixed(2)),
      };
    });

    schoolsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    return res.json({
      userLocation: { lat: userLat, lon: userLon },
      count: schoolsWithDistance.length,
      schools: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error in /listSchools:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;