package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("llm_configs")
public class LLMConfig {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String userId;
    
    private String apiBaseUrl;
    
    private String apiKey; // Encrypted
    
    private String modelName;
    
    private Boolean isDefault;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
}
