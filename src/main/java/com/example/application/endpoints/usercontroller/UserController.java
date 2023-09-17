package com.example.application.endpoints.usercontroller;

import com.example.application.entity.User;
import com.example.application.repository.UserRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

import java.util.List;

import static com.example.application.utils.RandomUtils.generateRandomId;

@Endpoint
@AnonymousAllowed
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                user.setId(generateRandomId());
                userRepository.save(user);
            } catch (Exception e) {
                return "Error";
            }
            return "User saved successfully";
        } else {
            return "Max rows in DB exceeded";
        }

    }
}