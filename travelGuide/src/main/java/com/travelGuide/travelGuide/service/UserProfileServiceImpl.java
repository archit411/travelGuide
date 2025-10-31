package com.travelGuide.travelGuide.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelGuide.travelGuide.Pojo.BaseResponse;
import com.travelGuide.travelGuide.Pojo.UserProfileReqBody;
import com.travelGuide.travelGuide.Pojo.UserProfileRespBody;
import com.travelGuide.travelGuide.model.SignUpModel;
import com.travelGuide.travelGuide.model.UserProfile;
import com.travelGuide.travelGuide.repositories.LoginSignUpRepository;
import com.travelGuide.travelGuide.repositories.UserProfileRepository;

@Service
public class UserProfileServiceImpl implements UserProfileService {

	@Autowired
	private LoginSignUpRepository loginSignUpRepository;

	@Autowired
	private UserProfileRepository userProfileRepository;

	public BaseResponse<UserProfile> getUserDetails(String msisdn) {

		BaseResponse<UserProfile> response = null;
		try {
			if (msisdn == null || msisdn == "") {

				response = new BaseResponse<UserProfile>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("msisdn is null");
				response.setStatusCode("105");

				return response;
			}

			UserProfile userProfile = userProfileRepository.findByMsisdn(msisdn);

			if (userProfile == null) {
				response = new BaseResponse<UserProfile>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("no record found for this msisdn");
				response.setStatusCode("106");

				return response;
			}

			response = new BaseResponse<UserProfile>();

			response.setData(userProfile);
			response.setDescription("user data fetched");
			response.setStatus("SUCCESS");
			response.setStatusCode("100");

			return response;
		} catch (Exception e) {
			e.printStackTrace();
			response = new BaseResponse<UserProfile>();

			response.setData(null);
			response.setDescription("Exception Occured");
			response.setStatus("FAILURE");
			response.setStatusCode("106");
			return response;
		}
	}

	public BaseResponse<UserProfileRespBody> createAndGetUserProfileByEmail(String emailId) {
		BaseResponse<UserProfileRespBody> response = null;
		UserProfileRespBody responseBody = null;
		try {
			if(emailId==null) {
				response = new BaseResponse<UserProfileRespBody>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("emaild is null");
				response.setStatusCode("105");

				return response;
			}

			UserProfile profileDetails = userProfileRepository.findByEmailId(emailId);
			if(profileDetails!=null) {
				responseBody = new UserProfileRespBody();
				responseBody.setEmailId(profileDetails.getEmailId());
				responseBody.setfName(profileDetails.getfName());
				responseBody.setlName(profileDetails.getlName());
				responseBody.setUsername(profileDetails.getUsername());
				responseBody.setCity(profileDetails.getCity());
				responseBody.setState(profileDetails.getState());
				responseBody.setCountry(profileDetails.getCountry());
				responseBody.setGender(profileDetails.getGender());

				response = new BaseResponse<UserProfileRespBody>();
				response.setData(responseBody);
				response.setDescription("user profile saved");
				response.setStatus("SUCCESS");
				response.setStatusCode("100");

				return response;
			}

			SignUpModel model = loginSignUpRepository.findByEmailId(emailId);
			if (model == null) {
				response = new BaseResponse<UserProfileRespBody>();
				response.setData(null);
				response.setStatus("FAILURE");
				response.setDescription("profile details not found for this email id");
				response.setStatusCode("106");

				return response;
			}

			//set model object to save data
			UserProfile user = new UserProfile();
			user.setEmailId(model.getEmailId());
			user.setfName(model.getfName());
			user.setlName(model.getlName());
			user.setUsername(model.getUsername());

			userProfileRepository.save(user);

			//set response body
			responseBody = new UserProfileRespBody();
			responseBody.setEmailId(model.getEmailId());
			responseBody.setfName(model.getfName());
			responseBody.setlName(model.getlName());
			responseBody.setUsername(model.getUsername());
			
			response = new BaseResponse<UserProfileRespBody>();
			response.setData(responseBody);
			response.setDescription("user profile saved");
			response.setStatus("SUCCESS");
			response.setStatusCode("100");

			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return response;
		}
	}

//	public BaseResponse<UserProfileRespBody> getUserProfileByEmail(String emailId) {
//		BaseResponse<UserProfileRespBody> response = null;
//		try {
//
//			if(emailId==null) {
//				response = new BaseResponse<UserProfileRespBody>();
//				response.setData(null);
//				response.setStatus("FAILURE");
//				response.setDescription("emaild is null");
//				response.setStatusCode("105");
//
//				return response;
//			}
//			
//			UserProfile userDetails = userProfileRepository.findByEmailId(emailId);
//			if(userDetails==null) {
//				response = new BaseResponse<UserProfileRespBody>();
//				response.setData(null);
//				response.setStatus("FAILURE");
//				response.setDescription("user details not found for this emaild id");
//				response.setStatusCode("106");
//
//				return response;
//			}
//			
//			UserProfileRespBody responseBody = new UserProfileRespBody();
//			responseBody.setEmailId(userDetails.getEmailId());
//			responseBody.setfName(userDetails.getfName());
//			responseBody.setlName(userDetails.getlName());
//			responseBody.setUsername(userDetails.getUsername());
//			
//			response = new BaseResponse<UserProfileRespBody>();
//			response.setData(responseBody);
//			response.setDescription("profile fetched");
//			response.setStatus("SUCCESS");
//			response.setStatusCode("100");
//			
//			return response;
//		} catch (Exception e) {
//			response = new BaseResponse<UserProfileRespBody>();
//
//			response.setData(null);
//			response.setDescription("Exception Occured");
//			response.setStatus("FAILURE");
//			response.setStatusCode("106");
//			return response;
//
//		}
//	}

}
