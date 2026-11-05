package com.cohortlink.server.dto.request;

import lombok.Data;

@Data
public class MessageSearchRequest {
    
    private String keyword;
    private String type;
    private String startDate;
    private String endDate;
    private Integer page = 1;
    private Integer pageSize = 20;
}
