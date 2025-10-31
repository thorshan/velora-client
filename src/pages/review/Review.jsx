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
  Paper,
  Stack,
} from "@mui/material";
import { reviewApi } from "../../api/reviewApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import Loading from "../../components/loading/Loading";
import { DocumentTitle } from "../../components/utils/DocumentTitle";

const Review = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  DocumentTitle(translations[language].reviews)

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getAllReviews();
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openDeleteModal = (id) => {
    setDeleteReviewId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteReviewId) {
      await reviewApi.deleteReview(deleteReviewId);
      setShowDeleteModal(false);
      setDeleteReviewId(null);
      fetchReviews();
    }
  };

  // Slice data for current page
  const paginatedReviews = reviews.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Next / Previous handlers
  const handleNext = () => {
    if (page < Math.ceil(reviews.length / rowsPerPage)) {
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
          <Typography variant="h5" color="primary" mb={2}>
            {translations[language].reviews}
          </Typography>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{translations[language]._no}</TableCell>
                <TableCell>{translations[language].title}</TableCell>
                <TableCell>{translations[language].review_text}</TableCell>
                <TableCell>{translations[language].rating}</TableCell>
                <TableCell>{translations[language].item}</TableCell>
                <TableCell>{translations[language].createdBy}</TableCell>
                <TableCell>{translations[language].action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReviews.map((r, index) => (
                <TableRow key={r._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.reviewText}</TableCell>
                  <TableCell>{r.reviewRating}</TableCell>
                  <TableCell>{r.item?.name || "N/A"}</TableCell>
                  <TableCell>{r.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => openDeleteModal(r._id)}
                    >
                      {translations[language].delete}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedReviews.length === 0 && (
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
              {Math.ceil(reviews.length / rowsPerPage)} {" / "} {page}{" "}
              {translations[language].page}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={handleNext}
              disabled={page === Math.ceil(reviews.length / rowsPerPage)}
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

export default Review;
