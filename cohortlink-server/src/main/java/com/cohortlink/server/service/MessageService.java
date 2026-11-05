package com.cohortlink.server.service;

import com.cohortlink.server.dto.request.MessageSearchRequest;
import com.cohortlink.server.dto.request.SendMessageRequest;
import com.cohortlink.server.dto.response.MessageResponse;
import com.cohortlink.server.dto.response.PageResponse;
import com.cohortlink.server.entity.Message;

public interface MessageService {
    
    /**
     * 发送消息
     */
    MessageResponse sendMessage(String roomId, String userId, SendMessageRequest request);
    
    /**
     * 获取房间消息（分页）
     */
    PageResponse<MessageResponse> getMessages(String roomId, int page, int pageSize);
    
    /**
     * 搜索消息
     */
    PageResponse<MessageResponse> searchMessages(String roomId, MessageSearchRequest request);
    
    /**
     * 删除消息
     */
    void deleteMessage(String roomId, String messageId, String userId);
    
    /**
     * 根据ID获取消息
     */
    MessageResponse getMessageById(String messageId);
}
