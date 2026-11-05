package com.cohortlink.server.websocket;

import com.cohortlink.server.dto.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class MessageWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    
    // 记录每个房间的在线用户
    private final Map<String, Set<String>> roomOnlineUsers = new ConcurrentHashMap<>();

    /**
     * 广播消息到房间
     */
    public void broadcastMessage(String roomId, MessageResponse message) {
        String destination = "/topic/room/" + roomId + "/messages";
        messagingTemplate.convertAndSend(destination, Map.of(
            "type", "message:new",
            "data", message
        ));
        log.debug("Broadcast message to room {}: {}", roomId, message.getId());
    }

    /**
     * 广播消息删除事件
     */
    public void broadcastMessageDeleted(String roomId, String messageId) {
        String destination = "/topic/room/" + roomId + "/messages";
        messagingTemplate.convertAndSend(destination, Map.of(
            "type", "message:deleted",
            "data", Map.of("messageId", messageId)
        ));
        log.debug("Broadcast message deleted to room {}: {}", roomId, messageId);
    }

    /**
     * 广播用户加入房间
     */
    public void broadcastUserJoin(String roomId, String userId, String nickname) {
        String destination = "/topic/room/" + roomId + "/users";
        messagingTemplate.convertAndSend(destination, Map.of(
            "type", "user:join",
            "data", Map.of(
                "userId", userId,
                "nickname", nickname,
                "timestamp", System.currentTimeMillis()
            )
        ));
        
        // 添加到在线用户列表
        roomOnlineUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        log.debug("User {} joined room {}", userId, roomId);
    }

    /**
     * 广播用户离开房间
     */
    public void broadcastUserLeave(String roomId, String userId) {
        String destination = "/topic/room/" + roomId + "/users";
        messagingTemplate.convertAndSend(destination, Map.of(
            "type", "user:leave",
            "data", Map.of(
                "userId", userId,
                "timestamp", System.currentTimeMillis()
            )
        ));
        
        // 从在线用户列表移除
        Set<String> users = roomOnlineUsers.get(roomId);
        if (users != null) {
            users.remove(userId);
            if (users.isEmpty()) {
                roomOnlineUsers.remove(roomId);
            }
        }
        log.debug("User {} left room {}", userId, roomId);
    }

    /**
     * 广播输入状态
     */
    public void broadcastTypingStatus(String roomId, String userId, boolean isTyping) {
        String destination = "/topic/room/" + roomId + "/typing";
        messagingTemplate.convertAndSend(destination, Map.of(
            "type", isTyping ? "typing:start" : "typing:stop",
            "data", Map.of(
                "userId", userId,
                "timestamp", System.currentTimeMillis()
            )
        ));
    }

    /**
     * 获取房间在线用户数
     */
    public int getOnlineUserCount(String roomId) {
        Set<String> users = roomOnlineUsers.get(roomId);
        return users != null ? users.size() : 0;
    }

    /**
     * 检查用户是否在线
     */
    public boolean isUserOnline(String roomId, String userId) {
        Set<String> users = roomOnlineUsers.get(roomId);
        return users != null && users.contains(userId);
    }

    /**
     * 发送消息给特定用户
     */
    public void sendToUser(String userId, String destination, Object payload) {
        messagingTemplate.convertAndSendToUser(userId, destination, payload);
    }
}
