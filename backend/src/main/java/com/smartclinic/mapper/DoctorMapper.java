package com.smartclinic.mapper;

import com.smartclinic.dto.DoctorDTO;
import com.smartclinic.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    
    DoctorMapper INSTANCE = Mappers.getMapper(DoctorMapper.class);

    DoctorDTO toDTO(Doctor doctor);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "password", ignore = true)
    Doctor toEntity(DoctorDTO doctorDTO);
}
