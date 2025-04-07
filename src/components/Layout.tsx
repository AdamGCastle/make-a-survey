import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import LogIn from "../features/LogIn"; 
import { getUserFromToken } from "../utils/authUtils";
import DialogueBox from '../features/DialogueBox';
import { useAuth } from "../features/AuthContext";

interface LayoutProps {
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  }

  const Layout: React.FC<LayoutProps> = ({ setRefreshKey }) => {
    const [showLogin, setShowLogin] = useState(false);
    const user = getUserFromToken();
    const navigate = useNavigate();
    const { username, setUsername } = useAuth();

    const handleLogout = () => {
        localStorage.setItem("jwtToken", '');
        localStorage.setItem("username", '');
        setUsername('');

        setRefreshKey(prevKey => prevKey + 1);
        navigate('/', { replace: true});
    };

    const manageAccountClicked = () => {
        navigate('/manageAccount/manage', { replace: true});
    };

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    return (
        <div className="main">
            <Navbar bg="light" className="justify-content-center">
                <Nav className="me-3">
                <a href="/" className="link-text" style={{ cursor: "pointer" }}>Home</a>
                </Nav>

                {user.loggedIn ? (
                <Dropdown className="ms-3">
                    <Dropdown.Toggle
                    variant="light"
                    id="dropdown-basic"
                    className="navlink-padding"
                    >
                    <i className="bi bi-person-fill me-1"></i>
                    {username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={manageAccountClicked}>
                        Manage Account
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                ) : (
                <span
                    className="navlink-padding link-text"
                    style={{ cursor: "pointer" }}
                    onClick={handleShowLogin}
                >
                    Log in
                </span>
                )}
            </Navbar>

            {showLogin && <LogIn onClose={handleCloseLogin} setRefreshKey={setRefreshKey} />}

            <main className="justify-content-center">
                <div className="surrounding-card mt-3">
                    <Outlet />
                </div>                
                <DialogueBox />
            </main>            
        </div>
    );
};

export default Layout;