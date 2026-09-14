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
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
  const [users, setUsers] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const result = await fetch(`${API_URL}/api/user`, {
        method: "GET",
        credentials: "include",
      });

      if (result.ok) {
        const data = await result.json();

        console.log("==>User data:", data);

        setUsers(data.users || data.data?.users || []);
      } else {
        const data = await result.json();
        setError(data.message || "Failed to load users");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to connect to server");
    }
  };

  const handlePasswordChange = async (userId) => {
    setMessage("");
    setError("");

    const password = passwords[userId];

    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await fetch(`${API_URL}/api/user`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        setMessage("Password changed successfully");

        setPasswords((prev) => ({
          ...prev,
          [userId]: "",
        }));
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to connect to server");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Management
      </Typography>

      {message && (
        <Typography sx={{ mb: 2 }} color="green">
          {message}
        </Typography>
      )}

      {error && (
        <Typography sx={{ mb: 2 }} color="error">
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>New Password</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.firstname}</TableCell>

                <TableCell>{user.lastname}</TableCell>

                <TableCell>
                  <TextField
                    type="password"
                    size="small"
                    label="New Password"
                    value={passwords[user._id] || ""}
                    onChange={(event) => {
                      setPasswords((prev) => ({
                        ...prev,
                        [user._id]: event.target.value,
                      }));
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handlePasswordChange(user._id)}
                  >
                    Change Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}