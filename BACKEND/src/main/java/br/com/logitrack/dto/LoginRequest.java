package br.com.logitrack.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username obrigatório")
    private String username;

    @NotBlank(message = "Password obrigatório")
    private String password;
}
