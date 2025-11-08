package com.travelGuide.travelGuide.Pojo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SignUpRequestBody {

	@NotBlank(message="first name can't be null")
	private String fName;
	
	@NotBlank(message="last name can't be null")
	private String lName;
	
	@NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "Password must contain at least one uppercase letter, one number, and one special character"
    )
	private String password;

	/*
	 * @NotBlank(message="mobile number is required")
	 * 
	 * @Pattern(regexp = "\\d{10}", message = "Mobile number must be 10 digits")
	 * private String msisdn;
	 */
	
	@Email(message="inavalid email")
	private String emailId;
	
	

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getfName() {
		return fName;
	}

	public void setfName(String fName) {
		this.fName = fName;
	}

	public String getlName() {
		return lName;
	}

	public void setlName(String lName) {
		this.lName = lName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	/*
	 * public String getMsisdn() { return msisdn; }
	 * 
	 * public void setMsisdn(String msisdn) { this.msisdn = msisdn; }
	 */	
	
	
}
