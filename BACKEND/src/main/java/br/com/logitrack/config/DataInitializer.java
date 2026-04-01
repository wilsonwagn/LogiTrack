package br.com.logitrack.config;

import br.com.logitrack.entity.Usuario;
import br.com.logitrack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build());
            log.info("✅ Usuário admin criado — login: admin / admin123");
        }

        // Usuário 2
        if (usuarioRepository.findByUsername("wilson").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .username("wilson")
                    .password(passwordEncoder.encode("wilson123"))
                    .role("ROLE_ADMIN")
                    .build());
        }

        // Não precisa de tela de cadastro. Reiniciar o backend já cria o novo usuário automaticamente.
        
    }
}
