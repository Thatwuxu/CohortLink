package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    @TableField(unique = true)
    private String email;
    
    private String passwordHash;
    
    private String nickname;
    
    private String avatar;
    
    private String studentId;
    
    @TableField(exist = false)
    private String llmConfigJson;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
}
