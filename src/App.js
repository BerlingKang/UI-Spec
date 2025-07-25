import { ComponentTreeProvider } from "./ComponentContext";
import { ComponentWrapper } from "./ComponentWrapper";
import { Sidebar } from "./Sidebar";
import { Box, Button, Typography } from "@mui/material";

export default function App() {
  return (
      <ComponentTreeProvider>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: 300, borderRight: "1px solid #ccc", p: 2 }}>
            <Sidebar />
          </Box>
          <Box sx={{ flexGrow: 1, p: 4 }}>
            <ComponentWrapper id="1" type="Button" props={{ label: "Click Me" }}>
              <Button variant="contained">Click Me</Button>
            </ComponentWrapper>

            <ComponentWrapper id="2" type="Typography" props={{ text: "Hello World" }}>
              <Typography variant="h5">Hello World</Typography>
            </ComponentWrapper>

            <ComponentWrapper id="3" type="Nested" props={{}}>
              <ComponentWrapper id="3.1" type="Typography" props={{ text: "Nested" }}>
                <Typography variant="body1">Nested Text</Typography>
              </ComponentWrapper>
            </ComponentWrapper>
          </Box>
        </Box>
      </ComponentTreeProvider>
  );
}