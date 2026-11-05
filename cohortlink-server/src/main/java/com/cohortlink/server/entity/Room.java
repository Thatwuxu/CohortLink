package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("rooms")
public class Room {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String name;
    
    @TableField(unique = true)
    private String code;
    
    private String ownerId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
    
    @TableField(exist = false)
    private User owner;
}
