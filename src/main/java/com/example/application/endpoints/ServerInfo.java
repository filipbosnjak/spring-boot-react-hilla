package com.example.application.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import org.springframework.boot.autoconfigure.web.ServerProperties;

@Endpoint
@AnonymousAllowed
public class ServerInfo {

    private final ServerProperties serverProperties;

    public ServerInfo(ServerProperties serverProperties) {
        this.serverProperties = serverProperties;
    }

    public Integer serverPort() {
        return serverProperties.getPort();
    }
}
