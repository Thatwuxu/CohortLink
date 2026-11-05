package com.cohortlink.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cohortlink.server.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TaskMapper extends BaseMapper<Task> {
    
    @Select("SELECT * FROM tasks WHERE assignee_id = #{assigneeId} AND deleted = 0 ORDER BY due_date ASC")
    List<Task> findByAssigneeId(String assigneeId);
    
    @Select("SELECT * FROM tasks WHERE room_id = #{roomId} AND deleted = 0 ORDER BY created_at DESC")
    List<Task> findByRoomId(String roomId);
}
