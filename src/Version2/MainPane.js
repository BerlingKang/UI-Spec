import React, { useState } from "react";
import {Box, ListItemButton, List, Typography, Tab, Tabs} from "@mui/material";  // 推荐使用 MUI 布局组件，纯 CSS 也可
import { testString2 as input_text, response as input_response, code_response as input_code, code_1, code_2, spec_1} from "./Parameters";
import { combineSpec, generateCode, imageToSpec, editSpec } from "./APIsolver";
import CodeBar from "./CodePane";

import UploadBar from "./UploadBar";
import SpecTree from "./SpecTree";
import DetailPane from "./DetailPane";
import DynamicRenderer from "../Version1/CodePane";
import ReferencePane from "./ReferencePane";



const MainPane = () => {
    const [paneStatus, setPaneStatus] = useState("edit"); // 面盘控制
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [post, setPost] = useState([]);
    const [code, setCode] = useState("");
    const [renderImage, setRenderImage] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [codeList, setCodeList] = useState([]);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let indicater = 1;

    const generateCode = async (body) => {
        try{
            console.log("start generating")
            // const response = await generateCode(body);
            let response = null;
            if (indicater === 1) {
                response = code_1;
            }
            else if (indicater === 2) {
                response = code_2
            }
            console.log("Using the generating API:", response);
            setCode(response.data.code);
            setCodeList((prev) => [...prev, response.data.code]);
            indicater = indicater + 1 // TODO: 这个地方是例子，记得改回去用API的
        } catch (err) {
            console.log(err)
        }
    }

    const CurrentUI = () =>{
        return(
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    backgroundColor: "#f1f2f7",
                    height:'90%',
                    width:'100%',
                    flexDirection: 'row'
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: '95%',
                        backgroundColor: "#f1f2f7",
                        gap: 4,
                        p: 2,
                        height: '100%',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            height: '100%',
                            width:'100%'
                        }}
                    >

                        <Typography sx={{fontSize: '24px'}}>
                            Current UI
                        </Typography>

                        <Box sx={{
                            width:'100%',
                            display: 'flex',
                            flex: 1,
                            overflowY: 'auto',
                            flexDirection: 'column',
                        }}>
                            {codeList.map((code, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        flex: "1 1 0%",        // → 按 0 基准、允许增长也允许收缩
                                        maxWidth: "100%",       // ← 绝对不超出父容器 75%
                                        gap: 2,
                                        mb: 4,
                                        border: "1px solid #ccc",
                                        p: 2,
                                        borderRadius: 1,
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%",
                                            maxWidth: "100%",
                                            overflowY: "auto",
                                            border: "1px solid #ddd",
                                            p: 1,
                                        }}
                                    >
                                        <h3>动态代码渲染 #{index + 1}</h3>
                                        <Box
                                            sx={{
                                                flex: "1 1 auto",
                                                minWidth: 0,             // 再次保证子元素可收缩
                                                overflowX: "auto",       // 代码本身过长时水平滚动
                                            }}
                                        >
                                            <CodeBar code={code} />
                                        </Box>
                                    </Box>
                                </Box>
                            ))}

                        </Box>

                        <Box sx={{
                            mt: "auto", maxWidth:'100%'
                        }}>
                            <UploadBar />
                        </Box>
                    </Box>
                </Box>



            </Box>
        )
    }

    const ReferenceUI = () =>{
        return(
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    backgroundColor: "#f1f2f7",
                    height:'75%',
                    width:'100%',
                    flexDirection: 'row'
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: '75%',
                        backgroundColor: "#f1f2f7",
                        gap: 4,
                        p: 2,
                        height: '100%',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            height: '100%',
                            width:'100%'
                        }}
                    >

                        <Typography sx={{fontSize: '24px'}}>
                            Reference UI
                        </Typography>

                        <Box
                            component="img"
                            src="./example2.png"
                            alt="Logo"
                            sx={{ width: '100%', height: '55%' }}
                        />

                        <Box sx={{mt: "auto"}}>
                            <UploadBar />
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        width: '25%',
                        backgroundColor: "#ffffff",
                        gap: 4,
                        p: 2,
                        height: '100%',
                        flexDirection: 'column'
                    }}
                >
                    <ReferencePane data={spec_1}/>
                </Box>

            </Box>
        )
    }

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display:"flex",
                    height: "50px",
                    backgroundColor: "#d2d2d3"
                }}
            >
                Logo Top bar
            </Box>

            {/*主体容器*/}
            <Box
                sx={{
                    display: "flex",
                    height: "100vh",   // 全屏高度
                    width: '100%'
                }}
            >

                {/* 左侧 */}
                <Box
                    sx={{
                        flex: '0 0 20%',
                        backgroundColor: "#fdfdfe",
                        p: 2,
                        minWidth: '180px'
                    }}
                >
                    <SpecTree data={spec_1} generateCode={generateCode}/>
                </Box>


                {/*右侧两个*/}
                <Box
                    sx={{
                        display:'flex',
                        flex:"1 1 80%",
                        backgroundColor:"#f1f2f7",
                        p:2,
                        flexDirection:'column',
                        maxWidth:'80%',
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
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
                        <Tab label="Current UI" />
                        <Tab label="Reference UI" />
                    </Tabs>
                    <Box sx={{
                        display:'flex',
                        flex:1,
                        backgroundColor:"#f1f2f7",
                        p:2,
                        flexDirection:'column',
                        maxWidth:'100%',
                        maxHeight:'90%',
                    }}>
                        {value === 0 && <CurrentUI />}
                        {value === 1 && <ReferenceUI />}
                    </Box>

                </Box>

            </Box>
        </Box>
    );
};

export default MainPane;
