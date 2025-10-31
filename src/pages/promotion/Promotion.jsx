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
  Autocomplete,
  Paper,
  Stack,
} from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { promotionApi } from "../../api/promotionApi";
import { itemApi } from "../../api/itemApi";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Promotion = () => {
  const { language } = useLanguage();
  DocumentTitle(translations[language].promotions)
  const [promos, setPromos] = useState([]);
  const [items, setItems] = useState([]);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
    title: "",
    discount: "",
    promoCode: "",
    expiryDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePromoId, setDeletePromoId] = useState(null);
  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPromos = async () => {
    try {
      const res = await promotionApi.getAllPromotions();
      setPromos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await itemApi.getAllItems();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPromos();
    fetchItems();
  }, []);

  const handleAdd = () => {
    setFormData({
      item: "",
      title: "",
      discount: "",
      promoCode: "",
      expiryDate: "",
    });
    setEditingPromo(null);
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setFormData({
      item: promo.item?._id || promo.item || "",
      title: promo.title || "",
      discount: promo.discount || "",
      promoCode: promo.promoCode || "",
      expiryDate: promo.expiryDate || "",
    });
    setEditingPromo(promo);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeletePromoId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deletePromoId) {
      await promotionApi.deletePromotion(deletePromoId);
      setShowDeleteModal(false);
      setDeletePromoId(null);
      setPage(1);
      fetchPromos();
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    if (editingPromo) {
      await promotionApi.updatePromotion(editingPromo._id, formData);
    } else {
      await promotionApi.createPromotion(formData);
    }
    setShowModal(false);
    fetchPromos();
    console.log(promos);
  };

  // Search function
  const [search, setSearch] = useState("");
  const filterPromos = promos.filter((promo) =>
    promo.title.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data for current page
  const paginatedPromos = filterPromos.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(promos.length / rowsPerPage)) {
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
          {translations[language].promotions}
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
            onClick={fetchPromos}
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
            {translations[language].add_promo}
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
              {editingPromo
                ? `${translations[language].name} : ${editingPromo.name}`
                : translations[language].add_promo}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Autocomplete
                disablePortal
                fullWidth
                options={items}
                getOptionLabel={(option) => option.itemCode || ""}
                value={items.find((u) => u._id === formData.item) || null}
                onChange={(event, newValue) =>
                  setFormData({
                    ...formData,
                    item: newValue ? newValue._id : "",
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translations[language].item}
                    required
                    margin="normal"
                  />
                )}
              />
              <TextField
                fullWidth
                label={translations[language].title}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="number"
                label={translations[language].discount}
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label={translations[language].promo_code}
                value={formData.promoCode}
                onChange={(e) =>
                  setFormData({ ...formData, promoCode: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={translations[language].expiry_date}
                type="date"
                value={
                  formData.expiryDate
                    ? new Date(formData.expiryDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                margin="normal"
                required
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
                  {editingPromo
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
            <TableCell>{translations[language].item}</TableCell>
            <TableCell>{translations[language].title}</TableCell>
            <TableCell>{translations[language].promo_code}</TableCell>
            <TableCell>{translations[language].discount}</TableCell>
            <TableCell>{translations[language].expiry_date}</TableCell>
            <TableCell>{translations[language].action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPromos.map((p, index) => (
            <TableRow key={p._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{p.item?.name || "N/A"}</TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.promoCode}</TableCell>
              <TableCell>{p.discount}</TableCell>
              <TableCell>{new Date(p.expiryDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(p)}
                >
                  {translations[language].edit}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteModal(p._id)}
                >
                  {translations[language].delete}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {paginatedPromos.length === 0 && (
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
          {Math.ceil(promos.length / rowsPerPage)} {" / "} {page}{" "}
          {translations[language].page}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleNext}
          disabled={page === Math.ceil(promos.length / rowsPerPage)}
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

export default Promotion;
