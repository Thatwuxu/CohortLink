package com.cohortlink.server.dto.response;

import com.cohortlink.server.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponse {
    
    private String id;
    private String roomId;
    private String userId;
    private User user;
    private String type;
    private String content;
    private String language;
    private String replyToId;
    private LocalDateTime createdAt;
}
