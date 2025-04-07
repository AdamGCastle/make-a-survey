import { ChangeEvent, FunctionComponent, useState } from "react";
import { IAccountDto } from "./models";
import { useDialogue } from '../features/DialogueContext';
import { getUserFromToken } from "../utils/authUtils";
import { isNullOrWhiteSpace } from "../utils/helpers";
import { useAuth } from "./AuthContext";

interface ManageAccountProps {
  onClose: () => void;
  mode: 'create' | 'manage';
}

const ManageAccount: FunctionComponent<ManageAccountProps> = ({ onClose, mode }) => {
  const user = getUserFromToken();
  
  const isCreateMode = mode === 'create';
  const [accountDto, setAccountDto] = useState<IAccountDto>({
    username: isCreateMode ? '' : user.username,
    newPassword: '',
    verifyPassword: '',
    id: user.id,
    token: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);  
  const [isDeleteAccount, setIsDeleteAccount] = useState(false); 
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);   
  const [lockEnterToSubmit, setLockEnterToSubmit] = useState(false);  
  const [currentUsername, setCurrentUsername] = useState(user.username);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showDialogue } = useDialogue();
  const { setUsername } = useAuth();

  const [usernameError, setUsernameError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [newPasswordError , setNewPasswordError] = useState('');

  const baseUrl = process.env.REACT_APP_PORTFOLIO_WEB_API_BASE_URL;

  const usernameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setAccountDto(prev => ({
      ...prev,
      username: value,
    }));
  };
    
  const handleChangeUsernameClick = () => {
    setAccountDto(prev => ({ ...prev, username: currentUsername }));
    setShowChangeUsername(true);
  };
  
  const handleChangeUsernameOk = async () => {
    if(showChangeUsername && (!accountDto.username || accountDto.username.trim() === '')) {
      setUsernameError('Please enter a username.');

      return;
    }
    
    setUsernameError('');
    const changeUsernameSuccess = await submitAccountRequest();

    if(!changeUsernameSuccess){
      return;
    }

    setCurrentUsername(accountDto.username);
    localStorage.setItem("username", accountDto.username);

    showDialogue({
      title: 'Success',
      message: 'Username changed.',
      isQuestion: false,
      onOkNavigationRoute: ''
    });

    setUsername(accountDto.username);
    setShowChangeUsername(false);
  };
  
  const handleCreateAccountClicked = async () => {
    let errors : boolean = false;

    if(!accountDto.username || accountDto.username.trim() === '') {
      setUsernameError('Please enter a username.');
      errors = true;
    }

    if(!accountDto.newPassword) {
      setNewPasswordError('Please enter a password.');
      errors = true;
    }

    if(errors){
      return;
    }

    setUsernameError("");
    setNewPasswordError("");
    const createAccountSuccess = await submitAccountRequest();

    if(!createAccountSuccess){
      return;
    }
    
    setUsername(accountDto.username);
    setAccountDto({
      id: 0,
      username: '',
      verifyPassword: '',
      newPassword: '',
      token: ''
    });

    setLockEnterToSubmit(true);

    showDialogue({
      title: 'Success',
      message: 'Account created!',
      isQuestion: false,
      onOkNavigationRoute: '/'
    });

  }

  const handleChangeUsernameCancel = () => {
    setAccountDto(prev => ({ ...prev, username: "" }));
    setShowChangeUsername(false);
  };
    
  const handleChangePasswordSelect = () => {
    setAccountDto(prev => ({
      ...prev,
      newPassword: ''
    }));

    setConfirmPassword("");
    setShowChangePassword(true);
  };
  
  const handleChangePasswordOk = async () => {
    
    setPasswordsDontMatch(confirmPassword !== accountDto.newPassword);
    if(accountDto.verifyPassword === '') {
      setVerifyPasswordError('Please enter your password.');
    }

    if(passwordsDontMatch) {      
      return;
    }

    if(!accountDto.newPassword || accountDto.newPassword.trim() === '') {
      setNewPasswordError('Please enter a new password.');

      return;
    }
    
    setNewPasswordError("");
    const changePasswordSuccess = await submitAccountRequest();
    if(!changePasswordSuccess ){
      return;
    }

    showDialogue({
      title: 'Success',
      message: 'Password changed.',
      isQuestion: false,
      onOkNavigationRoute: ''
    });

    setShowChangePassword(false);
  };
  
  const handleChangePasswordCancel = () => {
    setAccountDto(prev => ({
      ...prev,
      newPassword: ''
    }));

    setConfirmPassword("");
    setShowChangePassword(false);
  };

  const handleDeleteAccountSelect = () => {
    showDialogue({
      title: 'Are you sure?',
      message: 'Once your account has been deleted there will be no way to recover it.',
      isQuestion: true,
      onOkNavigationRoute: '',
      onConfirm: () => {
        setIsDeleteAccount(true);       
      }
    });
  }

  const handleDeleteAccountOk = async () => {
    console.log(accountDto.verifyPassword );
    if(accountDto.verifyPassword === ''){
      setVerifyPasswordError('Please enter your password.');
      return;
    }

    setVerifyPasswordError('');

    const deleteAccountSuccess = await submitAccountRequest();
    if(!deleteAccountSuccess){
      return;
    }
    
    showDialogue({
      title: 'Success',
      message: `${currentUsername}'s account has been deleted.`,
      isQuestion: false,
      onOkNavigationRoute: '/'
    });
  }

  const handleDeleteAccountCancel = () => {
    setVerifyPasswordError('');
    setAccountDto(prev => ({
      ...prev,
      verifyPassword: ''
    }));

    setIsDeleteAccount(false);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(lockEnterToSubmit){
      return;
    }

    if (event.key === 'Enter') {
      if(isCreateMode){
        handleCreateAccountClicked();
        return;
      }

      if(showChangeUsername) {
        handleChangeUsernameOk();
        return;
      }

      if(showChangePassword) {
        handleChangePasswordOk();
      }

      if(isDeleteAccount){
        handleDeleteAccountOk();        
      }
    }
  };

  const passwordFieldChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if(id === 'verifyPassword'){
      setVerifyPasswordError('');
      setAccountDto(prev => ({
        ...prev,
        verifyPassword: value
      }));

      return;
    }

    if(id === 'newPassword'){
      setNewPasswordError('');
      setAccountDto(prev => ({
        ...prev,
        newPassword: value
      }));

      setPasswordsDontMatch(confirmPassword === '' ? false : value !== confirmPassword);

      return;
    }

    setConfirmPassword(value);
    setPasswordsDontMatch(accountDto.newPassword !== value);    
  }

  const submitAccountRequest = async (): Promise<boolean> => {
    setIsLoading(true);

    if(passwordsDontMatch){
      return false;
    }

    const genericErrorMessage = `Failed to ${isCreateMode ? 'create account' : isDeleteAccount ? 'delete account' : showChangeUsername ? 'change username' : 'change password'}.`;
    let success : boolean = false;

    try {
      const endpoint = `${baseUrl}/Accounts/${isCreateMode ? 'Create' : isDeleteAccount ? 'Delete' : showChangeUsername ? 'ChangeUsername' : 'ChangePassword'}`;

      const response = await fetch(endpoint, {
        method: isDeleteAccount ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(accountDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        showDialogue({
          title: 'Error',
          message: isNullOrWhiteSpace(errorText) ? genericErrorMessage : errorText,
          isQuestion: false,
          onOkNavigationRoute: ''
        });

        return false;
      }
      
      if(isDeleteAccount){
        localStorage.setItem("jwtToken", '');
        localStorage.setItem("username", '');
        setUsername('');

      } else {
        const data = await response.json();
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("username", data.username);
      }

      success = true;
    } catch (error: any) {
      showDialogue({
        title: 'Error',
        message: `Failed to ${isCreateMode ? 'create account' : showChangeUsername ? 'change username' : 'change password'}.`,
        isQuestion: false,
        onOkNavigationRoute: ''
      });
    } finally {
      setIsLoading(false);
    }

    return success;  
  };

  return (
    <div className="row justify-content-center">
      <div className="col col-sm-8 col-md-6 mx-2">
        <div className="card title-card mb-3 p-3 w-100 text-center">
          <h2 className="mb-3">{`${isCreateMode ? "Create" : "Manage"} Account`}</h2>

          {!isCreateMode &&
            <div>
              <div className="m-2">
                <strong>{`${showChangeUsername ? "Old username" : "Username"}:`}</strong> {currentUsername}  
              </div>
              {!showChangeUsername && !showChangePassword && !isDeleteAccount && <div className="d-grid gap-2 mb-3 mt-3">
                <button
                  className="btn custom-blue-btn"
                  onClick={handleChangeUsernameClick}
                  disabled={showChangePassword}
                >
                  Change Username
                </button>
              </div>}
              {!showChangePassword && !showChangeUsername && !isDeleteAccount && (
                <div className="d-grid gap-2 mb-3">
                  <button
                    className="btn custom-blue-btn"
                    onClick={handleChangePasswordSelect}
                    disabled={showChangeUsername}
                  >
                    Change Password
                  </button>
                </div>
              )}
              {!showChangePassword && !showChangeUsername && !isDeleteAccount &&  (
                <div className="d-grid gap-2 mb-3">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteAccountSelect}
                    disabled={showChangeUsername || showChangePassword}
                  >
                    Delete account
                  </button>
                </div>
              )}     
            </div>
          }

          {(isCreateMode || showChangeUsername) && 
            <div className="m-2">
              <label htmlFor="username" className="form-label">{`${isCreateMode ? "U" : "New u"}sername: `}</label>
              <input
                type="text"
                className="form-control text-center"
                id="username"
                placeholder="Enter username"
                value={accountDto.username}
                onChange={usernameChanged}
                onKeyDown={handleKeyPress}
              />

              <div className="text-danger mt-2 mb-3">{usernameError}</div>

              {!isCreateMode && 
                <div className="d-flex justify-content-center mt-4">
                  <button className="btn btn-success me-2" onClick={handleChangeUsernameOk}>OK</button>
                  <button className="btn btn-outline-secondary" onClick={handleChangeUsernameCancel}>Cancel</button>
                </div>
              }              
            </div>            
          }

          {(showChangePassword || isDeleteAccount) && 
            <div className="mb-2">
              <label 
                htmlFor="verifyPassword" 
                className="form-label">{isDeleteAccount ? 'Enter your password to delete your account:' : showChangePassword ? "Old password:" : "Password:"}
              </label>
              <input
                type="password"
                className="form-control text-center"
                id="verifyPassword"
                onChange={passwordFieldChanged}
                onKeyDown={handleKeyPress}
              />
              <div className="text-danger mt-2 mb-3">{verifyPasswordError}</div>              
            </div>
            
          }
          {(isCreateMode || showChangePassword) && 
            <div className="m-2">
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">{`${isCreateMode ? "P" : "New p"}assword: `}</label>
                <input
                  type="password"
                  className="form-control text-center"
                  id="newPassword"
                  onChange={passwordFieldChanged}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="text-danger mt-2 mb-3">{newPasswordError}</div>              
              <div className={passwordsDontMatch ? "mb-3" : "mb-4"}>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control text-center"
                  id="confirmPassword"
                  onChange={passwordFieldChanged}
                  onKeyDown={handleKeyPress}
                />
              </div>
              <div className="text-danger mb-3">{passwordsDontMatch ? ("Passwords do not match") : ('')}</div>           
              
              {!isCreateMode && 
                <div className="d-flex justify-content-center mt-2">
                  <button 
                    className="btn btn-success me-2" 
                    onClick={handleChangePasswordOk}
                    disabled={isLoading || passwordsDontMatch || confirmPassword === '' || (!isCreateMode && accountDto.verifyPassword === '') }>
                      OK
                      </button>
                  <button className="btn btn-outline-secondary"
                    disabled={isLoading}
                    onClick={handleChangePasswordCancel}>
                      Cancel
                  </button>
                </div>
              }   
            </div>
          }

          {isDeleteAccount && 
            <div className="d-flex justify-content-center mt-2">
              <button 
                className="btn btn-danger me-2" 
                onClick={handleDeleteAccountOk}
                disabled={isLoading || accountDto.verifyPassword === ''}
              >
                  Delete account
                  </button>
              <button className="btn btn-outline-secondary"
                disabled={isLoading}
                onClick={handleDeleteAccountCancel}>
                  Cancel
              </button>
            </div>
          }   

          {isCreateMode && (
            <button 
              className="btn btn-primary" 
              onClick={handleCreateAccountClicked} 
              disabled={isLoading || passwordsDontMatch || accountDto.username === '' || confirmPassword === ''}>
                Create account
              </button>
          )}

          {isLoading && <div className="d-flex justify-content-center mt-3">
              <div className="text-center spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }          
        </div>
      </div>
    </div>
      
  );
};

export default ManageAccount;