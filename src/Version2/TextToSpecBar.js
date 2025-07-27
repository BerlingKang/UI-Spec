import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    TextField,
} from "@mui/material";
import {input_string} from "../Version1/Parameters";
import {root_spec, spec_1} from "./Parameters";

const TextToSpecBar = ({text_to_spec, setTextToSpec}) => {
    const [value, setValue] = useState('');

    const TextToSpec = async (event) => {
        console.log("Text before sending:", value);
        const payload = {
            text: value,
            save_name: "text_to_spec_01",
        };

        try {
            let response = text_to_spec(payload);
            console.log("getting responsing spec:",response)
            // setTextToSpec(response.data.spec)
            setTextToSpec(root_spec)
        } catch (err) {
            console.log(err)
        }

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

            <Box>
                <TextField
                    label="请输入内容"
                    variant="outlined"
                    size="small"
                    multiline
                    minRows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => {
                        if (value === '') setValue('');
                    }}
                    inputProps={{
                        style: {
                            color: value === '' ? '#aaa' : '#000',
                        },
                    }}
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
                    }}
                />
            </Box>



            {/* 圆形上传按钮 */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                gap:2,
            }}>
                <Button variant="contained" component="label" onClick={TextToSpec}>
                    Generate
                </Button>
            </Box>
        </Box>
    );
};

export default TextToSpecBar;
