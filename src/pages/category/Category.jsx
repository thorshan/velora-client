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
  Paper,
  Stack,
} from "@mui/material";
import { categoryApi } from "../../api/categoryApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Category = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  DocumentTitle(translations[language].categories)

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setFormData({ ...category });
    setEditingCategory(category);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteCategoryId) {
      await categoryApi.deleteCategory(deleteCategoryId);
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
      fetchCategories();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      await categoryApi.updateCategory(editingCategory._id, formData);
    } else {
      await categoryApi.createCategory(formData);
    }
    setShowModal(false);
    fetchCategories();
  };

  // Slice data for current page
  const paginatedCategories = categories.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(categories.length / rowsPerPage)) {
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
      <Typography variant="h5" mb={2}>
        {translations[language].categories}
      </Typography>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleAdd}
      >
        {translations[language].add_category}
      </Button>

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
              {editingCategory
                ? `${translations[language].name} : ${editingCategory.name}`
                : translations[language].add_category}
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
                label={translations[language].description}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {editingCategory
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
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
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
            <TableCell>{translations[language].name}</TableCell>
            <TableCell>{translations[language].description}</TableCell>
            <TableCell>{translations[language].action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCategories.map((c, index) => (
            <TableRow key={c._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(c)}
                >
                  {translations[language].edit}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(c._id)}
                >
                  {translations[language].delete}
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
          {Math.ceil(categories.length / rowsPerPage)} {" / "} {page}{" "}
          {translations[language].page}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleNext}
          disabled={page === Math.ceil(categories.length / rowsPerPage)}
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

export default Category;
