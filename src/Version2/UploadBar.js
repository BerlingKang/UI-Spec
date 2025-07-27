import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {input_string} from "../Version1/Parameters";

const UploadBar = ({image_to_spec, edit_spec, data}) => {
    const [images, setImages] = useState([]);
    const [value, setValue] = useState('');
    const defaultText = '-Input text and/or upload reference images to edit your SPEC\n-For partial reference, upload the relevant section instead of the full page';
    const [specList, setSpecList] = useState([]);
    const displayValue = value === '' ? defaultText : value;

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        for (const file of files) {
            const reader = new FileReader();

            try {
                reader.onload = async () => {
                    const base64String = reader.result.split(',')[1]; // 去掉开头的 data:image/...;base64,

                    const payload = {
                        image: base64String,
                        save_name: file.name,  // 或自定义一个唯一名字
                        spec: "",              // 如有已有 spec 可传入；否则留空或删除该字段
                    };
                    const body = JSON.stringify(payload);
                    // const response = await image_to_spec(body);

                    const response = input_string;

                    // const result = await response.json();

                    const newImage = {
                        url: URL.createObjectURL(file),
                        id: Date.now() + Math.random(),
                        // spec: result.spec,
                    };
                    setImages((prev) => [...prev, newImage]);
                    setSpecList((prev) => [...prev, response])

                };
            } catch (err) {
                alert("Handling pic fail")
                console.log(err);
            }

            reader.readAsDataURL(file);  // 将文件读成 base64
        }
    };


    const handleRemoveImage = (idToRemove) => {
        setImages((prev) => prev.filter((img) => img.id !== idToRemove));

    };

    const confirmEditSpec = async (e) => {
        const payload = {
            save_name: "edit_spec_01",
            text: value,
            spec: data,
        }
        try{
            console.log("spec before editing", data)
            const response = await edit_spec(JSON.stringify(payload));
            console.log("spec before editing", response.data.spec);
        } catch (err) {
            console.log("error when editing spec", err);
        }
    }

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
                <Button variant="contained" component="label" onClick={confirmEditSpec}>
                    Confirm Edit
                </Button>
            </Box>
        </Box>
    );
};

export default UploadBar;
