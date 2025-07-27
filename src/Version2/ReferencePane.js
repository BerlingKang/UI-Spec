import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageUploadList = ({ getImageReference }) => {
    const [images, setImages] = useState([]);
    const [selectedImageName, setSelectedImageName] = useState('');
    const [imageCount, setImageCount] = useState(0);

    const get_reference = async (file) => {
        const payload = {
            image: file,
            save_name: "reference_01",
        }
        try {
            console.log("using this json as a payload", JSON.stringify(payload));
            const response = await getImageReference(payload);
            console.log("get response spec as:", response);
            return response.data.spec;
        } catch (err) {
            console.log("error occur when referencing", err);
        }
    };

    // 将 File 转为 Base64
    const fileToBase64 = (file, index) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const extension = file.name.split('.').pop();
                const newName = `image_${imageCount + index + 1}.${extension}`;

                const spec = await get_reference(reader.result);

                resolve({
                    base64: reader.result,
                    name: newName,
                    spec: spec,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });


    // 上传并处理图片
    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        const base64Images = await Promise.all(
            files.map((file, index) => fileToBase64(file, index))
        );

        setImages((prev) => [...prev, ...base64Images]);
        setImageCount((prev) => prev + files.length);
    };


    const handleDelete = (base64) => {
        setImages((prev) => prev.filter((img) => img.base64 !== base64));
        setSelectedImageName((prevName) => {
            const stillExists = images.some((img) => img.name === prevName && img.base64 !== base64);
            return stillExists ? prevName : '';
        });
    };

    const handleSelectChange = (event) => {
        setSelectedImageName(event.target.value);
    };

    const selectedImage = images.find((img) => img.name === selectedImageName);

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Button variant="contained" component="label">
                上传图片
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                />
            </Button>

            {/* 下拉选择图片 */}
            {images.length > 0 && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="image-select-label">选择图片名称</InputLabel>
                    <Select
                        labelId="image-select-label"
                        value={selectedImageName}
                        label="选择图片名称"
                        onChange={handleSelectChange}
                    >
                        {images.map((img) => (
                            <MenuItem key={img.base64} value={img.name}>
                                {img.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* 细节信息展示 */}
            {selectedImage && (
                <Paper variant="outlined" sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        图片详情（5 个方面）
                    </Typography>

                    {[
                        'function',
                        'displayed information',
                        'color style & layout',
                        'position',
                        'layout style'
                    ].map((field) => (
                        <TextField
                            key={field}
                            label={field}
                            value={selectedImage.spec?.[field] || ''}
                            fullWidth
                            multiline
                            margin="dense"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    ))}
                </Paper>
            )}


            {/* 图片展示区 */}
            <Grid container spacing={2} mt={2}>
                {images.map((img) => (
                    <Grid item xs={6} key={img.base64}>
                        <Box position="relative">
                            <img
                                src={img.base64}
                                alt={img.name}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    border: img.name === selectedImageName ? '2px solid blue' : '1px solid #ccc',
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => handleDelete(img.base64)}
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'white',
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Typography align="center" sx={{ mt: 1 }}>
                            {img.name}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageUploadList;
