package com.cohortlink.server.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cohortlink.server.dto.request.MessageSearchRequest;
import com.cohortlink.server.dto.request.SendMessageRequest;
import com.cohortlink.server.dto.response.MessageResponse;
import com.cohortlink.server.dto.response.PageResponse;
import com.cohortlink.server.entity.Message;
import com.cohortlink.server.entity.Room;
import com.cohortlink.server.entity.RoomMember;
import com.cohortlink.server.entity.User;
import com.cohortlink.server.mapper.MessageMapper;
import com.cohortlink.server.mapper.RoomMapper;
import com.cohortlink.server.mapper.RoomMemberMapper;
import com.cohortlink.server.mapper.UserMapper;
import com.cohortlink.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageMapper messageMapper;
    private final UserMapper userMapper;
    private final RoomMapper roomMapper;
    private final RoomMemberMapper roomMemberMapper;

    @Override
    @Transactional
    public MessageResponse sendMessage(String roomId, String userId, SendMessageRequest request) {
        // 验证房间存在
        Room room = roomMapper.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("房间不存在");
        }

        // 验证用户是房间成员
        RoomMember member = roomMemberMapper.findByUserIdAndRoomId(userId, roomId);
        if (member == null) {
            throw new RuntimeException("您不是该房间成员");
        }

        // 创建消息
        Message message = new Message();
        message.setRoomId(roomId);
        message.setUserId(userId);
        message.setType(request.getType());
        message.setContent(request.getContent());
        message.setLanguage(request.getLanguage());
        message.setReplyToId(request.getReplyToId());

        messageMapper.insert(message);

        return convertToResponse(message);
    }

    @Override
    public PageResponse<MessageResponse> getMessages(String roomId, int page, int pageSize) {
        // 验证房间存在
        Room room = roomMapper.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("房间不存在");
        }

        // 分页查询
        Page<Message> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Message::getRoomId, roomId)
               .eq(Message::getDeleted, 0)
               .orderByDesc(Message::getCreatedAt);

        Page<Message> result = messageMapper.selectPage(pageParam, wrapper);

        List<MessageResponse> items = result.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return PageResponse.of(items, result.getTotal(), page, pageSize);
    }

    @Override
    public PageResponse<MessageResponse> searchMessages(String roomId, MessageSearchRequest request) {
        // 验证房间存在
        Room room = roomMapper.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("房间不存在");
        }

        // 构建查询条件
        Page<Message> pageParam = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Message::getRoomId, roomId)
               .eq(Message::getDeleted, 0);

        // 关键词搜索
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Message::getContent, request.getKeyword());
        }

        // 类型筛选
        if (request.getType() != null && !request.getType().isEmpty()) {
            wrapper.eq(Message::getType, request.getType());
        }

        // 时间范围筛选
        if (request.getStartDate() != null && !request.getStartDate().isEmpty()) {
            LocalDateTime startDateTime = LocalDate.parse(request.getStartDate(), DateTimeFormatter.ISO_DATE).atStartOfDay();
            wrapper.ge(Message::getCreatedAt, startDateTime);
        }
        if (request.getEndDate() != null && !request.getEndDate().isEmpty()) {
            LocalDateTime endDateTime = LocalDate.parse(request.getEndDate(), DateTimeFormatter.ISO_DATE).atTime(LocalTime.MAX);
            wrapper.le(Message::getCreatedAt, endDateTime);
        }

        wrapper.orderByDesc(Message::getCreatedAt);

        Page<Message> result = messageMapper.selectPage(pageParam, wrapper);

        List<MessageResponse> items = result.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return PageResponse.of(items, result.getTotal(), request.getPage(), request.getPageSize());
    }

    @Override
    @Transactional
    public void deleteMessage(String roomId, String messageId, String userId) {
        Message message = messageMapper.selectById(messageId);
        if (message == null) {
            throw new RuntimeException("消息不存在");
        }

        if (!message.getRoomId().equals(roomId)) {
            throw new RuntimeException("消息不属于该房间");
        }

        // 只有消息发送者可以删除自己的消息
        if (!message.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除该消息");
        }

        messageMapper.deleteById(messageId);
    }

    @Override
    public MessageResponse getMessageById(String messageId) {
        Message message = messageMapper.selectById(messageId);
        if (message == null) {
            throw new RuntimeException("消息不存在");
        }
        return convertToResponse(message);
    }

    private MessageResponse convertToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setRoomId(message.getRoomId());
        response.setUserId(message.getUserId());
        response.setType(message.getType());
        response.setContent(message.getContent());
        response.setLanguage(message.getLanguage());
        response.setReplyToId(message.getReplyToId());
        response.setCreatedAt(message.getCreatedAt());

        // 查询用户信息
        User user = userMapper.findById(message.getUserId());
        response.setUser(user);

        return response;
    }
}
