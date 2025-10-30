import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import { userApi } from "../../api/userApi";
import { ROLES } from "../../utils/constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";

const Users = () => {
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAllUser();
      setTimeout(() => {
        setUsers(res.data);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setFormData({ name: "", email: "", password: "", role: "" });
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: "" });
    setEditingUser(user);
    setShowModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (deleteUserId) {
      await userApi.deleteUser(deleteUserId);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      fetchUsers();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await userApi.updateUser(editingUser._id, formData);
    } else {
      await userApi.createUser(formData);
    }
    setShowModal(false);
    fetchUsers();
  };

  // Search Function
  const [search, setSearch] = useState("");
  const filterUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Slice users for current page
  const paginatedUsers = filterUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(users.length / rowsPerPage)) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography
          variant="h5"
          fontWeight={"bold"}
          color="primary.main"
          mb={2}
        >
          {translations[language].users}
        </Typography>
        <Stack direction="row" spacing={3}>
          <TextField
            label={translations[language].search}
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            size="small"
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={fetchUsers}
          >
            {translations[language].refresh}
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleAdd}
          >
            {translations[language].add_user}
          </Button>
        </Stack>
      </Box>

      {/* Add/Edit Modal */}
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editingUser
                ? `${translations[language].name} : ${editingUser.name}`
                : translations[language].add_user}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={translations[language].name}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={translations[language].email}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={translations[language].password}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                margin="normal"
                required={!editingUser}
              />
              <TextField
                fullWidth
                select
                label={translations[language].role}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                margin="normal"
              >
                {Object.values(ROLES).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  {translations[language].cancel}
                </Button>
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {editingUser
                    ? translations[language].update
                    : translations[language].add}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            animation: "fadeIn 0.3s",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              {translations[language].caution}
            </Typography>
            <Typography mb={3}>
              {translations[language].delete_confirm}
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                {translations[language].cancel}
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                {translations[language].delete}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Users Table */}
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>{translations[language]._no}</TableCell>
            <TableCell>{translations[language].name}</TableCell>
            <TableCell>{translations[language].email}</TableCell>
            <TableCell>{translations[language].role}</TableCell>
            <TableCell>{translations[language].action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((u,index) => (
            <TableRow key={u._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell
                sx={{
                  color: () =>
                    u.role === "admin"
                      ? "#59AC77"
                      : u.role === "moderator"
                      ? "#476EAE"
                      : u.role === "user"
                      ? "#FDAAAA"
                      : "gray",
                  fontWeight: "bold",
                }}
              >
                {u.role}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(u)}
                >
                  {translations[language].edit}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(u._id)}
                >
                  {translations[language].delete}
                </Button>
              </TableCell>
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {translations[language].no_data}
                  </TableCell>
                </TableRow>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Next / Previous Pagination Buttons */}
      <Stack
        direction="row"
        spacing={2}
        mt={2}
        justifyContent="center"
        alignItems={"center"}
      >
        <Button
          size="small"
          variant="contained"
          onClick={handlePrevious}
          disabled={page === 1}
        >
          {translations[language].previous}
        </Button>
        <Typography variant="body1" align="center" sx={{ mt: 1 }}>
          {Math.ceil(users.length / rowsPerPage)} {" / "} {page}{" "}
          {translations[language].page}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleNext}
          disabled={page === Math.ceil(users.length / rowsPerPage)}
        >
          {translations[language].next}
        </Button>
      </Stack>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default Users;
