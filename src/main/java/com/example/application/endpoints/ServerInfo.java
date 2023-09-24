package com.example.application.endpoints;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import org.springframework.boot.autoconfigure.web.ServerProperties;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

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

    public String getServerDomain() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        }
    }
}
