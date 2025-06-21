import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ScrollToTop } from './components/ScrollToTop.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ScrollToTop />
    <App />
    </BrowserRouter>
)
