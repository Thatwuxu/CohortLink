package com.cohortlink.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cohortlink.server.entity.RoomMember;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoomMemberMapper extends BaseMapper<RoomMember> {
    
    @Select("SELECT * FROM room_members WHERE room_id = #{roomId}")
    List<RoomMember> findByRoomId(String roomId);
    
    @Select("SELECT * FROM room_members WHERE user_id = #{userId} AND room_id = #{roomId}")
    RoomMember findByUserIdAndRoomId(String userId, String roomId);
    
    @Select("DELETE FROM room_members WHERE user_id = #{userId} AND room_id = #{roomId}")
    void deleteByUserIdAndRoomId(String userId, String roomId);
}
