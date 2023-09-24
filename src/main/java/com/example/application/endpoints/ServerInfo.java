package com.example.application.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Endpoint
@AnonymousAllowed
public class ServerInfo {

    private final ServerProperties serverProperties;

    private final Environment environment;

    public ServerInfo(ServerProperties serverProperties, Environment environment) {
        this.serverProperties = serverProperties;
        this.environment = environment;
    }

    public Integer serverPort() {
        return serverProperties.getPort();
    }

    public String getServerDomain() {
        return environment.getProperty("DOMAIN_NAME");
    }
}
