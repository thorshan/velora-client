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
  InputAdornment,
  Autocomplete,
  Paper,
  Stack,
} from "@mui/material";
import { itemApi } from "../../api/itemApi";
import { brandApi } from "../../api/brandApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { useAuth } from "../../contexts/AuthContext";
import { categoryApi } from "../../api/categoryApi";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Item = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  DocumentTitle(translations[language].items);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    image: "",
    itemCode: "",
    price: "",
    quantity: "",
    description: "",
    createdBy: user.id,
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchItems = async () => {
    try {
      const res = await itemApi.getAllItems();
      const allItems = res.data;

      if (user?.role === "admin") {
        setItems(allItems);
      }

      if (user?.role !== "admin") {
        const userItems = await itemApi.getItemByUser(user?.id);
        setItems(userItems.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Category and Brand
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await brandApi.getAllBrands();
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(
    () => {
      fetchItems();
      fetchBrands();
      fetchCategories();
    },
    //eslint-disable-next-line
    []
  );

  const handleAdd = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      image: "",
      itemCode: "",
      price: "",
      quantity: "",
      description: "",
      createdBy: user.id,
    });
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      image: item.image || "",
      itemCode: item.itemCode || "",
      price: item.price || "",
      quantity: item.quantity || "",
      description: item.description || "",
      category: item.category?._id || item.category || "",
      brand: item.brand?._id || item.brand || "",
      // createdBy: item.user?.id || item.user || "",
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteItemId) {
      await itemApi.deleteItem(deleteItemId);
      setShowDeleteModal(false);
      setDeleteItemId(null);
      setPage(1);
      fetchItems();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await itemApi.updateItem(editingItem._id, formData);
    } else {
      await itemApi.createItem(formData);
    }
    setShowModal(false);
    fetchItems();
  };

  // Search Function
  const [search, setSearch] = useState("");
  const filterItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data for current page
  const paginatedItems = filterItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(items.length / rowsPerPage)) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Auto generate Item Code
  const generateItemCode = (brandId) => {
    if (!brandId) return "";

    const brandObj = brands.find((b) => b._id === brandId);
    if (!brandObj) return "";

    const brandName = brandObj.name;
    const prefix = brandName.slice(0, 2).toUpperCase();

    // Find all items with the same brand
    const brandItems = items.filter((item) => {
      const itemBrandId =
        typeof item.brand === "object" ? item.brand._id : item.brand;
      return itemBrandId === brandId;
    });

    // Find the highest item code number for this brand
    const maxCodeNum = brandItems.reduce((max, item) => {
      const match = item.itemCode?.match(/X(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);

    const nextNumber = maxCodeNum + 1;
    return `${prefix}X${String(nextNumber).padStart(5, "0")}`;
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
          {translations[language].items}
        </Typography>
        <Stack spacing={3} direction={"row"}>
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
            onClick={fetchItems}
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
            {translations[language].add_item}
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
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: { xs: "90%", md: "50%" },
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: 3,
              animation: "slideDown 0.3s ease",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editingItem
                ? `${translations[language].name} : ${editingItem.name}`
                : translations[language].add_item}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              {/* Left Column */}
              <TextField
                fullWidth
                label={translations[language].name}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              {/* Right Column */}
              <Autocomplete
                disablePortal
                fullWidth
                options={categories}
                getOptionLabel={(option) => option.name}
                value={
                  categories.find((c) => c._id === formData.category) || null
                }
                onChange={(e, newValue) =>
                  setFormData({ ...formData, category: newValue?._id || "" })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translations[language].category}
                    required
                  />
                )}
              />

              {/* Brand */}
              <Autocomplete
                disablePortal
                fullWidth
                options={brands}
                getOptionLabel={(option) => option.name}
                value={brands.find((b) => b._id === formData.brand) || null}
                onChange={(e, newValue) => {
                  const nextCode = newValue
                    ? generateItemCode(newValue._id)
                    : "";
                  setFormData({
                    ...formData,
                    brand: newValue?._id || "",
                    itemCode: nextCode,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translations[language].brand}
                    required
                  />
                )}
              />

              {/* Item Code */}
              <TextField
                fullWidth
                label={translations[language].item_code}
                value={formData.itemCode}
                InputProps={{ readOnly: true }}
              />

              {/* Price */}
              <TextField
                fullWidth
                label={translations[language].price}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">MMK</InputAdornment>
                  ),
                }}
              />

              {/* Quantity */}
              <TextField
                fullWidth
                label={translations[language].quantity}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
              />

              {/* Description (spans 2 columns) */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label={translations[language].description}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                sx={{ gridColumn: "span 2" }}
              />

              {/* Image (spans 2 columns) */}
              <TextField
                fullWidth
                label={translations[language].img_url}
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                sx={{ gridColumn: "span 2" }}
              />

              {/* Buttons */}
              <Box
                gridColumn="span 2"
                display="flex"
                justifyContent="flex-end"
                mt={2}
              >
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
                  {editingItem
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
            <TableCell>{translations[language].item_code}</TableCell>
            <TableCell>{translations[language].category}</TableCell>
            <TableCell>{translations[language].brand}</TableCell>
            <TableCell>{translations[language].price}</TableCell>
            <TableCell>{translations[language].quantity}</TableCell>
            <TableCell>{translations[language].createdBy}</TableCell>
            <TableCell>{translations[language].action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedItems.map((i, index) => (
            <TableRow key={i._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.itemCode}</TableCell>
              <TableCell>
                {i.category?.name ||
                  categories.find((c) => c._id === i.category)?.name ||
                  "N/A"}
              </TableCell>
              <TableCell>
                {i.brand?.name ||
                  brands.find((b) => b._id === i.brand)?.name ||
                  "N/A"}
              </TableCell>
              <TableCell>{i.price.toLocaleString()}</TableCell>
              <TableCell>{i.quantity}</TableCell>
              <TableCell>{i.createdBy ? i.createdBy.name : "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(i)}
                >
                  {translations[language].edit}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(i._id)}
                >
                  {translations[language].delete}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {paginatedItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center">
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
          {Math.ceil(items.length / rowsPerPage)} {" / "} {page}{" "}
          {translations[language].page}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleNext}
          disabled={page === Math.ceil(items.length / rowsPerPage)}
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

export default Item;
