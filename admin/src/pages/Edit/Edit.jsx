import React, { useEffect, useState } from 'react';
import './Edit.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';

const Edit = ({ url }) => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/food/${id}`); // Corrected endpoint
      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error("Error fetching product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error); // Log error for debugging
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      // Change POST to PUT for updating the product
      const response = await axios.put(`${url}/api/food/edit/${id}`, formData); // Corrected endpoint
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list'); // Redirect to the list after successful edit
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error); // Log error for debugging
      toast.error("Error updating product");
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Loading state
  }

  return (
    <div className='edit'>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      <Card>
        <CardMedia
          component="img"
          height="140"
          image={image ? URL.createObjectURL(image) : `${url}/images/${data.image}`}
          alt={data.name}
        />
        <CardContent>
          <form onSubmit={onSubmitHandler}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  name="description"
                  value={data.description}
                  onChange={onChangeHandler}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Price"
                  name="price"
                  type="number"
                  value={data.price}
                  onChange={onChangeHandler}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Category"
                  name="category"
                  select
                  value={data.category}
                  onChange={onChangeHandler}
                  SelectProps={{
                    native: true,
                  }}
                  required
                >
                  <option value="Salad">Salad</option>
                  <option value="Lablebi">Lablebi</option>
                  <option value="Burger">Burger</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Coscous">Coscous</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Pizza">Pizza</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" component="span">
                    Upload Image
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Edit;