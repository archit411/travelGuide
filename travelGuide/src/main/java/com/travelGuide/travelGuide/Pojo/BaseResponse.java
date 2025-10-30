package com.travelGuide.travelGuide.Pojo;

public class BaseResponse<D> {

	private String status;
	private String statusCode;
	private String description;
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	private D data;

	public D getData() {
		return data;
	}

	public void setData(D data) {
		this.data = data;
	}
	
	
	
}
