package com.cohortlink.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("room_members")
public class RoomMember {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String roomId;
    
    private String userId;
    
    private String role; // owner, member
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime joinedAt;
    
    @TableField(exist = false)
    private User user;
    
    @TableField(exist = false)
    private Room room;
}
