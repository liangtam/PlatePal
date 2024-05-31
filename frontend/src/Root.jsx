import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, UserProfile } from './pages';

const Root = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home/>}></Route>
            <Route exact path="/users/:id" element={<UserProfile/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default Root;