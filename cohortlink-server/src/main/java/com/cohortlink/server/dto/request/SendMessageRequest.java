package com.cohortlink.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    
    @NotBlank(message = "消息类型不能为空")
    private String type; // text, code, image, system
    
    @NotBlank(message = "消息内容不能为空")
    private String content;
    
    private String language; // for code messages
    
    private String replyToId; // reply to another message
}
