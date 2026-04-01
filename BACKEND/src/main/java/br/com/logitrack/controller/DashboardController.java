package br.com.logitrack.controller;

import br.com.logitrack.dto.DashboardDTO;
import br.com.logitrack.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metricas")
    public ResponseEntity<DashboardDTO> getMetricas() {
        return ResponseEntity.ok(dashboardService.getMetricas());
    }
}
