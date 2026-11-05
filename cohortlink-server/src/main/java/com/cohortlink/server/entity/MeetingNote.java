package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("meeting_notes")
public class MeetingNote {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String roomId;
    
    @TableField(typeHandler = org.apache.ibatis.type.StringTypeHandler.class)
    private String transcript;
    
    @TableField(typeHandler = org.apache.ibatis.type.StringTypeHandler.class)
    private String summaryJson;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableLogic
    private Integer deleted;
    
    @TableField(exist = false)
    private Room room;
}
