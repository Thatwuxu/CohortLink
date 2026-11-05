package com.cohortlink.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cohortlink.server.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    @Select("SELECT * FROM users WHERE email = #{email} AND deleted = 0")
    User findByEmail(String email);
    
    @Select("SELECT * FROM users WHERE id = #{id} AND deleted = 0")
    User findById(String id);
}
