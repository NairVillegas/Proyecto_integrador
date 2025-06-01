package com.flamabrava.repository;

import com.flamabrava.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
}
