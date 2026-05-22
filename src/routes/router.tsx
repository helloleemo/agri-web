import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import Root from "../pages/Root";
import MekarangPage from "../pages/$mekarang";
import PATHS from "./paths";

const router = createBrowserRouter([
    {
        path: PATHS.root,
        element: <Root />
    },
    {
        path: PATHS.mekarang.root,
        element: <MekarangPage />,
            
        children: [

        ]
            
    },
    {
        path: PATHS.notfound, 
        element: <NotFoundPage />
    },
]);

export default router;
