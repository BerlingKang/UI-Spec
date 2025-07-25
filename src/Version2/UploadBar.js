import React, { useState } from "react";
import {
    Box,
    Button,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    IconButton,
    Paper,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const UploadBar = () => {
    const [images, setImages] = useState([]);
    const [value, setValue] = useState('');
    const defaultText = '-Input text and/or upload reference images to edit your SPEC\n-For partial reference, upload the relevant section instead of the full page';

    const displayValue = value === '' ? defaultText : value;

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (idToRemove) => {
        setImages((prev) => prev.filter((img) => img.id !== idToRemove));
    };

    return (
        <Box sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            p:3,
            gap: 2,
            backgroundColor: "#fdfdfe"
        }}>


            {/* 图片展示区域 */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "auto",
                    gap: 2,
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            >
                {images.map((img) => (
                    <Box
                        key={img.id}
                        sx={{
                            position: "relative",
                            flexShrink: 0,
                            height: 150,
                            width: "auto",
                        }}
                    >
                        <Box
                            component="img"
                            src={img.url}
                            alt="uploaded"
                            sx={{
                                height: "100%",
                                borderRadius: 2,
                                boxShadow: 1,
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(img.id)}
                            sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(255,255,255,0.7)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,0,0,0.6)",
                                    color: "white",
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            <Box>
                <TextField
                    multiline
                    minRows={3}
                    sx={{
                       backgroundColor: "#f1f2f7",
                       display: "flex",
                       flex: 1,
                       mt: 2,
                       gap: 2,
                       "& .MuiInputBase-root": {
                           resize: "vertical",
                           overflow: "auto",
                       },
                    }}>
                    label="请输入内容"
                    variant="outlined"
                    size="small"
                    value={displayValue}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={(e) => {
                    // 如果是默认文字，清空
                    if (value === '') setValue('');
                }}
                    inputProps={{
                    style: {
                        color: value === '' ? '#aaa' : '#000', // 默认提示是灰色
                    },
                }}
                </TextField>
            </Box>


            {/* 圆形上传按钮 */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                gap:2,
            }}>
                <IconButton
                    component="label"
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px dashed #888",
                        backgroundColor: "#f5f5f5",
                        "&:hover": {
                            backgroundColor: "#e0e0e0",
                        },
                    }}
                >
                    <AddIcon />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageUpload}
                    />
                </IconButton>
                <Button variant="contained" component="label">
                    Generate
                </Button>
            </Box>
        </Box>
    );
};

export default UploadBar;
