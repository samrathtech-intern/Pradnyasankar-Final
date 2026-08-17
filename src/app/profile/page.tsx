"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:8081";

interface Profile {
  userId: number;
  firstName: string;
  lastName: string | null;
  email: string;
  mobileNumber: string;
  dateOfBirth: string | null;
  gender: string | null;
  profileImageUrl: string | null;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    profileImageUrl: "",
  });

  // GET PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("ps_auth_token");

        if (!token) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/customer/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data: Profile = await response.json();

        setProfile(data);

        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          mobileNumber: data.mobileNumber || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          profileImageUrl: data.profileImageUrl || "",
        });
      } catch (error) {
        console.error(error);
        setMessage("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // UPDATE PROFILE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("ps_auth_token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/customer/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const updatedProfile: Profile = await response.json();

      setProfile(updatedProfile);

      setFormData({
        firstName: updatedProfile.firstName || "",
        lastName: updatedProfile.lastName || "",
        mobileNumber: updatedProfile.mobileNumber || "",
        dateOfBirth: updatedProfile.dateOfBirth || "",
        gender: updatedProfile.gender || "",
        profileImageUrl: updatedProfile.profileImageUrl || "",
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>{message || "Profile not found."}</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>My Profile</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({
                ...formData,
                firstName: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({
                ...formData,
                lastName: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
          />
        </div>

        <br />

        <div>
          <label>Mobile Number</label>
          <input
            type="text"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobileNumber: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({
                ...formData,
                dateOfBirth: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value,
              })
            }
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        <br />

        <button type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
}