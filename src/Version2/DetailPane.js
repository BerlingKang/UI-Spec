import React, { useState, useEffect } from 'react';
import {Box, Tabs, Tab, Typography, FormControlLabel, Switch, TextField, Button} from '@mui/material';

import { ReactComponent as FunctionIcon } from './icon/function_label.svg';
import { ReactComponent as InfoIcon } from './icon/displayedInformation.svg';
import { ReactComponent as StyleIcon } from './icon/colorStyleAndLayout.svg';
import { ReactComponent as PositionIcon } from './icon/position.svg';
import { ReactComponent as LayoutIcon } from './icon/layout.svg';

const DetailPane = ({ selectedComponent, selectedSpecData, edit_spec }) => {
    const [switchStates, setSwitchStates] = useState({
        function: true,
        info: true,
        style: true,
        position: true,
        layout: true,
    });

    const applyChange = () => {
        const keyMap = {
            function: '承担的功能',
            info: '承载的信息',
            style: '组件的配色样式',
            position: '所处的位置',
            layout: '组件内的布局样式'
        };

        let result = "请针对我提供的spec对以下内容进行修改：";

        Object.entries(switchStates).forEach(([key, isEnabled]) => {
            if (isEnabled) {
                const specKey = keyMap[key];
                const value = selectedSpecData?.[specKey];
                if (value) {
                    result += `将${specKey}改为：${value}\n`;
                }
            }
        });

        console.log('✔️ 应用的规格内容：\n' + result);

        applySpecEdit(result)

    };

    const applySpecEdit = async (text) => {
        try {
            const payload = {
                spec: selectedComponent,
                text: text,
                save_name: "edit_spec_01",
            }
            console.log("start editing spec from detailpane:", JSON.stringify(payload))
            await edit_spec(JSON.stringify(payload));
        }catch (err) {
                console.log(err)
            }
    }

    const handleToggle = (key) => (event) => {
        setSwitchStates((prev) => ({
            ...prev,
            [key]: event.target.checked,
        }));
    };

    const getFieldValue = (source, key) => {
        if (!source) return '';
        return source[key] || '';
    };

    const renderBox = (label, IconComponent, switchKey, componentKey, specKey) => (
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', p: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'row', gap:1}}>
                <FormControlLabel

                    labelPlacement="start"
                    control={
                        <Switch
                            checked={switchStates[switchKey]}
                            onChange={handleToggle(switchKey)}
                            color="primary"
                        />
                    }
                    label=""
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{label}</Typography>
                    <IconComponent width={20} height={20} />
                </Box>
            </Box>

            <TextField
                InputProps={{ readOnly: true, style: { color: 'blue' } }}
                value={getFieldValue(selectedComponent, componentKey)}
                sx={{ backgroundColor: '#f1f2f7', mt: 1 }}
                multiline
            />
            <TextField
                InputProps={{ readOnly: false }}
                value={getFieldValue(selectedSpecData, specKey)}
                sx={{ backgroundColor: '#f1f2f7', mt: 1 }}
                multiline
            />
        </Box>
    );

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
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
            <Box sx={{ height: '90%', overflow: 'auto' }}>
                {renderBox('Function', FunctionIcon, 'function', '承担的功能', '承担的功能')}
                {renderBox('Displayed Information', InfoIcon, 'info', '承载的信息', '承载的信息')}
                {renderBox('Color Style & Layout', StyleIcon, 'style', '组件的配色样式', '组件的配色样式')}
                {renderBox('Position', PositionIcon, 'position', '所处的位置', '所处的位置')}
                {renderBox('Layout Style', LayoutIcon, 'layout', '组件内的布局样式', '组件内的布局样式')}
            </Box>
            <Box>
                <Button fullWidth variant="contained" onClick={applyChange} sx={{ p: 2 }}>Apply</Button>
            </Box>
        </Box>
    );
};

export default DetailPane;