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
import { orderApi } from "../../api/orderApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import Loading from "../../components/loading/Loading";

const Order = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDeleteModal = (id) => {
    setDeleteOrderId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteOrderId) {
      await orderApi.deleteOrder(deleteOrderId);
      setShowDeleteModal(false);
      setDeleteOrderId(null);
      fetchOrders();
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await orderApi.updateOrder(id, { orderStatus: status });
      console.log(orders);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search function
  const [search, setSearch] = useState("");
  const filterOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Slice data for current page
  const paginatedOrders = filterOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(orders.length / rowsPerPage)) {
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
      {!loading && (
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
              {translations[language].orders}
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
                onClick={fetchOrders}
              >
                {translations[language].refresh}
              </Button>
            </Stack>
          </Box>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{translations[language]._no}</TableCell>
                <TableCell>{translations[language].name}</TableCell>
                <TableCell>{translations[language].order_no}</TableCell>
                <TableCell>{translations[language].contact}</TableCell>
                <TableCell>{translations[language].status}</TableCell>
                <TableCell align="right">{translations[language].action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((r, index) => (
                <TableRow key={r._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{r.user?.name}</TableCell>
                  <TableCell>{r.orderNumber}</TableCell>
                  <TableCell>{"09" + r.deliContact}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: () =>
                          r.orderStatus === "Ordered"
                            ? "secondary.main"
                            : r.orderStatus === "Delivered"
                            ? "#59AC77"
                            : "gray",
                      }}
                    >
                      {r.orderStatus}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction={"row"} spacing={3}>
                      {r.orderStatus === "Ordered" && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleStatusUpdate(r._id, "Delivered")
                            }
                          >
                            {translations[language].approved}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => openDeleteModal(r._id)}
                      >
                        {translations[language].delete}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedOrders.length === 0 && (
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
              {Math.ceil(orders.length / rowsPerPage)} {" / "} {page}{" "}
              {translations[language].page}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={handleNext}
              disabled={page === Math.ceil(orders.length / rowsPerPage)}
            >
              {translations[language].next}
            </Button>
          </Stack>
        </Box>
      )}
      <Loading loading={loading} />
    </Box>
  );
};

export default Order;
