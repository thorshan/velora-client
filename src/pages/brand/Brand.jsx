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
  Autocomplete,
  CardMedia,
  Paper,
  Stack,
} from "@mui/material";
import { brandApi } from "../../api/brandApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { userApi } from "../../api/userApi";
import { categoryApi } from "../../api/categoryApi";

const Brand = () => {
  const { language } = useLanguage();
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    title: "",
    address: "",
    contact: "",
    category: "",
    incharge: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBrandId, setDeleteBrandId] = useState(null);

  // Fetch Category and User
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAllUser();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchBrands = async () => {
    try {
      const res = await brandApi.getAllBrands();
      setTimeout(() => {
        setBrands(res.data);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setFormData({
      name: "",
      image: "",
      title: "",
      address: "",
      contact: "",
      category: "",
      incharge: "",
    });
    setEditingBrand(null);
    setShowModal(true);
  };

  const handleEdit = (brand) => {
    setFormData({
      name: brand.name || "",
      image: brand.image || "",
      title: brand.title || "",
      address: brand.address || "",
      contact: brand.contact || "",
      category: brand.category?._id || brand.category || "",
      incharge: brand.incharge?._id || brand.incharge || "",
    });
    setEditingBrand(brand);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteBrandId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteBrandId) {
      await brandApi.deleteBrand(deleteBrandId);
      setShowDeleteModal(false);
      setDeleteBrandId(null);
      setPage(1);
      fetchBrands();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBrand) {
      await brandApi.updateBrand(editingBrand._id, formData);
    } else {
      await brandApi.createBrand(formData);
    }
    setShowModal(false);
    fetchBrands();
  };

  // Search function
  const [search, setSearch] = useState("");
  const filterBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data for current page
  const paginatedBrands = filterBrands.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(brands.length / rowsPerPage)) {
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
          {translations[language].brand}
        </Typography>
        <Stack spacing={2} direction="row">
          <TextField
            label={translations[language].search}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
          size="small"
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={fetchBrands}
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
            {translations[language].add_brand}
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
              width: "50%",
              transform: "translateY(-30px)",
              animation: "slideDown 0.3s forwards",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editingBrand
                ? `${translations[language].name} : ${editingBrand.name}`
                : translations[language].add_brand}
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
                label={translations[language].title}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label={translations[language].contact}
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                multiline
                label={translations[language].address}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label={translations[language].category}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                margin="normal"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <Autocomplete
                disablePortal
                fullWidth
                options={users}
                getOptionLabel={(option) => option.name}
                value={users.find((u) => u._id === formData.incharge) || null}
                onChange={(event, newValue) =>
                  setFormData({
                    ...formData,
                    incharge: newValue ? newValue._id : "",
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translations[language].incharge}
                    required
                    margin="normal"
                  />
                )}
              />
              <TextField
                fullWidth
                label={translations[language].img_url}
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                margin="normal"
              />
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
                <Button size="small" type="submit" variant="contained" color="primary">
                  {editingBrand
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
              size="small"
                variant="outlined"
                color="secondary"
                sx={{ mr: 2 }}
                onClick={() => setShowDeleteModal(false)}
              >
                {translations[language].cancel}
              </Button>
              <Button size="small" variant="contained" color="error" onClick={handleDelete}>
                {translations[language].delete}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Table */}
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>{translations[language]._no}</TableCell>
            <TableCell>{translations[language].image}</TableCell>
            <TableCell>{translations[language].name}</TableCell>
            <TableCell>{translations[language].category}</TableCell>
            <TableCell>{translations[language].incharge}</TableCell>
            <TableCell>{translations[language].contact}</TableCell>
            <TableCell>{translations[language].action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedBrands.map((b, index) => (
            <TableRow key={b._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <CardMedia
                  height={"70"}
                  component="img"
                  src={b.image || "/images/no-image.jpg"}
                  alt={b.name}
                />
              </TableCell>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.category?.name || "N/A"}</TableCell>
              <TableCell>{b.incharge?.name || "N/A"}</TableCell>
              <TableCell>{b.contact}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(b)}
                >
                  {translations[language].edit}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(b._id)}
                >
                  {translations[language].delete}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {paginatedBrands.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {translations[language].no_data}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Next / Previous Buttons */}
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
          {Math.ceil(brands.length / rowsPerPage)} {" / "} {page}{" "}
          {translations[language].page}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleNext}
          disabled={page === Math.ceil(brands.length / rowsPerPage)}
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

export default Brand;
