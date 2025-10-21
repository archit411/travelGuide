package com.travelGuide.travelGuide.Pojo;

public class SignUpResponseBody {

	private String errorCode;	
	private String errorMsg;
	private String userName;

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Override
	public String toString() {
		return "SignUpResponseBody [userName=" + userName + "]";
	}

	
	
}
