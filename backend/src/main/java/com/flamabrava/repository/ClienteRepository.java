package com.flamabrava.repository;

import com.flamabrava.model.Cliente;
import com.google.common.base.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    java.util.Optional<Cliente> findByEmail(String email);
}
