import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import Index from "./Index"
import Display from "./Display"
import Register from "./Register"
import './style.css'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Index />} />
      <Route path="display" element={<Display />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
