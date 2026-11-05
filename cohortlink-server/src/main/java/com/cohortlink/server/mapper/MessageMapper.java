package com.cohortlink.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cohortlink.server.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {
    
    @Select("SELECT * FROM messages WHERE room_id = #{roomId} AND deleted = 0 ORDER BY created_at DESC LIMIT #{limit} OFFSET #{offset}")
    List<Message> findByRoomIdWithPagination(String roomId, int limit, int offset);
    
    @Select("SELECT COUNT(*) FROM messages WHERE room_id = #{roomId} AND deleted = 0")
    long countByRoomId(String roomId);
}
