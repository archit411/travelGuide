package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.SignUpRequestBody;
import com.travelGuide.travelGuide.Pojo.SignUpResponseBody;
import com.travelGuide.travelGuide.constants.Constants;
import com.travelGuide.travelGuide.jwt.JwtUtil;
import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.repositories.TravelGuideSignUpRepository;

@Service
public class TravelGuideServiceImpl implements TravelGuideService {

	@Autowired
	private TravelGuideSignUpRepository travelGuideSignUpRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;

	public SignUpResponseBody getUserName(SignUpRequestBody request) {

		SignUpResponseBody response = null;

		try {

			if (request != null) {

				boolean checkDuplicate = checkDuplicate(request);
				if (checkDuplicate) {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_DUPLICATE_ENTRY);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_DUPLICATE_ENTRY_MSG);
					response.setUserName(null);
					return response;
				}

				String createUserName = createUserName(request);
				if (createUserName == null || createUserName == "") {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.USERNAME_NOT_GENERATED);
					response.setUserName(null);
				}

				// to set sign up model and save data in db
				SignUpModel createAndSaveSignUp = createAndSaveSignUp(request, createUserName);

				if (createAndSaveSignUp != null) {

					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_SUCCESS_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_SUCCESS_MSG);
					response.setUserName(createAndSaveSignUp.getUsername());
				} else {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
					response.setUserName(null);
				}
			} else {
				response = new SignUpResponseBody();
				response.setErrorMsg(Constants.ERROR_MESSAGE.REST_INVALID_REQUEST_BODY);
				response.setErrorCode(Constants.ERROR_CODES.REST_INVALID_PARAM_PASSED);
				response.setUserName(null);
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response = new SignUpResponseBody();
			response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
			response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
			response.setUserName(null);

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

					signUpModel.setEmailId(request.getEmailId());
					signUpModel.setfName(request.getfName());
					signUpModel.setlName(request.getlName());
					signUpModel.setMsisdn(request.getMsisdn());
					signUpModel.setUsername(username);

					// to encode password before save in to db
					String encodedPassword = passwordEncoder.encode(request.getPassword());
					signUpModel.setPassword(encodedPassword);

					// save data in db
					updatedSignUp = new SignUpModel();
					updatedSignUp = travelGuideSignUpRepository.save(signUpModel);
				}
			}
			return updatedSignUp;
		} catch (Exception e) {
			e.printStackTrace();
			return updatedSignUp;
		}
	}

	public boolean checkDuplicate(SignUpRequestBody request) {

		// check for email id
		SignUpModel objectEmail = travelGuideSignUpRepository.findByEmailId(request.getEmailId());
		SignUpModel objectMsisdn = travelGuideSignUpRepository.findByMsisdn(request.getMsisdn());

		if (objectEmail != null || objectMsisdn != null) {
			return true;
		}

		return false;
	}

	public SignUpResponseBody loginUsername(String msisdn, String password) {
		SignUpResponseBody response = null;

		try {

			if (msisdn != null || msisdn != "" || password != null || password != "") {
				SignUpModel modelObject = travelGuideSignUpRepository.findByMsisdn(msisdn);
				if (modelObject == null) {
					response = new SignUpResponseBody();
					response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
					response.setErrorMsg(Constants.ERROR_MESSAGE.ACCOUNT_NOT_EXIST);
					response.setUserName(null);
				} else {

					//to check the encrypted saved password with the raw provided password
					boolean isPasswordValid = passwordEncoder.matches(password, modelObject.getPassword());
					if (isPasswordValid) {
						response = new SignUpResponseBody();
						response.setErrorCode(Constants.ERROR_CODES.REST_SUCCESS_CODE);
						response.setErrorMsg(Constants.ERROR_MESSAGE.REST_SUCCESS_MSG);
						response.setUserName(modelObject.getUsername());
						
						String token = jwtUtil.generateToken(modelObject.getUsername());
						response.setToken(token);
					} else {
						response = new SignUpResponseBody();
						response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
						response.setErrorMsg(Constants.ERROR_MESSAGE.PASSWORD_NOT_MATCHED);
						response.setUserName(null);
					}
				}
			}
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response = new SignUpResponseBody();
			response.setErrorCode(Constants.ERROR_CODES.REST_FAILURE_CODE);
			response.setErrorMsg(Constants.ERROR_MESSAGE.REST_FAILURE_MSG);
			response.setUserName(null);
			return response;
		}
	}
}
