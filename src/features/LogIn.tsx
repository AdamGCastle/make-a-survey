import { ChangeEvent, FunctionComponent, useState } from "react"
import { IAccountDto } from "./models";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {Link } from 'react-router-dom';

interface LogInProps {
    onClose: () => void;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const LogIn: FunctionComponent<LogInProps> = ({ onClose, setRefreshKey}) => {
    const [accountDto, setAccountDto] = useState<IAccountDto>({
        username: '',
        verifyPassword: '',
        newPassword: '',
        id: 0,
        token: ''
      });
    
    const [isLoading, setIsLoading] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUsername } = useAuth();

    const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;

    const accountDtoChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAccountDto(copyOfAccountDto => ({
            ...copyOfAccountDto,
            [id]: value,
        }));
    };
    
    const submitLogIn = async () => {
        const loginDetailsErrors = getLoginDetailsErrors(accountDto);

        if(loginDetailsErrors !== ''){
            setLoginErrorMessage(loginDetailsErrors);

            return;
        }

        setLoginErrorMessage('');
        setIsLoading(true);
        let genericErrorMessage = 'Login failed. Please contact support.';

        try{
            const response = await fetch(`${baseUrl}/Accounts/Login`, { 
                method: 'POST',
                body: JSON.stringify(accountDto),            
                headers: {'Content-Type': 'application/json'}
            });
            
            if(!response.ok) {
                let responseText = await response.text();
                
                setLoginErrorMessage((responseText !== null && responseText !== '') ? responseText : genericErrorMessage);
                setIsLoading(false);

                return;
            }

            const data = await response.json();

            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("username", data.username);

            setUsername(data.username);

            setIsLoading(false);
            setRefreshKey(prevKey => prevKey + 1);
            navigate('/', { replace: true});
            onClose();
        } catch(error: any) {
            setLoginErrorMessage(genericErrorMessage);            
            setIsLoading(false);   
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          submitLogIn();
        }
    };

    const getLoginDetailsErrors = (accountDto : IAccountDto) => {
        let userNameMissing = accountDto.username === '' || accountDto.username === null;
        let passwordMissing = accountDto.verifyPassword === '' || accountDto.verifyPassword === null;
                
        let missingCredentials = userNameMissing ? 'username' : '';
        missingCredentials += passwordMissing ? userNameMissing ? ' and password' : ' password' : '';

        return missingCredentials === '' ? '' : `Please enter a ${missingCredentials}.`;
    }

    return (
        <div className="overlay text-center p-2">
            <div className="dialog">
                <div className="dialog__content">
                    <div>         
                        <h2 className="dialog__title mb-2">Log in</h2>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control text-center"
                                id="username"
                                placeholder="Enter username"
                                onChange={accountDtoChanged}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control text-center"
                                id="verifyPassword"
                                placeholder="Enter password"
                                onChange={accountDtoChanged}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col">
                            <button onClick={submitLogIn} className={`btn btn-sm btn-secondary me-3 mb-3 w-25 ${isLoading ? "disabled" :""}`}>Log in</button>
                            <button onClick={onClose} className={`btn btn-sm btn-secondary me-3 mb-3 w-25 ${isLoading ? "disabled" :""}`}>Cancel</button>
                        </div>
                    </div>
                    { isLoading && <div className="d-flex justify-content-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    {!isLoading && loginErrorMessage !== '' && <div className="mt-3"><p className="text-danger">{loginErrorMessage}</p></div>}
                    {!isLoading && <div className="row justify-content-center">
                        <div className="col">
                             <Link to={'/manageaccount/create'} 
                                className="link-text"
                                style={{ cursor: "pointer" }}>
                                Create account
                            </Link>

                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );    
}

export default LogIn;