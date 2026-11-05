package com.cohortlink.server.controller;

import com.cohortlink.server.dto.request.MessageSearchRequest;
import com.cohortlink.server.dto.request.SendMessageRequest;
import com.cohortlink.server.dto.response.MessageResponse;
import com.cohortlink.server.dto.response.PageResponse;
import com.cohortlink.server.service.MessageService;
import com.cohortlink.server.websocket.MessageWebSocketHandler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/rooms/{roomId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final MessageWebSocketHandler webSocketHandler;

    /**
     * 发送消息（REST API）
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable String roomId,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {
        
        String userId = authentication.getName();
        MessageResponse message = messageService.sendMessage(roomId, userId, request);
        
        // 通过 WebSocket 广播消息
        webSocketHandler.broadcastMessage(roomId, message);
        
        return ResponseEntity.ok(Map.of(
            "code", 200,
            "message", "发送成功",
            "data", message
        ));
    }

    /**
     * 获取房间消息（分页）
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        
        PageResponse<MessageResponse> messages = messageService.getMessages(roomId, page, pageSize);
        
        return ResponseEntity.ok(Map.of(
            "code", 200,
            "message", "success",
            "data", messages
        ));
    }

    /**
     * 搜索消息
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMessages(
            @PathVariable String roomId,
            MessageSearchRequest request) {
        
        PageResponse<MessageResponse> messages = messageService.searchMessages(roomId, request);
        
        return ResponseEntity.ok(Map.of(
            "code", 200,
            "message", "success",
            "data", messages
        ));
    }

    /**
     * 删除消息
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(
            @PathVariable String roomId,
            @PathVariable String messageId,
            Authentication authentication) {
        
        String userId = authentication.getName();
        messageService.deleteMessage(roomId, messageId, userId);
        
        // 通过 WebSocket 广播删除事件
        webSocketHandler.broadcastMessageDeleted(roomId, messageId);
        
        return ResponseEntity.ok(Map.of(
            "code", 200,
            "message", "删除成功"
        ));
    }

    /**
     * WebSocket 发送消息（STOMP）
     */
    @MessageMapping("/chat/{roomId}/send")
    @SendTo("/topic/room/{roomId}/messages")
    public MessageResponse sendMessageViaWebSocket(
            @DestinationVariable String roomId,
            @Payload SendMessageRequest request,
            Authentication authentication) {
        
        String userId = authentication.getName();
        return messageService.sendMessage(roomId, userId, request);
    }

    /**
     * WebSocket 输入状态
     */
    @MessageMapping("/chat/{roomId}/typing")
    @SendTo("/topic/room/{roomId}/typing")
    public Map<String, Object> sendTypingStatus(
            @DestinationVariable String roomId,
            Authentication authentication) {
        
        String userId = authentication.getName();
        return Map.of(
            "userId", userId,
            "roomId", roomId,
            "isTyping", true
        );
    }
}
