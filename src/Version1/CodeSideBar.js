import React, { useState, useRef, useEffect } from "react";
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
import { spec_1 } from "./Parameters";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { diffJson } from "diff";

const SideBar = ({ spec, generate, editSpec }) => {
    const [items, setItems] = useState("");              // 当前要展示的 JSON 字符串
    const [diffParts, setDiffParts] = useState([]);      // diffJson 返回的片段数组
    const prevJsonRef = useRef("");                      // 存上一次的 JSON 字符串
    const [openItems, setOpenItems] = useState({});
    const [inputText, setInputText] = useState("");

    // 当 items（展示内容）更新时，做 diff
    useEffect(() => {
        const prev = prevJsonRef.current;
        const next = items;
        if (prev) {
            // 只有 prev 不为空才 diff
            const parts = diffJson(prev, next);
            setDiffParts(parts);
        }
        // 更新 prevJsonRef
        prevJsonRef.current = next;
    }, [items]);

    let spec_index = 1;

    // “合成” 按钮：把传入的 spec 序列化显示并触发第一次 diff
    const show = () => {
        if (spec_index === 1) {
            const jsonStr = JSON.stringify(spec, null, 2);
            setItems(jsonStr);
            spec_index = spec_index + 1
        }else if (spec_index === 2){
            setItems(JSON.stringify(spec_1, null, 2));
        }
    };

    // “开始生成” 保持不变
    const handleGenerate = async () => {
        await generate(JSON.stringify({ spec, save_name: "generate_code_001" }));
    };

    // “确认修改” 并 diff
    const handleConfirm = async () => {
        const body = {
            spec,
            save_name: "save_name_1",
            text: "做出如下修改：\n" + inputText + " 并返回完整的 spec",
        };
        const output = await editSpec(body);
        // output 假设是对象，先转成格式化字符串
        const newJson = JSON.stringify(output, null, 2);
        setItems(newJson);
    };

    const handleToggle = (key) =>
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

    // （你的 renderKeyValueList 保持不变，如果不需要了也可以删）
    const renderKeyValueList = (obj, parentKey = "") => { /* … */ };

    return (
        <Box sx={{ mt: 1, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={handleGenerate}>
                    开始生成
                </Button>
                <Button variant="contained" onClick={show}>
                    合成
                </Button>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                <Typography
                    component="pre"
                    variant="body2"
                    sx={{
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        overflowX: "auto",
                        backgroundColor: "#fafafa",
                        p: 2,
                        borderRadius: 1,
                    }}
                >
                    {diffParts.length > 0
                        ? diffParts.map((part, idx) => (
                            <span
                                key={idx}
                                style={{
                                    color: part.added || part.removed ? "red" : "inherit",
                                    backgroundColor: part.removed ? "#fee" : "transparent",
                                }}
                            >
                  {part.value}
                </span>
                        ))
                        : items}
                </Typography>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    height: "25%",
                    mt: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                }}
            >
                <Typography variant="subtitle1">请输入修改需求：</Typography>
                <TextField
                    label="请输入内容"
                    variant="outlined"
                    size="small"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <Button variant="contained" onClick={handleConfirm}>
                    确认
                </Button>
            </Paper>
        </Box>
    );
};

export default SideBar;
