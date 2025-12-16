package com.smartclinic.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI configuration for comprehensive API documentation
 */
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI smartClinicOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("Local Development Server");
        
        Server productionServer = new Server();
        productionServer.setUrl("https://api.smartclinic.com");
        productionServer.setDescription("Production Server");
        
        Contact contact = new Contact();
        contact.setName("Smart Clinic Support");
        contact.setEmail("support@smartclinic.com");
        contact.setUrl("https://smartclinic.com");
        
        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
        
        Info info = new Info()
                .title("Smart Clinic Management System API")
                .version("2.0.0")
                .contact(contact)
                .description("Comprehensive clinic management API with appointment scheduling, " +
                        "prescription management, patient records, doctor reviews, and payment processing.")
                .license(license);
        
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");
        
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("Bearer Authentication");
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer, productionServer))
                .addSecurityItem(securityRequirement)
                .components(new Components().addSecuritySchemes("Bearer Authentication", securityScheme));
    }
}
