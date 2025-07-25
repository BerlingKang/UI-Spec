import React, { useState } from "react";
import {Box, ListItemButton, List, Typography} from "@mui/material";  // 推荐使用 MUI 布局组件，纯 CSS 也可
import { testString2 as input_text, response as input_response, code_response as input_code, code_1, code_2} from "./Parameters";
import { combineSpec, generateCode, imageToSpec, editSpec } from "./APIsolver";
import CodeSideBar from "./CodeSideBar";
import DynamicRenderer from './CodePane';
import SpecUploadPane from "./SpecView";
import Comp2Menu from './Listview';
import SideBar from "./SideBar";


const MainPaneV2 = () => {
    const [paneStatus, setPaneStatus] = useState("edit"); // 面盘控制
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [post, setPost] = useState([]);
    const [code, setCode] = useState("");
    const [renderImage, setRenderImage] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [codeList, setCodeList] = useState([]);

    let indicater = 1;


    const testString2 = input_text;

    const generate = async (body) => {
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
            setRenderImage(response.data.render_image);
            setCode(response.data.code);
            setCodeList((prev) => [...prev, response.data.code]);
            indicater = indicater + 1 // TODO: 这个地方是例子，记得改回去用API的
        } catch (err) {
            console.log(err)
        }
    }

    const edit = async (body) => {
        try{
            const editResponse = await editSpec(body);

            const editRawString = editResponse;

            console.log("getting from the service\n", editResponse)

            // const regex = /```json\s*([\s\S]*?)\s*```/;
            // const match = editRawString.match(regex);
            // // const match = testString2.match(regex);
            //
            // if (!match || !match[1]) {
            //     throw new Error("未匹配到 JSON 数据块");
            // }
            //
            // const jsonString = match[1].trim(); // ⚠️ 去除开头结尾的空格与换行
            //
            // const dataObject = JSON.parse(jsonString); // ✅ 成功解析
            console.log("最终 JSON 对象:", editRawString.data.spec);

            return editRawString.data.spec;
        } catch (err) {
            console.warn(err)
        }
    };

    const apiSpec = async (body) => {

        try {
            // const response = await combineSpec(body);
            // const rawString = response.data.spec; // 是带有 ```json 的字符串

            // 提取 ```json ... ``` 中的内容
            const regex = /```json\s*([\s\S]*?)\s*```/;
            // const match = rawString.match(regex);
            const match = testString2.match(regex);

            if (!match || !match[1]) {
                throw new Error("未匹配到 JSON 数据块");
            }

            const jsonString = match[1].trim(); // ⚠️ 去除开头结尾的空格与换行

            const dataObject = JSON.parse(jsonString); // ✅ 成功解析
            console.log("最终 JSON 对象:", dataObject);

            setPost(dataObject); // ✅ 更新状态
        } catch (err) {
            console.error("解析出错:", err);
        }

    }

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display:"flex",
                    height: "50px",
                    backgroundColor: "#3995e3"
                }}
            >
                Logo Top bar
            </Box>

            <Box
                sx={{
                    display: "flex",
                    height: "100vh",   // 全屏高度
                }}
            >

                {/* 左侧 */}
                <Box
                    sx={{
                        width: "20%",
                        backgroundColor: "#f0f0f0",
                        p: 2,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            pr: 1,
                        }}
                    >
                        {/* 第一个按钮 */}
                        <Box
                            onClick={() => setPaneStatus('edit')}
                            sx={{
                                mb: 2,
                                p: 2,
                                border: "2px dashed #90caf9",
                                borderRadius: 2,
                                backgroundColor: "#f5faff",
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "#e3f2fd" },
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                上传&组合
                            </Typography>
                        </Box>
                        {/* 第二个按钮 */}
                        <Box
                            onClick={() => setPaneStatus('code')}
                            sx={{
                                mb: 2,
                                p: 2,
                                border: "2px dashed #90caf9",
                                borderRadius: 2,
                                backgroundColor: "#f5faff",
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "#e3f2fd" },
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                代码
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* 中间 */}
                <Box
                    sx={{
                        display: "flex",
                        flex: 1, // 自动占据剩余空间
                        backgroundColor: "#ffffff",
                        p: 2,
                        gap: 2,
                        height: '100%',
                        width: '80%'
                    }}
                >
                    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", width: '100%'}}>
                        {/*第一个子容器，负责处理上传、编辑、合成等*/}
                        <Box sx={{
                            display: paneStatus === 'edit' ? 'block' : 'none',
                            flex: 1
                        }}>
                            <Box sx={{ display: 'flex', height: "95vh", gap: 2}}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: "75%", height: "98%" }}>
                                    <Box>
                                        <SpecUploadPane onComponentClick={setSelectedComponent}/>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Comp2Menu selectedComponent={selectedComponent} onSearch={apiSpec}/>
                                    </Box>
                                </Box>

                                <Box sx={{ backgroundColor: "#f0f0f0", width: "25%"}}>
                                    <SideBar spec={post} generate={generate} editSpec={edit} onItemClick={(data) => {
                                        console.log("点击内容：", data);
                                    }}/>
                                </Box>
                            </Box>
                        </Box>

                        {/*第二个子容器，负责代码预览，查看等*/}
                        <Box sx={{
                            display: paneStatus === 'code' ? 'block' : 'none',
                            flex: 1,
                        }}>
                            <Box sx={{ display: 'flex', height: "95vh", gap: 2}}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: "75%", height: "98%" }}>
                                    {codeList.map((code, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: "flex",
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
                                                    overflowY: "auto",
                                                    width: "75%",
                                                    height: "400px",
                                                    border: "1px solid #ddd",
                                                    p: 1,
                                                }}
                                            >
                                                <h3>动态代码渲染 #{index + 1}</h3>
                                                <DynamicRenderer
                                                    code={code}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ backgroundColor: "#f0f0f0", width: "25%"}}>
                                    <CodeSideBar spec={post} generate={generate} editSpec={edit}/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MainPaneV2;
