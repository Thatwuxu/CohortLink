package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("messages")
public class Message {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String roomId;
    
    private String userId;
    
    private String type; // text, code, image, system
    
    @TableField(typeHandler = org.apache.ibatis.type.StringTypeHandler.class)
    private String content;
    
    private String language;
    
    private String replyToId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
    
    @TableField(exist = false)
    private User user;
}
