import React, { useState } from "react";
import { Box, Popover, Typography, Button } from "@mui/material";

const PropertyPanelDemo = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProps, setSelectedProps] = useState(null);

    const handleClick = (event, props) => {
        setAnchorEl(event.currentTarget);
        setSelectedProps(props);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedProps(null);
    };

    const open = Boolean(anchorEl);

    // 模拟多个组件
    const components = [
        { id: 1, name: "按钮1", type: "Button", color: "primary" },
        { id: 2, name: "按钮2", type: "Button", color: "secondary" },
    ];

    return (
        <Box sx={{ p: 4 }}>
            {components.map((comp) => (
                <Button
                    key={comp.id}
                    variant="contained"
                    color={comp.color}
                    sx={{ m: 2 }}
                    onClick={(e) => handleClick(e, comp)}
                >
                    {comp.name}
                </Button>
            ))}

            {/* 属性面板浮窗 */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box sx={{ p: 2, width: 200 }}>
                    <Typography variant="h6">属性面板</Typography>
                    {selectedProps ? (
                        <>
                            <Typography variant="body2">
                                类型: {selectedProps.type}
                            </Typography>
                            <Typography variant="body2">
                                颜色: {selectedProps.color}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2">无内容</Typography>
                    )}
                </Box>
            </Popover>
        </Box>
    );
};

export default PropertyPanelDemo;
