import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { reference_10 } from './Parameters'

const UploadBar = ({ image_reference, edit_spec, data, selectSpec }) => {
    const [images, setImages] = useState([]);
    const [value, setValue] = useState('');
    const [imageCount, setImageCount] = useState(0);

    const get_reference = async (pureBase64) => {
        const payload = {
            image: pureBase64, // ✅ 不含前缀
            save_name: "reference_01",
            spec: "",
        };
        try {
            console.log("using this json as a payload", JSON.stringify(payload));
            const response = await image_reference(payload);
            // let response = reference_10
            console.log("get response spec as:", response);
            return response.data.data.attribute;
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
                const spec = await get_reference(reader.result);   // ✅ 正确传参
                console.log(spec);

                resolve({
                    base64: reader.result,
                    name: newName,
                    spec: spec,
                    url: URL.createObjectURL(file),
                    id: `${Date.now()}-${Math.random()}`
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

    const handleRemoveImage = (idToRemove) => {
        setImages((prev) => prev.filter((img) => img.id !== idToRemove));
    };

    const confirmEditSpec = async () => {
        const payload = {
            save_name: "edit_spec_01",
            text: value,
            spec: data,
        };
        try {
            console.log("spec before editing", data);
            const response = await edit_spec(JSON.stringify(payload));
            console.log("spec after editing", response?.data?.spec);
        } catch (err) {
            console.log("error when editing spec", err);
        }
    };

    return (
        <Box sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
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
                                cursor: "pointer",
                            }}
                            onClick={() =>{console.log(img.spec)
                                selectSpec(img.spec)}}
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

            {/* 文本输入框 */}
            <TextField
                multiline
                minRows={3}
                label="请输入内容"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    backgroundColor: "#f1f2f7",
                    mt: 2,
                    "& .MuiInputBase-root": {
                        resize: "vertical",
                        overflow: "auto",
                    },
                }}
                value={null}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => {
                    if (value === '') setValue('');
                }}
                inputProps={{
                    style: {
                        color: value === '' ? '#aaa' : '#000',
                    },
                }}
            />

            {/* 按钮区域 */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                gap: 2,
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
                        multiple={false}  // ✅ 仅允许一张
                        hidden
                        onChange={handleImageUpload}
                    />
                </IconButton>
                <Button variant="contained" onClick={confirmEditSpec}>
                    Confirm Edit
                </Button>
            </Box>
        </Box>
    );
};

export default UploadBar;
