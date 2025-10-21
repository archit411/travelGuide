package com.travelGuide.travelGuide.constants;

public  class Constants{

	public static class ERROR_CODES{
		public static String REST_NULL_PARAM_PASS = "103";
		public static String REST_INVALID_PARAM_PASSED = "105";
		public static String REST_FAILURE_CODE = "106";
		public static String REST_SUCCESS_CODE = "100";
		public static String REST_DUPLICATE_ENTRY = "109";

	}
	
	public static class ERROR_MESSAGE{
		public static String REST_NULL_PARAM_PASS_MSG = "Parameter not passed";
		public static String REST_INVALID_PARAM_PASSED_MSG = "Invalid parameter passed";
		public static String REST_INVALID_REQUEST_BODY = "Request body not passed";
		public static String REST_FAILURE_MSG = "FAILURE";
		public static String REST_SUCCESS_MSG = "SUCCESS";
		public static String USERNAME_NOT_GENERATED = "Username not generated";
		public static String REST_DUPLICATE_ENTRY_MSG = "account already registered with this email id or number..log in";
		public static String ACCOUNT_NOT_EXIST = "account doen't exist....please signup";
		public static String PASSWORD_NOT_MATCHED = "password doesn't matched....try again";
	}
	
}

