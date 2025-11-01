package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;
import com.travelGuide.travelGuide.constants.Constants;
import com.travelGuide.travelGuide.jwt.JwtUtil;
import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.LoginSignUpRepository;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;

@Service
public class LoginSignupServiceImpl implements LoginSignupService {

	@Autowired
	private LoginSignUpRepository loginSignupRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private UserProfileRepository userProfileRepository;
	
	@Autowired
	private JwtUtil jwtUtil;

	public SignUpResponseBody signUpAndGetUsername(SignUpRequestBody request) {

		SignUpResponseBody response = null;

		try {

			if (request != null || request.getMsisdn()!=null){

				boolean checkDuplicate = checkDuplicate(request);
				if (checkDuplicate) {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_DUPLICATE_ENTRY);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_DUPLICATE_ENTRY_MSG);
					response.setMsisdn(null);
					response.setUsername(null);
					return response;
				}
				
//				//otp verification flow
//				String phoneE164 = "+91" + request.getMsisdn();
//				
//				boolean verified = supabaseService.isPhoneVerified(phoneE164);
//				if(!verified) {
//					response = new SignUpResponseBody();
//					response.setErrorCode("106");
//					response.setErrorMsg("phone no. verification failed");
//					response.setMsisdn(request.getMsisdn());
//					response.setUsername(null);
//					return response;
//				}

				String createUserName = createUserName(request);
				if (createUserName == null || createUserName == "") {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.USERNAME_NOT_GENERATED);
					response.setMsisdn(null);
					response.setUsername(null);
				}

				// to set sign up model and save data in db
				SignUpModel createAndSaveSignUp = createAndSaveSignUp(request, createUserName);

				if (createAndSaveSignUp != null) {

					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_SUCCESS_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_SUCCESS_MSG);
					response.setMsisdn(createAndSaveSignUp.getMsisdn());
					response.setUsername(createAndSaveSignUp.getUsername());
					
					//set user profile details 
					UserProfile user = new UserProfile();
					user.setfName(createAndSaveSignUp.getfName());
					user.setlName(createAndSaveSignUp.getlName());
					user.setMsisdn(createAndSaveSignUp.getMsisdn());
					user.setUsername(createUserName);
				
					//save data in user profile db
					userProfileRepository.save(user);
					
					
				} else {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
					response.setMsisdn(null);
					response.setUsername(null);
				}
			} else {
				response = new SignUpResponseBody();
				response.setErrorMsg(Constants.ERROR_MESSAGE.REST_INVALID_REQUEST_BODY);
				response.setErrorCode(Constants.ERROR_CODES.REST_INVALID_PARAM_PASSED);
				response.setMsisdn(null);
				response.setUsername(null);
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response = new SignUpResponseBody();
			response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
			response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
			response.setMsisdn(null);
			response.setUsername(null);

			return response;
		}

	}

	public String createUserName(SignUpRequestBody request) {
		String username = "";
		try {
			String firstName = request.getfName() != null ? request.getfName().toLowerCase() : "";
			String lastName = request.getlName() != null ? request.getlName().toLowerCase() : "";
			if (!firstName.isEmpty() && !lastName.isEmpty()) {
				username = "" + firstName.charAt(0) + lastName.charAt(0) + "_" + lastName;
			} else {
				return null;
			}
			return username;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public SignUpModel createAndSaveSignUp(SignUpRequestBody request, String username) {

		SignUpModel updatedSignUp = null;
		try {
			if (request != null) {
				if (username == "" || username != null) {
					SignUpModel signUpModel = new SignUpModel();

					signUpModel.setfName(request.getfName());
					signUpModel.setlName(request.getlName());
					signUpModel.setMsisdn(request.getMsisdn());
					signUpModel.setUsername(username);

					// to encode password before save in to db
					String encodedPassword = passwordEncoder.encode(request.getPassword());
					signUpModel.setPassword(encodedPassword);

					// save data in db
					updatedSignUp = new SignUpModel();
					updatedSignUp = loginSignupRepository.save(signUpModel);
				}
			}
			return updatedSignUp;
		} catch (Exception e) {
			e.printStackTrace();
			return updatedSignUp;
		}
	}

	public boolean checkDuplicate(SignUpRequestBody request) {

		SignUpModel objectMsisdn = loginSignupRepository.findByMsisdn(request.getMsisdn());

		if (objectMsisdn != null) {
			return true;
		}

		return false;
	}

	public SignUpResponseBody login(String msisdn, String password) {
		SignUpResponseBody response = null;
		try {

			if (msisdn != null || msisdn != "" || password != null || password != "") {
				SignUpModel modelObject = loginSignupRepository.findByMsisdn(msisdn);
				if (modelObject == null) {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.ACCOUNT_NOT_EXIST);
					response.setUsername(null);
					response.setMsisdn(null);
				} else {

					//to check the encrypted saved password with the raw provided password
					boolean isPasswordValid = passwordEncoder.matches(password, modelObject.getPassword());
					if (isPasswordValid) {
						response = new SignUpResponseBody();
						response.setErrorCode(Constants.ERROR_CODES.REST_SUCCESS_CODE);
						response.setErrorMsg(Constants.ERROR_MESSAGE.REST_SUCCESS_MSG);
						response.setUsername(modelObject.getUsername());
						response.setMsisdn(modelObject.getMsisdn());
						
						String token = jwtUtil.generateToken(modelObject.getMsisdn());
						response.setToken(token);
						
					} else {
						response = new SignUpResponseBody();
						response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
						response.setErrorMsg(Constants.ERROR_MESSAGE.PASSWORD_NOT_MATCHED);
						response.setUsername(null);
						response.setMsisdn(null);
					}
				}
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response = new SignUpResponseBody();
			response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
			response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
			response.setUsername(null);
			response.setMsisdn(null);
			return response;
		}
	}
}
