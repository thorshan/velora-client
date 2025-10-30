### TODO

- Item creation hmr current login user ko attach lote pay yan and quantity slot add yan
- Adding and Updating hmr loader hte yan
- Logout yin 401 error pyin yan

### Grid Property

```
sx={{
  display: "grid",
  gridTemplateColumns: {
  xs: "repeat(2, 1fr)",
  sm: "repeat(3, 1fr)",
  md: "repeat(4, 1fr)",
  lg: "repeat(5, 1fr)",
  },
  gap: 2,
  }}

```

### Lorem Text

Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero eligendi illum, doloremque repellendus quo delectus voluptate possimus necessitatibus eos exercitationem assumenda ex rem esse impedit laudantium accusantium cupiditate voluptates placeat ipsam! Odio omnis neque quidem! Modi deserunt error dicta a ipsa rerum alias aliquid, excepturi, unde saepe officiis dolore et quod fugiat quae. Deserunt ullam nemo veritatis odio et iusto aspernatur ipsa rem eum nam est ipsam nobis, sed officia repellat placeat recusandae asperiores delectus sapiente maiores doloribus ratione obcaecati facilis. Velit incidunt voluptatem excepturi tempora earum laudantium facere? Temporibus ab consequatur ut aliquid, eius sit dolorem rerum vel quae quasi sequi nemo deleniti accusamus, veniam, corrupti magnam suscipit quos.

### Color theme

palette: {
primary: {
main: "#1976d2", // your new primary color
light: "#63a4ff",
dark: "#004ba0",
contrastText: "#fff", // text color on primary
},
secondary: {
main: "#ff4081", // 🟣 your new secondary color
light: "#ff79b0",
dark: "#c60055",
contrastText: "#fff",
},
text: {
primary: "#212121", // main text color
secondary: "#757575", // secondary text color
disabled: "#bdbdbd",
},
background: {
default: "#f5f5f5", // page background
paper: "#ffffff", // cards, dialogs, etc.
},
},
typography: {
fontFamily: "'Poppins', 'Roboto', sans-serif",
},

```
<Card
  key={cartItem.item._id}
  variant="outlined"
  sx={{
    p: 2,
    borderRadius: 3,
    boxShadow: 1,
  }}
>
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    {/* Product Info */}
    <Box>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6">{cartItem.item.name}</Typography>

        {hasPromo ? (
          <>
            <Typography
              variant="body2"
              sx={{ textDecoration: "line-through" }}
              color="text.secondary"
            >
              {originalPrice} {translations[language].mmk}
            </Typography>
            <Typography variant="body2" color="success.main">
              {discountedPrice} {translations[language].mmk} (-
              {promo.discount}%)
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="primary">
            {originalPrice} {translations[language].mmk}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          {translations[language].quantity} : {cartItem.quantity} {" "} {translations[language].counting}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {translations[language].item_total_price} : {totalPrice} {" "}
          {translations[language].mmk}
        </Typography>
      </CardContent>
    </Box>

    {/* Controls */}
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Tooltip title="Decrease quantity">
          <IconButton
            onClick={() =>
              handleUpdateQuantity(
                cartItem.item._id,
                Math.max(1, cartItem.quantity - 1)
              )
            }
            color="secondary"
          >
            <RemoveIcon />
          </IconButton>
        </Tooltip>

        <Typography>{cartItem.quantity}</Typography>

        <Tooltip title="Increase quantity">
          <IconButton
            onClick={() =>
              handleUpdateQuantity(
                cartItem.item._id,
                cartItem.quantity + 1
              )
            }
            color="secondary"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remove item">
          <IconButton
            onClick={() => handleRemove(cartItem.item._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  </Box>
</Card>
```
