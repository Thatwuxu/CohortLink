package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tasks")
public class Task {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String roomId;
    
    private String assigneeId;
    
    private String creatorId;
    
    private String title;
    
    private String description;
    
    private String status; // pending, in_progress, completed
    
    private LocalDateTime dueDate;
    
    private String source; // ai, manual, sticky
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
    
    @TableField(exist = false)
    private User assignee;
    
    @TableField(exist = false)
    private User creator;
    
    @TableField(exist = false)
    private Room room;
}
