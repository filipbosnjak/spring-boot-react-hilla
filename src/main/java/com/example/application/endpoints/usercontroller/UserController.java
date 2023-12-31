package com.example.application.endpoints.usercontroller;

import com.example.application.entity.User;
import com.example.application.repository.UserRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import org.springframework.boot.autoconfigure.web.ServerProperties;

import java.util.List;
import java.util.UUID;

@Endpoint
@AnonymousAllowed
public class UserController {

    private final UserRepository userRepository;

    private final ServerProperties serverProperties;
    public UserController(UserRepository userRepository, ServerProperties serverProperties) {
        this.userRepository = userRepository;
        this.serverProperties = serverProperties;
    }

    @Nonnull
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String saveUser(
            User user
    ) {
        if(userRepository.findAll().size() < 30) {
            try {
                user.setId(UUID.randomUUID());
                userRepository.save(user);
            } catch (Exception e) {
                return "Error";
            }
            return "User saved successfully";
        } else {
            return "Max rows in DB exceeded";
        }

    }

    public String updateUser(
            User user
    ) {
        if(userRepository.findAll().size() < 30 && userRepository.existsById(user.getId())) {
            try {
                userRepository.save(user);
            } catch (Exception e) {
                return "Error";
            }
            return "User updated successfully";
        } else {
            return "Max rows in DB exceeded";
        }

    }

    public String deleteUser(
            User user
    ) {
        if(userRepository.existsById(user.getId())) {
            try {
                userRepository.delete(user);
            } catch (Exception e) {
                return "Error";
            }
        } else {
            return "User not found";
        }
        return "User deleted successfully";
    }

}