package com.cohortlink.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cohortlink.server.entity.Room;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoomMapper extends BaseMapper<Room> {
    
    @Select("SELECT * FROM rooms WHERE code = #{code} AND deleted = 0")
    Room findByCode(String code);
    
    @Select("SELECT r.* FROM rooms r INNER JOIN room_members rm ON r.id = rm.room_id WHERE rm.user_id = #{userId} AND r.deleted = 0")
    List<Room> findByUserId(String userId);
}
