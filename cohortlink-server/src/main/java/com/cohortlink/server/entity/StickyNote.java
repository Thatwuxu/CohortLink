package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sticky_notes")
public class StickyNote {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String roomId;
    
    private String creatorId;
    
    private String title;
    
    private String content;
    
    private LocalDateTime dueDate;
    
    private String assigneeId;
    
    private Boolean isDone;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
    
    @TableField(exist = false)
    private User creator;
    
    @TableField(exist = false)
    private User assignee;
}
