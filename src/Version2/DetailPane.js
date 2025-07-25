import React, { useState } from 'react';
import {Box, Tabs, Tab, Typography, RadioGroup, FormControlLabel, Radio, Switch, TextField} from '@mui/material';

const DetailPane = () =>{
    const [switchStates, setSwitchStates] = useState({
        function: true,
        info: true,
        style: true,
        position: true,
        layout: true,
    });


    const handleToggle = (key) => (event) => {
        setSwitchStates((prev) => ({
            ...prev,
            [key]: event.target.checked,
        }));
    };


    const CurrentUI = () => (
        <Box sx={{
            height:"90%",
            overflow: 'auto'
        }}>
            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                p: 1,
                mt: 1,
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={switchStates.function}
                            onChange={handleToggle("function")}
                            color="primary"
                        />
                    }
                    label={"Function"}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                        style: {color: "blue"}
                    }}
                    defaultValue="Displays product name and brand identity"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />

                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    defaultValue="Displays product name and brand identity"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />
            </Box>

            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                p: 1,
                mt: 1,
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={switchStates.info}
                            onChange={handleToggle("info")}
                            color="primary"
                        />
                    }
                    label={"Displayed Information"}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                        style: {color: "blue"}
                    }}
                    defaultValue="Text logo of iMaster NCE"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />

                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    defaultValue="Text logo of Dashboard"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />
            </Box>

            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                p: 1,
                mt: 1,
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={switchStates.style}
                            onChange={handleToggle("style")}
                            color="primary"
                        />
                    }
                    label={"Color Style & Layout"}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                        style: {color: "blue"}
                    }}
                    defaultValue="Dark gray text, left-ailgned, 24px, left margin"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />

                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    defaultValue="White text, left-aligned, 24px left margin"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />
            </Box>

            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                p: 1,
                mt: 1,
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={switchStates.position}
                            onChange={handleToggle("position")}
                            color="primary"
                        />
                    }
                    label={"Position"}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                        style: {color: "blue"}
                    }}
                    defaultValue="Top left of the page"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />

                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    defaultValue="Top left of the page"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />
            </Box>

            <Box sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                p: 1,
                mt: 1,
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={switchStates.layout}
                            onChange={handleToggle("layout")}
                            color="primary"
                        />
                    }
                    label={"Layout Style"}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                        style: {color: "blue"}
                    }}
                    defaultValue="Horizontally centered"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />

                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    defaultValue="Align left"
                    sx={{
                        backgroundColor: "#f1f2f7"
                    }}
                    multiline
                />
            </Box>
        </Box>
    );

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%'
        }}>
            {/* 顶部 Tabs */}
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        borderRadius: '6px 6px 0 0',
                        minHeight: '40px',
                    },
                    '& .Mui-selected': {
                        color: '#fff',
                    },
                }}
            >
                <Tab label="Attributes" />
            </Tabs>
            <CurrentUI />
        </Box>
    );
}

export default DetailPane;