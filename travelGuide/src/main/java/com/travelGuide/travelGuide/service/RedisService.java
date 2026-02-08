package com.travelGuide.travelGuide.service;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RedisService {

	@Autowired
	private RedisTemplate<String, String> rt;

	@Autowired
	private ObjectMapper objectMapper;

	public <T> void set(String key, List<T> data, Long ttl) {
		try {
			String json = objectMapper.writeValueAsString(data);
			rt.opsForValue().set(key, json, ttl, TimeUnit.SECONDS);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public <T> void setObject(String key, T data, Long ttl) {
		try {
			String json = objectMapper.writeValueAsString(data);
			rt.opsForValue().set(key, json, ttl, TimeUnit.SECONDS);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public <T> List<T> get(String key, Class<T> type) {
		try {
			String json = rt.opsForValue().get(key);
			if (json == null) {
				return null;
			}
			return objectMapper.readValue(json,
					objectMapper.getTypeFactory().constructCollectionType(List.class, type));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public <T> T getObject(String key, Class<T> type) {
		try {
			String json = rt.opsForValue().get(key);
			if (json == null) {
				return null;
			}
			return objectMapper.readValue(json, type);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
