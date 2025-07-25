import React, { useState } from "react";
import {Box, Typography, Tab, Tabs} from "@mui/material";  // 推荐使用 MUI 布局组件，纯 CSS 也可
import { testString2 as input_text, response as input_response, code_response as input_code, code_1, code_2, spec_1} from "./Parameters";
import { combineSpec, generateCode, imageToSpec, editSpec, textToSpec, imageReference } from "./APIsolver";

import CodeBar from "./CodePane";
import UploadBar from "./UploadBar";
import SpecTree from "./SpecTree";
import DetailPane from "./DetailPane";
import ReferencePane from "./ReferencePane";


const MainPane = () => {
    const [codeList, setCodeList] = useState([]);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    /**
     * 通过Spec树生成代码的方法
     * @param body
     * @returns {Promise<void>}
     */
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
            setCodeList((prev) => [...prev, response.data.code]);
            indicater = indicater + 1 // TODO: 这个地方是例子，记得改回去用API的
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * 通过文本生成spec界面的方法
     * @param body
     * @returns {Promise<void>}
     */
    const text_to_spec = async (body) =>{
        try{
            console.log("start generating");
            const response = await textToSpec(body);
            console.log("Getting response:", response);
        } catch (err){
            console.log(err);
        }
    }

    /**
     * 通过上传局部图片来实现生成局部spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const image_reference = async (body) =>{
        try {
            console.log("start posting");
            const response = await imageReference(body);
            console.log("Getting response:", response)
        }catch (err){
            console.log(err)
        }
    }

    /**
     * 通过图片获取spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const image_to_spec = async (body) =>{
        try {
            console.log("start posting");
            const response = await imageToSpec(body);
            console.log("Getting response:", response);
            return response;
        }catch (err){
            console.log(err);
        }
    }

    /**
     * 组合spec获取新的spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const combine_spec = async (body) =>{
        try {
            console.log("start posting");
            const response = await combineSpec(body);
            console.log("Getting response:", response)
        }catch (err){
            console.log(err)
        }
    }

    /**
     * 编辑spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const edit_spec = async (body) =>{
        try {
            console.log("start posting");
            const response = await editSpec(body);
            console.log("Getting response:", response)
        }catch (err){
            console.log(err)
        }
    }

    const EditUI = () =>{
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
                            Edit UI
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
                            <UploadBar image_to_spec={image_to_spec}/>
                        </Box>
                    </Box>
                </Box>



            </Box>
        )
    }

    const GenerateUI = () =>{
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
                            GenerateUI
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
                        <Tab label="Edit UI" />
                        <Tab label="Generate UI" />
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
                        {value === 0 && <EditUI />}
                        {value === 1 && <GenerateUI />}
                    </Box>

                </Box>

            </Box>
        </Box>
    );
};

export default MainPane;
